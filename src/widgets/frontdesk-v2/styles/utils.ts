/**
 * FrontDesk V2 - Style Utilities
 * Reusable style helper functions and utilities
 */

import { frontdeskV2Theme } from "./theme";

/**
 * Get spacing value from theme
 */
export const getSpacing = (multiplier: keyof typeof frontdeskV2Theme.spacing): string => {
  return frontdeskV2Theme.spacing[multiplier];
};

/**
 * Get color value from theme
 */
export const getColor = (path: string): string => {
  const keys = path.split(".");
  let value: any = frontdeskV2Theme.colors;

  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) {
      console.warn(`Color path "${path}" not found in theme`);
      return "#000000"; // Fallback
    }
  }

  return value;
};

/**
 * Create a flex container style
 */
export const flexContainer = (direction: "row" | "column" = "row") => ({
  display: "flex",
  flexDirection: direction,
});

/**
 * Create a scrollable container style
 */
export const scrollableContainer = (direction: "vertical" | "horizontal" | "both" = "vertical") => {
  const overflow = {
    vertical: { overflowY: "auto", overflowX: "hidden" },
    horizontal: { overflowY: "hidden", overflowX: "auto" },
    both: { overflow: "auto" },
  };

  return {
    ...overflow[direction],
    ...(direction === "vertical" && {
      // Smooth scrolling for better UX
      scrollBehavior: "smooth" as const,
    }),
  };
};

/**
 * Create a hover effect style
 */
export const hoverEffect = () => ({
  transition: frontdeskV2Theme.transitions.default,
  "&:hover": {
    backgroundColor: frontdeskV2Theme.colors.background.hover,
  },
});

/**
 * Create a clickable element style
 */
export const clickable = () => ({
  cursor: "pointer",
  userSelect: "none" as const,
  ...hoverEffect(),
});

/**
 * Create a border style
 */
export const border = (side: "all" | "top" | "right" | "bottom" | "left" = "all", strong: boolean = false) => {
  const borderColor = strong ? frontdeskV2Theme.colors.border.strong : frontdeskV2Theme.colors.border.default;
  const borderValue = `1px solid ${borderColor}`;

  switch (side) {
    case "top":
      return { borderTop: borderValue };
    case "right":
      return { borderRight: borderValue };
    case "bottom":
      return { borderBottom: borderValue };
    case "left":
      return { borderLeft: borderValue };
    default:
      return { border: borderValue };
  }
};

/**
 * Create text truncation style
 */
export const textTruncate = (lines: number = 1) => {
  if (lines === 1) {
    return {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap" as const,
    };
  }

  return {
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
};
