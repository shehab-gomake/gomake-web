import React, { useCallback, useMemo } from "react";
import { Box, ListItem, ListItemButton, Typography, Stack, Tooltip, type SxProps, type Theme } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Avatar } from "../../primitives/Avatar";
import { colorTokens } from "../../tokens";
import { InboxIcon } from "@/widgets/frontdesk/providers/chatwoot/utils/inbox-icons";
import { ConversationPriorityIcon } from "@/widgets/frontdesk/providers/chatwoot/components/conversation-priority-icon";
import { ConversationSLALabel } from "@/widgets/frontdesk/providers/chatwoot/components/conversation-sla-label";
import { ConversationLabels, ConversationLabel } from "@/widgets/frontdesk/providers/chatwoot/components/conversation-labels";
import { PriorityLevel, PresenceStatus } from "../../types";

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

const AVATAR_SIZE = 28;
const INBOX_ICON_CONTAINER_SIZE = 18;
const INBOX_ICON_SIZE = 11;
const PRIORITY_ICON_SIZE = 12;
const ASSIGNEE_AVATAR_SIZE = 18;
const UNREAD_BADGE_SIZE = 18;
const MAX_UNREAD_DISPLAY = 99;

// ============================================================================
// Styles
// ============================================================================

const getListItemButtonStyles = (isSelected: boolean): SxProps<Theme> => ({
  py: 1,
  px: 0,
  borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
  backgroundColor: isSelected ? colorTokens.semantic.interactive.selected : colorTokens.semantic.background.primary,
  "&:hover": {
    backgroundColor: isSelected ? colorTokens.semantic.interactive.selectedHover : colorTokens.semantic.interactive.hover,
    boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.04)",
  },
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  "&::before": isSelected
    ? {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
        backgroundColor: colorTokens.primary[600],
      }
    : {},
});

const getTitleStyles = (isSelected: boolean, isUnread: boolean): SxProps<Theme> => ({
  fontWeight: isUnread ? 600 : 500,
  color: isSelected ? colorTokens.primary[900] : colorTokens.semantic.text.primary,
  fontSize: 14,
  lineHeight: 1.3,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  flex: 1,
  letterSpacing: "-0.01em",
});

const snippetStyles: SxProps<Theme> = {
  color: colorTokens.semantic.text.secondary,
  fontSize: 13,
  lineHeight: 1.3,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  flex: 1,
  minWidth: 0,
  opacity: 0.85,
};

const timestampStyles: SxProps<Theme> = {
  color: colorTokens.semantic.text.secondary,
  fontSize: 11,
  fontWeight: 500,
  flexShrink: 0,
  opacity: 0.75,
  letterSpacing: "0.01em",
};

const unreadBadgeStyles: SxProps<Theme> = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "9px",
  bgcolor: colorTokens.primary[600],
  minWidth: UNREAD_BADGE_SIZE,
  height: UNREAD_BADGE_SIZE,
  px: 0.5,
  color: "white",
  fontSize: 10,
  fontWeight: 600,
  flexShrink: 0,
  ml: 0.5,
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
};

const inboxIconContainerStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  color: colorTokens.semantic.text.secondary,
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
export const ConversationListItem = React.memo<ConversationListItemProps>(
  ({
    id,
    title,
    participants,
    snippet,
    timestamp,
    isRead = true,
    isSelected = false,
    unreadCount = 0,
    hasAttachments = false,
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
    subject,
    recipient,
  }) => {
    // ========================================================================
    // Memoized Values
    // ========================================================================

    const participantName = useMemo(
      () => (Array.isArray(participants) ? String(participants[0] || "") : String(participants || "")),
      [participants]
    );

    const isUnread = useMemo(() => !isRead || (unreadCount ?? 0) > 0, [isRead, unreadCount]);

    const displayUnreadCount = useMemo(
      () => (unreadCount && unreadCount > 0 ? (unreadCount > MAX_UNREAD_DISPLAY ? "99+" : unreadCount) : null),
      [unreadCount]
    );

    const hasMetadata = useMemo(
      () => Boolean(appliedSla?.id || (labels && labels.length > 0) || assignee?.name),
      [appliedSla?.id, labels, assignee?.name]
    );

    const normalizedPriority = useMemo(
      () => priority?.toLowerCase() as "urgent" | "high" | "medium" | "low" | undefined,
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
          <Stack direction="row" alignItems="center" spacing={1} sx={{ width: "100%", px: 1.5 }}>
            {/* Contact Avatar */}
            <Avatar
              size="sm"
              name={participantName}
              src={avatarSrc}
              sx={{
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                fontSize: "0.75rem",
                flexShrink: 0,
                border: `1.5px solid ${colorTokens.semantic.border.default}`,
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)",
              }}
            />

            {/* Content Section */}
            <Stack flex={1} spacing={0.4} sx={{ minWidth: 0 }}>
              {/* First Row: Inbox Icon | Inbox Name | Timestamp */}
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={0.75}>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                  {inboxChannelType && (
                    <Box sx={inboxIconContainerStyles}>
                      <InboxIcon channelType={inboxChannelType} medium={inboxMedium} size={INBOX_ICON_SIZE} />
                    </Box>
                  )}

                  {inboxName && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: colorTokens.semantic.text.secondary,
                        fontSize: 10,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        opacity: 0.7,
                      }}
                    >
                      {inboxName}
                    </Typography>
                  )}
                </Stack>

                {/* Right Indicators: Timestamp on top, Priority below (compact vertical stack) */}
                <Stack
                  direction="column"
                  alignItems="flex-end"
                  justifyContent="center"
                  spacing={0}
                  sx={{ flexShrink: 0, lineHeight: 1 }}
                >
                  <Typography variant="caption" sx={timestampStyles}>
                    {timestamp}
                  </Typography>
                  {normalizedPriority && (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: -0.25 }}>
                      <ConversationPriorityIcon priority={normalizedPriority} size={PRIORITY_ICON_SIZE} />
                    </Box>
                  )}
                </Stack>
              </Stack>

              {/* Second Row: Contact Name */}
              <Typography variant="body2" sx={getTitleStyles(isSelected, isUnread)}>
                {title}
              </Typography>

              {/* Subject Row (for email conversations) */}
              {subject && (
                <Typography
                  variant="body2"
                  sx={{
                    color: isSelected ? colorTokens.primary[700] : colorTokens.semantic.text.secondary,
                    fontSize: 13,
                    fontWeight: isUnread ? 500 : 400,
                    lineHeight: 1.3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    opacity: 0.9,
                  }}
                  title={subject}
                >
                  {subject}
                </Typography>
              )}

              {/* Third Row: Message Preview | Unread Count */}
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={0.75}>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                  {hasAttachments && (
                    <AttachFileIcon
                      sx={{
                        fontSize: 14,
                        color: colorTokens.semantic.text.secondary,
                        transform: "rotate(45deg)",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <Typography variant="body2" sx={snippetStyles}>
                    {snippet || "No messages yet"}
                  </Typography>
                </Stack>

                {displayUnreadCount && <Box sx={unreadBadgeStyles}>{displayUnreadCount}</Box>}
              </Stack>

              {/* Bottom Row: SLA | Labels | Assignee */}
              {hasMetadata && (
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={0.75}>
                  {/* Left: SLA & Labels */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.75}
                    sx={{ flexWrap: "wrap", gap: 0.4, flex: 1, minWidth: 0 }}
                  >
                    {appliedSla?.id && conversationTimestamp && (
                      <ConversationSLALabel
                        appliedSla={appliedSla}
                        conversationTimestamp={conversationTimestamp}
                        lastActivityAt={lastActivityAt}
                      />
                    )}

                    {labels && labels.length > 0 && <ConversationLabels labels={labels} accountLabels={accountLabels} />}
                  </Stack>

                  {/* Right: Assignee */}
                  {assignee?.name && (
                    <Tooltip title={assignee.name} arrow>
                      <Avatar
                        size="xs"
                        name={assignee.name}
                        src={assignee.avatarSrc}
                        presence={assignee.presence}
                        sx={{
                          width: ASSIGNEE_AVATAR_SIZE,
                          height: ASSIGNEE_AVATAR_SIZE,
                          fontSize: "0.6rem",
                          flexShrink: 0,
                          border: `1px solid ${colorTokens.semantic.border.default}`,
                          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)",
                        }}
                      />
                    </Tooltip>
                  )}
                </Stack>
              )}
            </Stack>
          </Stack>
        </ListItemButton>
      </ListItem>
    );
  }
);

ConversationListItem.displayName = "ConversationListItem";
