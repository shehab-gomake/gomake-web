/**
 * Chatwoot Notifications Service
 *
 * Handles all notification-related endpoints.
 *
 * IMPORTANT: Chatwoot notifications API uses a DIFFERENT URL pattern than other endpoints:
 * - URL: /api/accounts/notifications (NO /v1, NO accountId in path)
 * - Authentication is handled via bearer token which contains the account context
 *
 * @see NotificationsApi.md
 * @see NOTIFICATIONS_FRONTEND_API_GUIDE.md
 */

import { BaseChatwootService } from "../core/base-chatwoot-service";
import {
  NotificationListParams,
  NotificationListResponse,
  NotificationSortOrder,
  ChatwootNotification,
  UnreadCountResponse,
  MarkConversationAsReadRequest,
  SnoozeNotificationRequest,
  DestroyAllRequest,
} from "../types/notifications.types";

/**
 * ChatwootNotificationsService
 * Handles notification-related API operations
 *
 * NOTE: The accountId parameter is kept in method signatures for API consistency,
 * but it's not used in the URL path. Authentication token provides account context.
 *
 * @example
 * ```typescript
 * const notificationsService = new ChatwootNotificationsService();
 *
 * // List notifications (accountId not used in URL)
 * const notifications = await notificationsService.listNotifications(accountId, {
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
   * - includes[]: Array of additional notification types to include ('read', 'snoozed')
   *
   * @param accountId - Account ID (not used in URL, kept for API consistency)
   * @param params - Query parameters
   * @returns Promise with notification list
   *
   * @example
   * ```typescript
   * // Get first page of notifications, sorted by newest first
   * const notifications = await service.listNotifications(123, {
   *   page: 1,
   *   sort_order: NotificationSortOrder.DESC
   * });
   *
   * // Include read notifications
   * const allNotifications = await service.listNotifications(123, {
   *   includes: ['read']
   * });
   * ```
   */
  async listNotifications(
    accountId: number,
    params?: NotificationListParams
  ): Promise<NotificationListResponse> {
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

      // Handle includes[] array (e.g., 'read', 'snoozed')
      if (params.includes && params.includes.length > 0) {
        params.includes.forEach((include) => {
          urlParams.append("includes[]", include);
        });
      }
    }

    const queryString = urlParams.toString();
    // Use /api/accounts/notifications (no v1, no accountId in path)
    const url = `/api/accounts/notifications${queryString ? `?${queryString}` : ""}`;
    return await this.get<NotificationListResponse>(url);
  }

  /**
   * Get Unread Count
   * GET /api/accounts/notifications/unread_count
   *
   * Returns the count of unread notifications for the current user.
   *
   * @param accountId - Account ID (not used in URL, kept for API consistency)
   * @returns Promise with unread count
   *
   * @example
   * ```typescript
   * const { unread_count } = await service.getUnreadCount(123);
   * console.log(`You have ${unread_count} unread notifications`);
   * ```
   */
  async getUnreadCount(accountId: number): Promise<UnreadCountResponse> {
    const url = `/api/accounts/notifications/unread_count`;
    return await this.get<UnreadCountResponse>(url);
  }

  /**
   * Mark All Notifications as Read
   * POST /api/accounts/notifications/mark_all_as_read
   *
   * Marks all unread notifications as read for the current user.
   * Returns 204 No Content on success.
   *
   * @param accountId - Account ID (not used in URL, kept for API consistency)
   * @returns Promise resolving when all notifications are marked as read
   *
   * @example
   * ```typescript
   * await service.markAllAsRead(123);
   * ```
   */
  async markAllAsRead(accountId: number): Promise<void> {
    const url = `/api/accounts/notifications/mark_all_as_read`;
    await this.post<void>(url, {});
  }

  /**
   * Mark Conversation Notifications as Read
   * POST /api/accounts/notifications/read_all
   *
   * Marks all notifications related to a specific conversation as read.
   * This should be called when a user opens a conversation.
   *
   * @param accountId - Account ID (not used in URL, kept for API consistency)
   * @param conversationId - Conversation ID
   * @returns Promise resolving when conversation notifications are marked as read
   *
   * @example
   * ```typescript
   * // When user opens conversation #123
   * await service.markConversationAsRead(1, 123);
   * ```
   */
  async markConversationAsRead(
    accountId: number,
    conversationId: number
  ): Promise<void> {
    const url = `/api/accounts/notifications/read_all`;
    const body: MarkConversationAsReadRequest = {
      primary_actor_type: "Conversation",
      primary_actor_id: conversationId,
    };
    await this.post<void>(url, body);
  }

  /**
   * Mark Single Notification as Read
   * PATCH /api/accounts/notifications/{notificationId}
   *
   * Marks a specific notification as read.
   * Returns the updated notification object.
   *
   * @param accountId - Account ID (not used in URL, kept for API consistency)
   * @param notificationId - Notification ID
   * @returns Promise with updated notification
   *
   * @example
   * ```typescript
   * const notification = await service.markAsRead(123, 456);
   * console.log('Marked notification as read:', notification.read_at);
   * ```
   */
  async markAsRead(
    accountId: number,
    notificationId: number
  ): Promise<ChatwootNotification> {
    const url = `/api/accounts/notifications/${notificationId}`;
    return await this.patch<ChatwootNotification>(url);
  }

  /**
   * Mark Notification as Unread
   * POST /api/accounts/notifications/{notificationId}/unread
   *
   * Marks a specific notification as unread (sets read_at to null).
   *
   * @param accountId - Account ID (not used in URL, kept for API consistency)
   * @param notificationId - Notification ID
   * @returns Promise with updated notification
   *
   * @example
   * ```typescript
   * const notification = await service.markAsUnread(123, 456);
   * console.log('Marked notification as unread:', notification.read_at); // null
   * ```
   */
  async markAsUnread(
    accountId: number,
    notificationId: number
  ): Promise<ChatwootNotification> {
    const url = `/api/accounts/notifications/${notificationId}/unread`;
    return await this.post<ChatwootNotification>(url);
  }

  /**
   * Delete Single Notification
   * DELETE /api/accounts/notifications/{notificationId}
   *
   * Deletes a specific notification.
   * Returns 204 No Content on success.
   *
   * @param accountId - Account ID (not used in URL, kept for API consistency)
   * @param notificationId - Notification ID
   * @returns Promise resolving when notification is deleted
   *
   * @example
   * ```typescript
   * await service.deleteNotification(123, 456);
   * ```
   */
  async deleteNotification(accountId: number, notificationId: number): Promise<void> {
    const url = `/api/accounts/notifications/${notificationId}`;
    await this.delete<void>(url);
  }

  /**
   * Delete All Notifications
   * POST /api/accounts/notifications/destroy_all
   *
   * Deletes all notifications or only read notifications based on the type parameter.
   * Returns 204 No Content on success.
   *
   * @param accountId - Account ID (not used in URL, kept for API consistency)
   * @param type - 'all' to delete all notifications, 'read' to delete only read ones
   * @returns Promise resolving when notifications are deleted
   *
   * @example
   * ```typescript
   * // Delete all notifications
   * await service.deleteAll(123, 'all');
   *
   * // Delete only read notifications
   * await service.deleteAll(123, 'read');
   * ```
   */
  async deleteAll(accountId: number, type: "all" | "read" = "all"): Promise<void> {
    const url = `/api/accounts/notifications/destroy_all`;
    const body: DestroyAllRequest = { type };
    await this.post<void>(url, body);
  }

  /**
   * Snooze Notification
   * POST /api/accounts/notifications/{notificationId}/snooze
   *
   * Snoozes a notification until the specified datetime.
   * Pass null for snoozed_until to unsnooze.
   *
   * @param accountId - Account ID (not used in URL, kept for API consistency)
   * @param notificationId - Notification ID
   * @param snoozedUntil - ISO datetime string or null to unsnooze
   * @returns Promise with updated notification
   *
   * @example
   * ```typescript
   * // Snooze until tomorrow
   * const tomorrow = new Date();
   * tomorrow.setDate(tomorrow.getDate() + 1);
   * await service.snoozeNotification(123, 456, tomorrow.toISOString());
   *
   * // Unsnooze
   * await service.snoozeNotification(123, 456, null);
   * ```
   */
  async snoozeNotification(
    accountId: number,
    notificationId: number,
    snoozedUntil: string | null
  ): Promise<ChatwootNotification> {
    const url = `/api/accounts/notifications/${notificationId}/snooze`;
    const body: SnoozeNotificationRequest = { snoozed_until: snoozedUntil };
    return await this.post<ChatwootNotification>(url, body);
  }
}

