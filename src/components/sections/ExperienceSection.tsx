import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  StepIconProps,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import ScienceIcon from '@mui/icons-material/Science';
import { experiences } from '../../data/experience';

const CustomStepIcon = (props: StepIconProps) => {
  const { active, icon } = props;
  const exp = experiences[Number(icon) - 1];
  const IconComponent = exp.icon;

  return (
    <IconComponent
      sx={{
        fontSize: 28,
        color: active ? 'primary.main' : 'text.secondary',
      }}
    />
  );
};

const ExperienceSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

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
      <Typography
        variant="h2"
        sx={{
          mb: { xs: 3, md: 4 },
          fontWeight: 700,
          fontSize: { xs: '2rem', md: '2.5rem' },
        }}
      >
        Experience
      </Typography>
      <Container maxWidth="lg" sx={{ 
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Grid container spacing={3} sx={{ 
          height: '100%',
          alignItems: 'center',
        }}>
          {/* Timeline */}
          <Grid item xs={12} md={4}>
            <Stepper 
              activeStep={activeStep} 
              orientation="vertical" 
              nonLinear
              sx={{
                '& .MuiStepConnector-line': {
                  minHeight: { xs: '20px', md: '40px' },
                },
                '& .MuiStepLabel-root': {
                  py: { xs: 0.5, md: 1 },
                }
              }}
            >
              {experiences.map((exp, index) => (
                <Step key={exp.title}>
                  <StepButton onClick={() => handleStepClick(index)}>
                    <StepLabel
                      StepIconComponent={CustomStepIcon}
                      sx={{
                        '& .MuiStepLabel-iconContainer': {
                          pr: 2,
                        },
                        '& .MuiStepLabel-label': {
                          fontSize: { xs: '1rem', md: '1.25rem' },
                        },
                      }}
                    >
                      <Box>
                        <Typography 
                          variant="subtitle1" 
                          fontWeight="bold" 
                          sx={{ 
                            fontSize: { xs: '1rem', md: '1.25rem' },
                            lineHeight: { xs: 1.2, md: 1.4 }
                          }}
                        >
                          {exp.period}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            fontSize: { xs: '0.9rem', md: '1.1rem' },
                            lineHeight: { xs: 1.2, md: 1.4 }
                          }}
                        >
                          {exp.company}
                        </Typography>
                      </Box>
                    </StepLabel>
                  </StepButton>
                </Step>
              ))}
            </Stepper>
          </Grid>

          {/* Content Display */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 4 },
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ 
                      fontSize: { xs: '1.4rem', md: '2rem' },
                      mb: { xs: 0.5, md: 1 }
                    }}
                  >
                    {experiences[activeStep].title}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="primary" 
                    gutterBottom 
                    sx={{ 
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                      mb: { xs: 0.5, md: 1 }
                    }}
                  >
                    {experiences[activeStep].company}
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    color="text.secondary" 
                    gutterBottom 
                    sx={{ 
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      mb: { xs: 1, md: 1.5 }
                    }}
                  >
                    {experiences[activeStep].period}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mt: { xs: 1, md: 4 },
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      lineHeight: { xs: 1.4, md: 1.6 }
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