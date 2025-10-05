/**
 * FrontDesk Design System - Shadow Tokens
 *
 * Elevation system using box shadows for depth and hierarchy.
 * Based on Material Design principles with subtle, modern shadows.
 */

export const shadowTokens = {
  // No shadow
  none: 'none',

  // Extra small shadow - subtle lift
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',

  // Small shadow - cards, buttons
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',

  // Medium shadow - dropdowns, popovers
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',

  // Large shadow - modals, drawers
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',

  // Extra large shadow - overlays
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',

  // 2x large shadow - prominent overlays
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Inner shadow
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',

  // Focus ring (for accessibility)
  focus: '0 0 0 3px rgba(59, 130, 246, 0.5)',
} as const;

// Semantic shadow mappings for common UI patterns
export const semanticShadows = {
  // Component elevation levels
  elevation: {
    level0: shadowTokens.none,     // Flat, no elevation
    level1: shadowTokens.xs,       // Barely lifted
    level2: shadowTokens.sm,       // Slightly lifted
    level3: shadowTokens.md,       // Clearly lifted
    level4: shadowTokens.lg,       // Floating
    level5: shadowTokens.xl,       // High floating
    level6: shadowTokens['2xl'],   // Maximum elevation
  },

  // Interactive states
  interactive: {
    default: shadowTokens.sm,
    hover: shadowTokens.md,
    active: shadowTokens.xs,
    focus: shadowTokens.focus,
    disabled: shadowTokens.none,
  },

  // UI components
  component: {
    card: shadowTokens.sm,
    panel: shadowTokens.xs,
    button: shadowTokens.sm,
    buttonHover: shadowTokens.md,
    input: shadowTokens.xs,
    inputFocus: shadowTokens.focus,
    dropdown: shadowTokens.lg,
    modal: shadowTokens['2xl'],
    popover: shadowTokens.lg,
    tooltip: shadowTokens.md,
    sheet: shadowTokens.xl,
  },

  // Special effects
  special: {
    inner: shadowTokens.inner,
    outline: '0 0 0 1px rgba(0, 0, 0, 0.05)',
    glow: '0 0 15px rgba(59, 130, 246, 0.3)',
    glowSuccess: '0 0 15px rgba(34, 197, 94, 0.3)',
    glowError: '0 0 15px rgba(239, 68, 68, 0.3)',
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