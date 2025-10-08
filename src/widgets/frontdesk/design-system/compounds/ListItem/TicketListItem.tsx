import React from 'react';
import { Box, Checkbox, ListItem, Typography, Stack } from '@mui/material';
import { Avatar } from '../../primitives/Avatar';
import { AvatarGroup } from '../../primitives/Avatar';
import { Chip } from '../../primitives/Chip';
import { PriorityBadge, PriorityLevel } from '../../primitives/Badge/PriorityBadge';
import { TicketTypeBadge, TicketType } from '../../primitives/Badge/TicketTypeBadge';
import { colorTokens, semanticSpacing } from '../../tokens';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { TagList } from '../../components/TagChip';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SmsIcon from '@mui/icons-material/Sms';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningIcon from '@mui/icons-material/Warning';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

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
  /** Customer info */
  customer?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    channel: 'EMAIL' | 'WHATSAPP' | 'SMS' | 'PUSH';
  };
  /** Message preview (last message content) */
  messagePreview?: string;
  /** Assignee info */
  assignee?: {
    name: string;
    avatarUrl?: string;
  } | null;
  /** Response status */
  responseStatus?: 'awaiting_first_response' | 'in_conversation';
  /** SLA urgency info */
  slaUrgency?: {
    status: 'safe' | 'warning' | 'overdue';
    timeRemaining?: string; // e.g., "2h 30m" or "Overdue 1h"
  };
  /** Message count */
  messageCount?: number;
  /** Category name */
  category?: string | null;
  /** Last message direction */
  lastMessageDirection?: 'INBOUND' | 'OUTBOUND';
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

const getChannelIcon = (channel: 'EMAIL' | 'WHATSAPP' | 'SMS' | 'PUSH') => {
  switch (channel) {
    case 'EMAIL':
      return <EmailIcon sx={{ fontSize: 14 }} />;
    case 'WHATSAPP':
      return <WhatsAppIcon sx={{ fontSize: 14 }} />;
    case 'SMS':
      return <SmsIcon sx={{ fontSize: 14 }} />;
    case 'PUSH':
      return <NotificationsIcon sx={{ fontSize: 14 }} />;
  }
};

const getSlaUrgencyColor = (status: 'safe' | 'warning' | 'overdue') => {
  switch (status) {
    case 'safe':
      return colorTokens.success[600]; // Green
    case 'warning':
      return colorTokens.warning[600]; // Amber
    case 'overdue':
      return colorTokens.error[600]; // Red
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
  tags = [],
  customer,
  messagePreview,
  assignee,
  responseStatus,
  slaUrgency,
  messageCount,
  category,
  lastMessageDirection,
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
        py: 1.75,
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
      <Stack flex={1} spacing={1} sx={{ minWidth: 0 }}>
        {/* Header Row - Ticket Number + Date + Status */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Stack direction="row" alignItems="center" gap={0.75}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: colorTokens.semantic.text.secondary,
                fontSize: 11,
              }}
            >
              {ticketNumber}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: colorTokens.semantic.text.tertiary,
                fontSize: 11,
              }}
            >
              · {updatedAt}
            </Typography>
          </Stack>
          {/* Status Chip */}
          <Chip label={status} color={getStatusColor(status)} variant="soft" size="small" />
        </Stack>

        {/* Customer Row - Channel Icon + Email/Name */}
        <Stack direction="row" alignItems="center" gap={0.75}>
          {customer && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: colorTokens.semantic.text.secondary,
              }}
            >
              {getChannelIcon(customer.channel)}
            </Box>
          )}
          <Typography
            variant="body2"
            sx={{
              fontWeight: isUnread ? 600 : 500,
              color: colorTokens.semantic.text.primary,
              fontSize: 13.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </Typography>
        </Stack>

        {/* Message Preview */}
        {messagePreview && (
          <Typography
            variant="caption"
            sx={{
              color: colorTokens.semantic.text.tertiary,
              fontSize: 12,
              fontStyle: 'italic',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: 1.5,
              pl: 3, // Indent to align with customer name (after icon)
            }}
          >
            {messagePreview}
          </Typography>
        )}
      </Stack>
    </ListItem>
  );
};