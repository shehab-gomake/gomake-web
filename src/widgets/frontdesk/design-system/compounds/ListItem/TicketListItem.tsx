import React from 'react';
import { Box, Checkbox, ListItem, Typography, Stack } from '@mui/material';
import { Avatar } from '../../primitives/Avatar';
import { AvatarGroup } from '../../primitives/Avatar';
import { Chip } from '../../primitives/Chip';
import { colorTokens, semanticSpacing } from '../../tokens';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

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

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'Urgent':
    case 'High':
      return <SentimentVeryDissatisfiedIcon fontSize="small" sx={{ color: colorTokens.error[600] }} />;
    case 'Medium':
      return <SentimentNeutralIcon fontSize="small" sx={{ color: colorTokens.warning[600] }} />;
    case 'Low':
      return <SentimentSatisfiedAltIcon fontSize="small" sx={{ color: colorTokens.success[600] }} />;
    default:
      return null;
  }
};

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
 * Specialized list item for ticket/task displays
 */
export const TicketListItem: React.FC<TicketListItemProps> = ({
  id,
  ticketNumber,
  title,
  status,
  priority,
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
        py: semanticSpacing.listItem.default / 8,
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
          sx={{ p: 0, mt: 0.5 }}
        />
      )}

      {/* Content */}
      <Stack flex={1} spacing={0.5} sx={{ minWidth: 0 }}>
        {/* Header Row - Ticket Number + Status */}
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 500,
              color: colorTokens.semantic.text.secondary,
              fontSize: 11,
            }}
          >
            {ticketNumber}
          </Typography>
          <Chip label={status} color={getStatusColor(status)} variant="soft" size="small" />
        </Stack>

        {/* Title */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: isUnread ? 600 : 500,
            color: colorTokens.semantic.text.primary,
            fontSize: 13,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </Typography>

        {/* Footer Row - Priority + Participants + Date */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Stack direction="row" alignItems="center" gap={1}>
            {/* Priority Icon */}
            {getPriorityIcon(priority)}

            {/* Participants */}
            {participants.length > 0 && (
              <AvatarGroup users={participants} size="xs" max={3} />
            )}

            {/* Date */}
            <Typography
              variant="caption"
              sx={{
                color: colorTokens.semantic.text.secondary,
                fontSize: 11,
              }}
            >
              {updatedAt}
            </Typography>
          </Stack>

          {/* Unread indicator */}
          {isUnread && (
            <FiberManualRecordIcon
              sx={{
                fontSize: 8,
                color: colorTokens.error[600],
              }}
            />
          )}
        </Stack>
      </Stack>
    </ListItem>
  );
};