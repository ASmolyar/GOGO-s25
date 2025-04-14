/**
 * A file for defining the global MUI theme used in the project.
 */
import { createTheme } from '@mui/material/styles';
import COLORS from './colors.ts';
import 'typeface-hk-grotesk';
// No need to import the fonts.css here since we imported it in index.css

// https://github.com/hack4impact/chapter-website-template/blob/main/public/style.css
const theme = createTheme({
  palette: {
    mode: 'dark', // Set the theme to dark mode
    primary: {
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
      main: COLORS.gogo_blue,
    },
    secondary: {
      main: COLORS.gogo_green,
    },
    background: {
      default: COLORS.darkModePastelBlack,
      paper: COLORS.darkModePastelBlack,
    },
    text: {
      primary: COLORS.white,
      secondary: COLORS.lightGray,
    },
    error: {
      main: COLORS.gogo_pink,
    },
    warning: {
      main: COLORS.gogo_yellow,
    },
    info: {
      main: COLORS.gogo_purple,
    },
    success: {
      main: COLORS.gogo_green,
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
  typography: {
    // Default body font
    fontFamily: ['Century Gothic', 'Arial', 'sans-serif'].join(','),
    // Heading font settings
    h1: {
      fontFamily: 'Airwaves, sans-serif',
      fontWeight: 'normal',
    },
    h2: {
      fontFamily: 'Airwaves, sans-serif',
      fontWeight: 'normal',
    },
    h3: {
      fontFamily: 'Airwaves, sans-serif',
      fontWeight: 'normal',
    },
    h4: {
      fontFamily: 'Airwaves, sans-serif',
      fontWeight: 'normal',
    },
    h5: {
      fontFamily: 'Airwaves, sans-serif',
      fontWeight: 'normal',
    },
    h6: {
      fontFamily: 'Airwaves, sans-serif',
      fontWeight: 'normal',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: 'Century Gothic, Arial, sans-serif',
          letterSpacing: '0.3px',
          lineHeight: '1.5',
          backgroundColor: COLORS.darkModePastelBlack,
          color: COLORS.white,
        },
        h1: {
          fontFamily: 'Airwaves, sans-serif !important',
        },
        h2: {
          fontFamily: 'Airwaves, sans-serif !important',
          fontSize: '38px !important',
          marginBottom: '32px !important',
        },
        h3: {
          fontFamily: 'Airwaves, sans-serif !important',
          marginBottom: '10px',
        },
        h4: {
          fontFamily: 'Airwaves, sans-serif !important',
        },
        h5: {
          fontFamily: 'Airwaves, sans-serif !important',
        },
        h6: {
          fontFamily: 'Airwaves, sans-serif !important',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          textTransform: 'none',
          fontWeight: 'bold',
        },
        containedPrimary: {
          backgroundColor: COLORS.gogo_blue,
          '&:hover': {
            backgroundColor: '#0e3cd0', // Darker shade of gogo_blue
          },
        },
        containedSecondary: {
          backgroundColor: COLORS.gogo_green,
          '&:hover': {
            backgroundColor: '#57a080', // Darker shade of gogo_green
          },
        },
      },
    },
  },
});

export default theme;
