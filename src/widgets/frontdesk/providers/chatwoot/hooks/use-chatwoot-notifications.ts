/**
 * useChatwootNotifications Hook
 *
 * Manages notifications fetching and state for Chatwoot My Inbox view.
 * Follows the same pattern as use-chatwoot-conversations for consistency.
 */

import { useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import { createLogger } from "@/services/frontdesk/utils/logger";
import {
  chatwootNotificationsAtom,
  chatwootNotificationsLoadingAtom,
  chatwootNotificationsErrorAtom,
  chatwootNotificationsFiltersAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { NotificationListParams, NotificationSortOrder } from "@/services/frontdesk/api/chatwoot/types/notifications.types";
import {
  createDefaultNotificationFilters,
} from "../utils/notification-filter-utils";
import {
  loadNotificationPreferences,
  saveNotificationPreferences,
} from "../utils/notification-preferences.service";

const logger = createLogger("useChatwootNotifications");

export const useChatwootNotifications = (
  options: Partial<NotificationListParams> = {}
) => {
  const [notifications, setNotifications] = useRecoilState(chatwootNotificationsAtom);
  const [loading, setLoading] = useRecoilState(chatwootNotificationsLoadingAtom);
  const [error, setError] = useRecoilState(chatwootNotificationsErrorAtom);
  const [filters, setFilters] = useRecoilState(chatwootNotificationsFiltersAtom);

  /**
   * Load saved preferences on mount and merge with default filters
   */
  useEffect(() => {
    const savedPreferences = loadNotificationPreferences();
    const defaultFilters = createDefaultNotificationFilters({
      ...options,
      ...savedPreferences,
    });
    
    // Only update if we have saved preferences or options, otherwise keep current state
    if (Object.keys(savedPreferences).length > 0 || Object.keys(options).length > 0) {
      setFilters((prev) => ({
        ...defaultFilters,
        ...prev, // Preserve any existing filter state
        ...savedPreferences, // Apply saved preferences
        ...options, // Apply passed options
      }));
    }
  }, [setFilters]); // Only run on mount

  /**
   * Fetch notifications with current filters
   * Follows the same pattern as use-chatwoot-conversations
   */
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const listParams: NotificationListParams = {
        page: filters.page || 1,
        limit: filters.limit || options.limit || 20,
        ...(filters.sort_order && { sort_order: filters.sort_order as NotificationSortOrder }),
        ...(filters.includes && { includes: filters.includes }),
        ...(filters.snoozed !== undefined && { snoozed: filters.snoozed }),
        ...(filters.read !== undefined && { read: filters.read }),
        ...options, // Merge with passed options
      };

      const response = await chatwootService.notifications.listNotifications(listParams);
      
      // Handle nested response structure (same as conversations)
      const responseData = response.data || response;
      const notificationsList = responseData.payload || responseData.data || responseData || [];
      
      setNotifications(notificationsList);
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to fetch notifications";
      setError(errorMessage);
      logger.error("Failed to fetch notifications", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [
    filters,
    options,
    setNotifications,
    setLoading,
    setError,
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
          page: newFilters.page !== undefined ? newFilters.page : (newFilters.snoozed !== undefined || newFilters.read !== undefined || newFilters.sort_order !== undefined ? 1 : prev.page || 1),
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
    try {
      await chatwootService.notifications.markAllAsRead();
      // Refresh notifications to get updated read status
      await refresh();
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to mark all as read";
      setError(errorMessage);
      logger.error("Failed to mark all as read", err);
      throw err;
    }
  }, [refresh, setError]);

  /**
   * Delete all notifications
   */
  const deleteAll = useCallback(async () => {
    try {
      await chatwootService.notifications.deleteAll();
      // Clear notifications from state
      setNotifications([]);
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to delete all notifications";
      setError(errorMessage);
      logger.error("Failed to delete all notifications", err);
      throw err;
    }
  }, [setNotifications, setError]);

  /**
   * Delete all read notifications
   */
  const deleteAllRead = useCallback(async () => {
    try {
      await chatwootService.notifications.deleteAllRead();
      // Refresh notifications to remove deleted items
      await refresh();
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to delete all read notifications";
      setError(errorMessage);
      logger.error("Failed to delete all read notifications", err);
      throw err;
    }
  }, [refresh, setError]);

  /**
   * Fetch notifications when filters change
   * Follows the same pattern as use-chatwoot-conversations
   */
  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.snoozed,
    filters.read,
    filters.sort_order,
    filters.page,
    filters.limit,
  ]);

  return {
    notifications,
    loading,
    error,
    filters,
    updateFilters,
    refresh,
    markAllAsRead,
    deleteAll,
    deleteAllRead,
  };
};

