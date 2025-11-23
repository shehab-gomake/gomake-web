/**
 * Chatwoot Notification Context Menu Hook
 *
 * Provides context menu actions and handlers for Chatwoot notifications (My Inbox).
 * Implements optimistic updates via useChatwootNotifications hook.
 *
 * Pattern: Follows use-chatwoot-context-menu.ts but adapted for notifications
 */

import { useCallback, useMemo } from "react";
import { ChatwootNotification } from "@/services/frontdesk/api/chatwoot/types/notifications.types";
import { useChatwootNotifications } from "./use-chatwoot-notifications";

/**
 * Simple notification utility
 * TODO: Replace with proper toast library when available
 */
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // TODO: Integrate with toast library (notistack, react-toastify, etc.)
};

/**
 * Context Menu Action Definition
 * Reuses the same interface as conversation context menu
 */
export interface ContextMenuAction {
  id: string;
  label: string;
  icon?: string;
  divider?: boolean;
  submenu?: ContextMenuAction[];
  disabled?: boolean;
}

/**
 * Custom hook for Chatwoot notification context menu
 *
 * @param notification - The notification to show context menu for
 */
export const useChatwootNotificationContextMenu = (notification: ChatwootNotification | null) => {
  const {
    markAsRead,
    markAsUnread,
  } = useChatwootNotifications();

  /**
   * Handle Mark as Read
   */
  const handleMarkAsRead = useCallback(
    async () => {
      if (!notification?.id) {
        showNotification("Cannot perform action: Missing notification", "error");
        return;
      }

      try {
        await markAsRead(notification.id);
        showNotification("Notification marked as read", "success");
      } catch (error: any) {
        showNotification("Failed to mark notification as read", "error");
        console.error("Failed to mark notification as read:", error);
      }
    },
    [notification, markAsRead]
  );

  /**
   * Handle Mark as Unread
   */
  const handleMarkAsUnread = useCallback(
    async () => {
      if (!notification?.id) {
        showNotification("Cannot perform action: Missing notification", "error");
        return;
      }

      try {
        await markAsUnread(notification.id);
        showNotification("Notification marked as unread", "success");
      } catch (error: any) {
        showNotification("Failed to mark notification as unread", "error");
        console.error("Failed to mark notification as unread:", error);
      }
    },
    [notification, markAsUnread]
  );

  /**
   * Get available actions based on notification state
   */
  const availableActions = useMemo((): ContextMenuAction[] => {
    if (!notification) return [];

    const actions: ContextMenuAction[] = [];
    const isUnread = !notification.read_at;

    // Mark as Read/Unread - toggle based on current state
    if (isUnread) {
      actions.push({
        id: 'mark-read',
        label: 'Mark as read',
        icon: 'mail',
      });
    } else {
      actions.push({
        id: 'mark-unread',
        label: 'Mark as unread',
        icon: 'mail-unread',
      });
    }

    return actions;
  }, [notification]);

  /**
   * Main action handler - routes to appropriate handler based on action ID
   */
  const handleAction = useCallback(
    async (actionId: string) => {
      if (!notification) return;

      switch (actionId) {
        case 'mark-read':
          await handleMarkAsRead();
          break;
        case 'mark-unread':
          await handleMarkAsUnread();
          break;
        default:
          console.warn(`Unknown action: ${actionId}`);
      }
    },
    [notification, handleMarkAsRead, handleMarkAsUnread]
  );

  return {
    actions: availableActions,
    handleAction,
    // Expose individual handlers for advanced use cases
    handlers: {
      markAsRead: handleMarkAsRead,
      markAsUnread: handleMarkAsUnread,
    },
  };
};
