import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import ExperienceSection from './components/sections/ExperienceSection';
import ProjectsSection from './components/sections/ProjectsSection';
import ContactSection from './components/sections/ContactSection';
import SocialLinks from './components/SocialLinks';
import CustomCursor from './components/CustomCursor';
import ScrollIndicator from './components/ScrollIndicator';
import { Box, CircularProgress } from '@mui/material';
import { modernTechTheme, typography, components } from './themes';

const TravelSection = lazy(() => import('./components/sections/TravelSection'));

// Defer mounting TravelSection (and its ~1.8MB three.js chunk) until the user
// scrolls near it, so it doesn't compete with above-the-fold resources.
// The placeholder keeps the #travel anchor and section height so nav links
// and scroll-snap behave the same before the real section swaps in.
const DeferredTravelSection: React.FC = () => {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = placeholderRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        io.disconnect();
      }
    }, { rootMargin: '1500px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (shouldLoad) {
    return (
      <Suspense fallback={
        <Box
          id="travel"
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
        >
          <CircularProgress color="primary" />
        </Box>
      }>
        <TravelSection />
      </Suspense>
    );
  }

  return (
    <Box
      ref={placeholderRef}
      id="travel"
      sx={{
        minHeight: '100vh',
        scrollSnapAlign: { xs: 'none', md: 'start' },
        scrollSnapStop: { xs: 'none', md: 'always' },
      }}
    />
  );
};

const theme = createTheme({
  ...modernTechTheme,
  typography,
  components,
  shape: {
    borderRadius: 12,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CustomCursor />
      <ScrollIndicator />
      <Box
        sx={{
          height: '100vh',
          overflowY: 'auto',
          scrollSnapType: { xs: 'none', md: 'y proximity' },
          scrollBehavior: 'smooth',
          overscrollBehavior: 'contain',
          '&::-webkit-scrollbar': {
            width: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'background.paper',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'primary.main',
            borderRadius: 4,
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          },
        }}
      >
        <Layout>
          <HeroSection />
          <AboutSection />
          <ExperienceSection />
          <ProjectsSection />
          <DeferredTravelSection />
          <ContactSection />
          <SocialLinks />
        </Layout>
      </Box>
    </ThemeProvider>
  );
}

export default App;
