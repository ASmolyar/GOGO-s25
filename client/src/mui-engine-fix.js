// This file provides the missing exports for @mui/styled-engine
import {
  ThemeContext,
  css,
  keyframes,
  GlobalStyles,
  StyledEngineProvider,
  internal_processStyles,
} from '@mui/styled-engine';

// Add missing internal exports that MUI system expects
export const internal_serializeStyles = internal_processStyles;
export const internal_mutateStyles = (styles) => styles;

// Re-export the official exports
export {
  ThemeContext,
  css,
  keyframes,
  GlobalStyles,
  StyledEngineProvider,
  internal_processStyles,
};

// Default export
export default function createStyled(...args) {
  // This is a simplified version of createStyled
  const realCreateStyled = require('@mui/styled-engine').default;
  return realCreateStyled(...args);
}
