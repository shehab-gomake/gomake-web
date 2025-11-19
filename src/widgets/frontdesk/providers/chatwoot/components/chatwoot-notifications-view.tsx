import React, { useState } from "react";
import { Box, Stack, Typography, Paper } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useChatwootNotifications } from "../hooks/use-chatwoot-notifications";
import { useChatwootNotificationContextMenu } from "../hooks/use-chatwoot-notification-context-menu";
import { ChatwootNotification } from "@/services/frontdesk/api/chatwoot/types/notifications.types";
import { ConversationContextMenu } from "@/widgets/frontdesk/components/shared";
import {
  NotificationFilters,
  NotificationSettingsMenu,
  NotificationList,
} from "./notifications";

export const ChatwootNotificationsView: React.FC = () => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const {
    notifications,
    loading,
    error,
    filters,
    updateFilters,
    markAllAsRead,
    deleteAll,
    deleteAllRead,
    markConversationAsRead,
  } = useChatwootNotifications();

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

  /**
   * Handle notification click - mark as read
   */
  const handleNotificationClick = async (notification: ChatwootNotification) => {
    const primaryActor = notification.primary_actor as any;
    if (primaryActor?.id) {
      try {
        await markConversationAsRead(primaryActor.id);
      } catch (err) {
        console.error("Failed to mark conversation notifications as read:", err);
      }
    }
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
        backgroundColor: neutralColor(0),
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: neutralColor(0),
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
            <NotificationFilters
              filters={filters}
              onFiltersChange={updateFilters}
              neutralColor={neutralColor}
            />
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <NotificationSettingsMenu
              onMarkAllAsRead={markAllAsRead}
              onDeleteAll={deleteAll}
              onDeleteAllRead={deleteAllRead}
              neutralColor={neutralColor}
            />
          </Stack>
        </Stack>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          backgroundColor: neutralColor(0),
          px: 1,
        }}
      >
        <NotificationList
          notifications={notifications}
          loading={loading}
          error={error}
          onNotificationClick={handleNotificationClick}
          onNotificationContextMenu={handleNotificationContextMenu}
          primaryColor={primaryColor}
          neutralColor={neutralColor}
        />
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
