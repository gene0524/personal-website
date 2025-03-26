import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import ExperienceSection from './components/sections/ExperienceSection';
import ProjectsSection from './components/sections/ProjectsSection';
import ContactSection from './components/sections/ContactSection';
import SocialLinks from './components/SocialLinks';
import { Box } from '@mui/material';
import { modernTechTheme, typography, components } from './themes';

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
      <Box
        sx={{
          height: '100vh',
          overflowY: 'auto',
          scrollSnapType: { xs: 'none', md: 'y proximity' },
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
          <ContactSection />
          <SocialLinks />
        </Layout>
      </Box>
    </ThemeProvider>
  );
}

export default App;
