/**
 * FrontDesk Design System - Color Tokens
 *
 * Semantic color system for consistent UI across all providers.
 * Based on Tailwind CSS color scales for familiarity and accessibility.
 */

export const colorTokens = {
  // Primary brand colors (Blue scale)
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // Neutral/Gray scale
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Success states (Green scale)
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  // Warning states (Amber scale)
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Error/Danger states (Red scale)
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Info states (Cyan scale)
  info: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
  },

  // Semantic mappings for common use cases
  semantic: {
    // Background colors
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
      inverse: '#111827',
    },

    // Text colors
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      disabled: '#D1D5DB',
      inverse: '#FFFFFF',
      link: '#2563EB',
      linkHover: '#1D4ED8',
    },

    // Border colors
    border: {
      default: '#E5E7EB',
      light: '#F3F4F6',
      medium: '#D1D5DB',
      dark: '#9CA3AF',
      focus: '#3B82F6',
    },

    // Interactive states
    interactive: {
      hover: '#F9FAFB',
      active: '#F3F4F6',
      selected: '#EFF6FF',
      selectedHover: '#DBEAFE',
      disabled: '#F9FAFB',
    },

    // Status indicators
    status: {
      online: '#22C55E',
      away: '#F59E0B',
      busy: '#EF4444',
      offline: '#9CA3AF',
    },

    // Priority colors
    priority: {
      urgent: '#DC2626',
      high: '#EF4444',
      medium: '#F59E0B',
      low: '#22C55E',
    },
  },
} as const;

// Type helper for color tokens
export type ColorToken = keyof typeof colorTokens;
export type ColorScale = keyof typeof colorTokens.primary;

/**
 * Get color value from token path
 * @example getColor('primary', '600') => '#2563EB'
 */
export const getColor = (token: ColorToken, scale: ColorScale): string => {
  return colorTokens[token][scale as keyof typeof colorTokens[typeof token]];
};

/**
 * Get semantic color
 * @example getSemanticColor('text', 'primary') => '#111827'
 */
export const getSemanticColor = (
  category: keyof typeof colorTokens.semantic,
  variant: string
): string => {
  return colorTokens.semantic[category][variant as keyof typeof colorTokens.semantic[typeof category]];
};