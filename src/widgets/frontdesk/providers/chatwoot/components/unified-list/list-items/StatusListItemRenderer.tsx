/**
 * StatusListItemRenderer Component
 *
 * Specialized list item renderer for status options with:
 * - Status icon
 * - Color-coded styling
 *
 * @module unified-list/list-items/StatusListItemRenderer
 */

import React from 'react';
import { Box, Typography, MenuItem, alpha } from '@mui/material';
import {
  OpenInNew as OpenIcon,
  Pending as PendingIcon,
  Snooze as SnoozeIcon,
  CheckCircle as ResolvedIcon,
  AllInbox as AllIcon,
} from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import { colorTokens } from '@/widgets/frontdesk/design-system';
import type { StatusListItem } from '../types';

export interface StatusListItemRendererProps {
  item: StatusListItem;
  isSelected: boolean;
  onClick: () => void;
}

// Default status icons mapping
const STATUS_ICONS: Record<string, React.ReactNode> = {
  open: <OpenIcon sx={{ fontSize: 18 }} />,
  pending: <PendingIcon sx={{ fontSize: 18 }} />,
  snoozed: <SnoozeIcon sx={{ fontSize: 18 }} />,
  resolved: <ResolvedIcon sx={{ fontSize: 18 }} />,
  all: <AllIcon sx={{ fontSize: 18 }} />,
};

// Default status colors
const STATUS_COLORS: Record<string, string> = {
  open: colorTokens.success[500],
  pending: colorTokens.warning[500],
  snoozed: colorTokens.info[500],
  resolved: colorTokens.neutral[500],
  all: colorTokens.neutral[600],
};

export const StatusListItemRenderer: React.FC<StatusListItemRendererProps> = ({
  item,
  isSelected,
  onClick,
}) => {
  const icon = item.icon || STATUS_ICONS[item.value] || <AllIcon sx={{ fontSize: 18 }} />;
  const statusColor = item.color || STATUS_COLORS[item.value] || colorTokens.neutral[500];

  return (
    <MenuItem
      onClick={onClick}
      disabled={item.disabled || isSelected}
      sx={{
        px: 2,
        py: 1,
        gap: 1.5,
        backgroundColor: isSelected ? alpha(statusColor, 0.08) : 'transparent',
        '&:hover': {
          backgroundColor: isSelected
            ? alpha(statusColor, 0.12)
            : colorTokens.neutral[50],
        },
        '&.Mui-disabled': {
          opacity: isSelected ? 1 : 0.5,
        },
      }}
    >
      {/* Status Icon */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isSelected ? statusColor : colorTokens.neutral[500],
          transition: 'color 0.2s ease',
        }}
      >
        {icon}
      </Box>

      {/* Status Label */}
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          fontSize: 13,
          fontWeight: isSelected ? 600 : 400,
          color: colorTokens.neutral[900],
        }}
      >
        {item.label}
      </Typography>

      {/* Selected indicator */}
      {isSelected && (
        <CheckIcon
          sx={{
            fontSize: 16,
            color: statusColor,
            flexShrink: 0,
          }}
        />
      )}
    </MenuItem>
  );
};

export default StatusListItemRenderer;

