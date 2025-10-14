/**
 * FrontDesk Design System - Spacing Tokens
 *
 * Consistent spacing scale based on 4px base unit.
 * All spacing values are in pixels for precise control.
 */

export const spacingTokens = {
  // Base spacing scale (4px increments)
  0: 0,
  0.5: 2,   // 0.5 * 4 = 2px
  1: 4,     // 1 * 4 = 4px
  1.5: 6,   // 1.5 * 4 = 6px
  2: 8,     // 2 * 4 = 8px
  2.5: 10,  // 2.5 * 4 = 10px
  3: 12,    // 3 * 4 = 12px
  3.5: 14,  // 3.5 * 4 = 14px
  4: 16,    // 4 * 4 = 16px
  5: 20,    // 5 * 4 = 20px
  6: 24,    // 6 * 4 = 24px
  7: 28,    // 7 * 4 = 28px
  8: 32,    // 8 * 4 = 32px
  9: 36,    // 9 * 4 = 36px
  10: 40,   // 10 * 4 = 40px
  12: 48,   // 12 * 4 = 48px
  14: 56,   // 14 * 4 = 56px
  16: 64,   // 16 * 4 = 64px
  20: 80,   // 20 * 4 = 80px
  24: 96,   // 24 * 4 = 96px
  28: 112,  // 28 * 4 = 112px
  32: 128,  // 32 * 4 = 128px
  36: 144,  // 36 * 4 = 144px
  40: 160,  // 40 * 4 = 160px
  44: 176,  // 44 * 4 = 176px
  48: 192,  // 48 * 4 = 192px
  52: 208,  // 52 * 4 = 208px
  56: 224,  // 56 * 4 = 224px
  60: 240,  // 60 * 4 = 240px
  64: 256,  // 64 * 4 = 256px
  72: 288,  // 72 * 4 = 288px
  80: 320,  // 80 * 4 = 320px
  96: 384,  // 96 * 4 = 384px
} as const;

// Semantic spacing for common UI patterns
export const semanticSpacing = {
  // Component internal spacing
  component: {
    xxs: spacingTokens[0.5],  // 2px - tight elements
    xs: spacingTokens[1],      // 4px - icon-to-text
    sm: spacingTokens[2],      // 8px - related items
    md: spacingTokens[3],      // 12px - default spacing
    lg: spacingTokens[4],      // 16px - section spacing
    xl: spacingTokens[6],      // 24px - large sections
    xxl: spacingTokens[8],     // 32px - major divisions
  },

  // Container padding
  container: {
    xs: spacingTokens[2],      // 8px - compact
    sm: spacingTokens[3],      // 12px - small
    md: spacingTokens[4],      // 16px - default
    lg: spacingTokens[6],      // 24px - comfortable
    xl: spacingTokens[8],      // 32px - spacious
  },

  // Layout gaps
  layout: {
    xs: spacingTokens[2],      // 8px - tight
    sm: spacingTokens[4],      // 16px - default
    md: spacingTokens[6],      // 24px - comfortable
    lg: spacingTokens[8],      // 32px - spacious
  },

  // List item spacing
  listItem: {
    compact: spacingTokens[2],    // 8px vertical
    default: spacingTokens[3],    // 12px vertical
    comfortable: spacingTokens[4], // 16px vertical
  },

  // Icon sizes
  icon: {
    xs: spacingTokens[3],      // 12px
    sm: spacingTokens[4],      // 16px
    md: spacingTokens[5],      // 20px
    lg: spacingTokens[6],      // 24px
    xl: spacingTokens[8],      // 32px
    xxl: spacingTokens[12],    // 48px
  },

  // Avatar sizes
  avatar: {
    xs: spacingTokens[5],      // 20px
    sm: spacingTokens[6],      // 24px
    md: spacingTokens[8],      // 32px
    lg: spacingTokens[10],     // 40px
    xl: spacingTokens[12],     // 48px
    xxl: spacingTokens[16],    // 64px
  },

  // Column widths (common layouts)
  column: {
    navigation: spacingTokens[55],   // 220px
    navigationCompact: spacingTokens[15], // 60px
    list: spacingTokens[70],         // 280px
    listWide: spacingTokens[80],     // 320px
    sidebar: spacingTokens[60],      // 240px
    sidebarWide: spacingTokens[65],  // 260px
  },
} as const;

export type SpacingToken = keyof typeof spacingTokens;
export type SemanticSpacingCategory = keyof typeof semanticSpacing;

/**
 * Get spacing value
 * @example getSpacing(4) => 16
 */
export const getSpacing = (token: SpacingToken): number => {
  return spacingTokens[token];
};

/**
 * Get semantic spacing value
 * @example getSemanticSpacing('component', 'md') => 12
 */
export const getSemanticSpacing = (
  category: SemanticSpacingCategory,
  variant: string
): number => {
  return semanticSpacing[category][variant as keyof typeof semanticSpacing[typeof category]];
};