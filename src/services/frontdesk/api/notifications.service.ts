/**
 * FrontDesk Notifications API Service
 * Source: /Users/omarsabbah/Desktop/Messaging-Hub/docs/guides/NOTIFICATION_SYSTEM_FRONTEND_GUIDE.md
 *
 * REST operations for the FrontDesk notification system.
 * Base URL: /notifications
 * Auth: Bearer token required on all requests
 * Tenant scoping: Automatic via printHouseId from JWT
 */

import { MessagingHubHttpClient } from "@/services/messaging-hub-http-client";
import { BackendNotification, BackendNotificationType } from "@/services/frontdesk/utils/notification-type-mapper";

/**
 * Query filters for listing notifications
 */
export interface NotificationFilters {
  type?: BackendNotificationType;
  unreadOnly?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Paginated response for notifications
 */
export interface PaginatedNotificationsResponse {
  data: BackendNotification[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Unread count response
 */
export interface UnreadCountResponse {
  count: number;
  type?: string;
}

/**
 * Mark all as read response
 */
export interface MarkAllAsReadResponse {
  count: number;
  message: string;
}

/**
 * Generic success response
 */
export interface SuccessResponse {
  success: boolean;
  message: string;
}

const NOTIFICATIONS_BASE_URL = "/notifications";

/**
 * NotificationsService
 * Handles all REST API operations for FrontDesk notifications
 */
export class NotificationsService extends MessagingHubHttpClient {
  /**
   * Get notifications with optional filters
   * GET /notifications?type=TICKET_ASSIGNED&unreadOnly=true&page=1&limit=20
   *
   * @param filters - Optional filters (type, unreadOnly, pagination)
   * @returns Promise<PaginatedNotificationsResponse> - Paginated notifications with metadata
   */
  async getNotifications(filters?: NotificationFilters): Promise<PaginatedNotificationsResponse> {
    const params = new URLSearchParams();

    if (filters?.type) params.append("type", filters.type);
    if (filters?.unreadOnly) params.append("unreadOnly", "true");
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : "";

    // Backend returns { success, data: [...notifications], pagination }
    // MessagingHubHttpClient auto-unwraps to return the data object
    const response = await this.get<PaginatedNotificationsResponse>(`${NOTIFICATIONS_BASE_URL}${queryString}`);

    // Return full response with pagination metadata for infinite scroll
    return response;
  }

  /**
   * Get unread notification count
   * GET /notifications/unread/count?type=TICKET_ASSIGNED
   *
   * @param type - Optional: count for specific notification type
   * @returns Promise<number> - Count of unread notifications
   */
  async getUnreadCount(type?: BackendNotificationType): Promise<number> {
    const params = new URLSearchParams();
    if (type) params.append("type", type);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await this.get<UnreadCountResponse>(`${NOTIFICATIONS_BASE_URL}/unread/count${queryString}`);

    return response.count;
  }

  /**
   * Mark a notification as read
   * POST /notifications/:id/read
   *
   * @param notificationId - ID of notification to mark as read
   * @returns Promise<BackendNotification> - Updated notification
   */
  async markAsRead(notificationId: string): Promise<BackendNotification> {
    return await this.post<BackendNotification>(`${NOTIFICATIONS_BASE_URL}/${notificationId}/read`);
  }

  /**
   * Mark all notifications as read
   * POST /notifications/mark-all-read?type=TICKET_ASSIGNED
   *
   * @param type - Optional: mark only specific type as read
   * @returns Promise<{ count: number }> - Number of notifications marked as read
   */
  async markAllAsRead(type?: BackendNotificationType): Promise<{ count: number }> {
    const params = new URLSearchParams();
    if (type) params.append("type", type);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await this.post<MarkAllAsReadResponse>(`${NOTIFICATIONS_BASE_URL}/mark-all-read${queryString}`);

    return { count: response.count };
  }

  /**
   * Dismiss a notification (remove from list without marking as read)
   * POST /notifications/:id/dismiss
   *
   * @param notificationId - ID of notification to dismiss
   * @returns Promise<BackendNotification> - Dismissed notification
   */
  async dismiss(notificationId: string): Promise<BackendNotification> {
    return await this.post<BackendNotification>(`${NOTIFICATIONS_BASE_URL}/${notificationId}/dismiss`);
  }

  /**
   * Delete a notification permanently
   * DELETE /notifications/:id
   *
   * @param notificationId - ID of notification to delete
   * @returns Promise<void>
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await this.delete<SuccessResponse>(`${NOTIFICATIONS_BASE_URL}/${notificationId}`);
  }
}

/**
 * Singleton instance of NotificationsService
 * Import and use this instance throughout the application
 *
 * @example
 * import { notificationsService } from '@/services/frontdesk';
 * const notifications = await notificationsService.getNotifications({ unreadOnly: true });
 */
export const notificationsService = new NotificationsService();
