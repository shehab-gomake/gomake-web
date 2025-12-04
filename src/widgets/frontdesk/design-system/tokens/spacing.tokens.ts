/**
 * FrontDesk Design System - Spacing Tokens
 *
 * Consistent spacing scale based on 8px base unit for modern SaaS design.
 * Follows 8px vertical rhythm for optimal visual harmony.
 * All spacing values are in pixels for precise control.
 */

// Base unit for the spacing system
export const SPACING_BASE_UNIT = 8;

// Grid configuration for 12-column layout
export const GRID_CONFIG = {
  columns: 12,
  gutter: 24, // 24px gutter spacing between columns
  margin: 24, // 24px margin on edges
} as const;

export const spacingTokens = {
  // Base spacing scale (8px increments for vertical rhythm)
  0: 0,
  0.5: 4,    // 0.5 * 8 = 4px - micro spacing
  1: 8,      // 1 * 8 = 8px - base unit
  1.5: 12,   // 1.5 * 8 = 12px
  2: 16,     // 2 * 8 = 16px
  2.5: 20,   // 2.5 * 8 = 20px
  3: 24,     // 3 * 8 = 24px - gutter size
  3.5: 28,   // 3.5 * 8 = 28px
  4: 32,     // 4 * 8 = 32px
  5: 40,     // 5 * 8 = 40px
  6: 48,     // 6 * 8 = 48px
  7: 56,     // 7 * 8 = 56px
  8: 64,     // 8 * 8 = 64px
  9: 72,     // 9 * 8 = 72px
  10: 80,    // 10 * 8 = 80px
  12: 96,    // 12 * 8 = 96px
  14: 112,   // 14 * 8 = 112px
  16: 128,   // 16 * 8 = 128px
  20: 160,   // 20 * 8 = 160px
  24: 192,   // 24 * 8 = 192px
  28: 224,   // 28 * 8 = 224px
  32: 256,   // 32 * 8 = 256px
  36: 288,   // 36 * 8 = 288px
  40: 320,   // 40 * 8 = 320px
  44: 352,   // 44 * 8 = 352px
  48: 384,   // 48 * 8 = 384px
  52: 416,   // 52 * 8 = 416px
  56: 448,   // 56 * 8 = 448px
  60: 480,   // 60 * 8 = 480px
  64: 512,   // 64 * 8 = 512px
  72: 576,   // 72 * 8 = 576px
  80: 640,   // 80 * 8 = 640px
  96: 768,   // 96 * 8 = 768px
} as const;

// Semantic spacing for common UI patterns
export const semanticSpacing = {
  // Component internal spacing (8px rhythm)
  component: {
    xxs: spacingTokens[0.5],  // 4px - micro spacing
    xs: spacingTokens[1],      // 8px - icon-to-text
    sm: spacingTokens[1.5],    // 12px - related items
    md: spacingTokens[2],      // 16px - default spacing
    lg: spacingTokens[3],      // 24px - section spacing
    xl: spacingTokens[4],      // 32px - large sections
    xxl: spacingTokens[6],     // 48px - major divisions
  },

  // Container/Card padding (20-24px as per design spec)
  container: {
    xs: spacingTokens[1],      // 8px - compact
    sm: spacingTokens[1.5],    // 12px - small
    md: spacingTokens[2],      // 16px - default
    lg: spacingTokens[3],      // 24px - comfortable (standard card padding)
    xl: spacingTokens[4],      // 32px - spacious
  },

  // Layout gaps (24px gutter as per design spec)
  layout: {
    xs: spacingTokens[1],      // 8px - tight
    sm: spacingTokens[2],      // 16px - default
    md: spacingTokens[3],      // 24px - comfortable (gutter size)
    lg: spacingTokens[4],      // 32px - spacious
    xl: spacingTokens[6],      // 48px - extra spacious
  },

  // List item spacing (improved for better scanning)
  listItem: {
    compact: spacingTokens[1],     // 8px vertical
    default: spacingTokens[1.5],   // 12px vertical
    comfortable: spacingTokens[2], // 16px vertical
    spacious: spacingTokens[3],    // 24px vertical
  },

  // Icon sizes
  icon: {
    xs: spacingTokens[1.5],    // 12px
    sm: spacingTokens[2],      // 16px
    md: spacingTokens[2.5],    // 20px
    lg: spacingTokens[3],      // 24px
    xl: spacingTokens[4],      // 32px
    xxl: spacingTokens[6],     // 48px
  },

  // Avatar sizes
  avatar: {
    xs: spacingTokens[2.5],    // 20px
    sm: spacingTokens[3],      // 24px
    md: spacingTokens[4],      // 32px
    lg: spacingTokens[5],      // 40px
    xl: spacingTokens[6],      // 48px
    xxl: spacingTokens[8],     // 64px
  },

  // Column widths (common layouts) - adjusted for 12-column grid
  column: {
    navigation: 240,           // Navigation sidebar
    navigationCompact: 64,     // Collapsed navigation
    list: 360,                 // Conversation list (wider for better scanning)
    listWide: 400,             // Wide list view
    sidebar: 320,              // Detail sidebar
    sidebarWide: 360,          // Wide detail sidebar
  },
  
  // Card padding (20-24px as per design spec)
  card: {
    sm: spacingTokens[2],      // 16px
    md: spacingTokens[2.5],    // 20px
    lg: spacingTokens[3],      // 24px
  },
} as const;

export type SpacingToken = keyof typeof spacingTokens;
export type SemanticSpacingCategory = keyof typeof semanticSpacing;

/**
 * Get spacing value
 * @example getSpacing(4) => 32
 */
export const getSpacing = (token: SpacingToken): number => {
  return spacingTokens[token];
};

/**
 * Get semantic spacing value
 * @example getSemanticSpacing('component', 'md') => 16
 */
export const getSemanticSpacing = (
  category: SemanticSpacingCategory,
  variant: string
): number => {
  return semanticSpacing[category][variant as keyof typeof semanticSpacing[typeof category]];
};

/**
 * Calculate grid column width
 * @example getGridColumnWidth(3) => 25% (3 of 12 columns)
 */
export const getGridColumnWidth = (columns: number): string => {
  return `${(columns / GRID_CONFIG.columns) * 100}%`;
};

/**
 * Get responsive column width with gutter
 * @example getColumnWithGutter(3) => 'calc(25% - 24px)'
 */
export const getColumnWithGutter = (columns: number): string => {
  const percentage = (columns / GRID_CONFIG.columns) * 100;
  return `calc(${percentage}% - ${GRID_CONFIG.gutter}px)`;
};