/**
 * Shared Style Constants for Compose Conversation Components
 *
 * Centralized styling constants to ensure consistency across
 * the compose conversation modal and related components.
 */

import type { SxProps, Theme } from "@mui/material";

/**
 * Modal configuration constants
 */
export const MODAL_CONFIG = {
  maxWidth: "md" as const,
  maxHeight: "90vh",
  borderRadius: 2,
} as const;

/**
 * Shadow configurations
 */
export const SHADOWS = {
  modal: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  button: "0 1px 3px rgba(0, 0, 0, 0.1)",
  buttonHover: "0 4px 6px rgba(0, 0, 0, 0.1)",
} as const;

/**
 * Spacing configurations
 */
export const SPACING = {
  fieldPaddingX: 4,
  fieldPaddingY: 3,
  fieldPaddingYCompact: 2.5,
  headerPaddingX: 4,
  headerPaddingY: 3,
  headerPaddingBottom: 2.5,
} as const;

/**
 * Border widths
 */
export const BORDER_WIDTH = {
  standard: "1px",
  prominent: "2px",
} as const;

/**
 * Icon sizes
 */
export const ICON_SIZE = {
  badge: 40,
  small: 18,
  medium: 20,
  large: 24,
  attachment: 48,
} as const;

/**
 * Editor dimensions
 */
export const EDITOR = {
  minHeight: 280,
} as const;

/**
 * Typography configurations
 */
export const TYPOGRAPHY = {
  fieldLabel: {
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  sectionTitle: {
    fontSize: "1.375rem",
    fontWeight: 600,
  },
  bodyText: {
    fontSize: "0.875rem",
  },
  caption: {
    fontSize: "0.75rem",
  },
  buttonText: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  primaryButtonText: {
    fontSize: "0.875rem",
    fontWeight: 600,
  },
} as const;

/**
 * Generate field container styles
 */
export const createFieldContainerStyles = (
  neutralColor: (shade: number) => string,
  options: {
    backgroundColor?: "light" | "white";
    padding?: "standard" | "compact";
  } = {}
): SxProps<Theme> => {
  const { backgroundColor = "white", padding = "standard" } = options;

  return {
    display: "flex",
    alignItems: "flex-start",
    px: SPACING.fieldPaddingX,
    py: padding === "standard" ? SPACING.fieldPaddingY : SPACING.fieldPaddingYCompact,
    borderBottom: `${BORDER_WIDTH.standard} solid ${neutralColor(200)}`,
    backgroundColor: backgroundColor === "light" ? neutralColor(25) : neutralColor(0),
  };
};

/**
 * Generate field label styles
 */
export const createFieldLabelStyles = (
  neutralColor: (shade: number) => string,
  options: { minWidth?: number } = {}
): SxProps<Theme> => {
  return {
    color: neutralColor(700),
    minWidth: options.minWidth || 100,
    pt: 1,
    ...TYPOGRAPHY.fieldLabel,
  };
};

/**
 * Generate section label styles (for MESSAGE, ATTACHMENTS, etc.)
 */
export const createSectionLabelStyles = (neutralColor: (shade: number) => string): SxProps<Theme> => {
  return {
    color: neutralColor(700),
    mb: 2,
    ...TYPOGRAPHY.fieldLabel,
  };
};

/**
 * Generate button styles
 */
export const createPrimaryButtonStyles = (
  primaryColor: (shade: number) => string,
  neutralColor: (shade: number) => string
): SxProps<Theme> => {
  return {
    textTransform: "none",
    backgroundColor: primaryColor(600),
    color: "white",
    ...TYPOGRAPHY.primaryButtonText,
    px: 4,
    py: 1.25,
    borderRadius: 1,
    boxShadow: SHADOWS.button,
    "&:hover": {
      backgroundColor: primaryColor(700),
      boxShadow: SHADOWS.buttonHover,
    },
    "&:disabled": {
      backgroundColor: neutralColor(300),
      color: neutralColor(500),
    },
  };
};

/**
 * Generate secondary button styles
 */
export const createSecondaryButtonStyles = (neutralColor: (shade: number) => string): SxProps<Theme> => {
  return {
    textTransform: "none",
    color: neutralColor(700),
    ...TYPOGRAPHY.buttonText,
    px: 3,
    py: 1.25,
    borderRadius: 1,
    "&:hover": {
      backgroundColor: neutralColor(100),
    },
  };
};

/**
 * Generate danger button styles
 */
export const createDangerButtonStyles = (theme?: Theme): SxProps<Theme> => {
  return {
    textTransform: "none",
    backgroundColor: theme?.palette.error.main || "#ef4444",
    color: "white",
    ...TYPOGRAPHY.primaryButtonText,
    px: 2.5,
    boxShadow: "none",
    "&:hover": {
      backgroundColor: theme?.palette.error.dark || "#dc2626",
      boxShadow: "none",
    },
  };
};

/**
 * Generate outlined button styles
 */
export const createOutlinedButtonStyles = (
  neutralColor: (shade: number) => string,
  primaryColor: (shade: number) => string
): SxProps<Theme> => {
  return {
    textTransform: "none",
    ...TYPOGRAPHY.buttonText,
    borderColor: neutralColor(300),
    color: neutralColor(700),
    "&:hover": {
      backgroundColor: neutralColor(50),
      borderColor: neutralColor(400),
    },
  };
};

/**
 * Generate icon badge styles (e.g., Send icon in header)
 */
export const createIconBadgeStyles = (primaryColor: (shade: number) => string): SxProps<Theme> => {
  return {
    width: ICON_SIZE.badge,
    height: ICON_SIZE.badge,
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: primaryColor(50),
    color: primaryColor(600),
  };
};

/**
 * Generate chip styles for selected items
 */
export const createSelectedChipStyles = (primaryColor: (shade: number) => string): SxProps<Theme> => {
  return {
    backgroundColor: primaryColor(50),
    color: primaryColor(700),
    border: `${BORDER_WIDTH.standard} solid ${primaryColor(200)}`,
    fontWeight: 500,
    ...TYPOGRAPHY.bodyText,
    "& .MuiChip-deleteIcon": {
      color: primaryColor(600),
      "&:hover": {
        color: primaryColor(800),
      },
    },
  };
};

/**
 * Generate close button styles
 */
export const createCloseButtonStyles = (neutralColor: (shade: number) => string): SxProps<Theme> => {
  return {
    color: neutralColor(600),
    "&:hover": {
      backgroundColor: neutralColor(100),
      color: neutralColor(900),
    },
  };
};

/**
 * Generate TextField standard variant styles (for subject, cc, bcc)
 */
export const createStandardTextFieldStyles = (neutralColor: (shade: number) => string) => {
  return {
    InputProps: {
      disableUnderline: true,
      sx: {
        ...TYPOGRAPHY.bodyText,
        color: neutralColor(900),
        mt: 0.5,
      },
    },
    InputLabelProps: {
      sx: {
        color: neutralColor(700),
        ...TYPOGRAPHY.fieldLabel,
      },
    },
  };
};

/**
 * Generate error text styles
 */
export const createErrorTextStyles = (theme?: Theme): SxProps<Theme> => {
  return {
    mt: 1,
    ...TYPOGRAPHY.caption,
    color: theme?.palette.error.main || "#ef4444",
  };
};

/**
 * Generate loading state container styles
 */
export const createLoadingStateStyles = (
  neutralColor: (shade: number) => string,
  primaryColor: (shade: number) => string
): SxProps<Theme> => {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: 3,
    border: `${BORDER_WIDTH.standard} solid ${neutralColor(200)}`,
    borderRadius: 1,
    backgroundColor: neutralColor(25),
  };
};

/**
 * Generate inbox selector button styles
 */
export const createInboxSelectorButtonStyles = (
  neutralColor: (shade: number) => string,
  primaryColor: (shade: number) => string,
  isSelected: boolean
): SxProps<Theme> => {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    p: 2,
    border: `${BORDER_WIDTH.standard} solid ${isSelected ? primaryColor(400) : neutralColor(200)}`,
    borderRadius: 1,
    backgroundColor: isSelected ? primaryColor(25) : neutralColor(0),
    textTransform: "none",
    "&:hover": {
      backgroundColor: isSelected ? primaryColor(50) : neutralColor(50),
      borderColor: isSelected ? primaryColor(500) : neutralColor(300),
    },
  };
};

/**
 * Generate attachment preview container styles
 */
export const createAttachmentPreviewStyles = (neutralColor: (shade: number) => string): SxProps<Theme> => {
  return {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    p: 1.5,
    backgroundColor: neutralColor(25),
    border: `${BORDER_WIDTH.standard} solid ${neutralColor(200)}`,
    borderRadius: 1,
    position: "relative",
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: neutralColor(50),
      borderColor: neutralColor(300),
    },
  };
};

/**
 * Generate attachment thumbnail/icon container styles
 */
export const createAttachmentIconContainerStyles = (
  neutralColor: (shade: number) => string,
  options: { isImage: boolean; color?: string } = { isImage: false }
): SxProps<Theme> => {
  return {
    width: ICON_SIZE.attachment,
    height: ICON_SIZE.attachment,
    borderRadius: 1,
    overflow: "hidden",
    flexShrink: 0,
    backgroundColor: options.isImage ? neutralColor(100) : `${options.color || neutralColor(200)}15`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: `${BORDER_WIDTH.standard} solid ${neutralColor(200)}`,
  };
};

/**
 * File type colors for attachment previews
 */
export const FILE_TYPE_COLORS = {
  image: "#10b981", // green
  video: "#8b5cf6", // purple
  audio: "#f59e0b", // amber
  pdf: "#ef4444", // red
  document: "#3b82f6", // blue
  spreadsheet: "#059669", // emerald
  default: "#6b7280", // gray
} as const;

/**
 * Format file size utility
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};
