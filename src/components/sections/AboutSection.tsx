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
  CodeIcon: <CodeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
  BrushIcon: <BrushIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
  StorageIcon: <StorageIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
  CloudIcon: <CloudIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
};

const AboutSection: React.FC = () => {
  return (
    <Box
      component="section"
      id="about"
      sx={{
        minHeight: { xs: 'auto', md: '100vh' },
        height: { xs: 'auto', md: '100vh' },
        py: { xs: 8, md: 12 },
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
        <Grid container spacing={4} sx={{ 
          height: '100%',
          alignItems: 'center',
        }}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography
                variant="h2"
                sx={{
                  mb: 4,
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                About Me
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  color: 'text.secondary',
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                }}
              >
                {personalInfo.about.introduction}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 6,
                  color: 'text.secondary',
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                }}
              >
                {personalInfo.about.additional}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
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
                        p: 3,
                        height: '280px',
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
                      {iconMap[skill.icon as keyof typeof iconMap]}
                      <Typography
                        variant="h6"
                        sx={{
                          mt: 2,
                          mb: 2,
                          fontWeight: 600,
                        }}
                      >
                        {skill.category}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 1,
                        flex: 1,
                        justifyContent: 'center'
                      }}>
                        {skill.items.map((item) => (
                          <Typography key={item} variant="body2" color="text.secondary">
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