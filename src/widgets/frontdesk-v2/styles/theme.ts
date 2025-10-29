/**
 * FrontDesk V2 - Dark Theme Configuration
 * Centralized theme constants for consistent styling across components
 */

export const frontdeskV2Theme = {
  colors: {
    background: {
      primary: "#000000", // CenterPanel
      secondary: "#0d0d0d", // MiddlePanel, RightSidebar
      tertiary: "#1a1a1a", // LeftSidebar
      hover: "#262626",
    },
    text: {
      primary: "#ffffff",
      secondary: "#a0a0a0",
      tertiary: "#666666",
    },
    border: {
      default: "rgba(255, 255, 255, 0.1)",
      strong: "rgba(255, 255, 255, 0.2)",
    },
    brand: {
      primary: "#2e3092", // Blue (selected states)
      secondary: "#5a5fc7",
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
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px rgba(0, 0, 0, 0.1)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
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

