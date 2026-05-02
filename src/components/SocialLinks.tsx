import { useState } from 'react';
import { Box, IconButton, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const socialLinks = [
  { icon: <LinkedInIcon />, url: 'https://linkedin.com/in/gene-yu-tw', label: 'LinkedIn' },
  { icon: <GitHubIcon />,   url: 'https://github.com/gene0524',         label: 'GitHub' },
  { icon: <InstagramIcon />, url: 'https://www.instagram.com/gene_0524_', label: 'Instagram' },
];

const SocialLinks = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // ── Desktop: original fixed horizontal strip ───────────────────────────
  if (!isMobile) {
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'background.paper',
                  boxShadow: '0 0 15px rgba(0,255,157,0.3)',
                },
              }}
            >
              {link.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
    );
  }

  // ── Mobile: collapsible tab on the left edge ───────────────────────────
  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        top: '70%',
        transform: 'translateY(-50%)',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Sliding icon panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                py: 1.2,
                px: 0.8,
                backgroundColor: 'rgba(10,15,20,0.88)',
                backdropFilter: 'blur(12px)',
                borderTop: '1px solid rgba(0,255,157,0.3)',
                borderBottom: '1px solid rgba(0,255,157,0.3)',
                borderRight: 'none',
              }}
            >
              {socialLinks.map((link) => (
                <Tooltip key={link.label} title={link.label} placement="right">
                  <IconButton
                    component="a"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      width: 36,
                      height: 36,
                      color: 'primary.main',
                      border: '1px solid rgba(0,255,157,0.35)',
                      borderRadius: '50%',
                      '&:hover': {
                        backgroundColor: 'rgba(0,255,157,0.12)',
                      },
                    }}
                  >
                    {link.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab trigger — always visible */}
      <Box
        onClick={() => setOpen(prev => !prev)}
        sx={{
          width: 20,
          height: 64,
          backgroundColor: 'rgba(10,15,20,0.88)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0,255,157,0.35)',
          borderLeft: 'none',
          borderRadius: '0 8px 8px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <ChevronRightIcon
          sx={{
            fontSize: 14,
            color: 'primary.main',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
          }}
        />
      </Box>
    </Box>
  );
};

export default SocialLinks;
