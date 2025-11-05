import { ThemeConfig } from "../types";

/**
 * BASE THEME - Default GoMake Theme
 *
 * This is the default theme that matches your current design.
 * It uses your existing MUI theme colors as fallbacks.
 */
const baseThemeConfig: ThemeConfig = {
  name: "base",

  styles: {
    cssVariables: {
      // Primary Colors - Your current purple/pink scheme
      "--theme-primary-color": "#2e3092",
      "--theme-primary-hover": "#6d28d9",
      "--theme-primary-light": "#ede9fe",
      "--theme-primary-dark": "#252675",

      "--theme-primary-lavender-color": "#CBCBE4",
      "--theme-primary-lavender-light": "#E8E8F2",
      "--theme-primary-lavender-dark": "#504fa1",

      "--theme-secondary-color": "#ec4899",
      "--theme-secondary-hover": "#db2777",
      "--theme-secondary-light": "#fce7f3",

      // Background Colors
      "--theme-bg-body": "#f6f6f6", // Page background
      "--theme-bg-primary": "#ffffff", // Card background
      "--theme-bg-secondary": "#f8fafc",
      "--theme-bg-tertiary": "#f1f5f9",

      // Status Colors - For your cards
      "--theme-status-success": "#10b981", // Approved - Green
      "--theme-status-success-bg": "#d1fae5",
      "--theme-status-success-text": "#065f46",

      "--theme-status-warning": "#f59e0b", // Orders - Yellow/Orange
      "--theme-status-warning-bg": "#fef3c7",
      "--theme-status-warning-text": "#92400e",

      "--theme-status-error": "#ef4444", // Pending/Stuck Jobs - Red
      "--theme-status-error-bg": "#fee2e2",
      "--theme-status-error-text": "#991b1b",

      // Error Colors - Degree variants
      "--theme-error-color": "#ef4444", // Base error color (like 500)
      "--theme-error-light": "#fee2e2", // Light error variant
      "--theme-error-dark": "#991b1b", // Dark error variant

      // Success Colors - Degree variants
      "--theme-success-color": "#10b981", // Base success color (like 500)
      "--theme-success-light": "#d1fae5", // Light success variant
      "--theme-success-dark": "#065f46", // Dark success variant

      "--theme-status-neutral": "#6b7280", // Cancelled - Gray
      "--theme-status-neutral-bg": "#f3f4f6",
      "--theme-status-neutral-text": "#374151",

      // Text Colors
      "--theme-text-primary": "#1a202c",
      "--theme-text-secondary": "#4a5568",
      "--theme-text-muted": "#718096",
      "--theme-text-inverse": "#ffffff",

      // Typography - Font Families
      "--theme-font-family-base": '"Heebo", sans-serif',
      "--theme-font-family-brand": '"Heebo", sans-serif',
      "--theme-font-family-monospace": '"Courier New", monospace',

      // Typography - Font Weights
      "--theme-font-weight-light": "300",
      "--theme-font-weight-normal": "400",
      "--theme-font-weight-medium": "500",
      "--theme-font-weight-semibold": "600",
      "--theme-font-weight-bold": "700",

      // Typography - Title Styles (h1, h2, main headings)
      // Default matches original: Lexend, 600, 25px, primaryColor(500)
      "--theme-typography-title-font-family": '"Lexend", sans-serif',
      "--theme-typography-title-font-weight": "600",
      "--theme-typography-title-font-size": "25px",
      "--theme-typography-title-line-height": "32px",
      "--theme-typography-title-letter-spacing": "0px",
      "--theme-typography-title-color": "#2e3092", // Primary color - matches original primaryColor(500)

      // Typography - Heading Styles (h3, h4, section headings)
      "--theme-typography-heading-font-family": '"Heebo", sans-serif',
      "--theme-typography-heading-font-weight": "600",
      "--theme-typography-heading-font-size": "20px",
      "--theme-typography-heading-line-height": "28px",
      "--theme-typography-heading-letter-spacing": "0px",
      "--theme-typography-heading-color": "#1a202c",

      // Typography - Label Styles (form labels, field labels)
      "--theme-typography-label-font-family": '"Heebo", sans-serif',
      "--theme-typography-label-font-weight": "500",
      "--theme-typography-label-font-size": "14px",
      "--theme-typography-label-line-height": "20px",
      "--theme-typography-label-letter-spacing": "0px",
      "--theme-typography-label-color": "#4a5568",

      // Typography - Sub-label Styles (helper text, descriptions)
      "--theme-typography-sublabel-font-family": '"Heebo", sans-serif',
      "--theme-typography-sublabel-font-weight": "400",
      "--theme-typography-sublabel-font-size": "12px",
      "--theme-typography-sublabel-line-height": "18px",
      "--theme-typography-sublabel-letter-spacing": "0px",
      "--theme-typography-sublabel-color": "#718096",

      // Typography - Button Text Styles
      "--theme-typography-button-font-family": '"Lexend", sans-serif',
      "--theme-typography-button-font-weight": "500",
      "--theme-typography-button-font-size": "16px",
      "--theme-typography-button-line-height": "24px",
      "--theme-typography-button-letter-spacing": "0px",

      // Auto Button Styles
      "--theme-auto-button-color": "#2e3092", // Primary color - matches original primaryColor(500)
      "--theme-auto-button-font-family": '"Lexend", sans-serif',
      "--theme-auto-button-font-weight": "500",
      "--theme-auto-button-font-size": "14px",
      "--theme-auto-button-line-height": "21px",
      "--theme-auto-button-letter-spacing": "0px",

      // Typography - Body Text Styles (paragraphs, default text)
      "--theme-typography-body-font-family": '"Heebo", sans-serif',
      "--theme-typography-body-font-weight": "400",
      "--theme-typography-body-font-size": "14px",
      "--theme-typography-body-line-height": "21px",
      "--theme-typography-body-letter-spacing": "0px",
      "--theme-typography-body-color": "#1a202c",

      // Typography - Legacy/Base (for backward compatibility)
      "--theme-font-size-base": "16px",
      "--theme-line-height-base": "24px",
      "--theme-letter-spacing-base": "0px",

      // Border Colors
      "--theme-border-color": "#e5e7eb",
      "--theme-border-light": "#f3f4f6",
      "--theme-border-dark": "#d1d5db",

      // Spacing
      "--theme-spacing-xs": "4px",
      "--theme-spacing-sm": "8px",
      "--theme-spacing-md": "16px",
      "--theme-spacing-lg": "24px",
      "--theme-spacing-xl": "32px",

      // Border Radius
      "--theme-radius-sm": "4px",
      "--theme-radius-md": "8px",
      "--theme-radius-lg": "12px",
      "--theme-radius-xl": "16px",

      // Shadows
      "--theme-shadow-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      "--theme-shadow-md":
        "0 1px 0px 0 rgba(0, 0, 0, 0.08), 0 0px 5px 0 rgba(0, 0, 0, 0.08)",
      "--theme-shadow-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",

      // Button Styles
      "--theme-button-bg-primary": "#2e3092", // Primary button background (purple)
      "--theme-button-bg-primary-hover": "#6d28d9", // Hover state
      "--theme-button-text-primary": "#FFFFFF", // Button text color
      "--theme-button-border-color": "#FFFFFF", // Button border (white for base theme)
      "--theme-button-radius": "4px", // Button border radius

      // Widget Styles (for quote widget mainContainer)
      "--theme-widget-border-color": "transparent", // No border for base theme
      "--theme-widget-shadow":
        "0 1px 0px 0 rgba(0, 0, 0, 0.08), 0 0px 5px 0 rgba(0, 0, 0, 0.08)", // Default shadow
    },
  },

  // No component or page overrides - using base components
  pages: {},
  components: {},

  // No icon overrides - using default icons
  icons: {},
};

export default baseThemeConfig;
