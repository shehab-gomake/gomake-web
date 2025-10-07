/**
 * FrontDesk Design System - Border Radius Tokens
 *
 * Consistent border radius values for rounded corners.
 * Provides smooth, modern interface with appropriate roundness levels.
 */

export const radiusTokens = {
  none: 0,
  xs: 2,      // 2px - subtle rounding
  sm: 4,      // 4px - small elements
  md: 6,      // 6px - default rounding
  lg: 8,      // 8px - cards, panels
  xl: 12,     // 12px - prominent elements
  '2xl': 16,  // 16px - large cards
  '3xl': 24,  // 24px - hero elements
  full: 9999, // Full circle/pill
} as const;

// Semantic radius mappings for common UI patterns
export const semanticRadius = {
  // Component types
  component: {
    button: radiusTokens.md,
    buttonLarge: radiusTokens.lg,
    input: radiusTokens.md,
    card: radiusTokens.lg,
    panel: radiusTokens.lg,
    modal: radiusTokens.xl,
    popover: radiusTokens.lg,
    tooltip: radiusTokens.sm,
    badge: radiusTokens.full,
    chip: radiusTokens.full,
    avatar: radiusTokens.full,
    image: radiusTokens.md,
  },

  // Interactive elements
  interactive: {
    default: radiusTokens.md,
    hover: radiusTokens.lg,
    small: radiusTokens.sm,
    large: radiusTokens.xl,
  },
} as const;

export type RadiusToken = keyof typeof radiusTokens;
export type SemanticRadiusCategory = keyof typeof semanticRadius;

/**
 * Get radius value
 * @example getRadius('md') => 6
 */
export const getRadius = (token: RadiusToken): number => {
  return radiusTokens[token];
};

/**
 * Get semantic radius
 * @example getSemanticRadius('component', 'button') => 6
 */
export const getSemanticRadius = (
  category: SemanticRadiusCategory,
  variant: string
): number => {
  return semanticRadius[category][variant as keyof typeof semanticRadius[typeof category]];
};