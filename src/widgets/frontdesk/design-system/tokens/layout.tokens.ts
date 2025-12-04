/**
 * FrontDesk Design System - Layout Tokens
 *
 * Consistent layout dimensions for panels, columns, and structural elements.
 * Based on 12-column responsive grid with 24px gutter spacing.
 * All values in pixels for precise control.
 */

// Grid configuration
export const gridConfig = {
  columns: 12,
  gutter: 24,        // 24px gutter spacing between columns
  margin: 24,        // 24px margin on edges
  maxWidth: 1920,    // Maximum container width
} as const;

export const layoutTokens = {
  // Panel widths (adjusted for better breathing room)
  panel: {
    navigation: {
      collapsed: 64,
      default: 240,
      expanded: 280,
    },
    conversationList: {
      compact: 320,
      default: 380,    // Wider for better scanning
      wide: 440,
    },
    detailSidebar: {
      compact: 300,
      default: 340,    // Wider for better content display
      wide: 400,
    },
    settings: {
      sidebar: 260,
      content: 840,
    },
  },

  // Header heights (8px rhythm)
  header: {
    page: 64,          // 8 * 8 = 64px
    section: 56,       // 7 * 8 = 56px
    compact: 48,       // 6 * 8 = 48px
    toolbar: 48,       // 6 * 8 = 48px
  },

  // Footer/action bar heights
  footer: {
    actionBar: 56,     // 7 * 8 = 56px
    composer: 128,     // 16 * 8 = 128px
    composerExpanded: 200,
  },

  // Modal dimensions
  modal: {
    xs: { width: 360, maxHeight: '60vh' },
    sm: { width: 480, maxHeight: '70vh' },
    md: { width: 600, maxHeight: '80vh' },
    lg: { width: 760, maxHeight: '85vh' },
    xl: { width: 960, maxHeight: '90vh' },
    fullscreen: { width: '100vw', maxHeight: '100vh' },
  },

  // Card dimensions
  card: {
    minWidth: 240,
    maxWidth: 440,
    padding: 24,       // 20-24px padding as per design spec
    radius: 14,        // 14px radius as per design spec
    statsCard: { width: 200, height: 120 },
    notificationCard: { minHeight: 80 },
  },

  // Message bubble dimensions
  messageBubble: {
    maxWidth: '70%',
    minWidth: 100,
    padding: { x: 16, y: 12 },  // 8px rhythm
  },

  // Avatar sizes (8px rhythm)
  avatar: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
    xxl: 72,
  },

  // Icon container sizes
  iconContainer: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
  },

  // Breakpoints for responsive design
  breakpoints: {
    xs: 0,
    sm: 640,
    md: 960,
    lg: 1280,
    xl: 1600,
    xxl: 1920,
  },

  // Column gap (breathing room between columns)
  columnGap: {
    tight: 16,
    default: 24,      // Standard gutter
    spacious: 32,
  },
} as const;

// Z-index layers for stacking context
export const zIndexTokens = {
  // Base layers
  base: 0,
  above: 1,
  
  // Fixed elements
  stickyHeader: 100,
  sidebar: 200,
  dropdown: 300,
  
  // Overlays
  overlay: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  
  // Top-level
  notification: 800,
  toast: 900,
  maximized: 1000,
} as const;

// Transition/animation timing
export const transitionTokens = {
  // Durations (ms)
  duration: {
    instant: 0,
    fast: 100,
    normal: 200,
    slow: 300,
    slower: 500,
  },

  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // Common transitions
  presets: {
    fade: 'opacity 200ms ease-out',
    transform: 'transform 200ms ease-out',
    colors: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
    all: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    expand: 'height 300ms ease-out, opacity 200ms ease-out',
  },
} as const;

export type LayoutToken = keyof typeof layoutTokens;
export type ZIndexToken = keyof typeof zIndexTokens;
export type TransitionToken = keyof typeof transitionTokens;

/**
 * Get layout value
 * @example getLayout('panel', 'conversationList', 'default') => 340
 */
export const getLayout = (
  category: keyof typeof layoutTokens,
  subcategory: string,
  variant?: string
): number | string | object => {
  const cat = layoutTokens[category] as Record<string, unknown>;
  if (variant) {
    return (cat[subcategory] as Record<string, unknown>)[variant] as number | string | object;
  }
  return cat[subcategory] as number | string | object;
};

/**
 * Get z-index value
 * @example getZIndex('modal') => 500
 */
export const getZIndex = (layer: ZIndexToken): number => {
  return zIndexTokens[layer];
};

/**
 * Get transition preset
 * @example getTransition('fade') => 'opacity 200ms ease-out'
 */
export const getTransition = (preset: keyof typeof transitionTokens.presets): string => {
  return transitionTokens.presets[preset];
};

