/**
 * FrontDesk Design System - Theme Configuration
 *
 * MUI theme overrides for seamless integration with design tokens
 */

import { createTheme } from '@mui/material/styles';
import { colorTokens, typographyTokens, radiusTokens, shadowTokens, spacingTokens } from './tokens';

const theme = createTheme({
  palette: {
    primary: {
      main: colorTokens.primary[600],
      light: colorTokens.primary[400],
      dark: colorTokens.primary[800],
      contrastText: '#fff',
    },
    secondary: {
      main: colorTokens.neutral[600],
      light: colorTokens.neutral[400],
      dark: colorTokens.neutral[800],
    },
    error: {
      main: colorTokens.error[600],
      light: colorTokens.error[400],
      dark: colorTokens.error[800],
    },
    warning: {
      main: colorTokens.warning[600],
      light: colorTokens.warning[400],
      dark: colorTokens.warning[800],
    },
    info: {
      main: colorTokens.info[600],
      light: colorTokens.info[400],
      dark: colorTokens.info[800],
    },
    success: {
      main: colorTokens.success[600],
      light: colorTokens.success[400],
      dark: colorTokens.success[800],
    },
    text: {
      primary: colorTokens.semantic.text.primary,
      secondary: colorTokens.semantic.text.secondary,
      disabled: colorTokens.semantic.text.disabled,
    },
    background: {
      default: colorTokens.semantic.background.secondary,
      paper: colorTokens.semantic.background.primary,
    },
    divider: colorTokens.semantic.border.default,
  },
  typography: {
    fontFamily: typographyTokens.fontFamily.sans,
    fontSize: typographyTokens.fontSize.md,
    h1: {
      fontSize: typographyTokens.fontSize['3xl'],
      fontWeight: typographyTokens.fontWeight.bold,
      lineHeight: typographyTokens.lineHeight.tight,
    },
    h2: {
      fontSize: typographyTokens.fontSize['2xl'],
      fontWeight: typographyTokens.fontWeight.semibold,
      lineHeight: typographyTokens.lineHeight.tight,
    },
    h3: {
      fontSize: typographyTokens.fontSize.xl,
      fontWeight: typographyTokens.fontWeight.semibold,
      lineHeight: typographyTokens.lineHeight.snug,
    },
    h4: {
      fontSize: typographyTokens.fontSize.lg,
      fontWeight: typographyTokens.fontWeight.semibold,
      lineHeight: typographyTokens.lineHeight.snug,
    },
    h5: {
      fontSize: typographyTokens.fontSize.md,
      fontWeight: typographyTokens.fontWeight.semibold,
      lineHeight: typographyTokens.lineHeight.normal,
    },
    h6: {
      fontSize: typographyTokens.fontSize.base,
      fontWeight: typographyTokens.fontWeight.semibold,
      lineHeight: typographyTokens.lineHeight.normal,
    },
    body1: {
      fontSize: typographyTokens.fontSize.md,
      lineHeight: typographyTokens.lineHeight.normal,
    },
    body2: {
      fontSize: typographyTokens.fontSize.base,
      lineHeight: typographyTokens.lineHeight.normal,
    },
    caption: {
      fontSize: typographyTokens.fontSize.sm,
      lineHeight: typographyTokens.lineHeight.normal,
    },
    button: {
      fontSize: typographyTokens.fontSize.base,
      fontWeight: typographyTokens.fontWeight.medium,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: radiusTokens.md,
  },
  spacing: (factor: number) => {
    // MUI uses 8px base by default, map to our 4px base
    return spacingTokens[factor as keyof typeof spacingTokens] || factor * 4;
  },
  shadows: [
    shadowTokens.none,
    shadowTokens.xs,
    shadowTokens.sm,
    shadowTokens.md,
    shadowTokens.lg,
    shadowTokens.xl,
    shadowTokens['2xl'],
    shadowTokens['2xl'],
    shadowTokens['2xl'],
    shadowTokens['2xl'],
    shadowTokens['2xl'],
    shadowTokens['2xl'],
    shadowTokens['2xl'],
    shadowTokens['2xl'],
    shadowTokens['2xl'],
    shadowTokens['2xl'],
    shadowTokens['2xl'],
    shadowTokens['2xl'],
    shadowTokens['2xl'],
    shadowTokens['2xl'],
    shadowTokens['2xl'],
    shadowTokens['2xl'],
    shadowTokens['2xl'],
    shadowTokens['2xl'],
    shadowTokens['2xl'],
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: radiusTokens.md,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: shadowTokens.sm,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: radiusTokens.lg,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: radiusTokens.lg,
          boxShadow: shadowTokens.sm,
        },
      },
    },
  },
});

export default theme;