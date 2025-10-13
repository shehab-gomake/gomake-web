/**
 * FrontDesk Design System - Typography Tokens
 *
 * Consistent typography scale for readable, accessible text.
 * Font sizes in pixels, line heights as ratios.
 */

export const typographyTokens = {
  // Font families
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  },

  // Font sizes (px)
  fontSize: {
    xs: 11,      // 0.688rem - tiny labels
    sm: 12,      // 0.75rem - small text, captions
    base: 13,    // 0.813rem - base text for compact UI
    md: 14,      // 0.875rem - body text
    lg: 16,      // 1rem - emphasized text
    xl: 18,      // 1.125rem - subtitles
    '2xl': 20,   // 1.25rem - headings
    '3xl': 24,   // 1.5rem - large headings
    '4xl': 30,   // 1.875rem - page titles
    '5xl': 36,   // 2.25rem - hero text
  },

  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights (ratio)
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing (em)
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// Semantic typography styles for common UI patterns
export const semanticTypography = {
  // Display text (large headlines)
  display: {
    large: {
      fontSize: typographyTokens.fontSize['5xl'],
      fontWeight: typographyTokens.fontWeight.bold,
      lineHeight: typographyTokens.lineHeight.tight,
      letterSpacing: typographyTokens.letterSpacing.tight,
    },
    medium: {
      fontSize: typographyTokens.fontSize['4xl'],
      fontWeight: typographyTokens.fontWeight.bold,
      lineHeight: typographyTokens.lineHeight.tight,
      letterSpacing: typographyTokens.letterSpacing.tight,
    },
    small: {
      fontSize: typographyTokens.fontSize['3xl'],
      fontWeight: typographyTokens.fontWeight.semibold,
      lineHeight: typographyTokens.lineHeight.snug,
      letterSpacing: typographyTokens.letterSpacing.normal,
    },
  },

  // Headings
  heading: {
    h1: {
      fontSize: typographyTokens.fontSize['3xl'],
      fontWeight: typographyTokens.fontWeight.bold,
      lineHeight: typographyTokens.lineHeight.tight,
      letterSpacing: typographyTokens.letterSpacing.tight,
    },
    h2: {
      fontSize: typographyTokens.fontSize['2xl'],
      fontWeight: typographyTokens.fontWeight.semibold,
      lineHeight: typographyTokens.lineHeight.tight,
      letterSpacing: typographyTokens.letterSpacing.tight,
    },
    h3: {
      fontSize: typographyTokens.fontSize.xl,
      fontWeight: typographyTokens.fontWeight.semibold,
      lineHeight: typographyTokens.lineHeight.snug,
      letterSpacing: typographyTokens.letterSpacing.normal,
    },
    h4: {
      fontSize: typographyTokens.fontSize.lg,
      fontWeight: typographyTokens.fontWeight.semibold,
      lineHeight: typographyTokens.lineHeight.snug,
      letterSpacing: typographyTokens.letterSpacing.normal,
    },
    h5: {
      fontSize: typographyTokens.fontSize.md,
      fontWeight: typographyTokens.fontWeight.semibold,
      lineHeight: typographyTokens.lineHeight.normal,
      letterSpacing: typographyTokens.letterSpacing.normal,
    },
    h6: {
      fontSize: typographyTokens.fontSize.base,
      fontWeight: typographyTokens.fontWeight.semibold,
      lineHeight: typographyTokens.lineHeight.normal,
      letterSpacing: typographyTokens.letterSpacing.normal,
    },
  },

  // Body text
  body: {
    large: {
      fontSize: typographyTokens.fontSize.lg,
      fontWeight: typographyTokens.fontWeight.normal,
      lineHeight: typographyTokens.lineHeight.relaxed,
      letterSpacing: typographyTokens.letterSpacing.normal,
    },
    medium: {
      fontSize: typographyTokens.fontSize.md,
      fontWeight: typographyTokens.fontWeight.normal,
      lineHeight: typographyTokens.lineHeight.normal,
      letterSpacing: typographyTokens.letterSpacing.normal,
    },
    small: {
      fontSize: typographyTokens.fontSize.base,
      fontWeight: typographyTokens.fontWeight.normal,
      lineHeight: typographyTokens.lineHeight.normal,
      letterSpacing: typographyTokens.letterSpacing.normal,
    },
  },

  // Labels and captions
  label: {
    large: {
      fontSize: typographyTokens.fontSize.md,
      fontWeight: typographyTokens.fontWeight.medium,
      lineHeight: typographyTokens.lineHeight.normal,
      letterSpacing: typographyTokens.letterSpacing.normal,
    },
    medium: {
      fontSize: typographyTokens.fontSize.base,
      fontWeight: typographyTokens.fontWeight.medium,
      lineHeight: typographyTokens.lineHeight.normal,
      letterSpacing: typographyTokens.letterSpacing.normal,
    },
    small: {
      fontSize: typographyTokens.fontSize.sm,
      fontWeight: typographyTokens.fontWeight.medium,
      lineHeight: typographyTokens.lineHeight.normal,
      letterSpacing: typographyTokens.letterSpacing.wide,
    },
  },

  // Captions and helper text
  caption: {
    large: {
      fontSize: typographyTokens.fontSize.base,
      fontWeight: typographyTokens.fontWeight.normal,
      lineHeight: typographyTokens.lineHeight.normal,
      letterSpacing: typographyTokens.letterSpacing.normal,
    },
    medium: {
      fontSize: typographyTokens.fontSize.sm,
      fontWeight: typographyTokens.fontWeight.normal,
      lineHeight: typographyTokens.lineHeight.normal,
      letterSpacing: typographyTokens.letterSpacing.normal,
    },
    small: {
      fontSize: typographyTokens.fontSize.xs,
      fontWeight: typographyTokens.fontWeight.normal,
      lineHeight: typographyTokens.lineHeight.normal,
      letterSpacing: typographyTokens.letterSpacing.wide,
    },
  },

  // Buttons
  button: {
    large: {
      fontSize: typographyTokens.fontSize.md,
      fontWeight: typographyTokens.fontWeight.medium,
      lineHeight: typographyTokens.lineHeight.none,
      letterSpacing: typographyTokens.letterSpacing.normal,
    },
    medium: {
      fontSize: typographyTokens.fontSize.base,
      fontWeight: typographyTokens.fontWeight.medium,
      lineHeight: typographyTokens.lineHeight.none,
      letterSpacing: typographyTokens.letterSpacing.normal,
    },
    small: {
      fontSize: typographyTokens.fontSize.sm,
      fontWeight: typographyTokens.fontWeight.medium,
      lineHeight: typographyTokens.lineHeight.none,
      letterSpacing: typographyTokens.letterSpacing.normal,
    },
  },

  // Code and monospace
  code: {
    inline: {
      fontSize: typographyTokens.fontSize.sm,
      fontWeight: typographyTokens.fontWeight.normal,
      lineHeight: typographyTokens.lineHeight.normal,
      letterSpacing: typographyTokens.letterSpacing.normal,
      fontFamily: typographyTokens.fontFamily.mono,
    },
    block: {
      fontSize: typographyTokens.fontSize.base,
      fontWeight: typographyTokens.fontWeight.normal,
      lineHeight: typographyTokens.lineHeight.relaxed,
      letterSpacing: typographyTokens.letterSpacing.normal,
      fontFamily: typographyTokens.fontFamily.mono,
    },
  },
} as const;

export type FontSize = keyof typeof typographyTokens.fontSize;
export type FontWeight = keyof typeof typographyTokens.fontWeight;
export type LineHeight = keyof typeof typographyTokens.lineHeight;

/**
 * Get typography style object
 * @example getTypographyStyle('body', 'medium')
 */
export const getTypographyStyle = (
  category: keyof typeof semanticTypography,
  variant: string
) => {
  return semanticTypography[category][variant as keyof typeof semanticTypography[typeof category]];
};