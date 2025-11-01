/**
 * useChatwootNotifications Hook
 *
 * Manages notifications fetching and state for Chatwoot My Inbox view.
 */

import { useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import { createLogger } from "@/services/frontdesk/utils/logger";

const logger = createLogger("useChatwootNotifications");
import {
  chatwootNotificationsAtom,
  chatwootNotificationsLoadingAtom,
  chatwootNotificationsErrorAtom,
  chatwootNotificationsFiltersAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { NotificationListParams, NotificationSortOrder } from "@/services/frontdesk/api/chatwoot/types/notifications.types";

export const useChatwootNotifications = () => {
  const [notifications, setNotifications] = useRecoilState(chatwootNotificationsAtom);
  const [loading, setLoading] = useRecoilState(chatwootNotificationsLoadingAtom);
  const [error, setError] = useRecoilState(chatwootNotificationsErrorAtom);
  const [filters, setFilters] = useRecoilState(chatwootNotificationsFiltersAtom);

  /**
   * Fetch notifications with current filters
   */
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: NotificationListParams = {
        page: filters.page || 1,
        sort_order: (filters.sort_order as NotificationSortOrder) || NotificationSortOrder.DESC,
        includes: filters.includes,
        snoozed: filters.snoozed,
        read: filters.read,
      };

      const response = await chatwootService.notifications.listNotifications(params);
      const notificationsList = response.payload || response.data?.payload || [];
      setNotifications(notificationsList);
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to fetch notifications";
      setError(errorMessage);
      logger.error("Failed to fetch notifications", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [filters, setNotifications, setLoading, setError]);

  /**
   * Update filters and refetch
   */
  const updateFilters = useCallback(
    (newFilters: Partial<typeof filters>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        page: newFilters.page !== undefined ? newFilters.page : prev.page || 1,
      }));
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
   * Fetch notifications when filters change
   */
  useEffect(() => {
    fetchNotifications();
  }, [filters, fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    filters,
    updateFilters,
    refresh,
  };
};

