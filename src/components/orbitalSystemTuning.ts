// Kept separate from OrbitalSystem.tsx (which imports three.js) so HeroSection
// can import this type + defaults statically without defeating the lazy
// `import('../OrbitalSystem')` used to keep three.js out of the main bundle.

// Every scene-level knob that's been hand-tuned by eye lives here as a prop
// with a default matching the current look, so HeroTuningPanel (dev-only) can
// drive them live instead of round-tripping through code edits + screenshots.
export interface OrbitalSystemTuning {
  elevationDeg: number;
  rollDeg: number;
  focusDistance: number;
  fov: number;
  offsetXRatio: number;
  offsetYRatio: number;
  speedCoeff: number;
  speedExp: number;
  orbitScale: number;
}

// Tuned by Gene directly in HeroTuningPanel (2026-09-16) and pasted back via
// its "Copy values" button - this is the values Gene chose, not a Claude guess.
// Applies at >=900px (HeroTuningPanel's "Desktop" profile).
export const ORBITAL_SYSTEM_DEFAULTS: OrbitalSystemTuning = {
  elevationDeg: 18,
  rollDeg: -25,
  focusDistance: 7.1,
  fov: 50,
  offsetXRatio: -0.19,
  offsetYRatio: -0.15,
  speedCoeff: 2.6,
  speedExp: 1.8,
  orbitScale: 1,
};

// Below 900px, HeroTuningPanel switches to editing/showing THIS profile
// instead - only the keys listed here override ORBITAL_SYSTEM_DEFAULTS.
// Tuned by Gene directly in HeroTuningPanel (2026-09-16) and pasted back via
// its "Copy values" button - this is the values Gene chose, not a Claude
// guess. Same elevation/roll/zoom/fov/speed as desktop, but the disc is
// shifted the other way (offsetXRatio positive vs desktop's negative) and
// scaled down (orbitScale 0.7) to fit the smaller mobile portrait.
export const ORBITAL_SYSTEM_MOBILE_OVERRIDES: Partial<OrbitalSystemTuning> = {
  elevationDeg: 13,
  rollDeg: -25,
  focusDistance: 7.1,
  fov: 50,
  offsetXRatio: 0.1,
  offsetYRatio: -0.25,
  speedCoeff: 2.6,
  speedExp: 1.8,
  orbitScale: 0.7,
};
