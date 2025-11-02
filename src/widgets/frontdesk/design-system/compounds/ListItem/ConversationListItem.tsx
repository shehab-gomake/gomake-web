import React, { useCallback, useMemo } from 'react';
import { Box, ListItem, ListItemButton, Typography, Stack, Tooltip, type SxProps, type Theme } from '@mui/material';
import { Avatar } from '../../primitives/Avatar';
import { colorTokens } from '../../tokens';
import { InboxIcon } from '@/widgets/frontdesk/providers/chatwoot/utils/inbox-icons';
import { ConversationPriorityIcon } from '@/widgets/frontdesk/providers/chatwoot/components/conversation-priority-icon';
import { ConversationSLALabel } from '@/widgets/frontdesk/providers/chatwoot/components/conversation-sla-label';
import { ConversationLabels, ConversationLabel } from '@/widgets/frontdesk/providers/chatwoot/components/conversation-labels';
import { PriorityLevel, PresenceStatus } from '../../types';

// ============================================================================
// Type Definitions
// ============================================================================

export interface AssigneeInfo {
  name?: string;
  avatarSrc?: string;
  presence?: PresenceStatus;
}

export interface SLAInfo {
  id?: number | string;
  firstResponseThreshold?: number;
  nextResponseThreshold?: number;
  resolutionThreshold?: number;
  [key: string]: any;
}

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
  presence?: PresenceStatus;
  /** Priority indicator */
  priority?: PriorityLevel;
  /** Click handler */
  onClick?: () => void;
  /** Email-style recipient */
  recipient?: string;
  /** Email-style subject */
  subject?: string;
  /** Context menu handler */
  onContextMenu?: (event: React.MouseEvent) => void;
  /** Inbox channel type for icon display */
  inboxChannelType?: string | null;
  /** Inbox medium (for Twilio channels) */
  inboxMedium?: string | null;
  /** Inbox name for tooltip */
  inboxName?: string;
  /** Assignee information */
  assignee?: AssigneeInfo | null;
  /** Conversation labels */
  labels?: string[] | ConversationLabel[];
  /** Account labels with colors (for label matching) */
  accountLabels?: ConversationLabel[];
  /** SLA information */
  appliedSla?: SLAInfo | null;
  /** Conversation timestamp for SLA calculation */
  conversationTimestamp?: string | number | null;
  /** Last activity timestamp for SLA calculation */
  lastActivityAt?: string | number | null;
}

// ============================================================================
// Constants
// ============================================================================

const AVATAR_SIZE = 24;
const INBOX_ICON_CONTAINER_SIZE = 20;
const INBOX_ICON_SIZE = 12;
const PRIORITY_ICON_SIZE = 12;
const ASSIGNEE_AVATAR_SIZE = 20;
const UNREAD_BADGE_SIZE = 20;
const MAX_UNREAD_DISPLAY = 99;

// ============================================================================
// Styles
// ============================================================================

const getListItemButtonStyles = (isSelected: boolean): SxProps<Theme> => ({
  py: 1,
  px: 1.5,
  borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
  backgroundColor: isSelected
    ? colorTokens.semantic.interactive.selected
    : colorTokens.semantic.background.primary,
  '&:hover': {
    backgroundColor: isSelected
      ? colorTokens.semantic.interactive.selectedHover
      : colorTokens.semantic.interactive.hover,
  },
  transition: 'background-color 0.15s ease',
});

const getTitleStyles = (isSelected: boolean, isUnread: boolean): SxProps<Theme> => ({
  fontWeight: isUnread ? 600 : 400,
  color: isSelected
    ? colorTokens.primary[900]
    : colorTokens.semantic.text.primary,
  fontSize: 16,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
});

const snippetStyles: SxProps<Theme> = {
  color: colorTokens.semantic.text.secondary,
  fontSize: 14,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
  minWidth: 0,
};

const timestampStyles: SxProps<Theme> = {
  color: colorTokens.semantic.text.secondary,
  fontSize: 14,
  flexShrink: 0,
};

const unreadBadgeStyles: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  bgcolor: colorTokens.primary[600],
  width: UNREAD_BADGE_SIZE,
  height: UNREAD_BADGE_SIZE,
  color: 'white',
  fontSize: 12,
  fontWeight: 600,
  flexShrink: 0,
  ml: 0.5,
};

const inboxIconContainerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  borderRadius: '50%',
  bgcolor: colorTokens.semantic.background.secondary,
  width: INBOX_ICON_CONTAINER_SIZE,
  height: INBOX_ICON_CONTAINER_SIZE,
};

// ============================================================================
// Component
// ============================================================================

/**
 * ConversationListItem Component
 *
 * Universal conversation list item following the design guide specifications.
 * Displays contact avatar, name, message preview, unread count, priority,
 * SLA status, labels, and assignee information.
 *
 * @see CONVERSATION_LIST_ICONS_GUIDE.md for complete specifications
 */
export const ConversationListItem = React.memo<ConversationListItemProps>(({
  id,
  title,
  participants,
  snippet,
  timestamp,
  isRead = true,
  isSelected = false,
  unreadCount = 0,
  avatarSrc,
  presence,
  priority,
  onClick,
  onContextMenu,
  inboxChannelType,
  inboxMedium,
  inboxName,
  assignee,
  labels,
  accountLabels,
  appliedSla,
  conversationTimestamp,
  lastActivityAt,
}) => {
  // ========================================================================
  // Memoized Values
  // ========================================================================

  const participantName = useMemo(
    () => (Array.isArray(participants) ? String(participants[0] || '') : String(participants || '')),
    [participants]
  );

  const isUnread = useMemo(
    () => !isRead || (unreadCount ?? 0) > 0,
    [isRead, unreadCount]
  );

  const displayUnreadCount = useMemo(
    () => (unreadCount && unreadCount > 0 ? (unreadCount > MAX_UNREAD_DISPLAY ? '99+' : unreadCount) : null),
    [unreadCount]
  );

  const hasMetadata = useMemo(
    () => Boolean(appliedSla?.id || (labels && labels.length > 0) || assignee?.name),
    [appliedSla?.id, labels, assignee?.name]
  );

  const normalizedPriority = useMemo(
    () => priority?.toLowerCase() as 'urgent' | 'high' | 'medium' | 'low' | undefined,
    [priority]
  );

  // ========================================================================
  // Event Handlers
  // ========================================================================

  const handleContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      onContextMenu?.(event);
    },
    [onContextMenu]
  );

  // ========================================================================
  // Render
  // ========================================================================

  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={isSelected}
        onClick={onClick}
        onContextMenu={handleContextMenu}
        sx={getListItemButtonStyles(isSelected)}
      >
        <Stack direction="row" alignItems="flex-start" spacing={1} sx={{ width: '100%' }}>
          {/* Contact Avatar */}
          <Avatar
            size="sm"
            name={participantName}
            src={avatarSrc}
            presence={presence}
            sx={{
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              fontSize: '0.75rem',
              flexShrink: 0,
            }}
          />

          {/* Content Section */}
          <Stack flex={1} spacing={0.5} sx={{ minWidth: 0 }}>
            {/* Top Row: Contact Name | Priority | Inbox | Timestamp */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Typography variant="body2" sx={getTitleStyles(isSelected, isUnread)}>
                {title}
              </Typography>

              {/* Right Indicators */}
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
                {normalizedPriority && <ConversationPriorityIcon priority={normalizedPriority} size={PRIORITY_ICON_SIZE} />}

                {inboxChannelType && (
                  <Tooltip title={inboxName || ''} arrow placement="left">
                    <Box sx={inboxIconContainerStyles}>
                      <InboxIcon
                        channelType={inboxChannelType}
                        medium={inboxMedium}
                        size={INBOX_ICON_SIZE}
                      />
                    </Box>
                  </Tooltip>
                )}

                <Typography variant="caption" sx={timestampStyles}>
                  {timestamp}
                </Typography>
              </Stack>
            </Stack>

            {/* Message Preview Row */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Typography variant="body2" sx={snippetStyles}>
                {snippet || 'No messages yet'}
              </Typography>

              {displayUnreadCount && (
                <Box sx={unreadBadgeStyles}>
                  <span>{displayUnreadCount}</span>
                </Box>
              )}
            </Stack>

            {/* Bottom Row: SLA | Labels | Assignee */}
            {hasMetadata && (
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                {/* Left: SLA & Labels */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ flexWrap: 'wrap', gap: 0.5, flex: 1, minWidth: 0 }}
                >
                  {appliedSla?.id && conversationTimestamp && (
                    <ConversationSLALabel
                      appliedSla={appliedSla}
                      conversationTimestamp={conversationTimestamp}
                      lastActivityAt={lastActivityAt}
                    />
                  )}

                  {labels && labels.length > 0 && (
                    <ConversationLabels labels={labels} accountLabels={accountLabels} />
                  )}
                </Stack>

                {/* Right: Assignee */}
                {assignee?.name && (
                  <Avatar
                    size="xs"
                    name={assignee.name}
                    src={assignee.avatarSrc}
                    presence={assignee.presence}
                    sx={{
                      width: ASSIGNEE_AVATAR_SIZE,
                      height: ASSIGNEE_AVATAR_SIZE,
                      fontSize: '0.625rem',
                      flexShrink: 0,
                    }}
                  />
                )}
              </Stack>
            )}
          </Stack>
        </Stack>
      </ListItemButton>
    </ListItem>
  );
});

ConversationListItem.displayName = 'ConversationListItem';
