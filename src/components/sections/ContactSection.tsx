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
  FormControl,
  FormHelperText,
  TextFieldProps,
  SxProps,
  Theme,
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

// Common styles for reuse
const commonStyles = {
  paper: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  inputField: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.23)',
        borderWidth: '1px',
      },
      '&:hover fieldset': {
        borderColor: '#4ade80',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#4ade80',
      },
    },
  },
  button: {
    backgroundColor: '#4ade80',
    '&:hover': {
      backgroundColor: '#22c55e',
    },
    textTransform: 'uppercase',
    fontWeight: 500,
    letterSpacing: '0.5px',
  },
};

// Component for form input fields with consistent styling
interface FormInputProps extends Omit<TextFieldProps, 'error'> {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
  sx?: SxProps<Theme>;
  isMobile?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  value,
  onChange,
  error,
  icon,
  multiline = false,
  rows = 1,
  sx = {},
  isMobile = false,
  ...props
}) => {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={null}
      multiline={multiline}
      rows={rows}
      InputLabelProps={{
        sx: {
          fontSize: { xs: '0.9rem', md: '1rem' },
          backgroundColor: 'rgba(20, 30, 48, 0.5)',
          padding: '0 4px',
        },
      }}
      InputProps={{
        startAdornment: icon ? (
          <InputAdornment position="start">
            {icon}
          </InputAdornment>
        ) : null,
        endAdornment: error ? (
          <InputAdornment position="end" 
                          sx={multiline ? { alignSelf: 'flex-start', mt: 0.5 } : {}}>
            <Typography variant="caption" color="error" sx={{ fontSize: '0.7rem' }}>
              {error}
            </Typography>
          </InputAdornment>
        ) : null,
        sx: { height: multiline ? '100%' : { xs: '45px', md: 'auto' } }
      }}
      sx={{
        ...commonStyles.inputField,
        ...sx,
      }}
      {...props}
    />
  );
};

// Submit button component
interface SubmitButtonProps {
  isMobile?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isMobile = false }) => {
  return (
    <Button
      type="submit"
      variant="contained"
      size="large"
      fullWidth
      sx={{
        ...commonStyles.button,
        py: { xs: 1.2, md: 1.5 },
        fontSize: { xs: '0.95rem', md: '0.95rem' },
        boxShadow: { xs: '0 4px 8px rgba(0,0,0,0.2)', md: 'none' },
      }}
    >
      Send Message
    </Button>
  );
};

// Social media button component
interface SocialButtonProps {
  href: string;
  icon: React.ReactNode;
}

const SocialButton: React.FC<SocialButtonProps> = ({ href, icon }) => {
  return (
    <IconButton
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'background.paper',
        width: 40,
        height: 40,
        '&:hover': {
          backgroundColor: 'primary.dark',
        },
      }}
    >
      {icon}
    </IconButton>
  );
};

// Contact information item component
interface ContactItemProps {
  icon: React.ReactNode;
  text: string;
  href?: string;
  mb?: any;
}

const ContactItem: React.FC<ContactItemProps> = ({ icon, text, href, mb = { xs: 1.5, md: 2 } }) => {
  const content = (
    <>
      {icon}
      <Typography sx={{ fontSize: { xs: '0.9rem', md: '0.95rem' } }}>{text}</Typography>
    </>
  );

  return (
    <Box
      component={href ? "a" : "div"}
      href={href}
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: mb,
        textDecoration: 'none',
        color: 'inherit',
        transition: href ? 'all 0.3s ease' : undefined,
        '&:hover': href ? {
          color: 'primary.main',
        } : undefined
      }}
    >
      {content}
    </Box>
  );
};

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

  // Contact Information Panel
  const ContactInfoPanel = () => (
    <Paper
      elevation={3}
      sx={{
        ...commonStyles.paper,
        p: { xs: 2, md: 3 },
        width: '100%',
        height: { xs: '350px', md: '420px' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
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
              mb: { xs: 1.5, md: 2 },
              fontWeight: 600,
              fontSize: { xs: '1.5rem', md: '1.8rem' },
            }}
          >
            Get in Touch
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: { xs: 3, md: 4 },
              color: 'text.secondary',
              fontSize: { xs: '0.9rem', md: '0.95rem' },
              lineHeight: 1.5,
            }}
          >
            I'm always open to discussing new projects, creative ideas or
            opportunities to be part of your visions.
          </Typography>

          <Box sx={{ mb: { xs: 2, md: 3 } }}>
            <ContactItem 
              icon={<EmailIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: { xs: '1.2rem', md: '1.3rem' } }} />}
              text={displayContactInfo.email}
              href={`mailto:${displayContactInfo.email}`}
            />
            <ContactItem 
              icon={<PhoneIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: { xs: '1.2rem', md: '1.3rem' } }} />}
              text={displayContactInfo.phone}
              href={`tel:${displayContactInfo.phone}`}
            />
            <ContactItem 
              icon={<LocationOnIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: { xs: '1.2rem', md: '1.3rem' } }} />}
              text={displayContactInfo.location}
              mb={0}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <SocialButton 
            href={displayContactInfo.socialLinks.github} 
            icon={<GitHubIcon sx={{ fontSize: '1.3rem' }} />} 
          />
          <SocialButton 
            href={displayContactInfo.socialLinks.linkedin} 
            icon={<LinkedInIcon sx={{ fontSize: '1.3rem' }} />} 
          />
          <SocialButton 
            href={displayContactInfo.socialLinks.instagram} 
            icon={<InstagramIcon sx={{ fontSize: '1.3rem' }} />} 
          />
        </Box>
      </Box>
    </Paper>
  );

  // Mobile Contact Form
  const MobileContactForm = () => (
    <Box 
      sx={{ 
        display: { xs: 'flex', md: 'none' }, 
        flexDirection: 'column', 
        gap: 1.2,
      }}
    >
      <FormInput
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        icon={<PersonIcon sx={{ fontSize: '1.2rem', color: '#4ade80' }} />}
      />
      
      <FormInput
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        icon={<EmailIcon sx={{ fontSize: '1.2rem', color: '#4ade80' }} />}
      />
      
      <FormInput
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        error={errors.message}
        multiline
        rows={5}
        sx={{
          flex: 1,
          minHeight: '130px',
          maxHeight: '130px',
          '& .MuiInputBase-inputMultiline': {
            height: '100%',
            padding: '6px 12px',
            maxHeight: '130px',
          }
        }}
      />
      
      <Box sx={{ minHeight: '45px', mt: 1.2 }}>
        <SubmitButton isMobile={true} />
      </Box>
    </Box>
  );

  // Desktop Contact Form
  const DesktopContactForm = () => (
    <Box 
      sx={{ 
        display: { xs: 'none', md: 'flex' }, 
        flexDirection: 'column',
        gap: 1.5,
        flexGrow: 1,
      }}
    >
      <FormInput
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        icon={<PersonIcon sx={{ fontSize: '1.3rem', color: '#4ade80' }} />}
      />
      
      <FormInput
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        icon={<EmailIcon sx={{ fontSize: '1.3rem', color: '#4ade80' }} />}
      />
      
      <FormInput
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        error={errors.message}
        multiline
        rows={3}
        sx={{
          minHeight: '100px',
          maxHeight: '100px',
          '& .MuiInputBase-inputMultiline': {
            height: '100%',
            padding: '8px 14px',
            maxHeight: '100px',
          }
        }}
      />
    </Box>
  );

  return (
    <Box
      component="section"
      id="contact"
      sx={{
        minHeight: { xs: 'auto', md: '90vh' },
        height: { xs: 'auto', md: '90vh' },
        py: { xs: 6, md: 10 },
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
        <Grid container spacing={2} sx={{ 
          height: '100%',
          alignItems: 'center',
        }}>
          {/* Contact Information Side */}
          <Grid item xs={12} md={6} sx={{ height: '100%', display: 'flex' }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%', height: '100%', display: 'flex' }}
            >
              <ContactInfoPanel />
            </motion.div>
          </Grid>

          {/* Contact Form Side */}
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
                  ...commonStyles.paper,
                  p: { xs: 2, md: 3 },
                  width: '100%',
                  height: { xs: 'auto', md: '420px' },
                  minHeight: { xs: 'auto', md: '420px' }, // Allow mobile container to flex based on content
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    mb: { xs: 1.5, md: 3 },
                    fontWeight: 600,
                    fontSize: { xs: '1.5rem', md: '1.8rem' },
                  }}
                >
                  Send Me Something
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  flex: 1,
                  position: 'relative',
                }}>
                  {/* Mobile and desktop versions are separated for different styling */}
                  <MobileContactForm />
                  <DesktopContactForm />
                  
                  {/* Desktop Submit Button */}
                  <Box sx={{ 
                    mt: 2,
                    display: { xs: 'none', md: 'block' }
                  }}>
                    <SubmitButton />
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