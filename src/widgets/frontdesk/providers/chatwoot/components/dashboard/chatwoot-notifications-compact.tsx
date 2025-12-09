/**
 * Chatwoot Notifications Compact Component
 *
 * Simplified notification list for dashboard embedding.
 * Shows top 10 notifications with simple chip-based filtering.
 */

import React, { useState, useMemo } from "react";
import {
  Box,
  Stack,
  Typography,
  List,
  ListItem,
  Avatar,
  Chip as MuiChip,
  Button,
} from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useChatwootNotifications } from "../../hooks/use-chatwoot-notifications";
import { useChatwootProvider } from "../../hooks/use-chatwoot-provider";
import { Chip } from "@/widgets/frontdesk/design-system";
import { colorTokens } from "@/widgets/frontdesk/design-system/tokens";
import { EmptyState } from "@/widgets/frontdesk/design-system";
import InboxIcon from "@mui/icons-material/Inbox";
import type { ChatwootNotification } from "@/services/frontdesk/api/chatwoot/types/notifications.types";
import { DASHBOARD_LIMITS } from "../../constants/dashboard.constants";
import { formatTimeAgo } from "../../utils/date-utils";
import { getMessagePreview } from "../../utils/notification-formatters";
import { generateNotificationAvatar } from "../../utils/avatar.utils";

type FilterType = "unread" | "mentions" | "assignments" | "all";

export const ChatwootNotificationsCompact: React.FC = () => {
  const {
    notifications,
    loading,
    error,
    unreadCount,
    wsConnected,
    markConversationAsRead,
  } = useChatwootNotifications();
  const { router: chatwootRouter } = useChatwootProvider();
  const [activeFilter, setActiveFilter] = useState<FilterType>("unread");

  // Filter notifications based on active filter
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    switch (activeFilter) {
      case "unread":
        filtered = notifications.filter((n) => !n.read_at);
        break;
      case "mentions":
        filtered = notifications.filter(
          (n) => n.notification_type === "conversation.mention"
        );
        break;
      case "assignments":
        filtered = notifications.filter(
          (n) => n.notification_type === "conversation.assigned"
        );
        break;
      case "all":
      default:
        filtered = notifications;
        break;
    }

    // Limit to configured dashboard maximum
    return filtered.slice(0, DASHBOARD_LIMITS.MAX_NOTIFICATIONS_DASHBOARD);
  }, [notifications, activeFilter]);

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    return {
      unread: notifications.filter((n) => !n.read_at).length,
      mentions: notifications.filter(
        (n) => n.notification_type === "conversation.mention"
      ).length,
      assignments: notifications.filter(
        (n) => n.notification_type === "conversation.assigned"
      ).length,
      all: notifications.length,
    };
  }, [notifications]);

  const getNotificationTypeLabel = (notificationType?: string) => {
    const typeMap: Record<string, string> = {
      "conversation.mention": "Mention",
      "conversation.assigned": "Assignment",
      "conversation.created": "New Conversation",
      "conversation.updated": "Updated",
      "message.created": "New Message",
    };
    return typeMap[notificationType || ""] || "New message";
  };

  const handleNotificationClick = async (
    notification: ChatwootNotification
  ) => {
    const primaryActor = notification.primary_actor as any;
    const conversationId = primaryActor?.id;
    const inboxId = primaryActor?.inbox_id;

    if (conversationId) {
      // Mark all notifications for this conversation as read
      try {
        await markConversationAsRead(conversationId);
      } catch (err) {
        // Error is logged by the hook, continue with navigation
        console.error(
          "Failed to mark conversation notifications as read:",
          err
        );
      }

      // Navigate to conversation
      chatwootRouter.navigateToConversation(
        conversationId.toString(),
        inboxId?.toString()
      );
    }
  };

  const handleViewAllClick = () => {
    chatwootRouter.navigateToMyInbox();
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Filter Chips */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: `1px solid ${colorTokens.neutral[200]}`,
          backgroundColor: colorTokens.neutral[50],
        }}
      >
        <Stack
          direction="row"
          flexWrap="wrap"
          sx={{
            gap: 0.5,
          }}
        >
          <Chip
            label={`Unread ${
              filterCounts.unread > 0 ? `(${filterCounts.unread})` : ""
            }`}
            variant={activeFilter === "unread" ? "filled" : "soft"}
            color="primary"
            size="small"
            onClick={() => setActiveFilter("unread")}
            sx={{ cursor: "pointer" }}
          />
          <Chip
            label={`Mentions ${
              filterCounts.mentions > 0 ? `(${filterCounts.mentions})` : ""
            }`}
            variant={activeFilter === "mentions" ? "filled" : "soft"}
            color="primary"
            size="small"
            onClick={() => setActiveFilter("mentions")}
            sx={{ cursor: "pointer" }}
          />
          <Chip
            label={`Assignments ${
              filterCounts.assignments > 0
                ? `(${filterCounts.assignments})`
                : ""
            }`}
            variant={activeFilter === "assignments" ? "filled" : "soft"}
            color="primary"
            size="small"
            onClick={() => setActiveFilter("assignments")}
            sx={{ cursor: "pointer" }}
          />
          <Chip
            label="All"
            variant={activeFilter === "all" ? "filled" : "soft"}
            color="primary"
            size="small"
            onClick={() => setActiveFilter("all")}
            sx={{ cursor: "pointer" }}
          />
        </Stack>
      </Box>

      {/* Notification List */}
      <Box sx={{ flex: 1, overflow: "auto", backgroundColor: "white" }}>
        {error ? (
          <Box sx={{ p: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: "error.main", fontSize: "0.813rem" }}
            >
              {error}
            </Typography>
          </Box>
        ) : loading && notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{ color: colorTokens.neutral[500], fontSize: "0.813rem" }}
            >
              Loading notifications...
            </Typography>
          </Box>
        ) : filteredNotifications.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              p: 3,
            }}
          >
            <EmptyState
              icon={<InboxIcon sx={{ fontSize: 40 }} />}
              title="No notifications"
              description={
                activeFilter === "unread"
                  ? "All caught up! No unread notifications."
                  : `No ${activeFilter} notifications found.`
              }
            />
          </Box>
        ) : (
          <List sx={{ py: 0.5 }}>
            {filteredNotifications.map((notification) => {
              const avatarData = generateNotificationAvatar(notification);
              const isUnread = !notification.read_at;
              const primaryActor = notification.primary_actor as any;
              const messagePreview = getMessagePreview(notification, 80);
              const typeLabel = getNotificationTypeLabel(
                notification.notification_type
              );
              // Use created_at (Unix timestamp in seconds) as primary source
              // formatTimeAgo handles Unix timestamps (numbers) and ISO strings correctly
              const timestamp =
                notification.created_at ||
                primaryActor?.last_activity_at ||
                notification.updated_at;

              return (
                <ListItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    px: 2,
                    py: 1,
                    cursor: "pointer",
                    backgroundColor: isUnread
                      ? colorTokens.primary[50]
                      : "white",
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
                    }}
                  >
                    {/* Avatar (16px - more compact) */}
                    <Avatar
                      src={avatarData.src}
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: avatarData.backgroundColor,
                        color: "white",
                        fontSize: "0.563rem",
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
                      {/* Message Preview */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: 12,
                          fontWeight: isUnread ? 600 : 400,
                          color: colorTokens.neutral[900],
                          lineHeight: 1.4,
                          mb: 0.5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={messagePreview}
                      >
                        {messagePreview}
                      </Typography>

                      {/* Metadata Row */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          gap: 1,
                        }}
                      >
                        {/* Left: Type Icon + Label */}
                        <Stack
                          direction="row"
                          alignItems="center"
                          sx={{
                            flex: 1,
                            minWidth: 0,
                            gap: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: 1,
                              backgroundColor: isUnread
                                ? colorTokens.primary[600]
                                : colorTokens.neutral[400],
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <AddCommentIcon
                              sx={{ fontSize: 8, color: "white" }}
                            />
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: 11,
                              fontWeight: 400,
                              color: isUnread
                                ? colorTokens.primary[600]
                                : colorTokens.neutral[500],
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {typeLabel}
                          </Typography>
                        </Stack>

                        {/* Right: Timestamp */}
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: 11,
                            color: colorTokens.neutral[500],
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatTimeAgo(timestamp)}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>

      {/* View All Button */}
      {filteredNotifications.length > 0 && (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderTop: `1px solid ${colorTokens.neutral[200]}`,
            backgroundColor: "white",
          }}
        >
          <Button
            fullWidth
            variant="text"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
            onClick={handleViewAllClick}
            sx={{
              fontSize: "0.813rem",
              textTransform: "none",
              color: colorTokens.primary[600],
              "&:hover": {
                backgroundColor: colorTokens.primary[50],
              },
            }}
          >
            View All in My Inbox
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ChatwootNotificationsCompact;
