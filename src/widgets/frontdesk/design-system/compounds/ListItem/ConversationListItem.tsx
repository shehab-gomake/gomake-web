import React from 'react';
import { Box, ListItem, ListItemButton, Typography, Stack } from '@mui/material';
import { Avatar } from '../../primitives/Avatar';
import { Badge } from '../../primitives/Badge';
import { Chip } from '../../primitives/Chip';
import { colorTokens, semanticSpacing } from '../../tokens';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import StarIcon from '@mui/icons-material/Star';

export interface ConversationListItemProps {
  /** Unique identifier */
  id: string;
  /** Conversation title/subject */
  title: string;
  /** Participant name(s) */
  participants: string[];
  /** Message preview/snippet */
  snippet: string;
  /** Timestamp or formatted date */
  timestamp: string;
  /** Is conversation read */
  isRead?: boolean;
  /** Is conversation selected */
  isSelected?: boolean;
  /** Unread count */
  unreadCount?: number;
  /** Has attachments */
  hasAttachments?: boolean;
  /** Is starred/favorited */
  isStarred?: boolean;
  /** Avatar URL */
  avatarSrc?: string;
  /** Presence status */
  presence?: 'online' | 'away' | 'busy' | 'offline' | null;
  /** Priority indicator */
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  /** Click handler */
  onClick?: () => void;
  /** Status chip */
  status?: { label: string; color: 'primary' | 'success' | 'warning' | 'error' };
  /** Email-style recipient (e.g., "To: email@example.com") */
  recipient?: string;
  /** Email-style subject (e.g., "Subject: Email subject") */
  subject?: string;
  /** Context menu handler - called on right-click */
  onContextMenu?: (event: React.MouseEvent) => void;
}

/**
 * ConversationListItem Component
 *
 * Universal list item for conversations across all providers
 * (Email, Direct Messages, WhatsApp, Tickets)
 */
export const ConversationListItem: React.FC<ConversationListItemProps> = ({
  id,
  title,
  participants,
  snippet,
  timestamp,
  isRead = true,
  isSelected = false,
  unreadCount,
  hasAttachments,
  isStarred,
  avatarSrc,
  presence,
  priority,
  onClick,
  status,
  recipient,
  subject,
  onContextMenu,
}) => {
  const participantName = Array.isArray(participants) 
    ? String(participants[0] || '') 
    : String(participants || '');
  const extraCount = Array.isArray(participants) && participants.length > 1 ? participants.length - 1 : 0;

  // Email-style layout: Show sender, recipient, subject, snippet
  const showEmailLayout = recipient || subject;

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (onContextMenu) {
      onContextMenu(event);
    }
  };

  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={isSelected}
        onClick={onClick}
        onContextMenu={handleContextMenu}
        sx={{
          py: 1.5,
          px: 2,
          borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
          backgroundColor: isSelected
            ? colorTokens.semantic.interactive.selected
            : colorTokens.semantic.background.primary, // Light background (white)
          '&:hover': {
            backgroundColor: isSelected
              ? colorTokens.semantic.interactive.selectedHover
              : colorTokens.semantic.interactive.hover,
          },
          transition: 'background-color 0.15s ease',
        }}
      >
        <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ width: '100%' }}>
          {/* Avatar */}
          <Avatar
            size="md"
            name={participantName}
            src={avatarSrc}
            presence={presence}
            unreadCount={unreadCount}
          />

          {/* Content */}
          <Stack flex={1} spacing={0.5} sx={{ minWidth: 0 }}>
            {showEmailLayout ? (
              // Email-style layout: Sender -> Recipient -> Subject -> Snippet -> Timestamp
              <>
                {/* Sender Row */}
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isRead ? 400 : 600,
                      color: isSelected
                        ? colorTokens.primary[900]
                        : colorTokens.semantic.text.primary,
                      fontSize: 13,
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: colorTokens.semantic.text.secondary,
                      fontSize: 11,
                      ml: 1,
                      flexShrink: 0,
                    }}
                  >
                    {timestamp}
                  </Typography>
                </Stack>

                {/* Recipient Row (if provided) */}
                {recipient && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: colorTokens.semantic.text.secondary,
                      fontSize: 12,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    To: {recipient}
                  </Typography>
                )}

                {/* Subject Row (if provided) */}
                {subject && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isRead ? 400 : 500,
                      color: isSelected
                        ? colorTokens.primary[800]
                        : colorTokens.semantic.text.primary,
                      fontSize: 12,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Subject: {subject}
                  </Typography>
                )}

                {/* Message Snippet Row */}
                <Typography
                  variant="body2"
                  sx={{
                    color: colorTokens.semantic.text.secondary,
                    fontSize: 12,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {snippet}
                </Typography>
              </>
            ) : (
              // Default layout: Title/Subject -> Participants -> Snippet/Timestamp
              <>
                {/* Title/Subject Row */}
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isRead ? 400 : 600,
                      color: isSelected
                        ? colorTokens.primary[900]
                        : colorTokens.semantic.text.primary,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                      fontSize: 13,
                    }}
                  >
                    {title}
                  </Typography>

                  {/* Right indicators */}
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ ml: 1 }}>
                    {hasAttachments && (
                      <AttachFileIcon
                        sx={{
                          fontSize: 14,
                          color: colorTokens.semantic.text.secondary,
                        }}
                      />
                    )}
                    {isStarred && (
                      <StarIcon
                        sx={{
                          fontSize: 14,
                          color: colorTokens.warning[600],
                        }}
                      />
                    )}
                    {status && (
                      <Chip
                        label={status.label}
                        color={status.color}
                        variant="soft"
                        size="small"
                      />
                    )}
                  </Stack>
                </Stack>

                {/* Participants Row */}
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isRead ? 400 : 600,
                      color: isSelected
                        ? colorTokens.primary[800]
                        : colorTokens.semantic.text.primary,
                      fontSize: 13,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {participantName}
                  </Typography>
                  {extraCount > 0 && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: colorTokens.semantic.text.secondary,
                        fontSize: 11,
                      }}
                    >
                      +{extraCount}
                    </Typography>
                  )}
                </Stack>

                {/* Snippet and Timestamp Row */}
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography
                    variant="body2"
                    sx={{
                      color: colorTokens.semantic.text.secondary,
                      fontSize: 12,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                    }}
                  >
                    {snippet}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: colorTokens.semantic.text.secondary,
                      fontSize: 11,
                      ml: 1,
                      flexShrink: 0,
                    }}
                  >
                    {timestamp}
                  </Typography>
                </Stack>
              </>
            )}
          </Stack>
        </Stack>
      </ListItemButton>
    </ListItem>
  );
};