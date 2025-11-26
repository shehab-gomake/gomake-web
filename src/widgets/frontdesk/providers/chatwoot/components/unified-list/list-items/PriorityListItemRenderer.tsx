/**
 * PriorityListItemRenderer Component
 *
 * Specialized list item renderer for priority options with:
 * - Priority flag icon with color
 * - Level-based styling
 *
 * @module unified-list/list-items/PriorityListItemRenderer
 */

import React from 'react';
import { Box, Typography, MenuItem, alpha } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { colorTokens } from '@/widgets/frontdesk/design-system';
import type { PriorityListItem } from '../types';

export interface PriorityListItemRendererProps {
  item: PriorityListItem;
  isSelected: boolean;
  onClick: () => void;
}

// Priority colors mapping
const PRIORITY_COLORS: Record<string, string> = {
  urgent: '#DC2626', // red-600
  high: '#EF4444',   // red-500
  medium: '#F59E0B', // amber-500
  low: '#22C55E',    // green-500
  none: colorTokens.neutral[400],
};

export const PriorityListItemRenderer: React.FC<PriorityListItemRendererProps> = ({
  item,
  isSelected,
  onClick,
}) => {
  const priorityColor = item.color || PRIORITY_COLORS[item.level] || colorTokens.neutral[400];
  const isNone = item.level === 'none' || item.value === null;

  return (
    <MenuItem
      onClick={onClick}
      disabled={item.disabled}
      sx={{
        px: 2,
        py: 1,
        gap: 1.5,
        backgroundColor: isSelected ? alpha(priorityColor, 0.08) : 'transparent',
        '&:hover': {
          backgroundColor: isSelected
            ? alpha(priorityColor, 0.12)
            : colorTokens.neutral[50],
        },
        '&.Mui-disabled': {
          opacity: 0.5,
        },
      }}
    >
      {/* Priority Icon */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: priorityColor,
        }}
      >
        {isNone ? (
          <CloseIcon sx={{ fontSize: 18 }} />
        ) : (
          <FlagIcon sx={{ fontSize: 18 }} />
        )}
      </Box>

      {/* Priority Label */}
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
            color: priorityColor,
            flexShrink: 0,
          }}
        />
      )}
    </MenuItem>
  );
};

export default PriorityListItemRenderer;

