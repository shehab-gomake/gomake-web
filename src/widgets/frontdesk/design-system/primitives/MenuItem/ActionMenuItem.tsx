import React from "react";
import { MenuItem, Box, Typography } from "@mui/material";
import { colorTokens, radiusTokens } from "../../tokens";

export interface ActionMenuItemProps {
  /** Unique identifier */
  id: string;
  /** Main label/title */
  label: string;
  /** Icon or visual element on the left (20x20) */
  icon?: React.ReactNode;
  /** Optional secondary text/metadata */
  secondaryText?: string;
  /** Optional badge/chip on the right */
  rightElement?: React.ReactNode;
  /** Whether item is selected */
  isSelected?: boolean;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Click handler */
  onClick?: (e: React.MouseEvent) => void;
  /** Custom styling */
  sx?: any;
}

/**
 * ActionMenuItem Component
 *
 * Unified menu item component used across FrontDesk for:
 * - Ticket list items
 * - Quick action menus
 * - Conversation list items
 * - Any other menu-style lists
 *
 * Design matches QuickActionMenu styling:
 * - Spacing: px: 2, py: 1.5, gap: 1.5
 * - Hover: colorTokens.primary[50]
 * - Selected: colorTokens.primary[100]
 * - Icon container: 20x20, colorTokens.primary[600]
 * - Typography: fontSize: 14, fontWeight: 500
 */
export const ActionMenuItem: React.FC<ActionMenuItemProps> = ({
  id,
  label,
  icon,
  secondaryText,
  rightElement,
  isSelected = false,
  disabled = false,
  onClick,
  sx = {},
}) => {
  return (
    <MenuItem
      disableRipple
      onClick={onClick}
      disabled={disabled}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        px: 2,
        py: 0.875,
        mx: 0.5,
        borderRadius: radiusTokens.sm,
        backgroundColor: isSelected ? colorTokens.primary[100] : "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        "&:hover": {
          backgroundColor: isSelected ? colorTokens.primary[100] : disabled ? "transparent" : "rgba(59, 130, 246, 0.08)",
          transform: disabled ? "none" : "translateX(2px)",
        },
        "&:active": {
          backgroundColor: colorTokens.semantic.interactive.active,
          transform: "translateX(1px)",
          transition: "all 0.1s ease",
        },
        "&.Mui-disabled": {
          opacity: 0.4,
          cursor: "not-allowed",
        },
        ...sx,
      }}
    >
      {/* Icon Container (18x18) */}
      {icon && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 18,
            height: 18,
            flexShrink: 0,
            "& svg": {
              transition: "transform 0.15s ease, color 0.15s ease",
              color: disabled ? `${colorTokens.semantic.text.tertiary} !important` : "inherit",
            },
            "&:hover svg": {
              transform: disabled ? "none" : "scale(1.05)",
            },
          }}
        >
          {icon}
        </Box>
      )}

      {/* Main Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Primary Label */}
        <Typography
          variant="body2"
          sx={{
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: disabled ? colorTokens.semantic.text.tertiary : colorTokens.semantic.text.primary,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: 1.35,
          }}
        >
          {label}
        </Typography>

        {/* Optional Secondary Text */}
        {secondaryText && (
          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              color: colorTokens.semantic.text.secondary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {secondaryText}
          </Typography>
        )}
      </Box>

      {/* Right Element (Badge, Chip, Status, etc.) */}
      {rightElement && (
        <Box
          sx={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          {rightElement}
        </Box>
      )}
    </MenuItem>
  );
};
