/**
 * NavigationSidebar Constants
 * 
 * Centralized constants for styling, configuration, and accessibility
 */

import { alpha } from "@mui/material";
import { radiusTokens, shadowTokens } from "@/widgets/frontdesk/design-system/tokens";

// Sidebar dimensions
export const SIDEBAR_WIDTHS = {
  expanded: 220,
  collapsed: 64,
} as const;

// Icon sizes
export const ICON_SIZES = {
  small: 16,
  medium: 18,
  large: 20,
} as const;

// Animation durations
export const TRANSITIONS = {
  fast: "0.15s ease-in-out",
  normal: "0.2s ease-in-out",
  slow: "0.3s ease-in-out",
  smooth: "0.2s cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

// Color opacities for visual variation
export const COLOR_OPACITIES = {
  icon: {
    default: 0.7,
    hover: 0.9,
    active: 1,
    disabled: 0.4,
  },
  background: {
    selected: 0.1,
    selectedHover: 0.2,
    hover: 0.05,
  },
} as const;

// Section header styles
export const SECTION_HEADER_STYLES = {
  fontSize: "0.688rem",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  opacity: 0.7,
} as const;

// Visual variation - color gradients for different sections
export const SECTION_COLORS = {
  navigation: {
    icon: "#6B7280", // neutral-500
    hover: "#4B5563", // neutral-600
  },
  tickets: {
    icon: "#6366F1", // indigo-500
    hover: "#4F46E5", // indigo-600
  },
  channels: {
    icon: "#8B5CF6", // purple-500
    hover: "#7C3AED", // purple-600
  },
} as const;

// List item styles
export const LIST_ITEM_STYLES = {
  default: {
    py: 1,
    px: 2,
    transition: TRANSITIONS.normal,
  },
  collapsed: {
    py: 1,
    px: 1.5,
    justifyContent: "center" as const,
  },
  nested: {
    py: 1,
    pl: 5,
    pr: 2,
  },
} as const;

// Button styles
export const BUTTON_STYLES = {
  newTicket: {
    expanded: {
      py: 1.25,
      px: 2,
      borderRadius: `${radiusTokens.xl}px`,
      boxShadow: shadowTokens.md,
      fontSize: "0.875rem",
      fontWeight: 600,
      letterSpacing: "0.01em",
      transition: TRANSITIONS.smooth,
      "&:hover": {
        boxShadow: shadowTokens.lg,
        transform: "translateY(-1px)",
      },
      "&:active": {
        transform: "translateY(0px)",
        boxShadow: shadowTokens.md,
      },
    },
    collapsed: {
      width: 40,
      height: 40,
      borderRadius: `${radiusTokens.full}px`,
      boxShadow: shadowTokens.md,
      transition: TRANSITIONS.smooth,
      "&:hover": {
        boxShadow: shadowTokens.lg,
        transform: "translateY(-1px)",
      },
      "&:active": {
        transform: "translateY(0px)",
        boxShadow: shadowTokens.md,
      },
    },
  },
} as const;

// Typography styles
export const TYPOGRAPHY_STYLES = {
  listItem: {
    fontSize: "0.875rem",
    fontWeight: {
      default: 400,
      selected: 600,
    },
  },
  nestedItem: {
    fontSize: "0.813rem",
    fontWeight: {
      default: 400,
      selected: 600,
    },
  },
  sectionHeader: SECTION_HEADER_STYLES,
} as const;

// Helper function to get icon color with opacity
export const getIconColor = (
  theme: any,
  isSelected: boolean = false,
  isHovered: boolean = false
): string => {
  if (isSelected) {
    return theme.palette.primary.main;
  }
  const opacity = isHovered ? COLOR_OPACITIES.icon.hover : COLOR_OPACITIES.icon.default;
  return alpha(theme.palette.text.secondary, opacity);
};

// Helper function to get background color
export const getBackgroundColor = (
  theme: any,
  isSelected: boolean = false,
  isHovered: boolean = false
): string => {
  if (isSelected) {
    return isHovered
      ? alpha(theme.palette.primary.main, COLOR_OPACITIES.background.selectedHover)
      : alpha(theme.palette.primary.main, COLOR_OPACITIES.background.selected);
  }
  return isHovered ? theme.palette.action.hover : "transparent";
};

// Accessibility labels
export const A11Y_LABELS = {
  sidebar: "Navigation sidebar",
  toggleCollapse: (isCollapsed: boolean) => isCollapsed ? "Expand sidebar" : "Collapse sidebar",
  newTicket: "Create new ticket",
  dashboard: "Dashboard view",
  myTickets: "My tickets view",
  allTickets: "All tickets view",
  mentions: "Mentions view",
  unattended: "Unattended tickets view",
  channels: "Channels view",
  settings: "Settings view",
  addChannel: "Add new channel",
  noAgentsWarning: "No agents assigned - Click to assign",
} as const;

