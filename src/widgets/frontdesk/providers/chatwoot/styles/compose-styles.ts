/**
 * Shared Style Constants for Compose Conversation Components
 *
 * Centralized styling constants using the FrontDesk Design System.
 * All styles are based on design tokens for consistency.
 */

import type { SxProps, Theme } from "@mui/material";
import {
  colorTokens,
  radiusTokens,
  shadowTokens,
  semanticTypography,
  semanticSpacing,
} from "@/widgets/frontdesk/design-system";

/**
 * Modal configuration constants
 */
export const MODAL_CONFIG = {
  maxWidth: "md" as const,
  maxHeight: "90vh",
  borderRadius: radiusTokens.lg,
} as const;

/**
 * Shadow configurations using design tokens
 */
export const SHADOWS = {
  modal: shadowTokens.xl,
  button: shadowTokens.xs,
  buttonHover: shadowTokens.sm,
} as const;

/**
 * Spacing configurations using design tokens
 */
export const SPACING = {
  fieldPaddingX: semanticSpacing.container.lg / 4, // Convert to MUI spacing units
  fieldPaddingY: semanticSpacing.container.md / 4,
  fieldPaddingYCompact: semanticSpacing.container.sm / 4,
  headerPaddingX: semanticSpacing.container.lg / 4,
  headerPaddingY: semanticSpacing.container.md / 4,
  headerPaddingBottom: semanticSpacing.container.sm / 4,
} as const;

/**
 * Border widths
 */
export const BORDER_WIDTH = {
  standard: "1px",
  prominent: "2px",
} as const;

/**
 * Icon sizes using design tokens
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
 * Typography configurations using design tokens
 */
export const TYPOGRAPHY = {
  fieldLabel: semanticTypography.label.small,
  sectionTitle: semanticTypography.heading.h3,
  bodyText: semanticTypography.body.medium,
  caption: semanticTypography.caption.medium,
  buttonText: {
    ...semanticTypography.label.medium,
    fontWeight: 500,
  },
  primaryButtonText: {
    ...semanticTypography.label.medium,
    fontWeight: 600,
  },
} as const;

/**
 * Generate field container styles
 */
export const createFieldContainerStyles = (
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
    borderBottom: `${BORDER_WIDTH.standard} solid ${colorTokens.neutral[200]}`,
    backgroundColor: backgroundColor === "light" ? colorTokens.neutral[25] : colorTokens.semantic.background.primary,
  };
};

/**
 * Generate field label styles
 */
export const createFieldLabelStyles = (options: { minWidth?: number } = {}): SxProps<Theme> => {
  return {
    color: colorTokens.neutral[700],
    minWidth: options.minWidth || 100,
    pt: 1,
    ...TYPOGRAPHY.fieldLabel,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };
};

/**
 * Generate section label styles (for MESSAGE, ATTACHMENTS, etc.)
 */
export const createSectionLabelStyles = (): SxProps<Theme> => {
  return {
    color: colorTokens.neutral[700],
    mb: 2,
    ...TYPOGRAPHY.fieldLabel,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };
};

/**
 * Generate button styles
 */
export const createPrimaryButtonStyles = (): SxProps<Theme> => {
  return {
    backgroundColor: colorTokens.primary[600],
    color: "white",
    textTransform: "none",
    boxShadow: SHADOWS.button,
    borderRadius: radiusTokens.md,
    ...TYPOGRAPHY.primaryButtonText,
    "&:hover": {
      backgroundColor: colorTokens.primary[700],
      boxShadow: SHADOWS.buttonHover,
    },
    "&:disabled": {
      backgroundColor: colorTokens.neutral[300],
      color: colorTokens.neutral[500],
    },
  };
};

/**
 * Generate secondary button styles
 */
export const createSecondaryButtonStyles = (): SxProps<Theme> => {
  return {
    color: colorTokens.neutral[700],
    textTransform: "none",
    borderRadius: radiusTokens.md,
    ...TYPOGRAPHY.buttonText,
    "&:hover": {
      backgroundColor: colorTokens.neutral[100],
    },
  };
};

/**
 * Generate outlined button styles
 * @deprecated Use createSecondaryButtonStyles instead - parameters are ignored
 */
export const createOutlinedButtonStyles = (
  _neutralColor?: (shade: number) => string,
  _primaryColor?: (shade: number) => string
): SxProps<Theme> => {
  return {
    color: colorTokens.neutral[600],
    textTransform: "none",
    borderRadius: radiusTokens.md,
    border: `${BORDER_WIDTH.standard} solid ${colorTokens.semantic.border.default}`,
    ...TYPOGRAPHY.buttonText,
    "&:hover": {
      backgroundColor: colorTokens.neutral[50],
      borderColor: colorTokens.neutral[400],
    },
  };
};

/**
 * Generate dialog header styles
 */
export const createDialogHeaderStyles = (): SxProps<Theme> => {
  return {
    px: SPACING.headerPaddingX,
    pt: SPACING.headerPaddingY,
    pb: SPACING.headerPaddingBottom,
    borderBottom: `${BORDER_WIDTH.standard} solid ${colorTokens.semantic.border.default}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colorTokens.semantic.background.primary,
  };
};

/**
 * Generate dialog content styles
 */
export const createDialogContentStyles = (): SxProps<Theme> => {
  return {
    p: 0,
    maxHeight: MODAL_CONFIG.maxHeight,
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: 6,
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: colorTokens.neutral[300],
      borderRadius: 3,
    },
    backgroundColor: colorTokens.semantic.background.secondary,
  };
};

/**
 * Generate dialog actions styles
 */
export const createDialogActionsStyles = (): SxProps<Theme> => {
  return {
    px: SPACING.fieldPaddingX,
    py: 2,
    borderTop: `${BORDER_WIDTH.standard} solid ${colorTokens.semantic.border.default}`,
    backgroundColor: colorTokens.semantic.background.primary,
    gap: 1,
  };
};

/**
 * Generate message editor container styles
 */
export const createMessageEditorContainerStyles = (): SxProps<Theme> => {
  return {
    px: SPACING.fieldPaddingX,
    py: SPACING.fieldPaddingY,
    backgroundColor: colorTokens.semantic.background.primary,
    borderBottom: `${BORDER_WIDTH.standard} solid ${colorTokens.semantic.border.default}`,
  };
};

/**
 * Generate attachment preview styles
 */
export const createAttachmentPreviewStyles = (): SxProps<Theme> => {
  return {
    position: "relative",
    width: ICON_SIZE.attachment,
    height: ICON_SIZE.attachment,
    borderRadius: radiusTokens.sm,
    overflow: "hidden",
    border: `${BORDER_WIDTH.standard} solid ${colorTokens.semantic.border.default}`,
    backgroundColor: colorTokens.neutral[100],
  };
};

/**
 * Generate inbox selector card styles
 */
export const createInboxCardStyles = (isSelected: boolean): SxProps<Theme> => {
  return {
    p: 2,
    borderRadius: radiusTokens.md,
    border: `${isSelected ? BORDER_WIDTH.prominent : BORDER_WIDTH.standard} solid ${
      isSelected ? colorTokens.primary[500] : colorTokens.semantic.border.default
    }`,
    backgroundColor: isSelected ? colorTokens.primary[50] : colorTokens.semantic.background.primary,
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: isSelected ? colorTokens.primary[600] : colorTokens.semantic.border.medium,
      backgroundColor: isSelected ? colorTokens.primary[50] : colorTokens.semantic.interactive.hover,
    },
  };
};

/**
 * Generate contact chip styles
 */
export const createContactChipStyles = (): SxProps<Theme> => {
  return {
    backgroundColor: colorTokens.primary[50],
    color: colorTokens.primary[700],
    border: `${BORDER_WIDTH.standard} solid ${colorTokens.primary[200]}`,
    borderRadius: radiusTokens.full,
    "& .MuiChip-deleteIcon": {
      color: colorTokens.primary[400],
      "&:hover": {
        color: colorTokens.primary[600],
      },
    },
  };
};

/**
 * Generate selected chip styles (for contact/recipient selection)
 * @deprecated Parameters are ignored - uses design tokens directly
 */
export const createSelectedChipStyles = (
  _primaryColor?: (shade: number) => string,
  _neutralColor?: (shade: number) => string
): SxProps<Theme> => {
  return {
    backgroundColor: colorTokens.primary[50],
    color: colorTokens.primary[700],
    border: `${BORDER_WIDTH.standard} solid ${colorTokens.primary[200]}`,
    borderRadius: radiusTokens.full,
    "& .MuiChip-deleteIcon": {
      color: colorTokens.primary[400],
      "&:hover": {
        color: colorTokens.primary[600],
      },
    },
  };
};

/**
 * Generate standard text field styles
 * @deprecated Parameters are ignored - uses design tokens directly
 */
export const createStandardTextFieldStyles = (
  _neutralColor?: (shade: number) => string
): SxProps<Theme> => {
  return {
    "& .MuiOutlinedInput-root": {
      borderRadius: radiusTokens.md,
      backgroundColor: colorTokens.semantic.background.primary,
      "& fieldset": {
        borderColor: colorTokens.semantic.border.default,
      },
      "&:hover fieldset": {
        borderColor: colorTokens.semantic.border.medium,
      },
      "&.Mui-focused fieldset": {
        borderColor: colorTokens.primary[500],
        borderWidth: BORDER_WIDTH.prominent,
      },
    },
    "& .MuiInputLabel-root": {
      color: colorTokens.neutral[600],
      "&.Mui-focused": {
        color: colorTokens.primary[600],
      },
    },
  };
};

/**
 * Generate error alert styles
 */
export const createErrorAlertStyles = (): SxProps<Theme> => {
  return {
    mx: SPACING.fieldPaddingX,
    my: 2,
    borderRadius: radiusTokens.md,
    backgroundColor: colorTokens.error[50],
    border: `${BORDER_WIDTH.standard} solid ${colorTokens.error[200]}`,
    color: colorTokens.error[700],
    "& .MuiAlert-icon": {
      color: colorTokens.error[500],
    },
  };
};

/**
 * Generate template selector styles
 */
export const createTemplateSelectorStyles = (): SxProps<Theme> => {
  return {
    backgroundColor: colorTokens.semantic.background.secondary,
    borderRadius: radiusTokens.md,
    border: `${BORDER_WIDTH.standard} solid ${colorTokens.semantic.border.default}`,
    p: 2,
    mb: 2,
  };
};

/**
 * Legacy wrapper functions for backward compatibility
 * @deprecated Use the new functions without neutralColor/primaryColor parameters
 */
export const createFieldContainerStylesLegacy = (
  neutralColor: (shade: number) => string,
  options: {
    backgroundColor?: "light" | "white";
    padding?: "standard" | "compact";
  } = {}
): SxProps<Theme> => createFieldContainerStyles(options);

export const createFieldLabelStylesLegacy = (
  neutralColor: (shade: number) => string,
  options: { minWidth?: number } = {}
): SxProps<Theme> => createFieldLabelStyles(options);

export const createSectionLabelStylesLegacy = (
  neutralColor: (shade: number) => string
): SxProps<Theme> => createSectionLabelStyles();

export const createPrimaryButtonStylesLegacy = (
  primaryColor: (shade: number) => string,
  neutralColor: (shade: number) => string
): SxProps<Theme> => createPrimaryButtonStyles();

export const createSecondaryButtonStylesLegacy = (
  neutralColor: (shade: number) => string
): SxProps<Theme> => createSecondaryButtonStyles();
