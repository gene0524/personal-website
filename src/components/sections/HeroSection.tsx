import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { personalInfo } from '../../data/personalInfo';

const HeroSection: React.FC = () => {
  return (
    <Box
      component="section"
      id="hero"
      sx={{
        minHeight: '100vh',
        height: '100vh',
        py: { xs: 8, md: 12 },
        position: 'relative',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2rem', md: '4.0rem' },
                  fontWeight: 800,
                  mb: 2,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  whiteSpace: { xs: 'nowrap', md: 'normal' },
                }}
              >
                Hello, I'm {personalInfo.name}
              </Typography>
              <Typography
                variant="h2"
                color="primary"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.4rem' },
                  fontWeight: 600,
                  mb: 4,
                  letterSpacing: '0.02em',
                  textTransform: 'none',
                }}
              >
                {personalInfo.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  color: 'text.secondary',
                  maxWidth: '850px',
                  lineHeight: 1.8,
                }}
              >
                {personalInfo.description}
              </Typography>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box
              sx={{
                position: 'relative',
                width: { xs: '300px', md: '360px' },
                height: { xs: '300px', md: '360px' },
                mt: { xs: 4, md: 0 },
                ml: { xs: 'auto', md: '20px' },
              }}
            >
              {/* Square frame */}
              <Box
                sx={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  width: '85%',
                  height: '85%',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                }}
              />
              {/* Circular photo */}
              <Box
                component="img"
                src={personalInfo.avatarUrl}
                alt="Profile"
                sx={{
                  position: 'absolute',
                  right: 2,
                  bottom: 2,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection; 