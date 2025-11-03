/**
 * FrontDesk V2 - Light Theme Configuration
 * Centralized theme constants for consistent styling across components
 */

export const frontdeskV2Theme = {
  colors: {
    background: {
      primary: "#ffffff", // CenterPanel - Pure white
      secondary: "#f9fafb", // MiddlePanel, RightSidebar - Light gray
      tertiary: "#f3f4f6", // LeftSidebar - Slightly darker gray
      hover: "#f0f1f3",
    },
    text: {
      primary: "#111827", // Dark gray, almost black
      secondary: "#6b7280", // Medium gray
      tertiary: "#9ca3af", // Light gray
    },
    border: {
      default: "#e5e7eb",
      strong: "#d1d5db",
    },
    brand: {
      primary: "#2e3092", // Blue (selected states)
      secondary: "#5a5fc7",
    },
    interactive: {
      hover: "#f9fafb",
      active: "#f3f4f6",
      selected: "#eff6ff",
      selectedHover: "#dbeafe",
      disabled: "#f9fafb",
    },
    status: {
      online: "#10b981",
      away: "#f59e0b",
      offline: "#6b7280",
    },
    priority: {
      low: "#6b7280",
      normal: "#3b82f6",
      high: "#f59e0b",
      urgent: "#ef4444",
    },
    platform: {
      email: "#ea4335",
      whatsapp: "#25d366",
      facebook: "#1877f2",
      sms: "#8b5cf6",
    },
  },
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      monospace: '"SF Mono", Monaco, Consolas, monospace',
    },
    fontSize: {
      xs: "11px",
      sm: "13px",
      base: "14px",
      lg: "16px",
      xl: "18px",
      "2xl": "20px",
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    0: "0px",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
  },
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.03)",
    base: "0 1px 3px rgba(0, 0, 0, 0.08)",
    md: "0 4px 6px rgba(0, 0, 0, 0.07)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.08)",
  },
  layout: {
    leftSidebarWidth: 240,
    middlePanelWidth: 380,
    rightSidebarWidth: 340,
  },
  transitions: {
    default: "all 0.2s ease-in-out",
    fast: "all 0.15s ease-in-out",
    slow: "all 0.3s ease-in-out",
  },
  breakpoints: {
    tablet: "1280px",
    mobile: "768px",
    compact: "480px",
  },
} as const;

export type FrontdeskV2Theme = typeof frontdeskV2Theme;
