/**
 * FrontDesk Design System - Layout Tokens
 *
 * Consistent layout dimensions for panels, columns, and structural elements.
 * All values in pixels for precise control.
 */

export const layoutTokens = {
  // Panel widths
  panel: {
    navigation: {
      collapsed: 60,
      default: 220,
      expanded: 280,
    },
    conversationList: {
      compact: 280,
      default: 340,
      wide: 400,
    },
    detailSidebar: {
      compact: 280,
      default: 320,
      wide: 380,
    },
    settings: {
      sidebar: 240,
      content: 800,
    },
  },

  // Header heights
  header: {
    page: 56,
    section: 48,
    compact: 40,
    toolbar: 44,
  },

  // Footer/action bar heights
  footer: {
    actionBar: 52,
    composer: 120,
    composerExpanded: 200,
  },

  // Modal dimensions
  modal: {
    xs: { width: 320, maxHeight: '60vh' },
    sm: { width: 440, maxHeight: '70vh' },
    md: { width: 560, maxHeight: '80vh' },
    lg: { width: 720, maxHeight: '85vh' },
    xl: { width: 900, maxHeight: '90vh' },
    fullscreen: { width: '100vw', maxHeight: '100vh' },
  },

  // Card dimensions
  card: {
    minWidth: 200,
    maxWidth: 400,
    statsCard: { width: 180, height: 100 },
    notificationCard: { minHeight: 72 },
  },

  // Message bubble dimensions
  messageBubble: {
    maxWidth: '70%',
    minWidth: 80,
    padding: { x: 12, y: 8 },
  },

  // Avatar sizes (for reference, also in spacing)
  avatar: {
    xs: 20,
    sm: 24,
    md: 32,
    lg: 40,
    xl: 48,
    xxl: 64,
  },

  // Icon container sizes
  iconContainer: {
    xs: 24,
    sm: 28,
    md: 32,
    lg: 40,
    xl: 48,
  },

  // Breakpoints for responsive design
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
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

