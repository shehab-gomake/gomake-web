/**
 * FrontDesk Notifications API Service
 *
 * This service provides API endpoints for managing FrontDesk notifications.
 * Currently using placeholder/stub implementations with dummy data.
 * Ready to be connected to real backend endpoints.
 *
 * @module services/frontdesk/api/notifications
 */

import { IFrontdeskNotification } from '@/store/frontdesk/atoms/notifications.atoms';

/**
 * API Response structure
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Get all unread FrontDesk notifications
 *
 * Backend endpoint (to be implemented):
 * GET /v1/frontdesk/notifications/unread
 *
 * Query params:
 * - type?: 'MESSAGE' | 'TICKET' (optional filter)
 * - limit?: number (default: 50)
 * - offset?: number (default: 0)
 *
 * @returns Promise<ApiResponse<IFrontdeskNotification[]>>
 */
export const getUnreadNotifications = async (
  type?: 'MESSAGE' | 'TICKET'
): Promise<ApiResponse<IFrontdeskNotification[]>> => {
  // TODO: Replace with actual API call when backend is ready
  // Example implementation:
  // const response = await axios.get('/v1/frontdesk/notifications/unread', {
  //   params: { type }
  // });
  // return response.data;

  console.log('[API Stub] getUnreadNotifications called with type:', type);

  // Stub response
  return {
    success: true,
    data: [],
    message: 'Stub: Backend not yet connected',
  };
};

/**
 * Mark a notification as read
 *
 * Backend endpoint (to be implemented):
 * PUT /v1/frontdesk/notifications/:id/read
 *
 * @param notificationId - The notification ID to mark as read
 * @returns Promise<ApiResponse<void>>
 */
export const markNotificationAsRead = async (
  notificationId: string
): Promise<ApiResponse<void>> => {
  // TODO: Replace with actual API call when backend is ready
  // Example implementation:
  // const response = await axios.put(`/v1/frontdesk/notifications/${notificationId}/read`);
  // return response.data;

  console.log('[API Stub] markNotificationAsRead called for ID:', notificationId);

  // Stub response
  return {
    success: true,
    message: 'Stub: Backend not yet connected',
  };
};

/**
 * Mark all notifications as read
 *
 * Backend endpoint (to be implemented):
 * PUT /v1/frontdesk/notifications/mark-all-read
 *
 * Body:
 * - type?: 'MESSAGE' | 'TICKET' (optional - mark only specific type)
 *
 * @param type - Optional: mark only specific notification type as read
 * @returns Promise<ApiResponse<void>>
 */
export const markAllNotificationsAsRead = async (
  type?: 'MESSAGE' | 'TICKET'
): Promise<ApiResponse<void>> => {
  // TODO: Replace with actual API call when backend is ready
  // Example implementation:
  // const response = await axios.put('/v1/frontdesk/notifications/mark-all-read', { type });
  // return response.data;

  console.log('[API Stub] markAllNotificationsAsRead called with type:', type);

  // Stub response
  return {
    success: true,
    message: 'Stub: Backend not yet connected',
  };
};

/**
 * Delete a notification
 *
 * Backend endpoint (to be implemented):
 * DELETE /v1/frontdesk/notifications/:id
 *
 * @param notificationId - The notification ID to delete
 * @returns Promise<ApiResponse<void>>
 */
export const deleteNotification = async (
  notificationId: string
): Promise<ApiResponse<void>> => {
  // TODO: Replace with actual API call when backend is ready
  // Example implementation:
  // const response = await axios.delete(`/v1/frontdesk/notifications/${notificationId}`);
  // return response.data;

  console.log('[API Stub] deleteNotification called for ID:', notificationId);

  // Stub response
  return {
    success: true,
    message: 'Stub: Backend not yet connected',
  };
};

/**
 * Get notification statistics
 *
 * Backend endpoint (to be implemented):
 * GET /v1/frontdesk/notifications/stats
 *
 * @returns Promise<ApiResponse<{ total: number; messages: number; tickets: number }>>
 */
export const getNotificationStats = async (): Promise<
  ApiResponse<{ total: number; messages: number; tickets: number }>
> => {
  // TODO: Replace with actual API call when backend is ready
  // Example implementation:
  // const response = await axios.get('/v1/frontdesk/notifications/stats');
  // return response.data;

  console.log('[API Stub] getNotificationStats called');

  // Stub response
  return {
    success: true,
    data: {
      total: 0,
      messages: 0,
      tickets: 0,
    },
    message: 'Stub: Backend not yet connected',
  };
};

/**
 * Subscribe to notification updates via WebSocket
 *
 * WebSocket endpoint (to be implemented):
 * ws://api/frontdesk/notifications
 *
 * Events to listen for:
 * - 'notification:new' - New notification created
 * - 'notification:read' - Notification marked as read
 * - 'notification:deleted' - Notification deleted
 *
 * Usage example:
 * ```typescript
 * const socket = io(config.api_server);
 * socket.on('frontdesk:notification:new', (notification) => {
 *   // Add notification to state
 * });
 * ```
 */
export const subscribeToNotifications = () => {
  // TODO: Implement WebSocket subscription when backend is ready
  // Example implementation similar to use-messenger-socket-io.ts:
  // const socket = io(config.api_server);
  // socket.on('frontdesk:notification:new', (notification) => {
  //   setNotifications(prev => [...prev, notification]);
  // });
  // return () => socket.disconnect();

  console.log('[API Stub] subscribeToNotifications called - WebSocket not yet implemented');
};
