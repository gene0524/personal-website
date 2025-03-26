import { ThemeOptions, Components, Theme } from '@mui/material/styles';
import { TypographyOptions } from '@mui/material/styles/createTypography';

export const modernTechTheme: ThemeOptions = {
  palette: {
    primary: {
      main: '#00ff9d',
      light: '#6effcf',
      dark: '#00cb6e',
    },
    secondary: {
      main: '#ff3366',
      light: '#ff6b8f',
      dark: '#c6003f',
    },
    background: {
      default: '#0a192f',
      paper: '#112240',
    },
    text: {
      primary: '#e6f1ff',
      secondary: '#8892b0',
    },
  },
};

export const elegantDarkTheme: ThemeOptions = {
  palette: {
    primary: {
      main: '#9d4edd',
      light: '#b75cff',
      dark: '#7b3aa3',
    },
    secondary: {
      main: '#ff9e00',
      light: '#ffb74d',
      dark: '#c67100',
    },
    background: {
      default: '#1a1a1a',
      paper: '#2d2d2d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
};

export const natureTheme: ThemeOptions = {
  palette: {
    primary: {
      main: '#2ecc71',
      light: '#58d68d',
      dark: '#27ae60',
    },
    secondary: {
      main: '#3498db',
      light: '#5dade2',
      dark: '#2980b9',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
  },
};

export const typography: TypographyOptions = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
    fontFamily: "'Poppins', sans-serif",
  },
  h2: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    lineHeight: 1.3,
    fontFamily: "'Poppins', sans-serif",
  },
  h3: {
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    fontWeight: 700,
    lineHeight: 1.4,
    fontFamily: "'Poppins', sans-serif",
  },
  h4: {
    fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
    fontWeight: 600,
    lineHeight: 1.4,
    fontFamily: "'Poppins', sans-serif",
  },
  body1: {
    fontSize: 'clamp(1rem, 2vw, 1.125rem)',
    lineHeight: 1.7,
    letterSpacing: '0.01em',
  },
  body2: {
    fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
    lineHeight: 1.6,
  },
  button: {
    fontWeight: 500,
    fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
  },
};

export const components: Components<Theme> = {
  MuiButton: {
    styleOverrides: {
      root: {
        fontWeight: 500,
        padding: '8px 24px',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  MuiContainer: {
    styleOverrides: {
      root: {
        paddingLeft: 'clamp(1rem, 5vw, 2rem)',
        paddingRight: 'clamp(1rem, 5vw, 2rem)',
      },
    },
  },
}; 