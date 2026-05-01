import { Box, Tooltip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollSpy } from '../hooks/useScrollSpy';

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'travel', label: 'Travel' },
  { id: 'contact', label: 'Contact' },
];

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const ScrollIndicator = () => {
  const activeSection = useScrollSpy();

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 20,
        top: '50%',
        transform: 'translateY(-50%)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1000,
        gap: 0,
      }}
    >
      {SECTIONS.map((section, index) => {
        const isActive = activeSection === section.id;
        return (
          <Box
            key={section.id}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            {index > 0 && (
              <Box
                sx={{
                  width: '1px',
                  height: 22,
                  backgroundColor: isActive
                    ? 'rgba(0,255,157,0.35)'
                    : 'rgba(255,255,255,0.12)',
                  transition: 'background-color 0.4s ease',
                }}
              />
            )}

            <Tooltip title={section.label} placement="left" arrow>
              <Box
                component={motion.div}
                onClick={() => scrollTo(section.id)}
                animate={{
                  scale: isActive ? 1.5 : 1,
                  boxShadow: isActive
                    ? '0 0 10px rgba(0,255,157,0.8)'
                    : '0 0 0px transparent',
                }}
                transition={{ duration: 0.3 }}
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  backgroundColor: isActive
                    ? 'primary.main'
                    : 'rgba(255,255,255,0.28)',
                  transition: 'background-color 0.4s ease',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.main' : 'rgba(255,255,255,0.6)',
                  },
                }}
              />
            </Tooltip>
          </Box>
        );
      })}
    </Box>
  );
};

export default ScrollIndicator;
