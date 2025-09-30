import React from 'react';
import { Box, Checkbox, ListItem, Typography, Stack } from '@mui/material';
import { Avatar } from '../../primitives/Avatar';
import { AvatarGroup } from '../../primitives/Avatar';
import { Chip } from '../../primitives/Chip';
import { PriorityBadge, PriorityLevel } from '../../primitives/Badge/PriorityBadge';
import { TicketTypeBadge, TicketType } from '../../primitives/Badge/TicketTypeBadge';
import { colorTokens, semanticSpacing } from '../../tokens';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

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
  /** Click handler */
  onClick?: (e: React.MouseEvent) => void;
  /** Check handler */
  onCheck?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
}

const getStatusColor = (status: string): 'primary' | 'warning' | 'success' | 'error' => {
  switch (status) {
    case 'To Do':
      return 'primary';
    case 'In Progress':
      return 'warning';
    case 'Done':
      return 'success';
    case 'Blocked':
      return 'error';
    default:
      return 'primary';
  }
};

/**
 * TicketListItem Component
 *
 * Specialized list item for ticket/task displays.
 * Improved with professional priority indicators and better visual hierarchy.
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
  onClick,
  onCheck,
}) => {
  return (
    <ListItem
      disablePadding
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        py: 1.25,
        px: 2,
        borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
        backgroundColor: isSelected
          ? colorTokens.semantic.interactive.selected
          : 'transparent',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
        '&:hover': {
          backgroundColor: isSelected
            ? colorTokens.semantic.interactive.selectedHover
            : colorTokens.semantic.interactive.hover,
        },
      }}
    >
      {/* Checkbox */}
      {onCheck && (
        <Checkbox
          size="small"
          checked={isChecked}
          onChange={(e) => {
            e.stopPropagation();
            onCheck(e.target.checked, e);
          }}
          onClick={(e) => e.stopPropagation()}
          sx={{ p: 0, mt: 0.25 }}
        />
      )}

      {/* Content */}
      <Stack flex={1} spacing={0.75} sx={{ minWidth: 0 }}>
        {/* Header Row - Ticket Number + Date + Status */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 500,
                color: colorTokens.semantic.text.secondary,
                fontSize: 10.5,
              }}
            >
              {ticketNumber}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: colorTokens.semantic.text.tertiary,
                fontSize: 10.5,
              }}
            >
              · {updatedAt}
            </Typography>
          </Stack>
          <Chip label={status} color={getStatusColor(status)} variant="soft" size="small" />
        </Stack>

        {/* Title Row with Type Icon */}
        <Stack direction="row" alignItems="center" gap={0.75}>
          {type && <TicketTypeBadge type={type} size="xs" />}
          <Typography
            variant="body2"
            sx={{
              fontWeight: isUnread ? 600 : 500,
              color: colorTokens.semantic.text.primary,
              fontSize: 13,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            {title}
          </Typography>
        </Stack>

        {/* Footer Row - Priority + Participants + Unread */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Stack direction="row" alignItems="center" gap={1}>
            {/* Priority Badge */}
            <PriorityBadge priority={priority as PriorityLevel} mode="icon" size="xs" />

            {/* Participants - Show only if present */}
            {participants.length > 0 && (
              <AvatarGroup users={participants} size="xs" max={2} />
            )}
          </Stack>

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
      </Stack>
    </ListItem>
  );
};