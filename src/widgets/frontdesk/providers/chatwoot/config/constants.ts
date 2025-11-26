/**
 * Centralized constants for Chatwoot provider
 */

export const CHATWOOT_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Cache
  CACHE_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_MAX_SIZE: 100,

  // Retry
  MAX_RETRIES: 3,
  RETRY_BACKOFF_MS: 1000,

  // Debounce
  SEARCH_DEBOUNCE_MS: 300,
  FILTER_DEBOUNCE_MS: 150,

  // Virtual scrolling
  CONVERSATION_ROW_HEIGHT: 88,
  MESSAGE_ROW_HEIGHT: 100,
  OVERSCAN_COUNT: 5,

  // WebSocket
  WEBSOCKET_RECONNECT_INTERVAL: 3000,

  // Toast
  TOAST_DURATION: 4000,
} as const;
