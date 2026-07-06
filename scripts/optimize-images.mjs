// Compress originals from assets-src/ into public/assets/images/ as WebP.
//
//   assets-src/<dir>/<name>.(jpg|jpeg|png)  →  public/assets/images/<dir>/<name>.webp
//
// HEIC/PDF originals are kept in assets-src only and never deployed.
// Existing outputs are skipped so builds stay fast — pass --force to regenerate.
//
// Usage:  node scripts/optimize-images.mjs [--force]

import { readdir, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = path.resolve('assets-src');
const OUT_DIR = path.resolve('public/assets/images');
const FORCE = process.argv.includes('--force');

// Per-folder output settings: travel photos only ever render as small card
// thumbnails, so they can be smaller than project screenshots.
const PRESETS = {
  travel: { maxDim: 1000, quality: 78 },
  default: { maxDim: 1600, quality: 80 },
};

const CONVERTIBLE = new Set(['.jpg', '.jpeg', '.png']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let converted = 0;
let skipped = 0;
let srcBytes = 0;
let outBytes = 0;

for await (const file of walk(SRC_DIR)) {
  const ext = path.extname(file).toLowerCase();
  if (!CONVERTIBLE.has(ext)) continue;

  const rel = path.relative(SRC_DIR, file);
  const outFile = path.join(OUT_DIR, rel.replace(/\.[^.]+$/, '.webp'));

  if (!FORCE && existsSync(outFile)) {
    skipped++;
    continue;
  }

  const topDir = rel.split(path.sep)[0];
  const { maxDim, quality } = PRESETS[topDir] ?? PRESETS.default;

  await mkdir(path.dirname(outFile), { recursive: true });
  await sharp(file)
    .rotate() // apply EXIF orientation before stripping metadata
    .resize(maxDim, maxDim, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality })
    .toFile(outFile);

  srcBytes += (await stat(file)).size;
  outBytes += (await stat(outFile)).size;
  converted++;
  console.log(`✓ ${rel} → ${path.relative(OUT_DIR, outFile)}`);
}

const mb = (b) => (b / 1024 / 1024).toFixed(1);
console.log(
  converted > 0
    ? `\n${converted} converted (${mb(srcBytes)} MB → ${mb(outBytes)} MB), ${skipped} up to date.`
    : `All ${skipped} images up to date.`,
);
