/**
 * FrontDesk Design System - Shadow Tokens
 *
 * Modern elevation system using soft, subtle shadows for a premium SaaS aesthetic.
 * Uses rgba(0,0,0,0.04) as the base for softer, more refined shadows.
 */

export const shadowTokens = {
  // No shadow
  none: 'none',

  // Extra small shadow - subtle lift (barely visible)
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',

  // Small shadow - cards, buttons (soft shadow as per design spec)
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',

  // Medium shadow - dropdowns, popovers (refined)
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',

  // Large shadow - modals, drawers
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',

  // Extra large shadow - overlays
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',

  // 2x large shadow - prominent overlays
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',

  // Card shadow - specifically for cards (rgba(0,0,0,0.04) as per design spec)
  card: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',

  // Card hover shadow - slightly elevated on hover
  cardHover: '0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',

  // Inner shadow
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)',

  // Focus ring (for accessibility)
  focus: '0 0 0 3px rgba(59, 130, 246, 0.4)',

  // Selected item shadow
  selected: '0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px -2px rgba(59, 130, 246, 0.2)',
} as const;

// Semantic shadow mappings for common UI patterns
export const semanticShadows = {
  // Component elevation levels
  elevation: {
    level0: shadowTokens.none,     // Flat, no elevation
    level1: shadowTokens.xs,       // Barely lifted
    level2: shadowTokens.card,     // Card level (soft shadow)
    level3: shadowTokens.md,       // Clearly lifted
    level4: shadowTokens.lg,       // Floating
    level5: shadowTokens.xl,       // High floating
    level6: shadowTokens['2xl'],   // Maximum elevation
  },

  // Interactive states
  interactive: {
    default: shadowTokens.card,
    hover: shadowTokens.cardHover,
    active: shadowTokens.xs,
    focus: shadowTokens.focus,
    selected: shadowTokens.selected,
    disabled: shadowTokens.none,
  },

  // UI components
  component: {
    card: shadowTokens.card,           // Soft card shadow
    cardHover: shadowTokens.cardHover, // Card hover state
    panel: shadowTokens.xs,
    button: shadowTokens.xs,
    buttonHover: shadowTokens.sm,
    input: shadowTokens.none,
    inputFocus: shadowTokens.focus,
    dropdown: shadowTokens.lg,
    modal: shadowTokens['2xl'],
    popover: shadowTokens.lg,
    tooltip: shadowTokens.md,
    sheet: shadowTokens.xl,
    listItem: shadowTokens.none,
    listItemHover: shadowTokens.xs,
    listItemSelected: shadowTokens.selected,
  },

  // Special effects
  special: {
    inner: shadowTokens.inner,
    outline: '0 0 0 1px rgba(0, 0, 0, 0.03)',
    glow: '0 0 20px rgba(59, 130, 246, 0.2)',
    glowSuccess: '0 0 20px rgba(34, 197, 94, 0.2)',
    glowError: '0 0 20px rgba(239, 68, 68, 0.2)',
    glowWarning: '0 0 20px rgba(245, 158, 11, 0.2)',
  },
} as const;

export type ShadowToken = keyof typeof shadowTokens;
export type SemanticShadowCategory = keyof typeof semanticShadows;

/**
 * Get shadow value
 * @example getShadow('md')
 */
export const getShadow = (token: ShadowToken): string => {
  return shadowTokens[token];
};

/**
 * Get semantic shadow
 * @example getSemanticShadow('elevation', 'level3')
 */
export const getSemanticShadow = (
  category: SemanticShadowCategory,
  variant: string
): string => {
  return semanticShadows[category][variant as keyof typeof semanticShadows[typeof category]];
};