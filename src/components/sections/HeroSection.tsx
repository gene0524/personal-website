import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Button } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DownloadIcon from '@mui/icons-material/Download';
import { personalInfo } from '../../data/personalInfo';
import ParticleNetwork from '../ParticleNetwork';
import { FONT_MONO } from '../../themes';

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

const HeroSection: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const typedRole = useTypewriter(!reducedMotion);

  return (
    <Box
      component="section"
      id="hero"
      aria-labelledby="hero-name"
      sx={{
        minHeight: { xs: 'auto', md: '100vh' },
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        scrollSnapAlign: { xs: 'none', md: 'start' },
        scrollSnapStop: { xs: 'none', md: 'always' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {!reducedMotion && <ParticleNetwork />}

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
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  href={personalInfo.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    borderColor: 'rgba(0,255,157,0.4)',
                    color: 'primary.main',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '999px',
                    '&:hover': { borderColor: 'primary.main', backgroundColor: 'rgba(0,255,157,0.08)' },
                  }}
                >
                  Resume
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
                sx={{
                  position: 'relative',
                  width: { xs: '200px', md: '300px' },
                  height: { xs: '200px', md: '300px' },
                }}
              >
                {/* Pulse glow */}
                <Box aria-hidden="true" sx={{
                  position: 'absolute',
                  inset: -16,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(0,255,157,0.18) 0%, transparent 70%)',
                  filter: 'blur(16px)',
                  animation: reducedMotion ? 'none' : 'glow 3s ease-in-out infinite',
                  '@keyframes glow': {
                    '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
                    '50%': { opacity: 1, transform: 'scale(1.06)' },
                  },
                }} />
                {/* Rotating dashed ring */}
                <Box aria-hidden="true" sx={{
                  position: 'absolute',
                  inset: -10,
                  borderRadius: '50%',
                  border: '1.5px dashed rgba(0,255,157,0.3)',
                  animation: reducedMotion ? 'none' : 'spin 22s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }} />
                {/* Solid border */}
                <Box aria-hidden="true" sx={{
                  position: 'absolute',
                  inset: -2,
                  borderRadius: '50%',
                  border: '2px solid rgba(0,255,157,0.25)',
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
