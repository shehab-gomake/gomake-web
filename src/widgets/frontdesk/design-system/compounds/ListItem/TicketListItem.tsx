import React from 'react';
import { Box, Stack } from '@mui/material';
import { ActionMenuItem } from '../../primitives/MenuItem';
import { AvatarGroup } from '../../primitives/Avatar';
import { Chip } from '../../primitives/Chip';
import { PriorityBadge, PriorityLevel } from '../../primitives/Badge/PriorityBadge';
import { colorTokens } from '../../tokens';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { TagList } from '../../components/TagChip';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';

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
  /** Is checked (for bulk actions) */
  isChecked?: boolean;
  /** Has unread updates */
  isUnread?: boolean;
  /** Participants */
  participants?: Array<{ userId: string; name: string; avatarUrl?: string }>;
  /** Tags */
  tags?: Array<{ id: string; name: string; displayName: string; color?: string | null; category: string; usageCount: number; isSystem: boolean }>;
  /** Click handler */
  onClick?: (e: React.MouseEvent) => void;
  /** Check handler */
  onCheck?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
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
 * Specialized list item for ticket/task displays using ActionMenuItem.
 * Uses QuickActionMenu-style design: px: 2, py: 1.5, gap: 1.5
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
  isChecked = false,
  isUnread = false,
  participants = [],
  tags = [],
  onClick,
  onCheck,
}) => {
  // Build secondary text: ticket number + date
  const secondaryText = `${ticketNumber} · ${updatedAt}`;

  // Build icon: Priority badge icon
  const icon = <PriorityBadge priority={priority as PriorityLevel} mode="icon" size="xs" />;

  // Build right element: Status chip + participants + tags + unread indicator
  const rightElement = (
    <Stack direction="row" alignItems="center" gap={1}>
      {/* Status Chip */}
      <Chip
        label={status}
        color={getStatusColor(status)}
        variant="soft"
        size="small"
        sx={{ fontSize: 11 }}
      />

      {/* Participants */}
      {participants.length > 0 && (
        <AvatarGroup users={participants} size="xs" max={2} />
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <TagList
          tags={tags as any}
          size="small"
          variant="outlined"
          maxDisplay={2}
        />
      )}

      {/* Unread indicator */}
      {isUnread && (
        <FiberManualRecordIcon
          sx={{
            fontSize: 10,
            color: colorTokens.primary[600],
          }}
        />
      )}
    </Stack>
  );

  return (
    <ActionMenuItem
      id={id}
      label={title}
      icon={icon}
      secondaryText={secondaryText}
      rightElement={rightElement}
      isSelected={isSelected}
      isChecked={isChecked}
      onClick={onClick}
      onCheck={onCheck}
      sx={{
        borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
        borderRadius: 0, // Remove border radius for list items
        alignItems: 'flex-start', // Align content to top
      }}
    />
  );
};
