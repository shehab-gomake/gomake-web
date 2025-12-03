/**
 * FrontDesk Design System - Border Radius Tokens
 *
 * Consistent border radius values for rounded corners.
 * Uses 14px as the standard card radius for a modern SaaS aesthetic.
 */

export const radiusTokens = {
  none: 0,
  xs: 2,      // 2px - subtle rounding
  sm: 4,      // 4px - small elements
  md: 8,      // 8px - default rounding
  lg: 12,     // 12px - buttons, inputs
  xl: 14,     // 14px - cards (design spec)
  '2xl': 16,  // 16px - panels
  '3xl': 20,  // 20px - large cards
  '4xl': 24,  // 24px - hero elements
  full: 9999, // Full circle/pill
} as const;

// Semantic radius mappings for common UI patterns
export const semanticRadius = {
  // Component types
  component: {
    button: radiusTokens.md,       // 8px
    buttonLarge: radiusTokens.lg,  // 12px
    input: radiusTokens.md,        // 8px
    card: radiusTokens.xl,         // 14px - design spec
    cardSmall: radiusTokens.lg,    // 12px
    panel: radiusTokens['2xl'],    // 16px
    modal: radiusTokens['3xl'],    // 20px
    popover: radiusTokens.xl,      // 14px
    tooltip: radiusTokens.md,      // 8px
    badge: radiusTokens.full,
    chip: radiusTokens.full,
    avatar: radiusTokens.full,
    image: radiusTokens.lg,        // 12px
    listItem: radiusTokens.lg,     // 12px
  },

  // Interactive elements
  interactive: {
    default: radiusTokens.md,      // 8px
    hover: radiusTokens.lg,        // 12px
    small: radiusTokens.sm,        // 4px
    large: radiusTokens.xl,        // 14px
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