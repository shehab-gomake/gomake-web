/**
 * AgentListItemRenderer Component
 *
 * Specialized list item renderer for agents with:
 * - Avatar with initials fallback
 * - Availability status indicator
 * - Role/email secondary text
 *
 * @module unified-list/list-items/AgentListItemRenderer
 */

import React from 'react';
import { Box, Avatar, Typography, MenuItem, alpha } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { colorTokens } from '@/widgets/frontdesk/design-system';
import type { AgentListItem } from '../types';

export interface AgentListItemRendererProps {
  item: AgentListItem;
  isSelected: boolean;
  onClick: () => void;
  /** Show availability indicator */
  showAvailability?: boolean;
  /** Highlight if current user */
  highlightCurrentUser?: boolean;
}

const AVAILABILITY_COLORS: Record<string, string> = {
  online: '#22c55e',
  busy: '#f59e0b',
  away: '#eab308',
  offline: '#6b7280',
};

/**
 * Generate initials from name
 */
const getInitials = (name?: string, email?: string): string => {
  if (name) {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  if (email) {
    return email.substring(0, 2).toUpperCase();
  }
  return '??';
};

/**
 * Generate consistent color from string
 */
const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#3B82F6', // blue
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#F59E0B', // amber
    '#10B981', // emerald
    '#06B6D4', // cyan
    '#6366F1', // indigo
    '#F97316', // orange
  ];
  return colors[Math.abs(hash) % colors.length];
};

export const AgentListItemRenderer: React.FC<AgentListItemRendererProps> = ({
  item,
  isSelected,
  onClick,
  showAvailability = true,
  highlightCurrentUser = true,
}) => {
  const initials = getInitials(item.label, item.email);
  const avatarColor = stringToColor(item.label || item.email || String(item.id));
  const availabilityColor = item.availability ? AVAILABILITY_COLORS[item.availability] : undefined;

  return (
    <MenuItem
      onClick={onClick}
      disabled={item.disabled}
      sx={{
        px: 2,
        py: 1,
        gap: 1.5,
        backgroundColor: isSelected ? alpha(colorTokens.primary[600], 0.08) : 'transparent',
        borderLeft: item.isCurrentUser && highlightCurrentUser 
          ? `3px solid ${colorTokens.primary[500]}`
          : '3px solid transparent',
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
      {/* Avatar */}
      <Avatar
        src={item.avatarUrl}
        sx={{
          width: 28,
          height: 28,
          fontSize: '0.7rem',
          fontWeight: 600,
          backgroundColor: avatarColor,
          color: '#ffffff',
        }}
      >
        {initials}
      </Avatar>

      {/* Name and availability */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: 13,
              fontWeight: isSelected || item.isCurrentUser ? 600 : 400,
              color: colorTokens.neutral[900],
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.label}
            {item.isCurrentUser && (
              <Typography
                component="span"
                sx={{
                  fontSize: 11,
                  color: colorTokens.neutral[500],
                  ml: 0.5,
                }}
              >
                (You)
              </Typography>
            )}
          </Typography>

          {/* Availability indicator */}
          {showAvailability && item.availability && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: availabilityColor,
                flexShrink: 0,
              }}
              title={item.availability}
            />
          )}
        </Box>

        {/* Secondary text (email or role) */}
        {(item.email || item.role) && (
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
            {item.role || item.email}
          </Typography>
        )}
      </Box>

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

export default AgentListItemRenderer;

