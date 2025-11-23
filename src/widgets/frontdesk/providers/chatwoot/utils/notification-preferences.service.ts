/**
 * Notification Preferences Service
 *
 * Handles localStorage persistence for notification filter preferences
 * Separates concerns - preferences logic is isolated from hooks
 *
 * Uses the 'includes' array pattern from NOTIFICATIONS_FRONTEND_API_GUIDE.md
 */

import { createLogger } from "@/services/frontdesk/utils/logger";
import { NotificationListParams } from "@/services/frontdesk/api/chatwoot/types/notifications.types";

const logger = createLogger("NotificationPreferencesService");

const STORAGE_KEY = "frontdesk.chatwoot.notifications.preferences";

interface NotificationPreferences {
  includes?: ("read" | "snoozed")[];
  sort_order?: string;
}

/**
 * Load saved notification filter preferences from localStorage
 */
export const loadNotificationPreferences = (): Partial<NotificationListParams> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const preferences: NotificationPreferences = JSON.parse(stored);
      return {
        includes: preferences.includes,
        sort_order: preferences.sort_order,
      };
    }
  } catch (err) {
    logger.warn("Failed to load notification preferences from localStorage", err);
  }
  return {};
};

/**
 * Save notification filter preferences to localStorage
 */
export const saveNotificationPreferences = (filters: Partial<NotificationListParams>): void => {
  try {
    const preferences: NotificationPreferences = {
      includes: filters.includes,
      sort_order: filters.sort_order,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (err) {
    logger.warn("Failed to save notification preferences to localStorage", err);
  }
};

/**
 * Clear saved notification preferences
 */
export const clearNotificationPreferences = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    logger.info("Notification preferences cleared");
  } catch (err) {
    logger.warn("Failed to clear notification preferences from localStorage", err);
  }
};
