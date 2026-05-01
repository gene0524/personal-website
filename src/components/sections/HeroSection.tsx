import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { personalInfo } from '../../data/personalInfo';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$&*';

const useTextScramble = (text: string, startDelay = 400) => {
  const [output, setOutput] = useState('');

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let raf: number;
    let startTime: number | null = null;
    const duration = text.length * 60;

    timeout = setTimeout(() => {
      const animate = (ts: number) => {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        const resolved = Math.floor(progress * text.length);

        setOutput(
          text.split('').map((char, i) => {
            if (char === ' ') return ' ';
            if (i < resolved) return char;
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }).join('')
        );

        if (progress < 1) raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
    }, startDelay);

    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [text, startDelay]);

  return output;
};

const ROLES = [
  'Software Engineer',
  'Mostly AI, Slightly Human',
  'Imperial MSc \'24',
];

const useTypewriter = () => {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (waiting) return;
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
  }, [text, isDeleting, phraseIdx, waiting]);

  return text;
};

const HeroSection: React.FC = () => {
  const scrambledName = useTextScramble(personalInfo.name, 500);
  const typedRole = useTypewriter();

  return (
    <Box
      component="section"
      id="hero"
      sx={{
        minHeight: { xs: 'auto', md: '100vh' },
        height: { xs: 'auto', md: '100vh' },
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
      {/* Background orb 1 */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        width: { xs: 200, md: 480 },
        height: { xs: 200, md: 480 },
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,255,157,0.07) 0%, transparent 70%)',
        filter: 'blur(30px)',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'orb1 7s ease-in-out infinite',
        '@keyframes orb1': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-24px, 18px) scale(1.08)' },
        },
      }} />
      {/* Background orb 2 */}
      <Box sx={{
        position: 'absolute',
        bottom: '15%',
        left: '5%',
        width: { xs: 150, md: 320 },
        height: { xs: 150, md: 320 },
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,216,255,0.05) 0%, transparent 70%)',
        filter: 'blur(25px)',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'orb2 9s ease-in-out infinite',
        '@keyframes orb2': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(18px, -20px) scale(1.05)' },
        },
      }} />

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
                sx={{
                  color: 'primary.main',
                  fontFamily: '"Space Mono", monospace',
                  fontSize: { xs: '0.85rem', md: '0.95rem' },
                  mb: 1,
                  letterSpacing: '0.12em',
                }}
              >
                Hi, my name is
              </Typography>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.8rem', md: '5rem' },
                  fontWeight: 800,
                  mb: 1.5,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.05,
                  fontFamily: '"Space Mono", monospace',
                  minHeight: { xs: '3.5rem', md: '5.5rem' },
                }}
              >
                {scrambledName || ' '}
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
                  variant="h2"
                  color="primary"
                  sx={{
                    fontSize: { xs: '1.1rem', md: '1.5rem' },
                    fontWeight: 500,
                    fontFamily: '"Space Mono", monospace',
                    letterSpacing: '0.02em',
                  }}
                >
                  {typedRole}
                </Typography>
                <Box
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
              </Box>

              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  color: 'text.secondary',
                  maxWidth: '560px',
                  lineHeight: 1.8,
                }}
              >
                {personalInfo.description}
              </Typography>
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
                <Box sx={{
                  position: 'absolute',
                  inset: -16,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(0,255,157,0.18) 0%, transparent 70%)',
                  filter: 'blur(16px)',
                  animation: 'glow 3s ease-in-out infinite',
                  '@keyframes glow': {
                    '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
                    '50%': { opacity: 1, transform: 'scale(1.06)' },
                  },
                }} />
                {/* Rotating dashed ring */}
                <Box sx={{
                  position: 'absolute',
                  inset: -10,
                  borderRadius: '50%',
                  border: '1.5px dashed rgba(0,255,157,0.3)',
                  animation: 'spin 22s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }} />
                {/* Solid border */}
                <Box sx={{
                  position: 'absolute',
                  inset: -2,
                  borderRadius: '50%',
                  border: '2px solid rgba(0,255,157,0.25)',
                }} />
                {/* Photo */}
                <Box
                  component="img"
                  src={personalInfo.avatarUrl}
                  alt="Profile"
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
