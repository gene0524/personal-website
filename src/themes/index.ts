import type { ThemeOptions, Components, Theme } from '@mui/material/styles';
import type { TypographyOptions } from '@mui/material/styles/createTypography';

export const FONT_BODY = "'Inter Variable', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
export const FONT_DISPLAY = "'Poppins', 'Inter Variable', sans-serif";
export const FONT_MONO = "'Space Mono', Menlo, Monaco, Consolas, monospace";

export const modernTechTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
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

export const typography: TypographyOptions = {
  fontFamily: FONT_BODY,
  h1: {
    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
    fontFamily: FONT_DISPLAY,
  },
  h2: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    lineHeight: 1.3,
    fontFamily: FONT_DISPLAY,
  },
  h3: {
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    fontWeight: 700,
    lineHeight: 1.4,
    fontFamily: FONT_DISPLAY,
  },
  h4: {
    fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
    fontWeight: 600,
    lineHeight: 1.4,
    fontFamily: FONT_DISPLAY,
  },
  h5: {
    fontFamily: FONT_DISPLAY,
    fontWeight: 700,
  },
  h6: {
    fontFamily: FONT_DISPLAY,
    fontWeight: 600,
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
