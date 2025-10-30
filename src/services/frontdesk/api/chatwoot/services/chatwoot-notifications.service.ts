/**
 * Chatwoot Notifications Service
 *
 * Handles all notification-related endpoints.
 *
 * @see NotificationsApi.md
 */

import { BaseChatwootService } from "../core/base-chatwoot-service";
import {
  NotificationListParams,
  NotificationListResponse,
  NotificationSortOrder,
} from "../types/notifications.types";

/**
 * ChatwootNotificationsService
 * Handles notification-related API operations
 *
 * @example
 * ```typescript
 * const notificationsService = new ChatwootNotificationsService();
 *
 * // List notifications
 * const notifications = await notificationsService.listNotifications({
 *   page: 1,
 *   sort_order: NotificationSortOrder.DESC
 * });
 * ```
 */
export class ChatwootNotificationsService extends BaseChatwootService {
  constructor(baseUrl?: string) {
    super(baseUrl);
  }

  /**
   * List Notifications
   * GET /api/accounts/notifications
   *
   * Supported query parameters:
   * - page: Page number for pagination (default: 1)
   * - sort_order: Sort order (desc or asc, default: desc)
   * - limit: Number of results per page
   * - includes[]: Array of additional notification types to include
   * - snoozed: Include snoozed notifications
   * - read: Include read notifications
   *
   * @param params - Query parameters
   * @returns Promise with notification list
   *
   * @example
   * ```typescript
   * // Get first page of notifications, sorted by newest first
   * const notifications = await service.listNotifications({
   *   page: 1,
   *   sort_order: NotificationSortOrder.DESC
   * });
   *
   * // Include snoozed and read notifications
   * const allNotifications = await service.listNotifications({
   *   snoozed: true,
   *   read: true,
   *   includes: ['snoozed', 'read']
   * });
   * ```
   */
  async listNotifications(params?: NotificationListParams): Promise<NotificationListResponse> {
    const urlParams = new URLSearchParams();

    if (params) {
      // Handle page
      if (params.page !== undefined) {
        urlParams.append("page", String(params.page));
      }

      // Handle sort_order
      if (params.sort_order !== undefined) {
        urlParams.append("sort_order", String(params.sort_order));
      }

      // Handle limit
      if (params.limit !== undefined) {
        urlParams.append("limit", String(params.limit));
      }

      // Handle includes[] array
      if (params.includes && params.includes.length > 0) {
        params.includes.forEach((include) => {
          urlParams.append("includes[]", include);
        });
      }

      // Handle snoozed
      if (params.snoozed) {
        urlParams.append("snoozed", "true");
      }

      // Handle read
      if (params.read) {
        urlParams.append("read", "true");
      }
    }

    const queryString = urlParams.toString();
    // Call /api/accounts/notifications (without /v1 and without accountId in path)
    const url = `/api/accounts/notifications${queryString ? `?${queryString}` : ""}`;
    return await this.get<NotificationListResponse>(url);
  }
}

