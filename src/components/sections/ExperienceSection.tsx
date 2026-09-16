import React, { useState } from 'react';
import {
  Box, Typography, Container, Grid, Paper,
  useTheme, useMediaQuery,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { experiences } from '../../data/experience';
import SectionHeading from '../SectionHeading';

const ExperienceSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      component="section"
      id="experience"
      aria-labelledby="experience-heading"
      sx={{
        minHeight: { xs: 'auto', md: '100vh' },
        py: { xs: 6, md: 12 },
        position: 'relative',
        scrollSnapAlign: { xs: 'none', md: 'start' },
        scrollSnapStop: { xs: 'none', md: 'always' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="lg">
        <SectionHeading id="experience-heading" number="02." title="Experience" />

        {/* ── Mobile: compact list + one persistent detail panel ───
            An accordion (however implemented - MUI's JS-measured Collapse,
            then grid-template-rows) fundamentally means each tap resizes a
            box and pushes every item below it, and that reflow is real work
            regardless of how it's driven. This sidesteps the problem instead
            of continuing to optimise it: rows never resize (just a border/
            background highlight, both compositor-only), and only ONE
            fixed-position panel below the list crossfades content - the
            same pattern already proven smooth in the desktop layout below,
            just restacked vertically for a narrow screen. */}
        {isMobile && (
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2.5 }}>
              {experiences.map((exp, index) => {
                const IconComponent = exp.icon;
                const isActive = activeStep === index;
                return (
                  <Box
                    key={exp.title}
                    component="button"
                    type="button"
                    aria-pressed={isActive}
                    aria-controls="experience-detail-panel"
                    onClick={() => setActiveStep(index)}
                    sx={{
                      all: 'unset', boxSizing: 'border-box', width: '100%', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 1.5,
                      px: 2, py: 1.1,
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: isActive ? 'rgba(0,255,157,0.35)' : 'divider',
                      backgroundColor: isActive ? 'rgba(0,255,157,0.06)' : 'background.paper',
                      transition: 'border-color 0.3s, background-color 0.3s',
                    }}
                  >
                    <Box
                      sx={{
                        width: 34, height: 34,
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: isActive ? 'primary.main' : 'divider',
                        backgroundColor: isActive ? 'rgba(0,255,157,0.1)' : 'background.default',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: isActive ? '0 0 10px rgba(0,255,157,0.35)' : 'none',
                        transition: 'border-color 0.3s, background-color 0.3s, box-shadow 0.3s',
                      }}
                    >
                      <IconComponent sx={{ fontSize: 16, color: isActive ? 'primary.main' : 'text.secondary' }} />
                    </Box>
                    <Box sx={{ textAlign: 'left', minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.92rem',
                          color: isActive ? 'text.primary' : 'text.secondary',
                          lineHeight: 1.3,
                        }}
                      >
                        {exp.title}
                      </Typography>
                      <Typography
                        sx={{ fontSize: '0.78rem', color: isActive ? 'primary.main' : 'text.secondary', lineHeight: 1.3, fontFamily: '"Space Mono", monospace' }}
                      >
                        {exp.company} · {exp.period}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            <Paper
              id="experience-detail-panel"
              aria-live="polite"
              elevation={0}
              sx={{
                p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2,
                position: 'relative', overflow: 'hidden', contain: 'layout style',
                '&::before': {
                  content: '""', position: 'absolute', top: 0, left: 0,
                  width: 3, height: '100%', backgroundColor: 'primary.main', borderRadius: '2px 0 0 2px',
                },
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Typography variant="body2" sx={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'text.secondary' }}>
                    {experiences[activeStep].description}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Paper>
          </Box>
        )}

        {/* ── Desktop: timeline + detail panel ──────────────────── */}
        {!isMobile && (
          <Grid container spacing={4} alignItems="flex-start">
            <Grid item md={4}>
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: 19, top: 20, bottom: 20, width: 2,
                    background: 'linear-gradient(to bottom, transparent, rgba(0,255,157,0.25) 15%, rgba(0,255,157,0.25) 85%, transparent)',
                  }}
                />
                {experiences.map((exp, index) => {
                  const isActive = activeStep === index;
                  const IconComponent = exp.icon;
                  return (
                    <Box
                      key={exp.title}
                      onClick={() => setActiveStep(index)}
                      sx={{
                        display: 'flex', alignItems: 'flex-start', gap: 2,
                        mb: 2.5, cursor: 'pointer',
                        '&:hover .tl-dot': {
                          borderColor: 'primary.main',
                          boxShadow: '0 0 8px rgba(0,255,157,0.3)',
                        },
                      }}
                    >
                      <Box
                        className="tl-dot"
                        sx={{
                          width: 40, height: 40, borderRadius: '50%',
                          border: '2px solid',
                          borderColor: isActive ? 'primary.main' : 'divider',
                          backgroundColor: isActive ? 'rgba(0,255,157,0.1)' : 'background.default',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, zIndex: 1,
                          transition: 'all 0.3s ease',
                          boxShadow: isActive ? '0 0 14px rgba(0,255,157,0.4)' : 'none',
                        }}
                      >
                        <IconComponent sx={{ fontSize: 18, color: isActive ? 'primary.main' : 'text.secondary', transition: 'color 0.3s' }} />
                      </Box>
                      <Box sx={{ pt: 0.5 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 700, fontSize: '1rem', color: isActive ? 'text.primary' : 'text.secondary', transition: 'color 0.3s', fontFamily: '"Space Mono", monospace' }}
                        >
                          {exp.period}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: '0.95rem', color: isActive ? 'primary.main' : 'text.secondary', transition: 'color 0.3s', lineHeight: 1.3 }}
                        >
                          {exp.company}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Grid>

            <Grid item md={8}>
              <Paper
                elevation={0}
                sx={{
                  p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 2,
                  minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden',
                  '&::before': {
                    content: '""', position: 'absolute', top: 0, left: 0,
                    width: 3, height: '100%', backgroundColor: 'primary.main', borderRadius: '2px 0 0 2px',
                  },
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Typography variant="h4" sx={{ fontSize: '1.9rem', mb: 0.5 }}>
                      {experiences[activeStep].title}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontSize: '1.15rem', mb: 0.5 }}>
                      {experiences[activeStep].company}
                    </Typography>
                    <Typography
                      variant="subtitle2" color="text.secondary"
                      sx={{ fontSize: '0.9rem', mb: 2.5, fontFamily: '"Space Mono", monospace' }}
                    >
                      {experiences[activeStep].period}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.7, color: 'text.secondary' }}>
                      {experiences[activeStep].description}
                    </Typography>
                  </motion.div>
                </AnimatePresence>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ExperienceSection;
