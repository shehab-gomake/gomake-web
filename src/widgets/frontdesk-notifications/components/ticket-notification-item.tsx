import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { useGomakeTheme } from '@/hooks/use-gomake-thme';
import { FONT_FAMILY } from '@/utils/font-family';
import { MessageDateTimeComponent } from '@/widgets/messenger/components/message-date-time-component';
import { PriorityBadge } from '@/widgets/frontdesk/design-system/primitives/Badge/PriorityBadge';
import { IFrontdeskNotification, NotificationPriority } from '@/store/frontdesk/atoms/notifications.atoms';

interface TicketNotificationItemProps {
  notification: IFrontdeskNotification;
  onClick: (notification: IFrontdeskNotification) => void;
}

const TicketNotificationItem: React.FC<TicketNotificationItemProps> = ({
  notification,
  onClick,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'New':
        return primaryColor(500);
      case 'In Progress':
      case 'Active':
        return '#FFA500'; // Orange
      case 'On Hold':
        return '#EF4444'; // Red
      case 'Resolved':
        return '#10B981'; // Green
      case 'Closed':
        return neutralColor(500);
      default:
        return primaryColor(500);
    }
  };

  // Map priority to PriorityBadge format
  const getPriorityLevel = (): 'Low' | 'Medium' | 'High' | 'Urgent' => {
    const priority = notification.metadata.priority;
    if (priority === 'LOW') return 'Low';
    if (priority === 'MEDIUM') return 'Medium';
    if (priority === 'HIGH') return 'High';
    if (priority === 'URGENT') return 'Urgent';
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
        '&:hover': {
          backgroundColor: neutralColor(50),
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
              ...FONT_FAMILY.Lexend(600, 13),
              color: neutralColor(600),
            }}
          >
            {notification.metadata.ticketNumber}
          </Typography>
          {notification.metadata.status && (
            <Box
              sx={{
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: `${getStatusColor(notification.metadata.status)}15`,
              }}
            >
              <Typography
                sx={{
                  ...FONT_FAMILY.Lexend(600, 11),
                  color: getStatusColor(notification.metadata.status),
                }}
              >
                {notification.metadata.status}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Title */}
        <Typography
          sx={{
            ...FONT_FAMILY.Lexend(600, 14),
            color: primaryColor(900),
          }}
        >
          {notification.title}
        </Typography>

        {/* Message Preview */}
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
          {notification.message}
        </Typography>

        {/* Timestamp */}
        <Box sx={{ color: neutralColor(400) }}>
          <MessageDateTimeComponent date={notification.timestamp} />
        </Box>
      </Stack>

      {/* Unread Indicator */}
      {!notification.isRead && (
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
