import React from 'react';
import { Stack, Box, Typography, Avatar } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ChatIcon from '@mui/icons-material/Chat';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useGomakeTheme } from '@/hooks/use-gomake-thme';
import { FONT_FAMILY } from '@/utils/font-family';
import { MessageDateTimeComponent } from '@/widgets/messenger/components/message-date-time-component';
import { IFrontdeskNotification } from '@/store/frontdesk/atoms/notifications.atoms';

interface MessageNotificationItemProps {
  notification: IFrontdeskNotification;
  onClick: (notification: IFrontdeskNotification) => void;
}

const MessageNotificationItem: React.FC<MessageNotificationItemProps> = ({
  notification,
  onClick,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();

  const getChannelIcon = () => {
    switch (notification.metadata.channel) {
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
    switch (notification.metadata.channel) {
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
        '&:hover': {
          backgroundColor: neutralColor(50),
        },
        borderBottom: `1px solid ${neutralColor(100)}`,
      }}
      onClick={() => onClick(notification)}
    >
      {/* Avatar */}
      <Avatar
        src={notification.metadata.senderAvatar}
        sx={{
          width: 40,
          height: 40,
          backgroundColor: primaryColor(100),
          color: primaryColor(500),
          ...FONT_FAMILY.Lexend(600, 14),
        }}
      >
        {notification.metadata.senderName?.charAt(0).toUpperCase() || 'U'}
      </Avatar>

      {/* Content */}
      <Stack flex={1} gap="4px">
        {/* Sender Name and Channel */}
        <Stack direction="row" alignItems="center" gap="8px">
          <Typography
            sx={{
              ...FONT_FAMILY.Lexend(600, 14),
              color: primaryColor(900),
            }}
          >
            {notification.metadata.senderName || 'Unknown User'}
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
              {notification.metadata.channel}
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
            marginTop: '16px',
          }}
        />
      )}
    </Stack>
  );
};

export { MessageNotificationItem };
