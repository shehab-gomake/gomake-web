/**
 * Chatwoot Constants
 *
 * Shared constants used across the Chatwoot provider
 */

// Default pagination
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 1;

// API response keys
export const API_RESPONSE_KEYS = {
  PAYLOAD: "payload",
  DATA: "data",
  META: "meta",
} as const;

// Filter defaults
export const DEFAULT_FILTERS = {
  PAGE: 1,
  LIMIT: 20,
} as const;

// Refresh intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  CONVERSATIONS: 30000, // 30 seconds
  NOTIFICATIONS: 60000, // 1 minute
  INBOXES: 300000, // 5 minutes
} as const;

// Cache keys
export const CACHE_KEYS = {
  CONVERSATIONS: "chatwoot-conversations",
  INBOXES: "chatwoot-inboxes",
  NOTIFICATIONS: "chatwoot-notifications",
  PROFILE: "chatwoot-profile",
} as const;

