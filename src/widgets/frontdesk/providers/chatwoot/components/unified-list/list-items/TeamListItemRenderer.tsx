/**
 * TeamListItemRenderer Component
 *
 * Specialized list item renderer for teams with:
 * - Team icon
 * - Description secondary text
 * - Member count badge
 *
 * @module unified-list/list-items/TeamListItemRenderer
 */

import React from 'react';
import { Box, Typography, MenuItem, alpha, Chip } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckIcon from '@mui/icons-material/Check';
import { colorTokens } from '@/widgets/frontdesk/design-system';
import type { TeamListItem } from '../types';

export interface TeamListItemRendererProps {
  item: TeamListItem;
  isSelected: boolean;
  onClick: () => void;
  /** Show member count */
  showMemberCount?: boolean;
}

export const TeamListItemRenderer: React.FC<TeamListItemRendererProps> = ({
  item,
  isSelected,
  onClick,
  showMemberCount = true,
}) => {
  return (
    <MenuItem
      onClick={onClick}
      disabled={item.disabled}
      sx={{
        px: 2,
        py: 1,
        gap: 1.5,
        backgroundColor: isSelected ? alpha(colorTokens.primary[600], 0.08) : 'transparent',
        '&:hover': {
          backgroundColor: isSelected
            ? alpha(colorTokens.primary[600], 0.12)
            : colorTokens.neutral[50],
        },
        '&.Mui-disabled': {
          opacity: 0.5,
        },
      }}
    >
      {/* Team Icon */}
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '6px',
          backgroundColor: isSelected ? colorTokens.primary[100] : colorTokens.neutral[100],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <GroupsIcon
          sx={{
            fontSize: 16,
            color: isSelected ? colorTokens.primary[600] : colorTokens.neutral[500],
          }}
        />
      </Box>

      {/* Name and description */}
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

      {/* Member count */}
      {showMemberCount && item.memberCount !== undefined && item.memberCount > 0 && (
        <Chip
          label={item.memberCount}
          size="small"
          sx={{
            height: 20,
            minWidth: 20,
            fontSize: 11,
            fontWeight: 600,
            backgroundColor: colorTokens.neutral[100],
            color: colorTokens.neutral[600],
            '& .MuiChip-label': {
              px: 0.75,
            },
          }}
        />
      )}

      {/* Selected indicator */}
      {isSelected && (
        <CheckIcon
          sx={{
            fontSize: 16,
            color: colorTokens.primary[600],
            flexShrink: 0,
          }}
        />
      )}
    </MenuItem>
  );
};

export default TeamListItemRenderer;

