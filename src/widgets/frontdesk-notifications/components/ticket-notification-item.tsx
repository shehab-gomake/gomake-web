import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { useGomakeTheme } from '@/hooks/use-gomake-thme';
import { FONT_FAMILY } from '@/utils/font-family';
import { MessageDateTimeComponent } from '@/widgets/messenger/components/message-date-time-component';
import { PriorityBadge } from '@/widgets/frontdesk/design-system/primitives/Badge/PriorityBadge';
import {
  BackendNotification,
  extractTicketPriority,
  extractTicketNumber,
  isNotificationUnread,
} from '@/services/frontdesk/utils/notification-type-mapper';

interface TicketNotificationItemProps {
  notification: BackendNotification;
  onClick: (notification: BackendNotification) => void;
}

const TicketNotificationItem: React.FC<TicketNotificationItemProps> = ({
  notification,
  onClick,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();

  // Check if notification is unread
  const isUnread = isNotificationUnread(notification);

  // Extract ticket info from notification metadata
  const ticketNumber = extractTicketNumber(notification) || 'TICKET-####';
  const ticketPriority = extractTicketPriority(notification);
  const ticketStatus = notification.metadata?.status || notification.metadata?.ticketStatus;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'New':
      case 'OPEN':
        return primaryColor(500);
      case 'In Progress':
      case 'IN_PROGRESS':
      case 'Active':
        return '#FFA500'; // Orange
      case 'On Hold':
      case 'ON_HOLD':
        return '#EF4444'; // Red
      case 'Resolved':
      case 'RESOLVED':
        return '#10B981'; // Green
      case 'Closed':
      case 'CLOSED':
        return neutralColor(500);
      default:
        return primaryColor(500);
    }
  };

  // Map backend priority to PriorityBadge format
  const getPriorityLevel = (): 'Low' | 'Medium' | 'High' | 'Urgent' => {
    if (!ticketPriority) return 'Medium';

    if (ticketPriority === 'LOW') return 'Low';
    if (ticketPriority === 'MEDIUM') return 'Medium';
    if (ticketPriority === 'HIGH') return 'High';
    if (ticketPriority === 'URGENT') return 'Urgent';

    return 'Medium';
  };

  return (
    <Stack
      direction="row"
      gap="12px"
      padding="12px 20px"
      alignItems="flex-start"
      sx={{
        cursor: 'pointer',
        backgroundColor: isUnread ? 'transparent' : neutralColor(50),
        opacity: isUnread ? 1 : 0.7,
        '&:hover': {
          backgroundColor: isUnread ? neutralColor(50) : neutralColor(100),
          opacity: 1,
        },
        borderBottom: `1px solid ${neutralColor(100)}`,
      }}
      onClick={() => onClick(notification)}
    >
      {/* Priority Badge */}
      <Box sx={{ paddingTop: '4px' }}>
        <PriorityBadge
          priority={getPriorityLevel()}
          mode="icon"
          size="sm"
          showBackground
        />
      </Box>

      {/* Content */}
      <Stack flex={1} gap="4px">
        {/* Ticket Number and Status */}
        <Stack direction="row" alignItems="center" gap="8px">
          <Typography
            sx={{
              ...FONT_FAMILY.Lexend(isUnread ? 600 : 500, 13),
              color: neutralColor(600),
            }}
          >
            {ticketNumber}
          </Typography>
          {ticketStatus && (
            <Box
              sx={{
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: `${getStatusColor(ticketStatus)}15`,
              }}
            >
              <Typography
                sx={{
                  ...FONT_FAMILY.Lexend(600, 11),
                  color: getStatusColor(ticketStatus),
                }}
              >
                {ticketStatus}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Title */}
        <Typography
          sx={{
            ...FONT_FAMILY.Lexend(isUnread ? 600 : 500, 14),
            color: primaryColor(900),
          }}
        >
          {notification.title}
        </Typography>

        {/* Message Preview */}
        {notification.body && (
          <Typography
            sx={{
              ...FONT_FAMILY.Lexend(400, 13),
              color: neutralColor(600),
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {notification.body}
          </Typography>
        )}

        {/* Timestamp */}
        <Box sx={{ color: neutralColor(400) }}>
          <MessageDateTimeComponent date={new Date(notification.createdAt)} />
        </Box>
      </Stack>

      {/* Unread Indicator */}
      {isUnread && (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: primaryColor(500),
            flexShrink: 0,
            marginTop: '8px',
          }}
        />
      )}
    </Stack>
  );
};

export { TicketNotificationItem };
