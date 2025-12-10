/**
 * NotificationListItem Component
 * Individual notification item with all metadata
 */

import React from "react";
import { useTranslation } from "react-i18next";
import {
  ListItem,
  Stack,
  Avatar,
  Typography,
  Chip,
  Box,
  Tooltip,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { ChatwootNotification } from "@/services/frontdesk/api/chatwoot/types/notifications.types";
import {
  getAssigneeInfo,
  getConversationId,
  getEmailSubject,
  getMessagePreview,
  getSnoozeText,
  getNotificationTypeDetails,
  getStatusLabel,
  getStatusColor,
} from "../../utils/notification-formatters";
import { formatTimeAgo } from "../../utils/date-utils";
import { ConversationPriorityIcon } from "../conversation-priority-icon";
import { InboxIcon } from "../../utils/inbox-icons";
import {
  generateNotificationAvatar,
  generateAgentAvatar,
} from "../../utils/avatar.utils";
import {
  colorTokens,
  radiusTokens,
  shadowTokens,
} from "@/widgets/frontdesk/design-system";

interface NotificationListItemProps {
  notification: ChatwootNotification;
  onClick: () => void;
  onContextMenu: (event: React.MouseEvent<HTMLLIElement>) => void;
  primaryColor?: (shade: number) => string;
  neutralColor?: (shade: number) => string;
}

export const NotificationListItem: React.FC<NotificationListItemProps> = ({
  notification,
  onClick,
  onContextMenu,
  primaryColor,
  neutralColor,
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const avatarData = generateNotificationAvatar(notification);
  const isUnread = !notification.read_at;
  const primaryActor = notification.primary_actor as any;
  const snoozeText = getSnoozeText(notification);
  const hasSnooze = !!snoozeText;
  const notificationDetails = hasSnooze
    ? null
    : getNotificationTypeDetails(notification.notification_type, {
        primary: colorTokens.primary[600],
        neutral: colorTokens.neutral[600],
      });
  const messagePreview = getMessagePreview(notification);
  const statusLabel = getStatusLabel(primaryActor?.status);
  const statusColor = getStatusColor(
    primaryActor?.status,
    colorTokens.neutral[600]
  );
  // Use created_at (Unix timestamp in seconds) as primary source, fallback to other timestamps
  // chatwootTimestampToDate handles Unix timestamps (numbers) and ISO strings
  const lastActivityAt =
    notification.created_at ||
    (primaryActor?.last_activity_at
      ? primaryActor.last_activity_at
      : undefined) ||
    notification.updated_at;

  // Extract conversation metadata
  const conversationMeta = primaryActor?.meta || {};
  const inboxChannelType =
    conversationMeta.channel?.type ||
    (primaryActor?.inbox_id
      ? conversationMeta.inbox?.channel_type || null
      : null);
  const inboxMedium =
    conversationMeta.channel?.medium || conversationMeta.inbox?.medium;
  const inboxName =
    conversationMeta.inbox?.name || conversationMeta.channel?.name;
  const priority = primaryActor?.priority;

  // Extract meaningful data
  const emailSubject = getEmailSubject(notification);
  const assigneeInfo = getAssigneeInfo(notification);
  const conversationId = getConversationId(notification);

  return (
    <ListItem
      onClick={onClick}
      onContextMenu={onContextMenu}
      sx={{
        px: 3, // 24px padding to match parent container
        py: 1.5,
        cursor: "pointer",
        backgroundColor: isUnread
          ? colorTokens.primary[50]
          : colorTokens.semantic.background.primary,
        "&:hover": {
          backgroundColor: isUnread
            ? colorTokens.primary[100]
            : colorTokens.neutral[50],
        },
        borderBottom: `1px solid ${colorTokens.neutral[100]}`,
      }}
    >
      <Stack
        direction="row"
        sx={{
          width: "100%",
          alignItems: "flex-start",
          gap: 1.5,
          direction: dir,
        }}
      >
        {/* Avatar */}
        <Avatar
          src={avatarData.src}
          sx={{
            width: 32,
            height: 32,
            bgcolor: avatarData.backgroundColor,
            color: "white",
            fontSize: "0.75rem",
            fontWeight: 600,
            flexShrink: 0,
            mt: 0.25,
          }}
          alt={avatarData.displayName}
          title={avatarData.displayName}
        >
          {avatarData.initials}
        </Avatar>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Row 1: Contact Name + Conversation ID */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 0.25, gap: 1, direction: dir }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: 14,
                fontWeight: isUnread ? 700 : 600,
                color: colorTokens.neutral[900],
                lineHeight: 1.3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={avatarData.displayName}
            >
              {avatarData.displayName}
            </Typography>

            {/* Conversation ID Badge */}
            {conversationId && (
              <Chip
                label={`#${conversationId}`}
                size="small"
                sx={{
                  height: 16,
                  fontSize: 10,
                  fontWeight: 600,
                  backgroundColor: colorTokens.neutral[100],
                  color: colorTokens.neutral[600],
                  flexShrink: 0,
                  "& .MuiChip-label": {
                    px: 0.75,
                  },
                }}
              />
            )}
          </Stack>

          {/* Row 2: Email Subject (if available) */}
          {emailSubject && (
            <Typography
              variant="body2"
              sx={{
                fontSize: 13,
                fontWeight: isUnread ? 600 : 500,
                color: colorTokens.neutral[800],
                lineHeight: 1.3,
                mb: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={emailSubject}
            >
              {emailSubject}
            </Typography>
          )}

          {/* Row 3: Message Preview */}
          <Typography
            variant="body2"
            sx={{
              fontSize: 12,
              fontWeight: 400,
              color: colorTokens.neutral[600],
              lineHeight: 1.4,
              mb: 0.75,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={messagePreview}
          >
            {messagePreview}
          </Typography>

          {/* Row 4: Meta Info */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ gap: 1, direction: dir }}
          >
            {/* Left: Assignee + Status + Notification Type */}
            <Stack
              direction="row"
              alignItems="center"
              sx={{ flex: 1, minWidth: 0, gap: 0.75, direction: dir }}
            >
              {/* Assignee */}
              {assigneeInfo &&
                (() => {
                  const assigneeAvatarData = generateAgentAvatar({
                    id: assigneeInfo.id,
                    name: assigneeInfo.name,
                    thumbnail: assigneeInfo.thumbnail,
                  });
                  return (
                    <Tooltip
                      title={t("frontdesk.detailPanel.assignedToTooltip", {
                        name: assigneeInfo.name,
                      })}
                      arrow
                      placement="top"
                    >
                      <Chip
                        label={assigneeInfo.name}
                        size="small"
                        avatar={
                          <Avatar
                            src={assigneeAvatarData.src}
                            sx={{
                              width: 16,
                              height: 16,
                              fontSize: "0.5rem",
                              bgcolor: assigneeAvatarData.backgroundColor,
                            }}
                            alt={assigneeAvatarData.displayName}
                          >
                            {assigneeAvatarData.initials}
                          </Avatar>
                        }
                        sx={{
                          height: 20,
                          fontSize: 11,
                          backgroundColor: colorTokens.primary[100],
                          color: colorTokens.primary[800],
                          fontWeight: 500,
                          flexShrink: 0,
                          "& .MuiChip-label": {
                            px: 0.5,
                          },
                          "& .MuiChip-avatar": {
                            ml: 0.5,
                          },
                        }}
                      />
                    </Tooltip>
                  );
                })()}

              {/* Status Badge */}
              {statusLabel && (
                <Chip
                  label={statusLabel}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 11,
                    backgroundColor: statusColor
                      ? `${statusColor}20`
                      : colorTokens.neutral[100],
                    color: statusColor || colorTokens.neutral[700],
                    border: `1px solid ${
                      statusColor || colorTokens.neutral[300]
                    }`,
                    fontWeight: 500,
                    flexShrink: 0,
                    "& .MuiChip-label": {
                      px: 0.75,
                    },
                  }}
                />
              )}

              {/* Notification Type or Snooze */}
              {hasSnooze ? (
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{ gap: 0.5, direction: dir }}
                >
                  <AccessTimeIcon
                    sx={{
                      fontSize: 12,
                      color: colorTokens.neutral[500],
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: colorTokens.neutral[500],
                    }}
                  >
                    {snoozeText}
                  </Typography>
                </Stack>
              ) : (
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 11,
                    fontWeight: 400,
                    color: colorTokens.neutral[500],
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {notificationDetails?.label || "New message"}
                </Typography>
              )}
            </Stack>

            {/* Right: Priority | Inbox Icon | Timestamp */}
            <Stack
              direction="row"
              alignItems="center"
              sx={{ flexShrink: 0, gap: 0.75, direction: dir }}
            >
              {/* Priority Icon */}
              {priority && (
                <ConversationPriorityIcon priority={priority} size={14} />
              )}

              {/* Inbox Icon */}
              {inboxChannelType && (
                <Tooltip title={inboxName || ""} arrow placement="left">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: colorTokens.neutral[500],
                      flexShrink: 0,
                    }}
                  >
                    <InboxIcon
                      channelType={inboxChannelType}
                      medium={inboxMedium}
                      size={16}
                    />
                  </Box>
                </Tooltip>
              )}

              {/* Timestamp */}
              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  color: colorTokens.neutral[500],
                  whiteSpace: "nowrap",
                  fontWeight: 500,
                }}
              >
                {formatTimeAgo(lastActivityAt)}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </ListItem>
  );
};
