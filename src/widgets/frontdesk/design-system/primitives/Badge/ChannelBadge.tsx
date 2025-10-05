import React from 'react';
import { Box, Typography } from '@mui/material';
import { colorTokens, radiusTokens } from '../../tokens';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SmsIcon from '@mui/icons-material/Sms';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import CommentIcon from '@mui/icons-material/Comment';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export type CommunicationChannel =
  | 'email'
  | 'whatsapp'
  | 'sms'
  | 'phone'
  | 'private_note'
  | 'internal'
  | 'web_chat';

export type MessageDirection = 'inbound' | 'outbound';

export interface ChannelBadgeProps {
  /** Communication channel */
  channel: CommunicationChannel;
  /** Message direction */
  direction?: MessageDirection;
  /** Display mode */
  mode?: 'icon' | 'label' | 'both';
  /** Size variant */
  size?: 'xs' | 'sm' | 'md';
  /** Show direction arrow */
  showDirection?: boolean;
}

const channelConfig = {
  email: {
    icon: EmailIcon,
    label: 'Email',
    color: colorTokens.semantic.channels.email.main,
    bgColor: colorTokens.semantic.channels.email.bg,
    borderColor: colorTokens.semantic.channels.email.border,
  },
  whatsapp: {
    icon: WhatsAppIcon,
    label: 'WhatsApp',
    color: colorTokens.semantic.channels.whatsapp.main,
    bgColor: colorTokens.semantic.channels.whatsapp.bg,
    borderColor: colorTokens.semantic.channels.whatsapp.border,
  },
  sms: {
    icon: SmsIcon,
    label: 'SMS',
    color: colorTokens.semantic.channels.sms.main,
    bgColor: colorTokens.semantic.channels.sms.bg,
    borderColor: colorTokens.semantic.channels.sms.border,
  },
  phone: {
    icon: PhoneIcon,
    label: 'Phone',
    color: colorTokens.semantic.channels.phone.main,
    bgColor: colorTokens.semantic.channels.phone.bg,
    borderColor: colorTokens.semantic.channels.phone.border,
  },
  private_note: {
    icon: LockIcon,
    label: 'Private Note',
    color: colorTokens.semantic.channels.private_note.main,
    bgColor: colorTokens.semantic.channels.private_note.bg,
    borderColor: colorTokens.semantic.channels.private_note.border,
  },
  internal: {
    icon: CommentIcon,
    label: 'Internal',
    color: colorTokens.semantic.channels.internal.main,
    bgColor: colorTokens.semantic.channels.internal.bg,
    borderColor: colorTokens.semantic.channels.internal.border,
  },
  web_chat: {
    icon: ChatIcon,
    label: 'Web Chat',
    color: colorTokens.semantic.channels.web_chat.main,
    bgColor: colorTokens.semantic.channels.web_chat.bg,
    borderColor: colorTokens.semantic.channels.web_chat.border,
  },
} as const;

const sizeStyles = {
  xs: {
    fontSize: 10,
    iconSize: 12,
    padding: '2px 6px',
    gap: 3,
  },
  sm: {
    fontSize: 11,
    iconSize: 14,
    padding: '3px 8px',
    gap: 4,
  },
  md: {
    fontSize: 12,
    iconSize: 16,
    padding: '4px 10px',
    gap: 5,
  },
} as const;

/**
 * ChannelBadge Component
 *
 * Displays communication channel with icon and optional label.
 * Supports direction indicators for inbound/outbound messages.
 */
export const ChannelBadge: React.FC<ChannelBadgeProps> = ({
  channel,
  direction,
  mode = 'both',
  size = 'sm',
  showDirection = false,
}) => {
  const config = channelConfig[channel];
  const styles = sizeStyles[size];
  const IconComponent = config.icon;

  if (mode === 'icon') {
    return (
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: config.color,
        }}
      >
        <IconComponent sx={{ fontSize: styles.iconSize }} />
      </Box>
    );
  }

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${styles.gap}px`,
        padding: styles.padding,
        backgroundColor: config.bgColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: radiusTokens.sm,
        color: config.color,
        fontSize: styles.fontSize,
        fontWeight: 600,
        lineHeight: 1.2,
      }}
      title={`${config.label}${direction ? ` (${direction})` : ''}`}
    >
      {showDirection && direction === 'inbound' && (
        <ArrowBackIcon sx={{ fontSize: styles.iconSize - 2 }} />
      )}

      {mode !== 'label' && <IconComponent sx={{ fontSize: styles.iconSize }} />}

      {mode === 'label' || mode === 'both' ? (
        <Typography
          component="span"
          sx={{
            fontSize: styles.fontSize,
            fontWeight: 600,
            color: config.color,
            lineHeight: 1,
          }}
        >
          {config.label}
        </Typography>
      ) : null}

      {showDirection && direction === 'outbound' && (
        <ArrowForwardIcon sx={{ fontSize: styles.iconSize - 2 }} />
      )}
    </Box>
  );
};