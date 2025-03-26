import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { motion } from 'framer-motion';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import { contactInfo } from '../../data/contactInfo';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formData);
      setSnackbar({
        open: true,
        message: 'Message sent successfully!',
        severity: 'success',
      });
      setFormData({ name: '', email: '', message: '' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const defaultContactInfo = {
    email: 'your.email@example.com',
    phone: '+1 234 567 890',
    location: 'Your Location',
    socialLinks: {
      github: 'https://github.com/yourusername',
      linkedin: 'https://linkedin.com/in/yourusername',
      instagram: 'https://instagram.com/yourusername',
    },
  };

  const displayContactInfo = {
    email: contactInfo.email || defaultContactInfo.email,
    phone: contactInfo.phone || defaultContactInfo.phone,
    location: contactInfo.location || defaultContactInfo.location,
    socialLinks: {
      github: contactInfo.socialLinks?.github || defaultContactInfo.socialLinks.github,
      linkedin: contactInfo.socialLinks?.linkedin || defaultContactInfo.socialLinks.linkedin,
      instagram: contactInfo.socialLinks?.instagram || defaultContactInfo.socialLinks.instagram,
    },
  };

  return (
    <Box
      component="section"
      id="contact"
      sx={{
        minHeight: { xs: 'auto', md: '100vh' },
        height: { xs: 'auto', md: '100vh' },
        py: { xs: 8, md: 12 },
        position: 'relative',
        scrollSnapAlign: { xs: 'none', md: 'start' },
        scrollSnapStop: { xs: 'none', md: 'always' },
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
          <Grid item xs={12} md={6} sx={{ height: '100%', display: 'flex' }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%', height: '100%', display: 'flex' }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  width: '100%',
                  height: '480px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Box sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <Box>
                    <Typography
                      variant="h3"
                      sx={{
                        mb: 3,
                        fontWeight: 600,
                      }}
                    >
                      Get in Touch
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 6,
                        color: 'text.secondary',
                        fontSize: '1rem',
                        lineHeight: 1.6,
                      }}
                    >
                      I'm always open to discussing new projects, creative ideas or
                      opportunities to be part of your visions.
                    </Typography>

                    <Box sx={{ mb: 4 }}>
                      <Box 
                        component="a"
                        href={`mailto:${displayContactInfo.email}`}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mb: 3,
                          textDecoration: 'none',
                          color: 'inherit',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            color: 'primary.main',
                          }
                        }}
                      >
                        <EmailIcon sx={{ mr: 2, color: 'primary.main', fontSize: '1.5rem' }} />
                        <Typography sx={{ fontSize: '1rem' }}>{displayContactInfo.email}</Typography>
                      </Box>
                      <Box 
                        component="a"
                        href={`tel:${displayContactInfo.phone}`}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mb: 3,
                          textDecoration: 'none',
                          color: 'inherit',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            color: 'primary.main',
                          }
                        }}
                      >
                        <PhoneIcon sx={{ mr: 2, color: 'primary.main', fontSize: '1.5rem' }} />
                        <Typography sx={{ fontSize: '1rem' }}>{displayContactInfo.phone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon sx={{ mr: 2, color: 'primary.main', fontSize: '1.5rem' }} />
                        <Typography sx={{ fontSize: '1rem' }}>{displayContactInfo.location}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton
                      component="a"
                      href={displayContactInfo.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'background.paper',
                        width: 48,
                        height: 48,
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      }}
                    >
                      <GitHubIcon sx={{ fontSize: '1.5rem' }} />
                    </IconButton>
                    <IconButton
                      component="a"
                      href={displayContactInfo.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'background.paper',
                        width: 48,
                        height: 48,
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      }}
                    >
                      <LinkedInIcon sx={{ fontSize: '1.5rem' }} />
                    </IconButton>
                    <IconButton
                      component="a"
                      href={displayContactInfo.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'background.paper',
                        width: 48,
                        height: 48,
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      }}
                    >
                      <InstagramIcon sx={{ fontSize: '1.5rem' }} />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6} sx={{ height: '100%', display: 'flex' }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%', height: '100%', display: 'flex' }}
            >
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 4, 
                  width: '100%',
                  height: '480px',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    mb: 4,
                    fontWeight: 600,
                  }}
                >
                  Send Message
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 3,
                  flex: 1,
                  justifyContent: 'space-between',
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 3,
                  }}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={!!errors.name}
                      helperText={errors.name}
                      InputLabelProps={{
                        sx: {
                          fontSize: '1rem',
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                            borderWidth: '1px',
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      InputLabelProps={{
                        sx: {
                          fontSize: '1rem',
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                            borderWidth: '1px',
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      multiline
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      error={!!errors.message}
                      helperText={errors.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                            borderWidth: '1px',
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ mt: 'auto', mb: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{
                        py: 1.5,
                        backgroundColor: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      }}
                    >
                      Send Message
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactSection; 