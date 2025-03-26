import { Box, IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';

/**
 * SocialLinks Component
 * Displays social media links on the left side of the page
 * Includes horizontal decorative lines and hover animations
 */
const SocialLinks = () => {
  const socialLinks = [
    { icon: <LinkedInIcon />, url: 'https://linkedin.com/in/gene-yu-tw', label: 'LinkedIn' },
    { icon: <GitHubIcon />, url: 'https://github.com/gene0524', label: 'GitHub' },
    { icon: <InstagramIcon />, url: 'https://www.instagram.com/gene_0524_', label: 'Instagram' },
  ];

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        position: 'fixed',
        left: 80,
        bottom: 60,
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        zIndex: 1000,
        // Base line that runs through all nodes
        '&::before': {
          content: '""',
          position: 'absolute',
          left: '-80px',
          right: '-40px',
          top: '50%',
          height: '2px',
          backgroundColor: 'primary.main',
          transform: 'translateY(-50%)',
          zIndex: -1,
        },
      }}
    >
      {socialLinks.map((link, index) => (
        <Tooltip key={index} title={link.label} placement="right">
          <IconButton
            component={motion.a}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              backgroundColor: 'background.paper',
              border: '2px solid',
              borderColor: 'primary.main',
              width: 40,
              height: 40,
              color: 'primary.main',
              // Ensure button content is vertically and horizontally centered
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'background.paper',
                boxShadow: '0 0 15px rgba(0, 255, 157, 0.3)',
              },
            }}
          >
            {link.icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
};

export default SocialLinks; 