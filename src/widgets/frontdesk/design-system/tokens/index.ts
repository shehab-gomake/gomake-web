/**
 * FrontDesk Design System - Token System
 *
 * Central export for all design tokens.
 * Import from here to access the complete token system.
 */

export * from './colors.tokens';
export * from './spacing.tokens';
export * from './typography.tokens';
export * from './shadows.tokens';
export * from './radius.tokens';

import { colorTokens, getColor, getSemanticColor } from './colors.tokens';
import { spacingTokens, semanticSpacing, getSpacing, getSemanticSpacing } from './spacing.tokens';
import { typographyTokens, semanticTypography, getTypographyStyle } from './typography.tokens';
import { shadowTokens, semanticShadows, getShadow, getSemanticShadow } from './shadows.tokens';
import { radiusTokens, semanticRadius, getRadius, getSemanticRadius } from './radius.tokens';

/**
 * Complete design token system
 */
export const tokens = {
  colors: colorTokens,
  spacing: spacingTokens,
  typography: typographyTokens,
  shadows: shadowTokens,
  radius: radiusTokens,
  semantic: {
    spacing: semanticSpacing,
    typography: semanticTypography,
    shadows: semanticShadows,
    radius: semanticRadius,
  },
} as const;

/**
 * Utility functions for accessing tokens
 */
export const tokenUtils = {
  getColor,
  getSemanticColor,
  getSpacing,
  getSemanticSpacing,
  getTypographyStyle,
  getShadow,
  getSemanticShadow,
  getRadius,
  getSemanticRadius,
};

/**
 * Default theme configuration
 * Maps tokens to MUI theme structure for seamless integration
 */
export const createFrontDeskTheme = () => ({
  palette: {
    primary: {
      main: colorTokens.primary[600],
      light: colorTokens.primary[400],
      dark: colorTokens.primary[800],
    },
    secondary: {
      main: colorTokens.neutral[600],
      light: colorTokens.neutral[400],
      dark: colorTokens.neutral[800],
    },
    error: {
      main: colorTokens.error[600],
    },
    warning: {
      main: colorTokens.warning[600],
    },
    info: {
      main: colorTokens.info[600],
    },
    success: {
      main: colorTokens.success[600],
    },
    text: {
      primary: colorTokens.semantic.text.primary,
      secondary: colorTokens.semantic.text.secondary,
      disabled: colorTokens.semantic.text.disabled,
    },
    background: {
      default: colorTokens.semantic.background.primary,
      paper: colorTokens.semantic.background.primary,
    },
    divider: colorTokens.semantic.border.default,
  },
  typography: {
    fontFamily: typographyTokens.fontFamily.sans,
    fontSize: typographyTokens.fontSize.md,
  },
  spacing: (factor: number) => spacingTokens[factor as keyof typeof spacingTokens] || factor * 4,
  shape: {
    borderRadius: radiusTokens.md,
  },
  shadows: Object.values(shadowTokens).map(shadow => shadow),
});