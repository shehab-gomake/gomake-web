/**
 * useChatwootNotifications Hook
 *
 * Manages notifications fetching and state for Chatwoot My Inbox view.
 * Follows the same pattern as use-chatwoot-conversations for consistency.
 *
 * Updated to use the unified Chatwoot Notifications API from NOTIFICATIONS_FRONTEND_API_GUIDE.md
 *
 * Features:
 * - Real-time WebSocket updates
 * - Optimistic UI updates
 * - Unread count tracking
 * - Mark conversation notifications as read
 * - Individual notification actions (mark as read, delete, snooze)
 */

import { useEffect, useCallback, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import { createLogger } from "@/services/frontdesk/utils/logger";
import {
  chatwootNotificationsAtom,
  chatwootNotificationsLoadingAtom,
  chatwootNotificationsErrorAtom,
  chatwootNotificationsFiltersAtom,
  chatwootSelectedAccountAtom,
  chatwootNotificationUnreadCountAtom,
  chatwootNotificationConnectionAtom,
  chatwootNotificationMetaAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import type {
  NotificationListParams,
  NotificationSortOrder,
  ChatwootNotification,
} from "@/services/frontdesk/api/chatwoot/types/notifications.types";
import {
  createDefaultNotificationFilters,
} from "../utils/notification-filter-utils";
import {
  loadNotificationPreferences,
  saveNotificationPreferences,
} from "../utils/notification-preferences.service";
import { useFetchDeduplication } from "./use-chatwoot-initialization";
import { useChatwootNotificationWebSocket } from "./use-chatwoot-notification-websocket";

const logger = createLogger("useChatwootNotifications");

export interface UseChatwootNotificationsOptions extends Partial<NotificationListParams> {
  /**
   * Enable WebSocket real-time updates
   * @default true
   */
  enableWebSocket?: boolean;
}

export const useChatwootNotifications = (
  options: UseChatwootNotificationsOptions = {}
) => {
  const { enableWebSocket = true, ...filterOptions } = options;
  const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);
  const [notifications, setNotifications] = useRecoilState(chatwootNotificationsAtom);
  const [loading, setLoading] = useRecoilState(chatwootNotificationsLoadingAtom);
  const [error, setError] = useRecoilState(chatwootNotificationsErrorAtom);
  const [filters, setFilters] = useRecoilState(chatwootNotificationsFiltersAtom);

  // New: Unread count tracking
  const [unreadCount, setUnreadCount] = useRecoilState(chatwootNotificationUnreadCountAtom);
  const [notificationMeta, setNotificationMeta] = useRecoilState(chatwootNotificationMetaAtom);
  const setConnectionState = useSetRecoilState(chatwootNotificationConnectionAtom);

  // Fetch deduplication to prevent redundant API calls
  const { shouldFetch, markFetchStart, markFetchComplete, markFetchFailed} = useFetchDeduplication<NotificationListParams>();

  // Track if this is the first mount
  const isFirstMountRef = useRef(true);
  const preferencesLoadedRef = useRef(false);

  // WebSocket connection for real-time updates
  const { connected: wsConnected, error: wsError } = useChatwootNotificationWebSocket({
    enabled: enableWebSocket,
    autoConnect: true,
  });

  /**
   * Load saved preferences on mount and merge with default filters
   */
  useEffect(() => {
    // Only load preferences once
    if (preferencesLoadedRef.current) return;
    preferencesLoadedRef.current = true;

    const savedPreferences = loadNotificationPreferences();
    const defaultFilters = createDefaultNotificationFilters({
      ...filterOptions,
      ...savedPreferences,
    });

    // Only update if we have saved preferences or options, otherwise keep current state
    if (Object.keys(savedPreferences).length > 0 || Object.keys(filterOptions).length > 0) {
      setFilters((prev) => ({
        ...defaultFilters,
        ...prev, // Preserve any existing filter state
        ...savedPreferences, // Apply saved preferences
        ...filterOptions, // Apply passed options
      }));
    }
  }, [setFilters, filterOptions]); // Only run on mount

  /**
   * Fetch notifications with current filters
   * Follows the same pattern as use-chatwoot-conversations
   */
  const fetchNotifications = useCallback(async () => {
    if (!selectedAccountId) {
      logger.warn("No account selected, skipping fetch");
      return;
    }

    const listParams: NotificationListParams = {
      page: filters.page || 1,
      ...(filters.sort_order && { sort_order: filters.sort_order as NotificationSortOrder }),
      ...(filters.includes && { includes: filters.includes }),
      ...filterOptions, // Merge with passed filter options
    };

    // Check if we should proceed with this fetch (prevents duplicates and concurrent fetches)
    if (!shouldFetch(listParams)) {
      logger.debug('Skipping duplicate/concurrent fetch');
      return;
    }

    markFetchStart();
    setLoading(true);
    setError(null);

    try {
      const response = await chatwootService.notifications.listNotifications(
        selectedAccountId,
        listParams
      );

      // Handle new response structure from NOTIFICATIONS_FRONTEND_API_GUIDE.md
      const notificationsList = response.data?.payload || [];
      const meta = response.data?.meta;

      setNotifications(notificationsList);

      // Store meta information (count and unread_count from API)
      if (meta) {
        setNotificationMeta({
          count: meta.count || 0,
          unread_count: meta.unread_count || 0,
        });
        // Also update unread count atom for backward compatibility
        setUnreadCount(meta.unread_count || 0);
      }

      // Mark fetch as complete to prevent duplicate calls
      markFetchComplete(listParams);
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to fetch notifications";
      setError(errorMessage);
      logger.error("Failed to fetch notifications", err);
      setNotifications([]);
      markFetchFailed();
    } finally {
      setLoading(false);
    }
  }, [
    selectedAccountId,
    filters,
    filterOptions,
    setNotifications,
    setLoading,
    setError,
    setNotificationMeta,
    setUnreadCount,
    shouldFetch,
    markFetchStart,
    markFetchComplete,
    markFetchFailed,
  ]);

  /**
   * Update filters with automatic preference persistence
   */
  const updateFilters = useCallback(
    (newFilters: Partial<NotificationListParams>) => {
      setFilters((prev) => {
        const updated = {
          ...prev,
          ...newFilters,
          // Ensure page resets to 1 when filters change (except when explicitly setting page)
          page: newFilters.page !== undefined ? newFilters.page : (newFilters.includes !== undefined || newFilters.sort_order !== undefined ? 1 : prev.page || 1),
        };

        // Persist preferences to localStorage
        saveNotificationPreferences(updated);

        return updated;
      });
    },
    [setFilters]
  );

  /**
   * Refresh notifications
   */
  const refresh = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    if (!selectedAccountId) {
      logger.warn("No account selected");
      return;
    }
    try {
      await chatwootService.notifications.markAllAsRead(selectedAccountId);
      // Refresh notifications to get updated read status
      await refresh();
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to mark all as read";
      setError(errorMessage);
      logger.error("Failed to mark all as read", err);
      throw err;
    }
  }, [selectedAccountId, refresh, setError]);

  /**
   * Delete all notifications
   */
  const deleteAll = useCallback(async () => {
    if (!selectedAccountId) {
      logger.warn("No account selected");
      return;
    }
    try {
      await chatwootService.notifications.deleteAll(selectedAccountId, "all");
      // Clear notifications from state
      setNotifications([]);
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to delete all notifications";
      setError(errorMessage);
      logger.error("Failed to delete all notifications", err);
      throw err;
    }
  }, [selectedAccountId, setNotifications, setError]);

  /**
   * Delete all read notifications
   */
  const deleteAllRead = useCallback(async () => {
    if (!selectedAccountId) {
      logger.warn("No account selected");
      return;
    }
    try {
      await chatwootService.notifications.deleteAll(selectedAccountId, "read");
      // Refresh notifications to remove deleted items
      await refresh();
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to delete all read notifications";
      setError(errorMessage);
      logger.error("Failed to delete all read notifications", err);
      throw err;
    }
  }, [selectedAccountId, refresh, setError]);

  /**
   * Mark single notification as read with optimistic update
   */
  const markAsRead = useCallback(async (notificationId: number) => {
    if (!selectedAccountId) {
      logger.warn("No account selected");
      return;
    }

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n
      )
    );

    try {
      await chatwootService.notifications.markAsRead(selectedAccountId, notificationId);
      // Decrement unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      // Revert optimistic update on error
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read_at: null } : n
        )
      );
      const errorMessage = err?.message || "Failed to mark notification as read";
      setError(errorMessage);
      logger.error("Failed to mark notification as read", err);
      throw err;
    }
  }, [selectedAccountId, setNotifications, setUnreadCount, setError]);

  /**
   * Mark single notification as unread
   */
  const markAsUnread = useCallback(async (notificationId: number) => {
    if (!selectedAccountId) {
      logger.warn("No account selected");
      return;
    }

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read_at: null } : n
      )
    );

    try {
      await chatwootService.notifications.markAsUnread(selectedAccountId, notificationId);
      // Increment unread count
      setUnreadCount((prev) => prev + 1);
    } catch (err: any) {
      // Revert optimistic update on error
      const errorMessage = err?.message || "Failed to mark notification as unread";
      setError(errorMessage);
      logger.error("Failed to mark notification as unread", err);
      throw err;
    }
  }, [selectedAccountId, setNotifications, setUnreadCount, setError]);

  /**
   * Delete single notification with optimistic update
   */
  const deleteNotification = useCallback(async (notificationId: number) => {
    if (!selectedAccountId) {
      logger.warn("No account selected");
      return;
    }

    // Store for potential revert
    const notificationToDelete = notifications.find((n) => n.id === notificationId);

    // Optimistic update
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

    // Update unread count if notification was unread
    if (notificationToDelete && !notificationToDelete.read_at) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    try {
      await chatwootService.notifications.deleteNotification(selectedAccountId, notificationId);
    } catch (err: any) {
      // Revert optimistic update on error
      if (notificationToDelete) {
        setNotifications((prev) => [...prev, notificationToDelete]);
        if (!notificationToDelete.read_at) {
          setUnreadCount((prev) => prev + 1);
        }
      }
      const errorMessage = err?.message || "Failed to delete notification";
      setError(errorMessage);
      logger.error("Failed to delete notification", err);
      throw err;
    }
  }, [selectedAccountId, notifications, setNotifications, setUnreadCount, setError]);

  /**
   * Snooze/unsnooze notification
   */
  const snoozeNotification = useCallback(
    async (notificationId: number, snoozedUntil: string | null) => {
      if (!selectedAccountId) {
        logger.warn("No account selected");
        return;
      }

      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, snoozed_until: snoozedUntil } : n
        )
      );

      try {
        await chatwootService.notifications.snoozeNotification(
          selectedAccountId,
          notificationId,
          snoozedUntil
        );
      } catch (err: any) {
        // Revert optimistic update on error
        await refresh();
        const errorMessage = err?.message || "Failed to snooze notification";
        setError(errorMessage);
        logger.error("Failed to snooze notification", err);
        throw err;
      }
    },
    [selectedAccountId, setNotifications, refresh, setError]
  );

  /**
   * Mark all notifications for a conversation as read
   * This is the critical method from BEHAVIORAL_ENDPOINTS.md
   */
  const markConversationAsRead = useCallback(
    async (conversationId: number) => {
      if (!selectedAccountId) {
        logger.warn("No account selected");
        return;
      }

      // Optimistic update: mark all notifications for this conversation as read
      setNotifications((prev) =>
        prev.map((n) =>
          n.primary_actor_type === "Conversation" &&
          n.primary_actor_id === conversationId &&
          !n.read_at
            ? { ...n, read_at: new Date().toISOString() }
            : n
        )
      );

      // Update unread count
      const unreadForConversation = notifications.filter(
        (n) =>
          n.primary_actor_type === "Conversation" &&
          n.primary_actor_id === conversationId &&
          !n.read_at
      ).length;
      setUnreadCount((prev) => Math.max(0, prev - unreadForConversation));

      try {
        await chatwootService.notifications.markConversationAsRead(
          selectedAccountId,
          conversationId
        );
      } catch (err: any) {
        // Revert on error
        await refresh();
        const errorMessage = err?.message || "Failed to mark conversation notifications as read";
        setError(errorMessage);
        logger.error("Failed to mark conversation notifications as read", err);
        throw err;
      }
    },
    [selectedAccountId, notifications, setNotifications, setUnreadCount, refresh, setError]
  );

  /**
   * Fetch notifications when filters change
   * Follows the same pattern as use-chatwoot-conversations
   */
  useEffect(() => {
    // Wait for account ID to be available
    if (!selectedAccountId) {
      logger.debug("No account ID, skipping fetch");
      return;
    }

    // Skip the first mount to prevent double fetch during initialization
    // Wait for preferences to be loaded first
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      // Fetch after a short delay to ensure preferences are loaded
      const timeoutId = setTimeout(() => {
        if (selectedAccountId) {
          logger.debug("Fetching notifications on first mount");
          fetchNotifications();
        }
      }, 150);
      return () => clearTimeout(timeoutId);
    }

    logger.debug("Fetching notifications due to filter/account change");
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.includes,
    filters.sort_order,
    filters.page,
    selectedAccountId,
  ]);

  return {
    // State
    notifications,
    loading,
    error,
    filters,
    unreadCount,
    notificationMeta, // count and unread_count from API

    // WebSocket state
    wsConnected,
    wsError,

    // Filter actions
    updateFilters,
    refresh,

    // Bulk actions
    markAllAsRead,
    deleteAll,
    deleteAllRead,

    // Individual notification actions
    markAsRead,
    markAsUnread,
    deleteNotification,
    snoozeNotification,

    // Conversation-specific action (critical for dual-call pattern)
    markConversationAsRead,
  };
};

