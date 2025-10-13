/**
 * Review Queue Component
 *
 * Displays conversations that don't have tickets yet (conversation.needs.review event).
 * Agents can create tickets from these conversations.
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Avatar,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SmsIcon from '@mui/icons-material/Sms';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { ConversationNeedsReviewPayload, ChannelType } from '../types/api.types';
import { colorTokens } from '@/widgets/frontdesk/design-system';

interface ReviewQueueProps {
  conversations: ConversationNeedsReviewPayload[];
  onCreateTicket: (conversation: ConversationNeedsReviewPayload) => Promise<void>;
  onDismiss: (conversation: ConversationNeedsReviewPayload) => void;
}

// Channel icon mapping
const getChannelIcon = (channel: ChannelType) => {
  switch (channel) {
    case 'EMAIL':
      return <EmailIcon fontSize="small" />;
    case 'WHATSAPP':
      return <WhatsAppIcon fontSize="small" />;
    case 'SMS':
      return <SmsIcon fontSize="small" />;
    case 'PUSH':
      return <NotificationsIcon fontSize="small" />;
    default:
      return <EmailIcon fontSize="small" />;
  }
};

// Channel color mapping
const getChannelColor = (channel: ChannelType) => {
  switch (channel) {
    case 'EMAIL':
      return '#4285F4'; // Gmail blue
    case 'WHATSAPP':
      return '#25D366'; // WhatsApp green
    case 'SMS':
      return '#FF9800'; // Orange
    case 'PUSH':
      return '#9C27B0'; // Purple
    default:
      return '#4285F4';
  }
};

export const ReviewQueue: React.FC<ReviewQueueProps> = ({
  conversations,
  onCreateTicket,
  onDismiss,
}) => {
  const theme = useTheme();
  const [creatingTicketForId, setCreatingTicketForId] = useState<string | null>(null);

  const handleCreateTicket = async (conversation: ConversationNeedsReviewPayload) => {
    // Use metadata.threadId or metadata.messageId as unique ID
    const conversationId = conversation.metadata?.threadId || conversation.metadata?.messageId || '';

    setCreatingTicketForId(conversationId);
    try {
      await onCreateTicket(conversation);
    } catch (error) {
      console.error('Failed to create ticket:', error);
    } finally {
      setCreatingTicketForId(null);
    }
  };

  if (conversations.length === 0) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: 'center',
          color: colorTokens.semantic.text.secondary,
        }}
      >
        <Typography variant="body2">
          No conversations awaiting review
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 600,
          fontSize: '1rem',
          color: colorTokens.semantic.text.primary,
        }}
      >
        Conversations Awaiting Review ({conversations.length})
      </Typography>

      {conversations.map((conv, index) => {
        const conversationId = conv.metadata?.threadId || conv.metadata?.messageId || `conv-${index}`;
        const isCreating = creatingTicketForId === conversationId;

        return (
          <Paper
            key={conversationId}
            elevation={0}
            sx={{
              mb: 1.5,
              p: 2,
              border: `1px solid ${colorTokens.semantic.border.default}`,
              borderRadius: 1,
              backgroundColor: theme.palette.background.paper,
              '&:hover': {
                backgroundColor: colorTokens.semantic.background.secondary,
                borderColor: colorTokens.semantic.border.focus,
              },
            }}
          >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                {/* Channel Icon */}
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: getChannelColor(conv.channel),
                  }}
                >
                  {getChannelIcon(conv.channel)}
                </Avatar>

                {/* Channel and Identifier */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: colorTokens.semantic.text.primary,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {conv.identifier}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary }}>
                    {conv.channel} · {formatDistanceToNow(parseISO(conv.timestamp), { addSuffix: true })}
                  </Typography>
                </Box>
              </Box>

              {/* Dismiss Button */}
              <IconButton
                size="small"
                onClick={() => onDismiss(conv)}
                sx={{ flexShrink: 0 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Subject (Email only) */}
            {conv.subject && (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  color: colorTokens.semantic.text.primary,
                }}
              >
                {conv.subject}
              </Typography>
            )}

            {/* Preview */}
            <Typography
              variant="body2"
              sx={{
                color: colorTokens.semantic.text.secondary,
                mb: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.5,
              }}
            >
              {conv.preview}
            </Typography>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleCreateTicket(conv)}
                disabled={isCreating}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {isCreating ? 'Creating...' : 'Create Ticket'}
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => onDismiss(conv)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Dismiss
              </Button>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};
