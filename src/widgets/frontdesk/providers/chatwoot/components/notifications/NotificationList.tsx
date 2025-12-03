/**
 * NotificationList Component
 * Renders a list of notifications with empty states
 */

import React from "react";
import { Box, Typography, List, CircularProgress } from "@mui/material";
import { NotificationsNone as NotificationsNoneIcon } from "@mui/icons-material";
import { ChatwootNotification } from "@/services/frontdesk/api/chatwoot/types/notifications.types";
import { NotificationListItem } from "./NotificationListItem";
import { colorTokens, radiusTokens, shadowTokens } from "@/widgets/frontdesk/design-system";
import { EmptyState } from "@/widgets/frontdesk/design-system";

interface NotificationListProps {
  notifications: ChatwootNotification[];
  loading: boolean;
  error: string | null;
  onNotificationClick: (notification: ChatwootNotification) => Promise<void>;
  onNotificationContextMenu: (event: React.MouseEvent<HTMLLIElement>, notification: ChatwootNotification) => void;
  primaryColor?: (shade: number) => string;
  neutralColor?: (shade: number) => string;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  loading,
  error,
  onNotificationClick,
  onNotificationContextMenu,
  primaryColor,
  neutralColor,
}) => {
  // Error state
  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <EmptyState
          icon={<NotificationsNoneIcon />}
          title="Error loading notifications"
          description={error}
        />
      </Box>
    );
  }

  // Loading state
  if (loading && notifications.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
          py: 4,
        }}
      >
        <CircularProgress size={32} sx={{ color: colorTokens.primary[600], mb: 2 }} />
        <Typography variant="body2" sx={{ color: colorTokens.neutral[600] }}>
          Loading notifications...
        </Typography>
      </Box>
    );
  }

  // Empty state
  if (notifications.length === 0) {
    return (
      <Box sx={{ py: 4 }}>
        <EmptyState
          icon={<NotificationsNoneIcon />}
          title="No notifications"
          description="You're all caught up! New notifications will appear here when you receive them."
        />
      </Box>
    );
  }

  // List of notifications
  return (
    <List sx={{ py: 0, mx: -3 }}>
      {notifications.map((notification) => (
        <NotificationListItem
          key={notification.id}
          notification={notification}
          onClick={() => onNotificationClick(notification)}
          onContextMenu={(e) => onNotificationContextMenu(e, notification)}
        />
      ))}
    </List>
  );
};
