/**
 * LabelListItemRenderer Component
 *
 * Specialized list item renderer for labels with:
 * - Color indicator dot
 * - Description secondary text
 * - Multi-select checkbox support
 *
 * @module unified-list/list-items/LabelListItemRenderer
 */

import React from 'react';
import { Box, Typography, MenuItem, Checkbox, alpha } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { colorTokens } from '@/widgets/frontdesk/design-system';
import type { LabelListItem } from '../types';

export interface LabelListItemRendererProps {
  item: LabelListItem;
  isSelected: boolean;
  onClick: () => void;
  /** Show checkbox for multi-select */
  showCheckbox?: boolean;
}

export const LabelListItemRenderer: React.FC<LabelListItemRendererProps> = ({
  item,
  isSelected,
  onClick,
  showCheckbox = false,
}) => {
  const labelColor = item.color || colorTokens.neutral[400];

  return (
    <MenuItem
      onClick={onClick}
      disabled={item.disabled}
      sx={{
        px: 2,
        py: 1,
        gap: 1.5,
        backgroundColor: isSelected ? alpha(labelColor, 0.08) : 'transparent',
        '&:hover': {
          backgroundColor: isSelected ? alpha(labelColor, 0.15) : colorTokens.neutral[50],
        },
        '&.Mui-disabled': {
          opacity: 0.5,
        },
      }}
    >
      {/* Checkbox for multi-select */}
      {showCheckbox && (
        <Checkbox
          checked={isSelected}
          size="small"
          sx={{
            p: 0,
            color: colorTokens.neutral[400],
            '&.Mui-checked': {
              color: labelColor,
            },
          }}
        />
      )}

      {/* Color indicator */}
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: labelColor,
          flexShrink: 0,
          boxShadow: isSelected ? `0 0 8px ${alpha(labelColor, 0.6)}` : 'none',
          transition: 'box-shadow 0.2s ease',
        }}
      />

      {/* Label text */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: 13,
            fontWeight: isSelected ? 600 : 400,
            color: colorTokens.neutral[900],
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.label}
        </Typography>

        {item.description && (
          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              color: colorTokens.neutral[500],
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.description}
          </Typography>
        )}
      </Box>

      {/* Selected indicator (when not using checkbox) */}
      {!showCheckbox && isSelected && (
        <CheckIcon
          sx={{
            fontSize: 16,
            color: labelColor,
            flexShrink: 0,
          }}
        />
      )}
    </MenuItem>
  );
};

export default LabelListItemRenderer;

