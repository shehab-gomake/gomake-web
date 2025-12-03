import React, { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Card } from "@/widgets/frontdesk/design-system";
import { colorTokens, radiusTokens, shadowTokens, semanticSpacing } from "@/widgets/frontdesk/design-system";
import { useChatwootNotifications } from "../hooks/use-chatwoot-notifications";
import { useChatwootNotificationContextMenu } from "../hooks/use-chatwoot-notification-context-menu";
import { ChatwootNotification } from "@/services/frontdesk/api/chatwoot/types/notifications.types";
import { ConversationContextMenu } from "@/widgets/frontdesk/components/shared";
import {
  NotificationFilters,
  NotificationPillFilters,
  NotificationSettingsMenu,
  NotificationList,
} from "./notifications";

export const ChatwootNotificationsView: React.FC = () => {
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
    <Card
      elevation={1}
      border="default"
      padding="none"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderLeft: `2px solid ${colorTokens.neutral[200]}`,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: colorTokens.semantic.background.primary,
          borderBottom: `1px solid ${colorTokens.neutral[200]}`,
          px: semanticSpacing.container.lg / 8, // 24px padding (24/8 = 3 MUI units)
          py: 2,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                color: colorTokens.neutral[900],
                lineHeight: 1.5,
              }}
            >
              Notifications
            </Typography>
            <NotificationPillFilters
              filters={filters}
              onFiltersChange={updateFilters}
            />
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <NotificationFilters
              filters={filters}
              onFiltersChange={updateFilters}
            />
            <NotificationSettingsMenu
              onMarkAllAsRead={markAllAsRead}
              onDeleteAll={deleteAll}
              onDeleteAllRead={deleteAllRead}
            />
          </Stack>
        </Stack>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          backgroundColor: colorTokens.semantic.background.primary,
          px: semanticSpacing.container.lg / 8, // 24px padding (24/8 = 3 MUI units)
          py: 2,
        }}
      >
        <NotificationList
          notifications={notifications}
          loading={loading}
          error={error}
          onNotificationClick={handleNotificationClick}
          onNotificationContextMenu={handleNotificationContextMenu}
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
    </Card>
  );
};
