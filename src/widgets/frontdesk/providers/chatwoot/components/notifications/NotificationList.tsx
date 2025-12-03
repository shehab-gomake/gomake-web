/**
 * NotificationList Component
 * Renders a list of notifications with empty states
 */

import React from "react";
import { Box, Typography, List } from "@mui/material";
import { ChatwootNotification } from "@/services/frontdesk/api/chatwoot/types/notifications.types";
import { NotificationListItem } from "./NotificationListItem";
import { colorTokens, radiusTokens, shadowTokens } from "@/widgets/frontdesk/design-system";

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
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" sx={{ color: "error.main" }}>
          {error}
        </Typography>
      </Box>
    );
  }

  // Loading state
  if (loading && notifications.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: colorTokens.neutral[500] }}>
          Loading notifications...
        </Typography>
      </Box>
    );
  }

  // Empty state
  if (notifications.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: colorTokens.neutral[500] }}>
          No notifications found
        </Typography>
      </Box>
    );
  }

  // List of notifications
  return (
    <List sx={{ py: 1 }}>
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
