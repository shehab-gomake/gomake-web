import React from 'react';
import { MenuItem, Box, Typography } from '@mui/material';
import { colorTokens, radiusTokens } from '../../tokens';

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
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.5,
        borderRadius: radiusTokens.md,
        backgroundColor: isSelected
          ? colorTokens.primary[100]
          : 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.15s ease',
        '&:hover': {
          backgroundColor: isSelected
            ? colorTokens.primary[100]
            : disabled
            ? 'transparent'
            : colorTokens.primary[50],
        },
        '&.Mui-disabled': {
          opacity: 0.5,
        },
        ...sx,
      }}
    >
      {/* Icon Container (20x20) */}
      {icon && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            flexShrink: 0,
            color: disabled
              ? colorTokens.semantic.text.tertiary
              : colorTokens.primary[600],
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
            fontSize: 14,
            fontWeight: 500,
            color: disabled
              ? colorTokens.semantic.text.tertiary
              : colorTokens.semantic.text.primary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
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
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
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
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {rightElement}
        </Box>
      )}
    </MenuItem>
  );
};
