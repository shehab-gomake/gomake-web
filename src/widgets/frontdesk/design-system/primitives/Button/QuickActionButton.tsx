import React, { useState } from "react";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  colorTokens,
  radiusTokens,
  shadowTokens,
  semanticTypography,
} from "../../tokens";
import FlashOnOutlinedIcon from "@mui/icons-material/FlashOnOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export interface QuickActionButtonProps
  extends Omit<MuiButtonProps, "variant" | "color" | "size"> {
  /** Button size */
  size?: "sm" | "md" | "lg";
  /** Whether menu is open */
  isOpen?: boolean;
  /** Whether button shows loading state */
  loading?: boolean;
}

const sizeStyles = {
  sm: {
    height: 32,
    padding: "0 12px",
    fontSize: semanticTypography.button.small.fontSize,
    fontWeight: semanticTypography.button.small.fontWeight,
  },
  md: {
    height: 36,
    padding: "0 14px",
    fontSize: semanticTypography.button.medium.fontSize,
    fontWeight: semanticTypography.button.medium.fontWeight,
  },
  lg: {
    height: 40,
    padding: "0 18px",
    fontSize: semanticTypography.button.large.fontSize,
    fontWeight: semanticTypography.button.large.fontWeight,
  },
};

/**
 * QuickActionButton Component
 *
 * Specialized button for opening quick actions menu
 * Features lightning bolt icon and dropdown indicator
 */
export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  size = "sm",
  isOpen = false,
  loading = false,
  disabled = false,
  children,
  sx = {},
  ...rest
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const sizeStyle = sizeStyles[size];

  const arrowIcon = (
    <KeyboardArrowDownIcon
      sx={{
        fontSize: 18,
        transition: "transform 0.2s ease",
        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
      }}
    />
  );

  return (
    <MuiButton
      disableElevation
      {...(isRTL
        ? {
            endIcon: <FlashOnOutlinedIcon sx={{ fontSize: 18 }} />,
            startIcon: arrowIcon,
          }
        : {
            startIcon: <FlashOnOutlinedIcon sx={{ fontSize: 18 }} />,
            endIcon: arrowIcon,
          })}
      sx={{
        ...sizeStyle,
        backgroundColor: colorTokens.primary[600],
        color: "white",
        border: "none",
        borderRadius: radiusTokens.md,
        textTransform: "none",
        transition: "all 0.15s ease",
        gap: 0.5,
        direction: dir,
        "&:hover": {
          backgroundColor: colorTokens.primary[700],
          boxShadow: shadowTokens.sm,
        },
        "&:active": {
          backgroundColor: colorTokens.primary[800],
        },
        "&:disabled": {
          backgroundColor: colorTokens.neutral[200],
          color: colorTokens.neutral[400],
          opacity: 0.6,
        },
        "&:focus-visible": {
          outline: `2px solid ${colorTokens.primary[600]}`,
          outlineOffset: 2,
        },
        // Open state styling
        ...(isOpen && {
          backgroundColor: colorTokens.primary[700],
          boxShadow: shadowTokens.md,
        }),
        ...sx,
      }}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? "Loading..." : children || "Quick Actions"}
    </MuiButton>
  );
};
