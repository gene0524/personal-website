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
import type { TextFieldProps } from '@mui/material';
import { motion } from 'framer-motion';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import SectionHeading from '../SectionHeading';
import { contactInfo } from '../../data/contactInfo';

// Optional form backend (Formspree / Web3Forms style JSON endpoint).
// When unset, the form falls back to opening the visitor's email client with
// the message pre-filled, so it never claims to have sent something it hasn't.
// Web3Forms additionally needs its (public) access key in the payload.
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;
const CONTACT_ACCESS_KEY = import.meta.env.VITE_CONTACT_ACCESS_KEY as string | undefined;

interface FormData {
  name: string;
  email: string;
  message: string;
}
type FormErrors = Partial<Record<keyof FormData, string>>;

const glassPaper = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
    '&:hover fieldset': { borderColor: 'primary.main' },
    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
  },
};

interface FormInputProps extends Omit<TextFieldProps, 'error' | 'name'> {
  name: keyof FormData;
  error?: string;
  icon?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({ name, error, icon, ...props }) => (
  <TextField
    fullWidth
    name={name}
    id={`contact-${name}`}
    error={!!error}
    helperText={error ?? ' '}
    InputProps={{
      startAdornment: icon ? <InputAdornment position="start">{icon}</InputAdornment> : null,
    }}
    sx={inputSx}
    {...props}
  />
);

const SocialButton: React.FC<{ href: string; label: string; icon: React.ReactNode }> = ({ href, label, icon }) => (
  <IconButton
    component="a"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${label} (opens in new tab)`}
    sx={{
      backgroundColor: 'primary.main',
      color: 'background.paper',
      width: 40,
      height: 40,
      '&:hover': { backgroundColor: 'primary.dark' },
    }}
  >
    {icon}
  </IconButton>
);

const ContactItem: React.FC<{ icon: React.ReactNode; text: string; href?: string }> = ({ icon, text, href }) => (
  <Box
    component={href ? 'a' : 'div'}
    href={href}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      mb: { xs: 1.5, md: 2 },
      textDecoration: 'none',
      color: 'inherit',
      transition: href ? 'color 0.3s ease' : undefined,
      '&:hover': href ? { color: 'primary.main' } : undefined,
    }}
  >
    {icon}
    <Typography sx={{ fontSize: { xs: '0.9rem', md: '0.95rem' } }}>{text}</Typography>
  </Box>
);

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const validateForm = () => {
    const next: FormErrors = {};
    if (!formData.name.trim()) next.name = 'Name is required';
    if (!formData.email.trim()) next.email = 'Email is required';
    else if (!validateEmail(formData.email)) next.email = 'Please enter a valid email address';
    if (!formData.message.trim()) next.message = 'Message is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const openMailClient = () => {
    const subject = encodeURIComponent(`Message from ${formData.name} via geneyu.me`);
    const body = encodeURIComponent(`${formData.message}\n\n— ${formData.name} <${formData.email}>`);
    window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;
    setSnackbar({ open: true, message: 'Opening your email client with the message pre-filled.', severity: 'info' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!CONTACT_ENDPOINT) {
      openMailClient();
      return;
    }

    setSending(true);
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...formData,
          ...(CONTACT_ACCESS_KEY ? { access_key: CONTACT_ACCESS_KEY } : {}),
          subject: `Message from ${formData.name} via geneyu.me`,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSnackbar({ open: true, message: 'Message sent. I will get back to you soon.', severity: 'success' });
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setSnackbar({ open: true, message: 'Could not send right now. Opening your email client instead.', severity: 'error' });
      openMailClient();
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  return (
    <Box
      component="section"
      id="contact"
      aria-labelledby="contact-heading"
      sx={{
        minHeight: { xs: 'auto', md: '90vh' },
        py: { xs: 6, md: 10 },
        position: 'relative',
        scrollSnapAlign: { xs: 'none', md: 'start' },
        scrollSnapStop: { xs: 'none', md: 'always' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="lg">
        <SectionHeading id="contact-heading" number="05." title="Contact" />
        <Grid container spacing={2} alignItems="stretch">
          {/* Contact information */}
          <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%', display: 'flex' }}
            >
              <Paper
                elevation={3}
                sx={{
                  ...glassPaper,
                  p: { xs: 2.5, md: 3 },
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 3,
                }}
              >
                <Box>
                  <Typography variant="h3" sx={{ mb: { xs: 1.5, md: 2 }, fontWeight: 600, fontSize: { xs: '1.5rem', md: '1.8rem' } }}>
                    Get in touch
                  </Typography>
                  <Typography variant="body1" sx={{ mb: { xs: 3, md: 4 }, color: 'text.secondary', fontSize: { xs: '0.9rem', md: '0.95rem' }, lineHeight: 1.6 }}>
                    Open to interesting engineering problems, collaborations and good conversations. Email is the fastest way to reach me.
                  </Typography>
                  <ContactItem
                    icon={<EmailIcon sx={{ color: 'primary.main', fontSize: { xs: '1.2rem', md: '1.3rem' } }} />}
                    text={contactInfo.email}
                    href={`mailto:${contactInfo.email}`}
                  />
                  <ContactItem
                    icon={<LocationOnIcon sx={{ color: 'primary.main', fontSize: { xs: '1.2rem', md: '1.3rem' } }} />}
                    text={contactInfo.location}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <SocialButton href={contactInfo.socialLinks.github} label="GitHub" icon={<GitHubIcon sx={{ fontSize: '1.3rem' }} />} />
                  <SocialButton href={contactInfo.socialLinks.linkedin} label="LinkedIn" icon={<LinkedInIcon sx={{ fontSize: '1.3rem' }} />} />
                  <SocialButton href={contactInfo.socialLinks.instagram} label="Instagram" icon={<InstagramIcon sx={{ fontSize: '1.3rem' }} />} />
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Contact form */}
          <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%', display: 'flex' }}
            >
              <Paper
                elevation={3}
                sx={{ ...glassPaper, p: { xs: 2.5, md: 3 }, width: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <Typography variant="h3" sx={{ mb: { xs: 1.5, md: 2 }, fontWeight: 600, fontSize: { xs: '1.5rem', md: '1.8rem' } }}>
                  Send me something
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  aria-label="Contact form"
                  sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}
                >
                  <FormInput
                    label="Name"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    icon={<PersonIcon sx={{ fontSize: '1.2rem', color: 'primary.main' }} />}
                  />
                  <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    icon={<EmailIcon sx={{ fontSize: '1.2rem', color: 'primary.main' }} />}
                  />
                  <FormInput
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    error={errors.message}
                    multiline
                    minRows={4}
                    maxRows={8}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={sending}
                    endIcon={<SendIcon />}
                    sx={{
                      mt: 'auto',
                      py: { xs: 1.2, md: 1.4 },
                      backgroundColor: 'primary.main',
                      color: 'background.default',
                      textTransform: 'none',
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                      '&:hover': { backgroundColor: 'primary.dark' },
                    }}
                  >
                    {sending ? 'Sending…' : CONTACT_ENDPOINT ? 'Send message' : 'Send via email'}
                  </Button>
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
