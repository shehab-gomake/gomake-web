import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  MenuItem,
  ListItemText,
  Select,
  FormControl,
  Paper,
  List,
  ListItem,
  Avatar,
  Chip,
  Divider,
  Checkbox,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCommentIcon from "@mui/icons-material/AddComment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useChatwootNotifications } from "../hooks/use-chatwoot-notifications";
import { useChatwootNotificationContextMenu } from "../hooks/use-chatwoot-notification-context-menu";
import { NotificationSortOrder, ChatwootNotification } from "@/services/frontdesk/api/chatwoot/types/notifications.types";
import { buildNotificationFilters } from "../utils/notification-filter-utils";
import { DropdownMenu, MenuSubheader } from "@/widgets/frontdesk/components/dropdown-menu/dropdown-menu";
import { ConversationContextMenu } from "@/widgets/frontdesk/components/shared";
import { ConversationPriorityIcon } from "./conversation-priority-icon";
import { ConversationSLALabel } from "./conversation-sla-label";
import { InboxIcon } from "../utils/inbox-icons";
import Tooltip from "@mui/material/Tooltip";

export const ChatwootNotificationsView: React.FC = () => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const {
    notifications,
    loading,
    error,
    filters,
    unreadCount,
    wsConnected,
    updateFilters,
    markAllAsRead,
    deleteAll,
    deleteAllRead,
    markConversationAsRead,
  } = useChatwootNotifications();
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [settingsMenuAnchor, setSettingsMenuAnchor] = useState<null | HTMLElement>(null);

  // Context menu state
  const [contextMenuPosition, setContextMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<ChatwootNotification | null>(null);

  // Get context menu actions for selected notification
  const notificationContextMenu = useChatwootNotificationContextMenu(selectedNotification);

  /**
   * Handle right-click on notification
   */
  const handleNotificationContextMenu = (
    event: React.MouseEvent<HTMLLIElement>,
    notification: ChatwootNotification
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedNotification(notification);
    setContextMenuPosition({
      top: event.clientY,
      left: event.clientX,
    });
  };

  /**
   * Close context menu
   */
  const handleCloseContextMenu = () => {
    setContextMenuPosition(null);
    // Delay clearing selected notification to allow actions to complete
    setTimeout(() => setSelectedNotification(null), 100);
  };

  /**
   * Handle context menu action
   */
  const handleContextMenuAction = async (actionId: string) => {
    await notificationContextMenu.handleAction(actionId);
    handleCloseContextMenu();
  };

  // Get notification sender info (the actual contact who sent the message)
  const getNotificationSender = (notification: any) => {
    const primaryActor = notification.primary_actor;

    // Try to get the actual contact/sender from meta
    const sender = primaryActor?.meta?.sender || notification.secondary_actor?.sender;
    const name = sender?.name || sender?.email || primaryActor?.name || "Unknown";
    const email = sender?.email || primaryActor?.meta?.sender?.email || "";
    const thumbnail = sender?.thumbnail || primaryActor?.meta?.sender?.thumbnail || "";

    const initials = name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    // Generate color based on name
    const colors = [primaryColor(500), "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
    const colorIndex = name.charCodeAt(0) % colors.length;

    return { name, email, thumbnail, initials, color: colors[colorIndex] };
  };

  // Format timestamp
  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  // Handle sort order change
  const handleSortOrderChange = (event: any) => {
    const value = event.target.value;
    const sortOrder = value === "newest" ? NotificationSortOrder.DESC : NotificationSortOrder.ASC;
    const hasSnoozed = filters.includes?.includes("snoozed") || false;
    const hasRead = filters.includes?.includes("read") || false;
    const updatedFilters = buildNotificationFilters({
      snoozed: hasSnoozed,
      read: hasRead,
      sortOrder,
    });
    updateFilters(updatedFilters);
  };

  // Handle checkbox changes
  const handleSnoozedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const hasRead = filters.includes?.includes("read") || false;
    const updatedFilters = buildNotificationFilters({
      snoozed: checked,
      read: hasRead,
      sortOrder: filters.sort_order as NotificationSortOrder,
    });
    updateFilters(updatedFilters);
  };

  const handleReadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const hasSnoozed = filters.includes?.includes("snoozed") || false;
    const updatedFilters = buildNotificationFilters({
      snoozed: hasSnoozed,
      read: checked,
      sortOrder: filters.sort_order as NotificationSortOrder,
    });
    updateFilters(updatedFilters);
  };

  // Handle settings menu actions
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setSettingsMenuAnchor(null);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete all notifications?")) {
      try {
        await deleteAll();
        setSettingsMenuAnchor(null);
      } catch (err) {
        // Error is handled by the hook
      }
    }
  };

  const handleDeleteAllRead = async () => {
    if (window.confirm("Are you sure you want to delete all read notifications?")) {
      try {
        await deleteAllRead();
        setSettingsMenuAnchor(null);
      } catch (err) {
        // Error is handled by the hook
      }
    }
  };

  const currentSortOrder = filters.sort_order === NotificationSortOrder.ASC ? "oldest" : "newest";

  // Get notification type details
  const getNotificationTypeDetails = (notificationType?: string) => {
    if (!notificationType) return { icon: "notifications", label: "Notification", color: neutralColor(600) };

    const typeMap: Record<string, { icon: string; label: string; color: string }> = {
      "conversation.mention": { icon: "alternate_email", label: "Mention", color: primaryColor(600) },
      "conversation.assigned": { icon: "person_add", label: "Assignment", color: primaryColor(600) },
      "conversation.created": { icon: "add_comment", label: "New Conversation", color: primaryColor(600) },
      "conversation.updated": { icon: "edit", label: "Updated", color: neutralColor(600) },
      "message.created": { icon: "message", label: "New Message", color: primaryColor(600) },
    };

    return typeMap[notificationType] || { icon: "notifications", label: notificationType, color: neutralColor(600) };
  };

  // Get snooze info text
  const getSnoozeText = (notification: any) => {
    if (notification.snoozed_until) {
      const snoozeDate = new Date(notification.snoozed_until);
      const now = new Date();
      if (snoozeDate > now) {
        const diffMs = snoozeDate.getTime() - now.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `Snoozed until ${diffMins}m`;
        if (diffHours < 24) return `Snoozed until ${diffHours}h`;
        return `Snoozed until ${diffDays}d`;
      }
      return "Snoozed ends";
    }

    const lastSnoozedAt = notification.meta?.lastSnoozedAt || notification.primary_actor?.meta?.lastSnoozedAt;
    if (lastSnoozedAt) {
      return "Snoozed";
    }

    return null;
  };

  // Get email subject from notification (for email channels)
  const getEmailSubject = (notification: any) => {
    const primaryActor = notification.primary_actor;
    const additionalAttrs = primaryActor?.additional_attributes;

    if (additionalAttrs?.mail_subject) {
      // Decode HTML entities
      const decoded = additionalAttrs.mail_subject
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
      return decoded;
    }
    return null;
  };

  // Get assignee info
  const getAssigneeInfo = (notification: any) => {
    const assignee = notification.primary_actor?.meta?.assignee;
    if (!assignee) return null;
    return {
      name: assignee.name || assignee.available_name || "Unknown",
      id: assignee.id,
      thumbnail: assignee.thumbnail || assignee.avatar_url || "",
    };
  };

  // Get conversation ID
  const getConversationId = (notification: any) => {
    return notification.primary_actor?.id || notification.primary_actor_id;
  };

  // Get message preview from notification
  const getMessagePreview = (notification: any) => {
    // First try to get actual message content from secondary_actor (the message itself)
    const messageContent = notification.secondary_actor?.content;

    if (messageContent) {
      // Remove HTML tags and extra whitespace
      const plainText = messageContent
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .replace(/={3,}/g, "") // Remove separator lines
        .trim();
      return plainText.length > 80 ? plainText.substring(0, 80) + "..." : plainText;
    }

    // Fallback to push message body
    const pushMessageBody = notification.push_message_body;
    if (pushMessageBody) {
      const plainText = pushMessageBody.replace(/<[^>]*>/g, "").trim();
      return plainText.length > 80 ? plainText.substring(0, 80) + "..." : plainText;
    }

    return "New message";
  };

  // Get conversation status badge text
  const getStatusLabel = (status?: string) => {
    if (!status || status === "open") return null;
    const statusMap: Record<string, string> = {
      resolved: "Resolved",
      pending: "Pending",
      snoozed: "Snoozed",
    };
    return statusMap[status] || status;
  };

  // Get status color
  const getStatusColor = (status?: string) => {
    if (!status || status === "open") return null;
    const colorMap: Record<string, string> = {
      resolved: neutralColor(600),
      pending: "#F59E0B",
      snoozed: neutralColor(500),
    };
    return colorMap[status] || neutralColor(600);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        border: `1px solid ${neutralColor(200)}`,
        borderRadius: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backgroundColor: neutralColor(0), // Light background, not dark gray
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: neutralColor(0), // Light background
          borderBottom: `1px solid ${neutralColor(200)}`,
          px: 2,
          py: 1.5,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                color: neutralColor(900),
              }}
            >
              Inbox
            </Typography>
            {/* Filter Dropdown */}
            <IconButton
              size="small"
              onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
              sx={{
                color: neutralColor(600),
                p: 0.5,
                "&:hover": {
                  backgroundColor: neutralColor(100),
                },
              }}
            >
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            {/* Settings Icon */}
            <IconButton
              size="small"
              onClick={(e) => setSettingsMenuAnchor(e.currentTarget)}
              sx={{
                color: neutralColor(600),
                backgroundColor: neutralColor(100),
                "&:hover": {
                  backgroundColor: neutralColor(200),
                },
                width: 32,
                height: 32,
              }}
            >
              <TuneIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        {/* Filter Menu - Dropdown */}
        <DropdownMenu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={() => setFilterMenuAnchor(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          width={280}
          disableContentPadding
        >
          {/* Display Options Section */}
          <Box sx={{ mb: 2 }}>
            <MenuSubheader>DISPLAY OPTIONS</MenuSubheader>

            {/* Snoozed Checkbox */}
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                const hasSnoozed = filters.includes?.includes("snoozed") || false;
                handleSnoozedChange({ target: { checked: !hasSnoozed } } as React.ChangeEvent<HTMLInputElement>);
              }}
              sx={{
                py: 1,
                px: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Checkbox
                checked={filters.includes?.includes("snoozed") || false}
                onChange={handleSnoozedChange}
                size="small"
                onClick={(e) => e.stopPropagation()}
              />
              <ListItemText
                primary="Snoozed"
                primaryTypographyProps={{
                  fontSize: 13,
                  fontWeight: filters.includes?.includes("snoozed") ? 600 : 400,
                }}
              />
            </MenuItem>

            {/* Read Checkbox */}
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                const hasRead = filters.includes?.includes("read") || false;
                handleReadChange({ target: { checked: !hasRead } } as React.ChangeEvent<HTMLInputElement>);
              }}
              sx={{
                py: 1,
                px: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Checkbox
                checked={filters.includes?.includes("read") || false}
                onChange={handleReadChange}
                size="small"
                onClick={(e) => e.stopPropagation()}
              />
              <ListItemText
                primary="Read"
                primaryTypographyProps={{
                  fontSize: 13,
                  fontWeight: filters.includes?.includes("read") ? 600 : 400,
                }}
              />
            </MenuItem>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Sort Order Section */}
          <Box>
            <MenuSubheader>SORT ORDER</MenuSubheader>
            <FormControl fullWidth size="small" sx={{ px: 2, pb: 1 }}>
              <Select
                value={currentSortOrder}
                onChange={handleSortOrderChange}
                sx={{
                  fontSize: 13,
                  "& .MuiSelect-select": {
                    py: 1,
                  },
                }}
              >
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="oldest">Oldest</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DropdownMenu>

        {/* Settings Menu */}
        <DropdownMenu
          anchorEl={settingsMenuAnchor}
          open={Boolean(settingsMenuAnchor)}
          onClose={() => setSettingsMenuAnchor(null)}
          width={200}
          disableContentPadding
        >
          <MenuItem onClick={handleMarkAllAsRead} sx={{ py: 1, px: 2 }}>
            <ListItemText
              primary="Mark all as read"
              primaryTypographyProps={{
                fontSize: 13,
              }}
            />
          </MenuItem>
          <MenuItem onClick={handleDeleteAllRead} sx={{ py: 1, px: 2 }}>
            <ListItemText
              primary="Delete all read"
              primaryTypographyProps={{
                fontSize: 13,
              }}
            />
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={handleDeleteAll}
            sx={{
              py: 1,
              px: 2,
              color: "error.main",
              "&:hover": {
                backgroundColor: "error.light",
                color: "error.dark",
              },
            }}
          >
            <ListItemText
              primary="Delete all"
              primaryTypographyProps={{
                fontSize: 13,
              }}
            />
          </MenuItem>
        </DropdownMenu>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          backgroundColor: neutralColor(0), // Light background
          px: 1,
        }}
      >
        {error ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" sx={{ color: "error.main" }}>
              {error}
            </Typography>
          </Box>
        ) : loading && notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: neutralColor(500) }}>
              Loading notifications...
            </Typography>
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: neutralColor(500) }}>
              No notifications found
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 1 }}>
            {notifications.map((notification) => {
              const sender = getNotificationSender(notification);
              const isUnread = !notification.read_at;
              const primaryActor = notification.primary_actor as any; // Extended type with conversation fields
              const snoozeText = getSnoozeText(notification);
              const hasSnooze = !!snoozeText;
              const notificationDetails = hasSnooze ? null : getNotificationTypeDetails(notification.notification_type);
              const messagePreview = getMessagePreview(notification);
              const statusLabel = getStatusLabel(primaryActor?.status);
              const statusColor = getStatusColor(primaryActor?.status);
              const lastActivityAt = primaryActor?.last_activity_at || notification.updated_at || notification.created_at;

              // Extract conversation metadata
              const conversationMeta = primaryActor?.meta || {};
              const inboxChannelType =
                conversationMeta.channel?.type || (primaryActor?.inbox_id ? conversationMeta.inbox?.channel_type || null : null);
              const inboxMedium = conversationMeta.channel?.medium || conversationMeta.inbox?.medium;
              const inboxName = conversationMeta.inbox?.name || conversationMeta.channel?.name;
              const priority = primaryActor?.priority;
              const slaPolicy = primaryActor?.sla_policy_id
                ? {
                    id: primaryActor.sla_policy_id,
                    firstResponseThreshold: conversationMeta.sla?.firstResponseThreshold,
                    nextResponseThreshold: conversationMeta.sla?.nextResponseThreshold,
                    resolutionThreshold: conversationMeta.sla?.resolutionThreshold,
                  }
                : null;

              const handleNotificationClick = async () => {
                // Mark all notifications for this conversation as read
                if (primaryActor?.id) {
                  try {
                    await markConversationAsRead(primaryActor.id);
                  } catch (err) {
                    // Error is logged by the hook
                    console.error('Failed to mark conversation notifications as read:', err);
                  }
                }
                // Navigation would go here if needed
                // For now, notifications are just marked as read
              };

              // Extract meaningful data
              const emailSubject = getEmailSubject(notification);
              const assigneeInfo = getAssigneeInfo(notification);
              const conversationId = getConversationId(notification);

              return (
                <ListItem
                  key={notification.id}
                  onClick={handleNotificationClick}
                  onContextMenu={(e) => handleNotificationContextMenu(e, notification)}
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
            })}
          </List>
        )}
      </Box>

      {/* Context Menu */}
      <ConversationContextMenu
        anchorPosition={contextMenuPosition}
        open={Boolean(contextMenuPosition)}
        onClose={handleCloseContextMenu}
        conversationId={selectedNotification?.id || 0}
        actions={notificationContextMenu.actions}
        onActionClick={handleContextMenuAction}
      />
    </Paper>
  );
};
