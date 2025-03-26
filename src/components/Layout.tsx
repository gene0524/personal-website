import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Button, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Divider,
  ListItemButton,
  ListItemIcon
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollSpy } from '../hooks/useScrollSpy';
import DownloadIcon from '@mui/icons-material/Download';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useScrollSpy();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navItems = ['Home', 'About', 'Experience', 'Projects', 'Contact'];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        // Scroll down
        setIsVisible(false);
      } else {
        // Scroll up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const sectionMap: { [key: string]: string } = {
      'home': 'hero',
      'about': 'about',
      'experience': 'experience',
      'projects': 'projects',
      'contact': 'contact',
    };

    const targetId = sectionMap[sectionId] || sectionId;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    handleDrawerToggle();
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, color: 'primary.main', fontWeight: 700 }}>
        Gene
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton
              sx={{ textAlign: 'center' }}
              onClick={() => scrollToSection(item.toLowerCase())}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href="/assets/files/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textAlign: 'center',
              color: 'primary.main',
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <DownloadIcon color="primary" />
            <ListItemText primary="Resume" sx={{ flex: '0 0 auto' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ duration: 0.3 }}
          >
            <AppBar 
              position="fixed" 
              sx={{ 
                backgroundColor: 'rgba(10, 25, 47, 0.85)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(0, 255, 157, 0.1)',
              }}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ 
                    flexGrow: 1, 
                    fontWeight: 800,
                    fontSize: '1.5rem',
                    fontFamily: '"Space Grotesk", sans-serif',
                    letterSpacing: '-0.05em',
                    position: 'relative',
                    display: 'inline-block',
                    transformOrigin: 'left center',
                    background: 'linear-gradient(135deg, #00FF9D 0%, #00D8FF 50%, #00FF9D 100%)',
                    backgroundSize: '200% auto',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    animation: 'gradient 3s linear infinite',
                    '@keyframes gradient': {
                      '0%': {
                        backgroundPosition: '0% center',
                      },
                      '100%': {
                        backgroundPosition: '200% center',
                      },
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '120%',
                      height: '120%',
                      left: '-10%',
                      top: '-10%',
                      background: 'inherit',
                      filter: 'blur(20px)',
                      opacity: 0.3,
                      zIndex: -1,
                    },
                    '&:hover': {
                      transform: 'scale(1.05) translateX(2px)',
                      transition: 'all 0.3s ease',
                    },
                  }}
                >
                  GY
                </Typography>
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
                  {navItems.map((item) => (
                    <Button
                      key={item}
                      sx={{
                        color: 'text.primary',
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                      onClick={() => scrollToSection(item.toLowerCase())}
                    >
                      {item}
                    </Button>
                  ))}
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    href="/assets/files/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      ml: 2,
                      backgroundColor: 'primary.main',
                      color: 'background.paper',
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: '20px',
                      px: 2,
                      py: 0.75,
                      minWidth: 'auto',
                      height: '36px',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease',
                      },
                    }}
                  >
                    Resume
                  </Button>
                </Box>
              </Toolbar>
            </AppBar>
          </motion.div>
        )}
      </AnimatePresence>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
            bgcolor: 'background.paper',
          },
        }}
      >
        {drawer}
      </Drawer>
      
      <Toolbar />
      
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </Container>

      <Box component="footer" sx={{ 
        py: 3, 
        bgcolor: 'background.paper',
        position: 'relative',
        width: '100%',
      }}>
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} My Portfolio. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 