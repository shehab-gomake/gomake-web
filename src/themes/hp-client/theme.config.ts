import { ThemeConfig } from "../types";
import { MonthlyPerformanceIcon } from "./icons/MonthlyPerformanceIcon";
import { CanceledIcon } from "./icons/CanceledIcon";
import { ApprovedIcon } from "./icons/ApprovedIcon";
import { SuccessRateIcon } from "./icons/SuccessRateIcon";
import { OrdersIcon } from "./icons/OrdersIcon";
import { PendingIcon } from "./icons/PendingIcon";
import { StuckJobsIcon } from "./icons/StuckJobsIcon";

import { HpCardsWidget } from "./components/HpCardsWidget";

/* HP CLIENT THEME - Custom Brand Theme */

const hpClientThemeConfig: ThemeConfig = {
  name: "hp-client",

  styles: {
    cssVariables: {
      // Primary Colors
      "--theme-primary-color": "#024AD8", // Blue - primary(500)
      "--theme-primary-hover": "#1A5FFF", // Lighter/more vibrant for hover
      "--theme-primary-light": "#B2D2FF", // More bold/darker than before
      "--theme-primary-disabled": "#8db3e8", // Lighter/muted for disabled state
      "--theme-primary-dark": "#002E8D", // Darker for disabled state

      "--theme-primary-lavender-color": "#C4D4F0", // Medium blue background (base - like 500)
      "--theme-primary-lavender-light": "#E1EBF8", // Light blue variant
      "--theme-primary-lavender-dark": "#504fa1", // Dark blue variant

      // Secondary Colors
      "--theme-secondary-color": "#ff6b35",
      "--theme-secondary-hover": "#ff8c5c", // Lighter for hover
      "--theme-secondary-light": "#ffccaa", // More bold/darker than before

      // Background Colors - WHITE page background
      "--theme-bg-body": "#ffffff",
      "--theme-bg-primary": "#ffffff",
      "--theme-bg-secondary": "#f8fafc",
      "--theme-bg-tertiary": "#f1f5f9",

      // Status Colors - Keep same (or customize these too)
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
      "--theme-text-breadcrumb": "#94A3B8", // Breadcrumb/secondary navigation text color - light blue-gray that complements the primary blue
      // Alternative options:
      // "#A3A3A3" - matches placeholder color, clean neutral gray
      // "#64748B" - medium slate gray, between secondary and muted
      // "#8B92A5" - slightly blue-tinted gray

      // Typography - Font Families
      "--theme-font-family-base": '"Inter", sans-serif',
      "--theme-font-family-brand": '"Forma DJR UI", sans-serif', // Brand font for titles/headings
      "--theme-font-family-monospace": '"Courier New", monospace',

      // Typography - Font Weights
      "--theme-font-weight-light": "300",
      "--theme-font-weight-normal": "400",
      "--theme-font-weight-medium": "500",
      "--theme-font-weight-semibold": "600",
      "--theme-font-weight-bold": "700",

      // Typography - Title Styles (h1, h2, main headings)
      "--theme-typography-title-font-family": '"Forma DJR UI", sans-serif',
      "--theme-typography-title-font-weight": "500",
      "--theme-typography-title-font-size": "32px",
      "--theme-typography-title-line-height": "40px",
      "--theme-typography-title-letter-spacing": "0px",
      "--theme-typography-title-color": "#000000",

      // Typography - Heading Styles (h3, h4, section headings)
      "--theme-typography-heading-font-family": '"Forma DJR UI", sans-serif',
      "--theme-typography-heading-font-weight": "500",
      "--theme-typography-heading-font-size": "25px",
      "--theme-typography-heading-line-height": "40px",
      "--theme-typography-heading-letter-spacing": "0px",
      "--theme-typography-heading-color": "#1a202c",

      // Typography - Label Styles (form labels, field labels)
      "--theme-typography-label-font-family": '"Inter", sans-serif',
      "--theme-typography-label-font-weight": "500",
      "--theme-typography-label-font-size": "14px",
      "--theme-typography-label-line-height": "20px",
      "--theme-typography-label-letter-spacing": "0px",
      "--theme-typography-label-color": "#4a5568",

      // Typography - Sub-label Styles (helper text, descriptions)
      "--theme-typography-sublabel-font-family": '"Inter", sans-serif',
      "--theme-typography-sublabel-font-weight": "400",
      "--theme-typography-sublabel-font-size": "12px",
      "--theme-typography-sublabel-line-height": "18px",
      "--theme-typography-sublabel-letter-spacing": "0px",
      "--theme-typography-sublabel-color": "#718096",

      // Typography - Button Text Styles
      "--theme-typography-button-font-family": '"Inter", sans-serif',
      "--theme-typography-button-font-weight": "500",
      "--theme-typography-button-font-size": "16px",
      "--theme-typography-button-line-height": "24px",
      "--theme-typography-button-letter-spacing": "0px",

      // Auto Button Styles (for quote widget auto button)
      "--theme-auto-button-color": "#024AD8", // HP client blue
      "--theme-auto-button-font-family": '"Forma DJR UI", sans-serif',
      "--theme-auto-button-font-weight": "500",
      "--theme-auto-button-font-size": "14px",
      "--theme-auto-button-line-height": "21px",
      "--theme-auto-button-letter-spacing": "0px",

      // Typography - Body Text Styles (paragraphs, default text)
      "--theme-typography-body-font-family": '"Inter", sans-serif',
      "--theme-typography-body-font-weight": "400",
      "--theme-typography-body-font-size": "16px",
      "--theme-typography-body-line-height": "24px",
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
      "--Stroke-Decorative-Default": "#E8E8E8", // Decorative stroke for white cards

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

      // Shadows - All set to none for HP Client theme (flat design)
      "--theme-shadow-sm": "none",
      "--theme-shadow-md": "none",
      "--theme-shadow-lg": "none",

      // Button Styles
      "--theme-button-bg-primary": "#024AD8", // Primary button background (blue for hp-client)
      "--theme-button-bg-primary-hover": "#0052a3", // Hover state
      "--theme-button-text-primary": "#FFFFFF", // Button text color
      "--theme-button-border-color": "#E0E0E0", // Button border - gray for hp-client
      "--theme-button-radius": "8px", // Button border radius - 16px for hp-client
      "--theme-button-full-width": "100%", // Button full width for hp-client

      // Dropdown/Autocomplete Styles
      "--theme-dropdown-shadow": "none",
      "--theme-dropdown-border": "none",
      "--theme-dropdown-border-color": "#E0E0E0",
      "--theme-dropdown-border-radius": "var(--theme-radius-md, 8px)",
      "--theme-dropdown-placeholder-color": "#A3A3A3",
      "--theme-dropdown-placeholder-size": "14px",
      "--theme-dropdown-placeholder-weight": "400",

      // Widget Styles (for quote widget mainContainer)
      "--theme-widget-border-width": "1.5px", // Slightly thicker border for hp-client (between 1px and 2px)
      "--theme-widget-border-color": "#E0E0E0", // Border color for hp-client
      "--theme-widget-shadow": "none", // No shadow for hp-client

      // Table Styles
      "--theme-table-head-bg": "#E8F2FF", // Table header background - very light blue tint
      // Alternative lighter options:
      // "#F0F7FF" - extremely light blue tint (almost white)
      // "#F5F9FF" - very subtle blue tint
      // "#F9FAFB" - neutral light gray (matches round table header)
      "--theme-table-head-color": "var(--theme-text-primary,rgb(26, 44, 28))", // Table header text color
      "--theme-table-body-color": "var(--theme-text-primary, #1a202c)", // Table body text color
      "--theme-table-row-even-bg": "rgba(236, 236, 236, 0.54)", // Even row background (#ececec8a)
      "--theme-table-border-color": "var(--theme-border-color, #E0E0E0)", // Table border color
      "--theme-table-classic-head-color": "#B5B7C0", // Classic table header color
      "--theme-table-round-head-bg": "var(--theme-bg-secondary, #F9FAFB)", // Round table header background
      "--theme-table-round-head-color": "var(--theme-text-secondary, #475467)", // Round table header color
      "--theme-table-scrollbar-track": "var(--theme-bg-tertiary, #f1f1f1)", // Scrollbar track color
      "--theme-table-scrollbar-thumb": "#CCCDCF", // Scrollbar thumb color

      // Card Background Colors (HP Client specific)
      "--theme-card-success-rate": "#0073A8", // Dark Blue
      "--theme-card-monthly-performance": "#FFFFFF", // White
      "--theme-card-approved": "#00843D", // Dark Green
      "--theme-card-pending": "#FF8900", // Dark Orange
      "--theme-card-orders": "#FFFFFF", // White
      "--theme-card-canceled": "#E0E0E0", // Light Gray
      "--theme-card-stuck-jobs": "#EF6B6B", // Reddish

      // Card Text Colors (HP Client specific - for white/light cards)
      // Used by use-cards-widget.tsx getCardTextColor()
      "--theme-card-success-rate-text": "#FFFFFF", // White text on blue
      "--theme-card-monthly-performance-text": "#024AD8", // Dark text on white
      "--theme-card-approved-text": "#FFFFFF", // White text on green
      "--theme-card-pending-text": "#FFFFFF", // White text on orange
      "--theme-card-orders-text": "#024AD8", // Dark text on white
      "--theme-card-canceled-text": "#A3A3A3", // Dark text on gray
      "--theme-card-stuck-jobs-text": "#FFFFFF", // White text on red

      // Card Borders
      // Used by use-cards-widget.tsx getCardBorder()
      "--theme-card-monthly-performance-border":
        "1px solid var(--Stroke-Decorative-Default, #E8E8E8)",
      "--theme-card-orders-border":
        "1px solid var(--Stroke-Decorative-Default, #E8E8E8)",

      // Home Page Grid Layout (for quote widget + cards widget container)
      "--theme-home-grid-template-columns": "45% 45%", // Adjusted for 10% gap
      "--theme-home-grid-column-gap": "10%", // 10% gap between columns for HP client
    },
  },

  // No component or page overrides - just styling changes
  pages: {},
  components: {
    CardsWidget: HpCardsWidget,
  },

  // Icon overrides for HP Client theme - All cards now use custom HP icons
  icons: {
    MonthlyPerformanceIcon: MonthlyPerformanceIcon,
    CanceledIcon: CanceledIcon,
    ApprovedIcon: ApprovedIcon,
    SuccessRateIcon: SuccessRateIcon,
    OrdersIcon: OrdersIcon,
    PendingIcon: PendingIcon,
    StuckJobsIcon: StuckJobsIcon,
  },
};

export default hpClientThemeConfig;
