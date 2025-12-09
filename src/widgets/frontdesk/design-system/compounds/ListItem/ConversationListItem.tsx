import React, { useCallback, useMemo } from "react";
import {
  Box,
  ListItem,
  ListItemButton,
  Typography,
  Stack,
  Tooltip,
  type SxProps,
  type Theme,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Avatar } from "../../primitives/Avatar";
import { colorTokens } from "../../tokens";
import { InboxIcon } from "@/widgets/frontdesk/providers/chatwoot/utils/inbox-icons";
import { ConversationPriorityIcon } from "@/widgets/frontdesk/providers/chatwoot/components/conversation-priority-icon";
import { ConversationSLALabel } from "@/widgets/frontdesk/providers/chatwoot/components/conversation-sla-label";
import {
  ConversationLabels,
  ConversationLabel,
} from "@/widgets/frontdesk/providers/chatwoot/components/conversation-labels";
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
  /** Avatar background color (for consistent coloring) */
  avatarBackgroundColor?: string;
  /** Avatar initials (for consistent display) */
  avatarInitials?: string;
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
// Constants (8px rhythm, modern SaaS design)
// ============================================================================

const AVATAR_SIZE = 40; // 5 * 8 = 40px
const INBOX_ICON_CONTAINER_SIZE = 22; // Slightly smaller for cleaner look
const INBOX_ICON_SIZE = 13;
const PRIORITY_ICON_SIZE = 14;
const ASSIGNEE_AVATAR_SIZE = 22; // Slightly smaller for balance
const UNREAD_BADGE_SIZE = 20; // Smaller, more modern pill badge
const MAX_UNREAD_DISPLAY = 99;
const ACTION_ICON_SIZE = 14;

// Card styling constants (design spec: 12px radius, soft shadow)
const CARD_RADIUS = 12; // 12px for list items
const CARD_PADDING_X = 16; // 2 * 8 = 16px horizontal
const CARD_PADDING_Y = 14; // Slightly less vertical for density
const ITEM_GAP = 8; // 8px gap between items
const ACCENT_LINE_WIDTH = 3; // Thin accent line for selected state

// Modern soft separator color - uses design system token
const SEPARATOR_COLOR = colorTokens.neutral[100];

// ============================================================================
// Styles
// ============================================================================

const getListItemButtonStyles = (isSelected: boolean): SxProps<Theme> => ({
  py: `${CARD_PADDING_Y}px`,
  px: 0,
  mx: `${ITEM_GAP}px`,
  my: `${ITEM_GAP / 2}px`,
  borderRadius: `${CARD_RADIUS}px`,
  backgroundColor: isSelected
    ? colorTokens.semantic.background.primary
    : colorTokens.semantic.background.primary,
  border: `1px solid ${
    isSelected ? colorTokens.primary[200] : colorTokens.neutral[100]
  }`,
  // Soft shadow as per design spec - subtle and refined
  boxShadow: isSelected
    ? "0 2px 8px -2px rgba(59, 130, 246, 0.12)"
    : "0 1px 3px rgba(0, 0, 0, 0.02)",
  "&:hover": {
    backgroundColor: isSelected
      ? colorTokens.primary[50]
      : colorTokens.neutral[50],
    borderColor: isSelected
      ? colorTokens.primary[300]
      : colorTokens.neutral[200],
    // Subtle hover elevation
    boxShadow: "0 4px 12px -4px rgba(0, 0, 0, 0.06)",
  },
  transition: "all 0.15s ease",
  position: "relative",
  overflow: "hidden",
  // Thin accent line on left edge (2-3px as per spec)
  "&::before": isSelected
    ? {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: `${ACCENT_LINE_WIDTH}px`,
        backgroundColor: colorTokens.primary[500],
        borderRadius: "3px 0 0 3px",
      }
    : {},
});

const getTitleStyles = (
  isSelected: boolean,
  isUnread: boolean
): SxProps<Theme> => ({
  fontWeight: isUnread ? 600 : 500,
  color: colorTokens.semantic.text.primary,
  fontSize: "0.875rem", // 14px - semibold for name as per spec
  lineHeight: 1.35,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  flex: 1,
  letterSpacing: "-0.01em",
});

const snippetStyles: SxProps<Theme> = {
  color: colorTokens.neutral[500],
  fontSize: "0.8125rem", // 13px - regular, neutral as per spec
  lineHeight: 1.4,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  flex: 1,
  minWidth: 0,
};

const timestampStyles: SxProps<Theme> = {
  color: colorTokens.neutral[400],
  fontSize: "0.6875rem", // 11px - smaller, muted timestamp
  fontWeight: 500,
  flexShrink: 0,
  letterSpacing: "0.02em",
  textAlign: "right",
  minWidth: 48,
};

const unreadBadgeStyles: SxProps<Theme> = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: `${UNREAD_BADGE_SIZE / 2}px`,
  bgcolor: colorTokens.primary[500],
  minWidth: UNREAD_BADGE_SIZE,
  height: UNREAD_BADGE_SIZE,
  px: 0.75,
  color: "white",
  fontSize: "0.6875rem", // 11px - smaller badge text
  fontWeight: 600,
  flexShrink: 0,
  boxShadow: "0 1px 3px rgba(59, 130, 246, 0.15)",
};

const inboxIconContainerStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: INBOX_ICON_CONTAINER_SIZE,
  height: INBOX_ICON_CONTAINER_SIZE,
  borderRadius: "6px",
  backgroundColor: colorTokens.neutral[50],
  color: colorTokens.neutral[500],
  border: `1px solid ${colorTokens.neutral[100]}`,
};

const actionIconStyles: SxProps<Theme> = {
  fontSize: ACTION_ICON_SIZE,
  color: colorTokens.neutral[400],
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
    avatarBackgroundColor,
    avatarInitials,
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
      () =>
        Array.isArray(participants)
          ? String(participants[0] || "")
          : String(participants || ""),
      [participants]
    );

    const isUnread = useMemo(
      () => !isRead || (unreadCount ?? 0) > 0,
      [isRead, unreadCount]
    );

    const displayUnreadCount = useMemo(
      () =>
        unreadCount && unreadCount > 0
          ? unreadCount > MAX_UNREAD_DISPLAY
            ? "99+"
            : unreadCount
          : null,
      [unreadCount]
    );

    const hasMetadata = useMemo(
      () =>
        Boolean(
          appliedSla?.id || (labels && labels.length > 0) || assignee?.name
        ),
      [appliedSla?.id, labels, assignee?.name]
    );

    const normalizedPriority = useMemo(
      () =>
        priority?.toLowerCase() as
          | "urgent"
          | "high"
          | "medium"
          | "low"
          | undefined,
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
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          selected={isSelected}
          onClick={onClick}
          onContextMenu={handleContextMenu}
          sx={getListItemButtonStyles(isSelected)}
        >
          <Stack
            direction="row"
            alignItems="flex-start"
            sx={{
              width: "100%",
              px: 1.5,
              gap: 1.5,
            }}
          >
            {/* Contact Avatar - Larger with better styling */}
            <Avatar
              size="md"
              name={participantName}
              src={avatarSrc}
              backgroundColor={avatarBackgroundColor}
              sx={{
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                fontSize: "0.875rem",
                flexShrink: 0,
                border: `2px solid ${
                  isSelected
                    ? colorTokens.primary[200]
                    : colorTokens.neutral[200]
                }`,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
                mt: 0.25,
              }}
            >
              {avatarInitials}
            </Avatar>

            {/* Content Section - Better spacing */}
            <Stack
              flex={1}
              sx={{
                minWidth: 0,
                py: 0.25,
                gap: 0.5,
              }}
            >
              {/* First Row: Title/Name + Timestamp */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  gap: 1,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    gap: 1,
                  }}
                >
                  {/* Inbox Icon in styled container */}
                  {inboxChannelType && (
                    <Box sx={inboxIconContainerStyles}>
                      <InboxIcon
                        channelType={inboxChannelType}
                        medium={inboxMedium}
                        size={INBOX_ICON_SIZE}
                      />
                    </Box>
                  )}

                  {/* Contact Name - Primary text */}
                  <Typography
                    variant="body2"
                    sx={getTitleStyles(isSelected, isUnread)}
                  >
                    {title}
                  </Typography>
                </Stack>

                {/* Timestamp - Right aligned */}
                <Typography variant="caption" sx={timestampStyles}>
                  {timestamp}
                </Typography>
              </Stack>

              {/* Inbox Name Row (if available) */}
              {inboxName && (
                <Typography
                  variant="caption"
                  sx={{
                    color: colorTokens.neutral[400],
                    fontSize: "0.6875rem", // 11px
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {inboxName}
                </Typography>
              )}

              {/* Subject Row (for email conversations) */}
              {subject && (
                <Typography
                  variant="body2"
                  sx={{
                    color: isSelected
                      ? colorTokens.primary[700]
                      : colorTokens.neutral[600],
                    fontSize: "0.8125rem", // 13px
                    fontWeight: isUnread ? 500 : 400,
                    lineHeight: 1.4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={subject}
                >
                  {subject}
                </Typography>
              )}

              {/* Message Preview Row */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  gap: 1,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    gap: 0.75,
                  }}
                >
                  {hasAttachments && (
                    <AttachFileIcon
                      sx={{
                        fontSize: 14,
                        color: colorTokens.neutral[400],
                        transform: "rotate(45deg)",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <Typography variant="body2" sx={snippetStyles}>
                    {snippet || "No messages yet"}
                  </Typography>
                </Stack>

                {/* Right side: Priority + Unread Badge */}
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{
                    gap: 0.75,
                  }}
                >
                  {normalizedPriority && (
                    <ConversationPriorityIcon
                      priority={normalizedPriority}
                      size={PRIORITY_ICON_SIZE}
                    />
                  )}
                  {displayUnreadCount && (
                    <Box sx={unreadBadgeStyles}>{displayUnreadCount}</Box>
                  )}
                </Stack>
              </Stack>

              {/* Metadata Row: SLA | Labels | Action Icons | Assignee */}
              {hasMetadata && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    mt: 0.5,
                    pt: 0.75,
                    borderTop: `1px solid ${colorTokens.neutral[100]}`,
                    gap: 1,
                  }}
                >
                  {/* Left: SLA & Labels */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                      flexWrap: "wrap",
                      gap: 0.75,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {appliedSla?.id && conversationTimestamp && (
                      <ConversationSLALabel
                        appliedSla={appliedSla}
                        conversationTimestamp={conversationTimestamp}
                        lastActivityAt={lastActivityAt}
                      />
                    )}

                    {labels && labels.length > 0 && (
                      <ConversationLabels
                        labels={labels}
                        accountLabels={accountLabels}
                      />
                    )}
                  </Stack>

                  {/* Right: Action Icons + Assignee */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                      gap: 0.75,
                    }}
                  >
                    {/* Assignment indicator */}
                    {assignee?.name && (
                      <Tooltip title="Assigned" arrow placement="top">
                        <PersonAddIcon sx={actionIconStyles} />
                      </Tooltip>
                    )}

                    {/* Assignee Avatar */}
                    {assignee?.name && (
                      <Tooltip title={assignee.name} arrow placement="top">
                        <Avatar
                          size="xs"
                          name={assignee.name}
                          src={assignee.avatarSrc}
                          presence={assignee.presence}
                          sx={{
                            width: ASSIGNEE_AVATAR_SIZE,
                            height: ASSIGNEE_AVATAR_SIZE,
                            fontSize: "0.65rem",
                            flexShrink: 0,
                            border: `1.5px solid ${colorTokens.neutral[200]}`,
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                          }}
                        />
                      </Tooltip>
                    )}
                  </Stack>
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
