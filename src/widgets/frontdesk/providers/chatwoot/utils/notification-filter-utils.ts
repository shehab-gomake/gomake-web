/**
 * Notification Filter Utilities
 *
 * Common utilities for working with Chatwoot notification filters
 * Follows the same pattern as conversation filter utilities
 */

import { NotificationListParams, NotificationSortOrder } from "@/services/frontdesk/api/chatwoot/types/notifications.types";

/**
 * Get human-readable label for sort order
 */
export const getSortOrderLabel = (sortOrder: NotificationSortOrder | string): string => {
  const sortOrderStr = String(sortOrder).toLowerCase();
  if (sortOrderStr === "desc" || sortOrderStr === NotificationSortOrder.DESC) {
    return "Newest";
  }
  if (sortOrderStr === "asc" || sortOrderStr === NotificationSortOrder.ASC) {
    return "Oldest";
  }
  return String(sortOrder);
};

/**
 * Create default notification filters
 */
export const createDefaultNotificationFilters = (overrides?: Partial<NotificationListParams>): NotificationListParams => {
  return {
    page: 1,
    sort_order: NotificationSortOrder.DESC,
    ...overrides,
  };
};

/**
 * Build notification filters from display options
 *
 * Uses the 'includes' array pattern from NOTIFICATIONS_FRONTEND_API_GUIDE.md
 *
 * @param options - Display filter options
 * @param overrides - Additional filter overrides
 * @returns Built notification filters
 */
export const buildNotificationFilters = (
  options: {
    snoozed?: boolean;
    read?: boolean;
    sortOrder?: NotificationSortOrder;
  },
  overrides?: Partial<NotificationListParams>
): NotificationListParams => {
  const includes: ("read" | "snoozed")[] = [];

  if (options.snoozed) {
    includes.push("snoozed");
  }

  if (options.read) {
    includes.push("read");
  }

  return {
    page: overrides?.page || 1,
    sort_order: options.sortOrder || overrides?.sort_order || NotificationSortOrder.DESC,
    includes: includes.length > 0 ? includes : undefined,
    ...overrides,
  };
};

/**
 * Create a stable filter key for caching/comparison
 */
export const createNotificationFilterKey = (filters: Partial<NotificationListParams>): string => {
  return JSON.stringify({
    sort_order: filters.sort_order || NotificationSortOrder.DESC,
    includes: filters.includes?.sort() || [],
    page: filters.page || 1,
  });
};
