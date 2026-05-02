import React, { useState } from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import CodeIcon from '@mui/icons-material/Code';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';
import { personalInfo } from '../../data/personalInfo';
import { skills } from '../../data/skills';
import SectionHeading from '../SectionHeading';

const iconMap = {
  CodeIcon: CodeIcon,
  SmartToyIcon: SmartToyIcon,
  StorageIcon: StorageIcon,
  CloudIcon: CloudIcon,
};

const AboutSection: React.FC = () => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  return (
    <Box
      component="section"
      id="about"
      sx={{
        minHeight: { xs: 'auto', md: '100vh' },
        height: { xs: 'auto', md: '100vh' },
        py: { xs: 6, md: 12 },
        position: 'relative',
        scrollSnapAlign: { xs: 'none', md: 'start' },
        scrollSnapStop: { xs: 'none', md: 'always' },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="lg">
        <SectionHeading number="01." title="About Me" />

        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <Typography
              variant="body1"
              sx={{
                mb: { xs: 2, md: 3 },
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: { xs: 1.6, md: 1.8 },
              }}
            >
              {personalInfo.about.introduction}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: { xs: 1.6, md: 1.8 },
              }}
            >
              {personalInfo.about.additional}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {skills.map((skill, index) => {
                const IconComponent = iconMap[skill.icon as keyof typeof iconMap];
                return (
                  <Grid item xs={6} key={skill.category}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {/* Flip card wrapper — hover on desktop, tap on touch */}
                      <Box
                        sx={{ perspective: '1200px', height: { xs: '160px', md: '230px' } }}
                        onMouseEnter={() => {
                          if (!window.matchMedia('(hover: none)').matches) setFlippedIndex(index);
                        }}
                        onMouseLeave={() => {
                          if (!window.matchMedia('(hover: none)').matches) setFlippedIndex(null);
                        }}
                        onClick={() => {
                          if (window.matchMedia('(hover: none)').matches) {
                            setFlippedIndex(prev => prev === index ? null : index);
                          }
                        }}
                      >
                        <Box
                          sx={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            transformStyle: 'preserve-3d',
                            WebkitTransformStyle: 'preserve-3d',
                            willChange: 'transform',
                            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            transform: flippedIndex === index ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          }}
                        >
                          {/* Front face */}
                          <Box
                            sx={{
                              position: 'absolute',
                              inset: 0,
                              backfaceVisibility: 'hidden',
                              WebkitBackfaceVisibility: 'hidden',
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 2,
                              backgroundColor: 'background.paper',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: { xs: 1, md: 1.5 },
                              transition: 'border-color 0.3s',
                            }}
                          >
                            <IconComponent
                              sx={{ fontSize: { xs: 32, md: 40 }, color: 'primary.main' }}
                            />
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                fontSize: { xs: '0.85rem', md: '1.05rem' },
                              }}
                            >
                              {skill.category}
                            </Typography>
                          </Box>

                          {/* Back face */}
                          <Box
                            sx={{
                              position: 'absolute',
                              inset: 0,
                              backfaceVisibility: 'hidden',
                              WebkitBackfaceVisibility: 'hidden',
                              transform: 'rotateY(180deg)',
                              border: '1px solid',
                              borderColor: 'primary.main',
                              borderRadius: 2,
                              backgroundColor: 'background.paper',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              justifyContent: 'center',
                              gap: { xs: 0.5, md: 0.8 },
                              px: { xs: 1.5, md: 2 },
                            }}
                          >
                            {skill.items.map(item => (
                              <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <Box
                                  sx={{
                                    width: 5,
                                    height: 5,
                                    borderRadius: '50%',
                                    backgroundColor: 'primary.main',
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: 'text.secondary',
                                    fontSize: { xs: '0.78rem', md: '0.92rem' },
                                    fontFamily: '"Space Mono", monospace',
                                  }}
                                >
                                  {item}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;
