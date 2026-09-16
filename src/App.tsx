import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import SocialLinks from './components/SocialLinks';
import ScrollIndicator from './components/ScrollIndicator';
import { Box, CircularProgress } from '@mui/material';
import { modernTechTheme, typography, components } from './themes';

// Below-the-fold sections were all bundled eagerly into the main chunk
// (~650KB/207KB gzip) regardless of whether a visit ever scrolls that far.
// About stays eager - it's usually the very next thing scrolled to, so
// deferring it wouldn't save meaningful time and risks a visible loading
// flash for the MOST likely next section. Everything after it uses the same
// pattern proven out on TravelSection: idle-prefetch the code (decoupled
// from scroll position, using the seconds of idle time before a normal
// visit scrolls this far) + defer actual mounting until an IntersectionObserver
// says it's getting close.
const ExperienceSection = lazy(() => import('./components/sections/ExperienceSection'));
const ProjectsSection = lazy(() => import('./components/sections/ProjectsSection'));
const TravelSection = lazy(() => import('./components/sections/TravelSection'));
const ContactSection = lazy(() => import('./components/sections/ContactSection'));

interface DeferredSectionProps {
  id: string;
  minHeight: string | { xs?: string; md?: string };
  rootMargin: string;
  Component: React.LazyExoticComponent<React.ComponentType>;
  onPrefetch: () => void;
}

const DeferredSection: React.FC<DeferredSectionProps> = ({ id, minHeight, rootMargin, Component, onPrefetch }) => {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const id2 = idle ? idle(onPrefetch) : window.setTimeout(onPrefetch, 2000);
    return () => { if (!idle) window.clearTimeout(id2); };
  }, [onPrefetch]);

  useEffect(() => {
    const el = placeholderRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        io.disconnect();
      }
    }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  if (shouldLoad) {
    return (
      <Suspense fallback={
        <Box id={id} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight }}>
          <CircularProgress color="primary" />
        </Box>
      }>
        <Component />
      </Suspense>
    );
  }

  return (
    <Box
      ref={placeholderRef}
      id={id}
      sx={{ minHeight, scrollSnapAlign: { xs: 'none', md: 'start' }, scrollSnapStop: { xs: 'none', md: 'always' } }}
    />
  );
};

// react-globe.gl's own data dependencies (world-atlas JSON + texture) don't
// prefetch themselves just because the JS chunk did - see TravelSection.tsx.
const prefetchTravel = () => {
  import('./components/sections/TravelSection');
  fetch('/globe/countries-110m.json').catch(() => {});
  new Image().src = '/globe/earth-night.webp';
};
// Stable module-level references so DeferredSection's onPrefetch effect
// dependency doesn't change identity every render.
const prefetchExperience = () => { import('./components/sections/ExperienceSection'); };
const prefetchProjects = () => { import('./components/sections/ProjectsSection'); };
const prefetchContact = () => { import('./components/sections/ContactSection'); };

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
          <DeferredSection
            id="experience"
            Component={ExperienceSection}
            onPrefetch={prefetchExperience}
            rootMargin="1200px 0px"
            minHeight={{ xs: 'auto', md: '100vh' }}
          />
          <DeferredSection
            id="projects"
            Component={ProjectsSection}
            onPrefetch={prefetchProjects}
            rootMargin="1200px 0px"
            minHeight={{ xs: 'auto', md: '100vh' }}
          />
          <DeferredSection
            id="travel"
            Component={TravelSection}
            onPrefetch={prefetchTravel}
            rootMargin="2800px 0px"
            minHeight="100vh"
          />
          <DeferredSection
            id="contact"
            Component={ContactSection}
            onPrefetch={prefetchContact}
            rootMargin="1200px 0px"
            minHeight={{ xs: 'auto', md: '90vh' }}
          />
          <SocialLinks />
        </Layout>
      </Box>
    </ThemeProvider>
  );
}

export default App;
