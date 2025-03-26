import React from 'react';
import { Box, Typography, Container, Grid, Paper, Card, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import CodeIcon from '@mui/icons-material/Code';
import BrushIcon from '@mui/icons-material/Brush';
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';
import { personalInfo } from '../../data/personalInfo';
import { skills } from '../../data/skills';

const iconMap = {
  CodeIcon: <CodeIcon sx={{ fontSize: { xs: 30, md: 40 }, color: 'primary.main' }} />,
  BrushIcon: <BrushIcon sx={{ fontSize: { xs: 30, md: 40 }, color: 'primary.main' }} />,
  StorageIcon: <StorageIcon sx={{ fontSize: { xs: 30, md: 40 }, color: 'primary.main' }} />,
  CloudIcon: <CloudIcon sx={{ fontSize: { xs: 30, md: 40 }, color: 'primary.main' }} />,
};

const AboutSection: React.FC = () => {
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
      <Container maxWidth="lg" sx={{ 
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Grid container spacing={3} sx={{ 
          height: '100%',
          alignItems: 'center',
        }}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography
                variant="h2"
                sx={{
                  mb: { xs: 1.5, md: 4 },
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                About Me
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: { xs: 1.5, md: 4 },
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
                  mb: { xs: 2, md: 6 },
                  color: 'text.secondary',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: { xs: 1.6, md: 1.8 },
                }}
              >
                {personalInfo.about.additional}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container spacing={1.5}>
              {skills.map((skill, index) => (
                <Grid item xs={6} key={skill.category}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 1, md: 3 },
                        height: { xs: '180px', md: '280px' },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-4px)',
                          transition: 'all 0.3s ease',
                        },
                      }}
                    >
                      <Box sx={{ mt: { xs: 0, md: 1 } }}>
                        {iconMap[skill.icon as keyof typeof iconMap]}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          mt: { xs: 0.5, md: 2 },
                          mb: { xs: 0.5, md: 2 },
                          fontWeight: 600,
                          fontSize: { xs: '0.9rem', md: '1.25rem' },
                        }}
                      >
                        {skill.category}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: { xs: 0.3, md: 1 },
                        flex: 1,
                        justifyContent: 'center',
                        overflow: 'hidden',
                        width: '100%',
                        px: { xs: 0.5, md: 1 },
                      }}>
                        {skill.items.map((item) => (
                          <Typography 
                            key={item} 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              fontSize: { xs: '0.75rem', md: '1rem' },
                              lineHeight: { xs: 1.3, md: 1.2 },
                              letterSpacing: { xs: 0, md: 0.3 },
                              fontWeight: { xs: 'normal', md: 400 },
                            }}
                          >
                            {item}
                          </Typography>
                        ))}
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection; 