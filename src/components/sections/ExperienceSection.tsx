import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { experiences } from '../../data/experience';
import SectionHeading from '../SectionHeading';

const ExperienceSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Box
      component="section"
      id="experience"
      sx={{
        minHeight: { xs: 'auto', md: '100vh' },
        height: { xs: 'auto', md: '100vh' },
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
        <SectionHeading number="02." title="Experience" />

        <Grid container spacing={4} alignItems="flex-start">
          {/* Custom timeline */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'relative' }}>
              {/* Vertical connector */}
              <Box
                sx={{
                  position: 'absolute',
                  left: 19,
                  top: 20,
                  bottom: 20,
                  width: 2,
                  background:
                    'linear-gradient(to bottom, transparent, rgba(0,255,157,0.25) 15%, rgba(0,255,157,0.25) 85%, transparent)',
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
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      mb: { xs: 2, md: 2.5 },
                      cursor: 'pointer',
                      '&:hover .tl-dot': {
                        borderColor: 'primary.main',
                        boxShadow: '0 0 8px rgba(0,255,157,0.3)',
                      },
                    }}
                  >
                    {/* Dot */}
                    <Box
                      className="tl-dot"
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: isActive ? 'primary.main' : 'divider',
                        backgroundColor: isActive
                          ? 'rgba(0,255,157,0.1)'
                          : 'background.default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        zIndex: 1,
                        transition: 'all 0.3s ease',
                        boxShadow: isActive ? '0 0 14px rgba(0,255,157,0.4)' : 'none',
                      }}
                    >
                      <IconComponent
                        sx={{
                          fontSize: 18,
                          color: isActive ? 'primary.main' : 'text.secondary',
                          transition: 'color 0.3s',
                        }}
                      />
                    </Box>

                    {/* Labels */}
                    <Box sx={{ pt: 0.5 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: '0.9rem', md: '1rem' },
                          color: isActive ? 'text.primary' : 'text.secondary',
                          transition: 'color 0.3s',
                          fontFamily: '"Space Mono", monospace',
                        }}
                      >
                        {exp.period}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: '0.88rem', md: '0.95rem' },
                          color: isActive ? 'primary.main' : 'text.secondary',
                          transition: 'color 0.3s',
                          lineHeight: 1.3,
                        }}
                      >
                        {exp.company}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Grid>

          {/* Detail panel */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 4 },
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                minHeight: { xs: 'auto', md: '340px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 3,
                  height: '100%',
                  backgroundColor: 'primary.main',
                  borderRadius: '2px 0 0 2px',
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
                  <Typography
                    variant="h4"
                    sx={{ fontSize: { xs: '1.4rem', md: '1.9rem' }, mb: 0.5 }}
                  >
                    {experiences[activeStep].title}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontSize: { xs: '1rem', md: '1.15rem' }, mb: 0.5 }}
                  >
                    {experiences[activeStep].company}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: '0.85rem', md: '0.9rem' },
                      mb: { xs: 1.5, md: 2.5 },
                      fontFamily: '"Space Mono", monospace',
                    }}
                  >
                    {experiences[activeStep].period}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      lineHeight: { xs: 1.5, md: 1.7 },
                      color: 'text.secondary',
                    }}
                  >
                    {experiences[activeStep].description}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ExperienceSection;
