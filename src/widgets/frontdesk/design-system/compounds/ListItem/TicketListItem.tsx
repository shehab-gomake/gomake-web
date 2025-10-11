import React from 'react';
import { Box, Typography } from '@mui/material';
import { AvatarGroup } from '../../primitives/Avatar';
import { Chip } from '../../primitives/Chip';
import { PriorityBadge, PriorityLevel } from '../../primitives/Badge/PriorityBadge';
import { colorTokens } from '../../tokens';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { TagList } from '../../components/TagChip';

export interface TicketListItemProps {
  /** Ticket ID */
  id: string;
  /** Ticket number (e.g., TICKET-1234) */
  ticketNumber: string;
  /** Ticket title */
  title: string;
  /** Status */
  status: string;
  /** Priority */
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  /** Ticket type */
  type?: 'Bug' | 'Feature' | 'Task' | 'Support';
  /** Last updated timestamp */
  updatedAt: string;
  /** Is selected */
  isSelected?: boolean;
  /** Has unread updates */
  isUnread?: boolean;
  /** Participants */
  participants?: Array<{ userId: string; name: string; avatarUrl?: string }>;
  /** Tags */
  tags?: Array<{ id: string; name: string; displayName: string; color?: string | null; category: string; usageCount: number; isSystem: boolean }>;
  /** Click handler */
  onClick?: (e: React.MouseEvent) => void;
  /** Tag click handler - called when a tag is clicked */
  onTagClick?: (tag: { id: string; name: string; displayName: string; color?: string | null; category: string; usageCount: number; isSystem: boolean }) => void;
}

const getStatusColor = (status: string): 'primary' | 'warning' | 'success' | 'error' | 'neutral' => {
  switch (status) {
    case 'New':
      return 'primary';
    case 'Active':
      return 'warning';
    case 'On Hold':
      return 'error';
    case 'Resolved':
      return 'success';
    case 'Closed':
      return 'neutral';
    default:
      return 'primary';
  }
};

/**
 * TicketListItem Component
 *
 * Redesigned ticket list item with better visual hierarchy:
 * - Priority badge with background (more visible)
 * - Ticket number integrated with title
 * - Status chip prominent on right
 * - Metadata (time, participants, tags) clearly separated
 * - Unread indicator integrated with title
 */
export const TicketListItem: React.FC<TicketListItemProps> = ({
  id,
  ticketNumber,
  title,
  status,
  priority,
  type,
  updatedAt,
  isSelected = false,
  isUnread = false,
  participants = [],
  tags = [],
  onClick,
  onTagClick,
}) => {
  // Build custom content with better layout
  const customContent = (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.5,
        cursor: 'pointer',
        backgroundColor: isSelected ? colorTokens.primary[100] : 'transparent',
        borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
        transition: 'background-color 0.15s ease',
        '&:hover': {
          backgroundColor: isSelected ? colorTokens.primary[100] : colorTokens.primary[50],
        },
      }}
    >
      {/* Left: Priority Badge with background */}
      <Box sx={{ flexShrink: 0 }}>
        <PriorityBadge
          priority={priority as PriorityLevel}
          mode="icon"
          size="sm"
          showBackground
        />
      </Box>

      {/* Center: Title and Metadata */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {/* Title Row: Ticket number + Title + Unread indicator */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              fontWeight: 600,
              color: colorTokens.semantic.text.tertiary,
              flexShrink: 0,
            }}
          >
            {ticketNumber}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: 14,
              fontWeight: isUnread ? 600 : 500,
              color: colorTokens.semantic.text.primary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            {title}
          </Typography>
          {isUnread && (
            <FiberManualRecordIcon
              sx={{
                fontSize: 8,
                color: colorTokens.primary[600],
                flexShrink: 0,
              }}
            />
          )}
        </Box>

        {/* Metadata Row: Time + Participants + Tags */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              color: colorTokens.semantic.text.secondary,
            }}
          >
            {updatedAt}
          </Typography>

          {participants.length > 0 && (
            <>
              <Box sx={{ width: 2, height: 2, borderRadius: '50%', backgroundColor: colorTokens.semantic.text.tertiary }} />
              <AvatarGroup users={participants} size="xs" max={2} />
            </>
          )}

          {tags && tags.length > 0 && (
            <>
              <Box sx={{ width: 2, height: 2, borderRadius: '50%', backgroundColor: colorTokens.semantic.text.tertiary }} />
              <TagList
                tags={tags as any}
                size="small"
                variant="outlined"
                maxDisplay={2}
                onClickTag={onTagClick ? (tag) => {
                  // Stop propagation to prevent ticket selection when clicking tag
                  onTagClick(tag);
                } : undefined}
              />
            </>
          )}
        </Box>
      </Box>

      {/* Right: Status Chip */}
      <Box sx={{ flexShrink: 0 }}>
        <Chip
          label={status}
          color={getStatusColor(status)}
          variant="soft"
          size="small"
          sx={{ fontSize: 11, fontWeight: 600 }}
        />
      </Box>
    </Box>
  );

  return customContent;
};
