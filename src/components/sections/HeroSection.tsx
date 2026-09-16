import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { Box, Container, Typography, Grid, Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion, useReducedMotion } from 'framer-motion';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { personalInfo } from '../../data/personalInfo';
import { FONT_MONO } from '../../themes';
import ParticleNetwork from '../ParticleNetwork';
import { ORBITAL_SYSTEM_DEFAULTS, ORBITAL_SYSTEM_MOBILE_OVERRIDES, type OrbitalSystemTuning } from '../orbitalSystemTuning';

// three.js chunk loads after first paint so the hero text and portrait (LCP) never wait for it
const OrbitalSystem = lazy(() => import('../OrbitalSystem'));
// Dev-only tuning panel; never bundled into production (import.meta.env.DEV
// is statically replaced by Vite, so this whole lazy() call is dead-code-
// eliminated from the prod build along with the panel itself).
const HeroTuningPanel = import.meta.env.DEV ? lazy(() => import('../HeroTuningPanel')) : null;

const useAfterFirstPaint = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const id = idle ? idle(() => setReady(true)) : window.setTimeout(() => setReady(true), 200);
    return () => { if (!idle) window.clearTimeout(id); };
  }, []);
  return ready;
};

const ROLES = [
  'Software Engineer',
  'Trading Systems',
  'Mostly AI, Slightly Human',
];

const useTypewriter = (enabled: boolean) => {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [text, setText] = useState(enabled ? '' : ROLES[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (!enabled || waiting) return;
    const phrase = ROLES[phraseIdx];
    const delay = isDeleting ? 40 : 95;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        const next = phrase.slice(0, text.length + 1);
        setText(next);
        if (next === phrase) {
          setWaiting(true);
          setTimeout(() => { setWaiting(false); setIsDeleting(true); }, 1800);
        }
      } else {
        const next = phrase.slice(0, text.length - 1);
        setText(next);
        if (next === '') {
          setIsDeleting(false);
          setPhraseIdx(i => (i + 1) % ROLES.length);
        }
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [enabled, text, isDeleting, phraseIdx, waiting]);

  return text;
};

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

// Both background layers (starfield + solar system) bleed this far past the
// hero's own bottom edge into the top of the next section, instead of being
// hard-clipped exactly at the section boundary. A mask fades them to nothing
// well before the bleed ends, so it reads as an ambient dissolve rather than
// a rectangle sitting on top of the next section's heading. The fade starts
// a little INSIDE the hero itself (not right at the edge) so there's no
// visible seam where "clipped" becomes "fading".
const BLEED = { xs: 90, md: 200 } as const;
// Stop 1: still fully opaque until 70px before the hero's own edge (fade
// begins slightly inside the hero, not right at the boundary). Stop 2: fully
// transparent by 20px before the very bottom of the bleed box - a fixed
// small buffer, NOT bleed-relative (using `bleed - 20px` here previously
// meant the fade finished just 20px into the bleed for any bleed value,
// instead of near the end of it - the whole point of a "gradual" dissolve
// across most of the bleed was accidentally an abrupt one right at the seam).
const fadeGradient = (bleed: number) =>
  `linear-gradient(to bottom, #000, #000 calc(100% - ${bleed + 70}px), transparent calc(100% - 20px))`;
const bleedSx = {
  bottom: { xs: -BLEED.xs, md: -BLEED.md },
  maskImage: { xs: fadeGradient(BLEED.xs), md: fadeGradient(BLEED.md) },
  WebkitMaskImage: { xs: fadeGradient(BLEED.xs), md: fadeGradient(BLEED.md) },
} as const;

const HeroSection: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const typedRole = useTypewriter(!reducedMotion);
  const theme = useTheme();
  const sphereReady = useAfterFirstPaint();
  const portraitRef = useRef<HTMLDivElement>(null);
  // Once the scene draws the portrait itself, the DOM copy fades out (it stays for LCP/alt text)
  const [sceneReady, setSceneReady] = useState(false);
  const handleSceneReady = useCallback(() => setSceneReady(true), []);
  // The composition was solved against the desktop portrait's screen size/
  // position - it isn't guaranteed to read the same way at mobile's much
  // smaller portrait, so mobile gets its own tuning profile. Whichever
  // breakpoint you're actually viewing is the one the dev panel edits: drag a
  // slider at >=900px and it's saved as ORBITAL_SYSTEM_DEFAULTS; narrow the
  // browser below 900px (or use DevTools device mode) and the same panel now
  // edits ORBITAL_SYSTEM_MOBILE_OVERRIDES instead.
  const isMobileViewport = useMediaQuery('(max-width:899px)', { noSsr: true });
  const savedDesktopTuning = ORBITAL_SYSTEM_DEFAULTS;
  const savedMobileTuning: OrbitalSystemTuning = { ...ORBITAL_SYSTEM_DEFAULTS, ...ORBITAL_SYSTEM_MOBILE_OVERRIDES };
  const [desktopTuning, setDesktopTuning] = useState<OrbitalSystemTuning>(savedDesktopTuning);
  const [mobileTuning, setMobileTuning] = useState<OrbitalSystemTuning>(savedMobileTuning);
  const tuning = isMobileViewport ? mobileTuning : desktopTuning;
  const setTuning = isMobileViewport ? setMobileTuning : setDesktopTuning;
  const savedTuning = isMobileViewport ? savedMobileTuning : savedDesktopTuning;

  return (
    <Box
      component="section"
      id="hero"
      aria-labelledby="hero-name"
      sx={{
        minHeight: { xs: 'auto', md: '100vh' },
        py: { xs: 8, md: 12 },
        position: 'relative',
        // No overflow:hidden here on purpose - the two background layers below
        // are absolutely positioned (taken out of layout, so this doesn't
        // affect scroll-snap height math) and deliberately extend past the
        // section's own bottom edge, masked to fade out, for a bleed effect
        // instead of a hard cut at the section boundary. overflow-x:hidden
        // alone would make the browser force overflow-y to 'auto' (a real
        // clipped-scroll-region quirk when the axes differ) - not what we
        // want - and nothing here extends horizontally, so plain 'visible' is safe.
        scrollSnapAlign: { xs: 'none', md: 'start' },
        scrollSnapStop: { xs: 'none', md: 'always' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background starfield — the original 2D connecting-dots network, sitting
          behind the solar system like a distant sky. zIndex:1 (a real stacking
          layer, not the 'auto' AboutSection sits at) is what lets this bleed
          show up ON TOP of the next section's top edge instead of being
          painted over by it despite coming later in the DOM. */}
      {!reducedMotion && (
        <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, ...bleedSx }}>
          <ParticleNetwork />
        </Box>
      )}

      {/* Perspective solar system across the whole hero, behind the content; the portrait is its sun */}
      <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, ...bleedSx }}>
        {sphereReady && (
          <Suspense fallback={null}>
            <OrbitalSystem
              accent={theme.palette.primary.main}
              background={theme.palette.background.default}
              reducedMotion={!!reducedMotion}
              anchorRef={portraitRef}
              portraitSrc={personalInfo.avatarUrl}
              onReady={handleSceneReady}
              {...tuning}
            />
          </Suspense>
        )}
      </Box>

      {HeroTuningPanel && (
        <Suspense fallback={null}>
          <HeroTuningPanel
            value={tuning}
            onChange={setTuning}
            resetValue={savedTuning}
            profile={isMobileViewport ? 'mobile' : 'desktop'}
          />
        </Suspense>
      )}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left: text */}
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                component="p"
                sx={{
                  color: 'primary.main',
                  fontFamily: FONT_MONO,
                  fontSize: { xs: '0.85rem', md: '0.95rem' },
                  mb: 1,
                  letterSpacing: '0.12em',
                }}
              >
                {personalInfo.company} · {personalInfo.location}
              </Typography>

              <Typography
                variant="h1"
                id="hero-name"
                sx={{
                  fontSize: { xs: '2.8rem', md: '5rem' },
                  fontWeight: 800,
                  mb: 1.5,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.05,
                  fontFamily: FONT_MONO,
                }}
              >
                {personalInfo.name}
              </Typography>

              {/* Typewriter row */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: { xs: 3, md: 4 },
                  minHeight: { xs: '1.8rem', md: '2.2rem' },
                }}
              >
                <Typography
                  component="p"
                  color="primary"
                  aria-live="off"
                  sx={{
                    fontSize: { xs: '1.1rem', md: '1.5rem' },
                    fontWeight: 500,
                    fontFamily: FONT_MONO,
                    letterSpacing: '0.02em',
                    m: 0,
                  }}
                >
                  {typedRole}
                </Typography>
                {!reducedMotion && (
                  <Box
                    aria-hidden="true"
                    sx={{
                      width: '2px',
                      height: { xs: '1.1rem', md: '1.5rem' },
                      backgroundColor: 'primary.main',
                      ml: 0.5,
                      flexShrink: 0,
                      animation: 'blink 1s step-end infinite',
                      '@keyframes blink': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0 },
                      },
                    }}
                  />
                )}
              </Box>

              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  color: 'text.primary',
                  maxWidth: '560px',
                  lineHeight: 1.8,
                  mb: 1.5,
                }}
              >
                {personalInfo.tagline}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.9rem', md: '0.95rem' },
                  color: 'text.secondary',
                  maxWidth: '560px',
                  lineHeight: 1.7,
                  mb: { xs: 3, md: 4 },
                }}
              >
                {personalInfo.proof}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  endIcon={<ArrowDownwardIcon />}
                  onClick={() => scrollTo('projects')}
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'background.default',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '999px',
                    '&:hover': { backgroundColor: 'primary.dark' },
                  }}
                >
                  See projects
                </Button>
              </Box>
            </motion.div>
          </Grid>

          {/* Right: photo */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Box
                ref={portraitRef}
                sx={{
                  position: 'relative',
                  width: { xs: '200px', md: '300px' },
                  height: { xs: '200px', md: '300px' },
                  mt: { xs: 7, md: 0 },
                  mb: { xs: 4, md: 0 },
                }}
              >
                {/* Solid border — a simple "photo has an edge" cue before the scene loads */}
                <Box aria-hidden="true" sx={{
                  position: 'absolute',
                  inset: -2,
                  borderRadius: '50%',
                  border: '2px solid rgba(0,255,157,0.25)',
                  opacity: sceneReady ? 0 : 1,
                  transition: 'opacity 0.8s ease',
                }} />
                {/* Rotating dashed ring — permanent tech-HUD accent, sits above the canvas */}
                <Box aria-hidden="true" sx={{
                  position: 'absolute',
                  inset: -8,
                  borderRadius: '50%',
                  border: '1.5px dashed rgba(0,255,157,0.35)',
                  zIndex: 2,
                  animation: reducedMotion ? 'none' : 'spin 22s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }} />
                {/* Photo (LCP element) */}
                <Box
                  component="img"
                  src={personalInfo.avatarUrl}
                  alt="Gene Yu"
                  width={900}
                  height={900}
                  fetchPriority="high"
                  decoding="async"
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    position: 'relative',
                    zIndex: 1,
                    display: 'block',
                    opacity: sceneReady ? 0 : 1,
                    transition: 'opacity 0.8s ease',
                  }}
                />
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
