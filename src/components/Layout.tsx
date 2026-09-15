import React, { useState } from 'react';
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
  Divider,
  ListItemButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DownloadIcon from '@mui/icons-material/Download';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { personalInfo } from '../data/personalInfo';
import { FONT_DISPLAY } from '../themes';

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Work' },
  { id: 'travel', label: 'Travel' },
  { id: 'contact', label: 'Contact' },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useScrollSpy();

  const handleDrawerToggle = () => setMobileOpen(prev => !prev);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, color: 'primary.main', fontWeight: 700 }}>
        Gene
      </Typography>
      <Divider />
      <List component="nav" aria-label="Mobile">
        {NAV_ITEMS.map(item => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={activeSection === item.id}
              sx={{ textAlign: 'center' }}
              onClick={() => scrollToSection(item.id)}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href={personalInfo.resumeUrl}
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
      <AppBar
        position="fixed"
        component="header"
        sx={{
          backgroundColor: 'rgba(10, 25, 47, 0.85)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 255, 157, 0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="a"
            href="#hero"
            onClick={(e: React.MouseEvent) => { e.preventDefault(); scrollToSection('hero'); }}
            aria-label="GY — Gene Yu, back to top"
            sx={{
              flexGrow: 1,
              fontWeight: 800,
              fontSize: '1.5rem',
              fontFamily: FONT_DISPLAY,
              letterSpacing: '-0.04em',
              textDecoration: 'none',
              display: 'inline-block',
              background: 'linear-gradient(135deg, #00FF9D 0%, #00D8FF 50%, #00FF9D 100%)',
              backgroundSize: '200% auto',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              animation: 'gradient 3s linear infinite',
              '@keyframes gradient': {
                '0%': { backgroundPosition: '0% center' },
                '100%': { backgroundPosition: '200% center' },
              },
            }}
          >
            GY
          </Typography>
          <Box
            component="nav"
            aria-label="Primary"
            sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}
          >
            {NAV_ITEMS.map(item => {
              const isActive = activeSection === item.id;
              return (
                <Button
                  key={item.id}
                  aria-current={isActive ? 'true' : undefined}
                  sx={{
                    color: isActive ? 'primary.main' : 'text.primary',
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '4px 8px',
                    minWidth: '60px',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: 8,
                      right: 8,
                      bottom: 2,
                      height: 2,
                      borderRadius: 1,
                      backgroundColor: 'primary.main',
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.25s ease',
                    },
                    '&:hover': { color: 'primary.main' },
                  }}
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.label}
                </Button>
              );
            })}
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                ml: 1.5,
                backgroundColor: 'primary.main',
                color: 'background.paper',
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                borderRadius: '18px',
                px: 1.5,
                py: 0.6,
                minWidth: 'auto',
                height: '32px',
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

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
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

      <Box component="main" id="main" sx={{ flex: 1, width: '100%' }}>
        {children}
      </Box>

      <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper', width: '100%' }}>
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Gene Yu
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
