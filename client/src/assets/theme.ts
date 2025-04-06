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
    primary: {
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
      main: COLORS.primaryBlue,
    },
    secondary: {
      main: COLORS.secondarySeafoam,
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
  },
});

export default theme;
