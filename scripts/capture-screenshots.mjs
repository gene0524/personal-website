// Capture project screenshots with the locally installed Chrome.
//
//   For every project in src/data/projects.ts that has links.live and no
//   assets-src/projects/<slug>.png yet, open the site at 1440x900 @2x and save
//   a PNG. scripts/optimize-images.mjs then turns it into the WebP the site uses.
//
// Usage:
//   node scripts/capture-screenshots.mjs              # only missing screenshots
//   node scripts/capture-screenshots.mjs --force      # recapture all live projects
//   node scripts/capture-screenshots.mjs --slug=foo --url=http://localhost:5173
//        # one-off capture of a locally running app for a project without a public URL
//   --wait=6000   extra ms to wait after load (sites with intro animations)
//
// Requires Google Chrome (or set CHROME_PATH). puppeteer-core is a devDependency.

import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const OUT_DIR = path.resolve('assets-src/projects');
const CHROME = process.env.CHROME_PATH
  || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  }),
);

// Load the projects list without a TS toolchain: strip types via a tiny regex
// is fragile, so instead evaluate the compiled data through Vite's SSR loader.
async function loadProjects() {
  const { createServer } = await import('vite');
  const server = await createServer({ server: { middlewareMode: true }, logLevel: 'silent' });
  try {
    const mod = await server.ssrLoadModule('/src/data/projects.ts');
    return mod.projects;
  } finally {
    await server.close();
  }
}

// Click the most permissive-sounding button in a cookie/consent banner, if any.
async function dismissConsent(page) {
  const clicked = await page.evaluate(() => {
    const words = /accept all|accept|agree|allow all|essential only|got it|okay|ok|同意|接受|我知道了/i;
    const btn = [...document.querySelectorAll('button, [role=button], a')]
      .find(b => words.test(b.textContent?.trim() ?? '') && b.getClientRects().length);
    if (btn) { btn.click(); return btn.textContent.trim(); }
    return null;
  });
  if (clicked) {
    console.log(`  dismissed consent: "${clicked}"`);
    await new Promise(r => setTimeout(r, 600));
  }
}

async function capture(browser, slug, url) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60_000 });
  await new Promise(r => setTimeout(r, Number(args.wait) || 1500));
  await dismissConsent(page); // banners often appear after a delay, so run after the wait
  const out = path.join(OUT_DIR, `${slug}.png`);
  await page.screenshot({ path: out });
  await page.close();
  console.log(`  captured ${slug} ← ${url}`);
}

await mkdir(OUT_DIR, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });

try {
  if (args.slug && args.url) {
    await capture(browser, args.slug, args.url);
  } else {
    const projects = await loadProjects();
    let n = 0;
    for (const p of projects) {
      const live = p.links?.live;
      if (!live) continue;
      const out = path.join(OUT_DIR, `${p.slug}.png`);
      if (existsSync(out) && !args.force) continue;
      try {
        await capture(browser, p.slug, live);
        n++;
      } catch (err) {
        console.error(`  FAILED ${p.slug} (${live}): ${err.message.split('\n')[0]}`);
        process.exitCode = 1;
      }
    }
    if (n === 0) console.log('All live-project screenshots present. Use --force to recapture.');
  }
} finally {
  await browser.close();
}

// Keep the file URL import happy on Windows paths if ever needed.
void pathToFileURL;
