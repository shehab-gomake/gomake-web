import React from 'react';
import { Stack, Box, Typography, Avatar } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ChatIcon from '@mui/icons-material/Chat';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useGomakeTheme } from '@/hooks/use-gomake-thme';
import { FONT_FAMILY } from '@/utils/font-family';
import { MessageDateTimeComponent } from '@/widgets/messenger/components/message-date-time-component';
import {
  BackendNotification,
  extractChannel,
  isNotificationUnread,
} from '@/services/frontdesk/utils/notification-type-mapper';

interface MessageNotificationItemProps {
  notification: BackendNotification;
  onClick: (notification: BackendNotification) => void;
}

const MessageNotificationItem: React.FC<MessageNotificationItemProps> = ({
  notification,
  onClick,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();

  // Check if notification is unread
  const isUnread = isNotificationUnread(notification);

  // Extract channel from notification metadata
  const channel = extractChannel(notification) || 'DM';

  // Extract sender info from metadata
  const senderName = notification.metadata?.senderName || notification.metadata?.userName || 'Unknown User';
  const senderAvatar = notification.metadata?.senderAvatar || notification.metadata?.userAvatar;

  const getChannelIcon = () => {
    switch (channel) {
      case 'EMAIL':
        return <EmailOutlinedIcon sx={{ fontSize: 14, color: '#2e3092' }} />;
      case 'WHATSAPP':
        return <WhatsAppIcon sx={{ fontSize: 14, color: '#25D366' }} />;
      case 'DM':
      default:
        return <ChatIcon sx={{ fontSize: 14, color: '#2e3092' }} />;
    }
  };

  const getChannelColor = () => {
    switch (channel) {
      case 'EMAIL':
        return '#2e3092';
      case 'WHATSAPP':
        return '#25D366';
      case 'DM':
      default:
        return '#2e3092';
    }
  };

  return (
    <Stack
      direction="row"
      gap="12px"
      padding="12px 20px"
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
      {/* Avatar */}
      <Avatar
        src={senderAvatar}
        sx={{
          width: 40,
          height: 40,
          backgroundColor: primaryColor(100),
          color: primaryColor(500),
          ...FONT_FAMILY.Lexend(600, 14),
        }}
      >
        {senderName.charAt(0).toUpperCase()}
      </Avatar>

      {/* Content */}
      <Stack flex={1} gap="4px">
        {/* Sender Name and Channel */}
        <Stack direction="row" alignItems="center" gap="8px">
          <Typography
            sx={{
              ...FONT_FAMILY.Lexend(isUnread ? 600 : 500, 14),
              color: primaryColor(900),
            }}
          >
            {senderName}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: `${getChannelColor()}10`,
            }}
          >
            {getChannelIcon()}
            <Typography
              sx={{
                ...FONT_FAMILY.Lexend(500, 11),
                color: getChannelColor(),
              }}
            >
              {channel}
            </Typography>
          </Box>
        </Stack>

        {/* Message Preview */}
        <Typography
          sx={{
            ...FONT_FAMILY.Lexend(400, 13),
            color: neutralColor(600),
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {notification.body || notification.title}
        </Typography>

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
            marginTop: '16px',
          }}
        />
      )}
    </Stack>
  );
};

export { MessageNotificationItem };
