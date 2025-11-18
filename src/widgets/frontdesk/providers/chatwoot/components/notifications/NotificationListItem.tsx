/**
 * NotificationListItem Component
 * Individual notification item with all metadata
 */

import React from "react";
import { ListItem, Stack, Avatar, Typography, Chip, Box, Tooltip } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { ChatwootNotification } from "@/services/frontdesk/api/chatwoot/types/notifications.types";
import {
  getNotificationSender,
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

interface NotificationListItemProps {
  notification: ChatwootNotification;
  onClick: () => void;
  onContextMenu: (event: React.MouseEvent<HTMLLIElement>) => void;
  primaryColor: (shade: number) => string;
  neutralColor: (shade: number) => string;
}

export const NotificationListItem: React.FC<NotificationListItemProps> = ({
  notification,
  onClick,
  onContextMenu,
  primaryColor,
  neutralColor,
}) => {
  const sender = getNotificationSender(notification, primaryColor(500));
  const isUnread = !notification.read_at;
  const primaryActor = notification.primary_actor as any;
  const snoozeText = getSnoozeText(notification);
  const hasSnooze = !!snoozeText;
  const notificationDetails = hasSnooze
    ? null
    : getNotificationTypeDetails(notification.notification_type, {
        primary: primaryColor(600),
        neutral: neutralColor(600),
      });
  const messagePreview = getMessagePreview(notification);
  const statusLabel = getStatusLabel(primaryActor?.status);
  const statusColor = getStatusColor(primaryActor?.status, neutralColor(600));
  // Use created_at (Unix timestamp in seconds) as primary source, fallback to other timestamps
  // chatwootTimestampToDate handles Unix timestamps (numbers) and ISO strings
  const lastActivityAt = notification.created_at || 
    (primaryActor?.last_activity_at ? primaryActor.last_activity_at : undefined) ||
    notification.updated_at;

  // Extract conversation metadata
  const conversationMeta = primaryActor?.meta || {};
  const inboxChannelType =
    conversationMeta.channel?.type || (primaryActor?.inbox_id ? conversationMeta.inbox?.channel_type || null : null);
  const inboxMedium = conversationMeta.channel?.medium || conversationMeta.inbox?.medium;
  const inboxName = conversationMeta.inbox?.name || conversationMeta.channel?.name;
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
        px: 2,
        py: 1.5,
        cursor: "pointer",
        backgroundColor: isUnread ? primaryColor(50) : neutralColor(0),
        "&:hover": {
          backgroundColor: isUnread ? primaryColor(100) : neutralColor(50),
        },
        borderBottom: `1px solid ${neutralColor(100)}`,
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ width: "100%", alignItems: "flex-start" }}>
        {/* Avatar */}
        <Avatar
          src={sender.thumbnail}
          sx={{
            width: 32,
            height: 32,
            bgcolor: sender.color,
            color: "white",
            fontSize: "0.75rem",
            fontWeight: 600,
            flexShrink: 0,
            mt: 0.25,
          }}
        >
          {sender.initials}
        </Avatar>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Row 1: Contact Name + Conversation ID */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mb: 0.25 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: 14,
                fontWeight: isUnread ? 700 : 600,
                color: neutralColor(900),
                lineHeight: 1.3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={sender.name}
            >
              {sender.name}
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
                  backgroundColor: neutralColor(100),
                  color: neutralColor(600),
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
                color: neutralColor(800),
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
              color: neutralColor(600),
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
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            {/* Left: Assignee + Status + Notification Type */}
            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
              {/* Assignee */}
              {assigneeInfo && (
                <Tooltip title={`Assigned to ${assigneeInfo.name}`} arrow placement="top">
                  <Chip
                    label={assigneeInfo.name}
                    size="small"
                    avatar={
                      <Avatar
                        src={assigneeInfo.thumbnail}
                        sx={{
                          width: 16,
                          height: 16,
                          fontSize: "0.5rem",
                        }}
                      >
                        {assigneeInfo.name.charAt(0)}
                      </Avatar>
                    }
                    sx={{
                      height: 20,
                      fontSize: 11,
                      backgroundColor: primaryColor(100),
                      color: primaryColor(800),
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
              )}

              {/* Status Badge */}
              {statusLabel && (
                <Chip
                  label={statusLabel}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 11,
                    backgroundColor: statusColor ? `${statusColor}20` : neutralColor(100),
                    color: statusColor || neutralColor(700),
                    border: `1px solid ${statusColor || neutralColor(300)}`,
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
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <AccessTimeIcon
                    sx={{
                      fontSize: 12,
                      color: neutralColor(500),
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: neutralColor(500),
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
                    color: neutralColor(500),
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
            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ flexShrink: 0 }}>
              {/* Priority Icon */}
              {priority && <ConversationPriorityIcon priority={priority} size={14} />}

              {/* Inbox Icon */}
              {inboxChannelType && (
                <Tooltip title={inboxName || ""} arrow placement="left">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: neutralColor(500),
                      flexShrink: 0,
                    }}
                  >
                    <InboxIcon channelType={inboxChannelType} medium={inboxMedium} size={16} />
                  </Box>
                </Tooltip>
              )}

              {/* Timestamp */}
              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  color: neutralColor(500),
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
