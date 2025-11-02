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
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useChatwootNotifications } from "../hooks/use-chatwoot-notifications";
import { NotificationSortOrder } from "@/services/frontdesk/api/chatwoot/types/notifications.types";
import { buildNotificationFilters } from "../utils/notification-filter-utils";
import { DropdownMenu, MenuSubheader } from "@/widgets/frontdesk/components/dropdown-menu/dropdown-menu";
import { ConversationPriorityIcon } from "./conversation-priority-icon";
import { ConversationSLALabel } from "./conversation-sla-label";
import { InboxIcon } from "../utils/inbox-icons";
import Tooltip from "@mui/material/Tooltip";

export const ChatwootNotificationsView: React.FC = () => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const { notifications, loading, error, filters, updateFilters, markAllAsRead, deleteAll, deleteAllRead } =
    useChatwootNotifications();
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [settingsMenuAnchor, setSettingsMenuAnchor] = useState<null | HTMLElement>(null);

  // Get notification sender info
  const getNotificationSender = (notification: any) => {
    const primaryActor = notification.primary_actor;
    if (!primaryActor) return { name: "System", initials: "S", color: neutralColor(400) };

    const name = primaryActor.name || primaryActor.email || "Unknown";
    const initials = name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    // Generate color based on name
    const colors = [primaryColor(500), "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
    const colorIndex = name.charCodeAt(0) % colors.length;

    return { name, initials, color: colors[colorIndex] };
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
    const updatedFilters = buildNotificationFilters({
      snoozed: filters.snoozed,
      read: filters.read,
      sortOrder,
    });
    updateFilters(updatedFilters);
  };

  // Handle checkbox changes
  const handleSnoozedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const updatedFilters = buildNotificationFilters({
      snoozed: checked,
      read: filters.read,
      sortOrder: filters.sort_order as NotificationSortOrder,
    });
    updateFilters(updatedFilters);
  };

  const handleReadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const updatedFilters = buildNotificationFilters({
      snoozed: filters.snoozed,
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

  // Get message preview from notification
  const getMessagePreview = (notification: any) => {
    const pushMessageBody =
      notification.meta?.pushMessageBody ||
      notification.primary_actor?.meta?.pushMessageBody ||
      notification.meta?.message?.content ||
      "";

    if (!pushMessageBody) {
      return notification.notification_type || "Notification";
    }

    // Remove HTML tags and truncate
    const plainText = pushMessageBody.replace(/<[^>]*>/g, "").trim();
    return plainText.length > 100 ? plainText.substring(0, 100) + "..." : plainText;
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
                handleSnoozedChange({ target: { checked: !filters.snoozed } } as React.ChangeEvent<HTMLInputElement>);
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
                checked={filters.snoozed || false}
                onChange={handleSnoozedChange}
                size="small"
                onClick={(e) => e.stopPropagation()}
              />
              <ListItemText
                primary="Snoozed"
                primaryTypographyProps={{
                  fontSize: 13,
                  fontWeight: filters.snoozed ? 600 : 400,
                }}
              />
            </MenuItem>

            {/* Read Checkbox */}
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                handleReadChange({ target: { checked: !filters.read } } as React.ChangeEvent<HTMLInputElement>);
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
                checked={filters.read || false}
                onChange={handleReadChange}
                size="small"
                onClick={(e) => e.stopPropagation()}
              />
              <ListItemText
                primary="Read"
                primaryTypographyProps={{
                  fontSize: 13,
                  fontWeight: filters.read ? 600 : 400,
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

              return (
                <ListItem
                  key={notification.id}
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
                    {/* Avatar (20px) */}
                    <Avatar
                      src={conversationMeta.sender?.thumbnail || primaryActor?.avatar_url}
                      sx={{
                        width: 20,
                        height: 20,
                        bgcolor: sender.color,
                        color: "white",
                        fontSize: "0.625rem",
                        fontWeight: 600,
                        flexShrink: 0,
                        mt: 0.5,
                      }}
                    >
                      {sender.initials}
                    </Avatar>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {/* Row 1: Primary Message */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: 13,
                          fontWeight: isUnread ? 600 : 400,
                          color: neutralColor(900),
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

                      {/* Row 2: Secondary Info */}
                      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                        {/* Left: Square Icon + Notification Type or Snooze */}
                        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
                          {hasSnooze ? (
                            <>
                              <AccessTimeIcon
                                sx={{
                                  fontSize: 14,
                                  color: isUnread ? primaryColor(600) : neutralColor(500),
                                  flexShrink: 0,
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: 12,
                                  fontWeight: 400,
                                  color: isUnread ? primaryColor(600) : neutralColor(500),
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {snoozeText}
                              </Typography>
                            </>
                          ) : (
                            <>
                              {/* Square Icon */}
                              <Box
                                sx={{
                                  width: 14,
                                  height: 14,
                                  borderRadius: 1,
                                  backgroundColor: isUnread ? primaryColor(600) : neutralColor(400),
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <AddCommentIcon sx={{ fontSize: 10, color: "white" }} />
                              </Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: 12,
                                  fontWeight: 400,
                                  color: isUnread ? primaryColor(600) : neutralColor(500),
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {notificationDetails?.label || "New message"}
                              </Typography>
                            </>
                          )}

                          {/* Status Badge */}
                          {statusLabel && (
                            <Chip
                              label={statusLabel}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: 11,
                                backgroundColor: statusColor ? `${statusColor}20` : neutralColor(100),
                                color: statusColor || neutralColor(700),
                                border: `1px solid ${statusColor || neutralColor(300)}`,
                                fontWeight: 400,
                                flexShrink: 0,
                                ml: 0.5,
                              }}
                            />
                          )}
                        </Stack>

                        {/* Right: Priority | Inbox | Timestamp */}
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
                          {/* Priority Icon */}
                          {priority && <ConversationPriorityIcon priority={priority} size={12} />}

                          {/* Inbox/Envelope Icon */}
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
                                <InboxIcon channelType={inboxChannelType} medium={inboxMedium} size={14} />
                              </Box>
                            </Tooltip>
                          )}

                          {/* Timestamp */}
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: 12,
                              color: neutralColor(500),
                              whiteSpace: "nowrap",
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
    </Paper>
  );
};
