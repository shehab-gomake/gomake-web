import React from 'react';
import { Box, Avatar, Typography, IconButton, Stack } from '@mui/material';
import { colorTokens, radiusTokens, semanticShadows } from '../../tokens';
import { ChannelBadge, CommunicationChannel, MessageDirection } from '../../primitives/Badge/ChannelBadge';
import { MessageStatusIndicator, MessageStatus } from '../../primitives/Badge/MessageStatusIndicator';
import { AttachmentCard } from '../AttachmentCard';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReplyIcon from '@mui/icons-material/Reply';
import { format, parseISO } from 'date-fns';

export interface MessageCardProps {
  /** Message ID */
  id: string;

  /** Communication channel */
  channel: CommunicationChannel;

  /** Message direction */
  direction: MessageDirection;

  /** Delivery/read status */
  status?: MessageStatus;

  /** Message author */
  author: {
    name: string;
    email?: string;
    avatarUrl?: string;
  };

  /** Message recipient (for outbound messages) */
  recipient?: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  };

  /** Message content */
  content: string;

  /** Timestamp */
  timestamp: string;

  /** Attachments */
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    mimeType?: string;
    url?: string;
    previewUrl?: string;
    uploadedAt?: string;
  }>;

  /** Is this a private/internal note */
  isPrivate?: boolean;

  /** Has the message been edited */
  isEdited?: boolean;

  /** Callback for reply action */
  onReply?: () => void;

  /** Callback for more actions */
  onMoreActions?: () => void;
}

const formatTimestamp = (timestamp: string): string => {
  const date = parseISO(timestamp);
  return format(date, 'MMM d, yyyy h:mm a');
};

const getChannelColors = (channel: CommunicationChannel) => {
  return colorTokens.semantic.channels[channel];
};

/**
 * MessageCard Component
 *
 * Unified message display for multi-channel ticket communication.
 * Supports email, WhatsApp, SMS, phone, private notes, and internal messages.
 * Visual design adapts based on channel type and message direction.
 */
export const MessageCard: React.FC<MessageCardProps> = ({
  id,
  channel,
  direction,
  status,
  author,
  recipient,
  content,
  timestamp,
  attachments,
  isPrivate = false,
  isEdited = false,
  onReply,
  onMoreActions,
}) => {
  const channelColors = getChannelColors(channel);
  const isOutbound = direction === 'outbound';
  const isPrivateNote = channel === 'private_note';

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 3,
        flexDirection: isOutbound ? 'row-reverse' : 'row',
      }}
    >
      {/* Avatar */}
      <Avatar
        src={author.avatarUrl}
        sx={{
          width: 36,
          height: 36,
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        {author.name.charAt(0).toUpperCase()}
      </Avatar>

      {/* Message Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 0.75,
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <ChannelBadge channel={channel} direction={direction} mode="both" size="sm" />

            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
              {author.name}
            </Typography>

            {author.email && (
              <Typography
                variant="caption"
                sx={{ color: colorTokens.semantic.text.secondary, fontSize: 11 }}
              >
                {author.email}
              </Typography>
            )}

            {recipient && (
              <>
                <Typography variant="caption" sx={{ color: colorTokens.semantic.text.tertiary }}>
                  →
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: colorTokens.semantic.text.secondary, fontSize: 11 }}
                >
                  {recipient.name || recipient.email || recipient.phoneNumber}
                </Typography>
              </>
            )}

            {status && <MessageStatusIndicator status={status} size="sm" />}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              variant="caption"
              sx={{ color: colorTokens.semantic.text.secondary, fontSize: 11, whiteSpace: 'nowrap' }}
            >
              {formatTimestamp(timestamp)}
              {isEdited && ' (edited)'}
            </Typography>

            {onReply && (
              <IconButton size="small" onClick={onReply} sx={{ width: 24, height: 24 }}>
                <ReplyIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}

            {onMoreActions && (
              <IconButton size="small" onClick={onMoreActions} sx={{ width: 24, height: 24 }}>
                <MoreVertIcon sx={{ fontSize: 16 }}/>
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Message Body */}
        <Box
          sx={{
            p: 2,
            backgroundColor: isPrivateNote ? channelColors.bg : colorTokens.semantic.background.primary,
            border: `1px solid ${channelColors.border}`,
            borderLeftWidth: isPrivateNote ? '4px' : '3px',
            borderLeftColor: channelColors.main,
            borderRadius: radiusTokens.md,
            ...(isPrivateNote && {
              boxShadow: `0 0 0 1px ${channelColors.border}`,
            }),
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: 14,
              color: colorTokens.semantic.text.primary,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              lineHeight: 1.6,
            }}
          >
            {content}
          </Typography>

          {/* Attachments */}
          {attachments && attachments.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {attachments.map((attachment) => (
                <AttachmentCard
                  key={attachment.id}
                  name={attachment.name}
                  size={attachment.size}
                  mimeType={attachment.mimeType}
                  previewUrl={attachment.previewUrl}
                  url={attachment.url}
                  uploadedAt={attachment.uploadedAt}
                  onPreview={() => attachment.url && window.open(attachment.url, '_blank')}
                  onDownload={() => attachment.url && window.open(attachment.url, '_blank')}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};