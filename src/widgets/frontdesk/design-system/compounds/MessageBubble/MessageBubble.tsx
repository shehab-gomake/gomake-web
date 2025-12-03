import React from 'react';
import { Box, Typography, Stack, SxProps, Theme } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { colorTokens, radiusTokens, semanticTypography } from '../../tokens';
import { messageTypeColors, MessageType } from '../../tokens/chatwoot.tokens';
import { transitionTokens, layoutTokens } from '../../tokens/layout.tokens';

export interface MessageBubbleProps {
  /** Message type */
  type: MessageType;
  /** Message content */
  children: React.ReactNode;
  /** Timestamp */
  timestamp?: string;
  /** Sender name */
  senderName?: string;
  /** Whether to show sender info */
  showSender?: boolean;
  /** Whether message is consecutive from same sender */
  isConsecutive?: boolean;
  /** Custom styles */
  sx?: SxProps<Theme>;
}

/**
 * MessageBubble Component
 *
 * Chat message container with different styles for incoming/outgoing/private notes
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({
  type,
  children,
  timestamp,
  senderName,
  showSender = true,
  isConsecutive = false,
  sx = {},
}) => {
  const colors = messageTypeColors[type] || messageTypeColors.incoming;
  const isOutgoing = type === 'outgoing';
  const isPrivateNote = type === 'private_note';
  const isActivity = type === 'activity';

  if (isActivity) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          py: 1,
          ...sx,
        }}
      >
        <Typography
          sx={{
            ...semanticTypography.caption.medium,
            color: colors.text,
            fontStyle: 'italic',
            px: 2,
            py: 0.5,
            backgroundColor: colorTokens.neutral[100],
            borderRadius: radiusTokens.full,
          }}
        >
          {children}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isOutgoing ? 'flex-end' : 'flex-start',
        mb: isConsecutive ? 0.5 : 1.5,
        ...sx,
      }}
    >
      {/* Sender name (for incoming messages) */}
      {showSender && !isConsecutive && senderName && !isOutgoing && (
        <Typography
          sx={{
            ...semanticTypography.caption.small,
            color: colorTokens.semantic.text.secondary,
            mb: 0.5,
            ml: 1,
          }}
        >
          {senderName}
        </Typography>
      )}

      {/* Message bubble */}
      <Box
        sx={{
          position: 'relative',
          maxWidth: layoutTokens.messageBubble.maxWidth,
          minWidth: layoutTokens.messageBubble.minWidth,
          backgroundColor: colors.bg,
          color: colors.text,
          border: `1px solid ${colors.border}`,
          borderRadius: radiusTokens.lg,
          px: layoutTokens.messageBubble.padding.x / 8,
          py: layoutTokens.messageBubble.padding.y / 8,
          transition: transitionTokens.presets.colors,
          // Bubble tail positioning
          ...(isOutgoing
            ? {
                borderBottomRightRadius: isConsecutive ? radiusTokens.lg : radiusTokens.xs,
              }
            : {
                borderBottomLeftRadius: isConsecutive ? radiusTokens.lg : radiusTokens.xs,
              }),
        }}
      >
        {/* Private note indicator */}
        {isPrivateNote && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{
              mb: 0.5,
              color: 'indicator' in colors ? colors.indicator : colors.meta,
            }}
          >
            <LockIcon sx={{ fontSize: 12 }} />
            <Typography
              sx={{
                ...semanticTypography.caption.small,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Private Note
            </Typography>
          </Stack>
        )}

        {/* Message content */}
        <Box
          sx={{
            ...semanticTypography.body.medium,
            wordBreak: 'break-word',
            '& p': { m: 0 },
            '& a': {
              color: isOutgoing ? colors.text : colorTokens.semantic.text.link,
              textDecoration: 'underline',
            },
          }}
        >
          {children}
        </Box>

        {/* Timestamp */}
        {timestamp && (
          <Typography
            sx={{
              ...semanticTypography.caption.small,
              color: colors.meta,
              mt: 0.5,
              textAlign: isOutgoing ? 'right' : 'left',
            }}
          >
            {timestamp}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

