/**
 * Chatwoot Notifications Types
 *
 * Type definitions for notification-related API requests and responses
 */

/**
 * Notification Sort Order
 */
export enum NotificationSortOrder {
  DESC = "desc",
  ASC = "asc",
}

/**
 * Notification List Query Parameters
 * Query parameters for GET /api/accounts/notifications
 */
export interface NotificationListParams {
  /** Page number for pagination (starts at 1) */
  page?: number;

  /** Sort order (desc or asc) */
  sort_order?: NotificationSortOrder | string;

  /** Limit number of results per page */
  limit?: number;

  /** Include additional notification types (array of strings) */
  includes?: string[];

  /** Include snoozed notifications */
  snoozed?: boolean;

  /** Include read notifications */
  read?: boolean;
}

/**
 * Chatwoot Notification
 * Represents a notification in Chatwoot
 */
export interface ChatwootNotification {
  id?: number;
  notification_type?: string;
  primary_actor_type?: string;
  primary_actor_id?: number;
  primary_actor?: {
    id?: number;
    name?: string;
    email?: string;
    avatar_url?: string;
    type?: string;
  };
  secondary_actor?: {
    id?: number;
    name?: string;
    email?: string;
    avatar_url?: string;
    type?: string;
  };
  user_id?: number;
  read_at?: string | null;
  snoozed_until?: string | null;
  meta?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

/**
 * Notification List Response
 * Response structure for list notifications endpoint
 */
export interface NotificationListResponse {
  data?: {
    payload?: ChatwootNotification[];
    meta?: {
      page?: number;
      total_pages?: number;
      total_count?: number;
      count?: number;
      per_page?: number;
    };
  };
  payload?: ChatwootNotification[];
  meta?: {
    page?: number;
    total_pages?: number;
    total_count?: number;
    count?: number;
    per_page?: number;
  };
}

