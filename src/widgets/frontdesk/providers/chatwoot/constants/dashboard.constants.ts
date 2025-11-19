/**
 * Chatwoot Dashboard Constants
 *
 * Centralized constants for dashboard configuration and limits.
 * Prevents magic numbers throughout the codebase.
 */

/**
 * Maximum number of items to display in dashboard quick views
 */
export const DASHBOARD_LIMITS = {
  /** Maximum conversations in "My Conversations" quick view */
  MAX_MY_CONVERSATIONS: 5,

  /** Maximum conversations in "Mentions" quick view */
  MAX_MENTIONED_CONVERSATIONS: 3,

  /** Maximum conversations in "Unattended" quick view */
  MAX_UNATTENDED_CONVERSATIONS: 3,

  /** Maximum notifications to show in compact notification list */
  MAX_NOTIFICATIONS_DASHBOARD: 10,

  /** Maximum notifications to show in full notification view */
  MAX_NOTIFICATIONS_FULL: 50,
} as const;

/**
 * Time grouping thresholds (in milliseconds)
 */
export const TIME_GROUPING = {
  /** Milliseconds in a day */
  ONE_DAY: 24 * 60 * 60 * 1000,

  /** Milliseconds in a week */
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

/**
 * Dashboard refresh intervals (in milliseconds)
 */
export const REFRESH_INTERVALS = {
  /** Interval to refresh dashboard stats */
  STATS: 30000, // 30 seconds

  /** Interval to refresh conversations */
  CONVERSATIONS: 15000, // 15 seconds

  /** Interval to refresh notifications */
  NOTIFICATIONS: 10000, // 10 seconds
} as const;

/**
 * Dashboard tab identifiers
 */
export const DASHBOARD_TABS = {
  OVERVIEW: 'overview',
  INBOX: 'inbox',
} as const;

export type DashboardTab = typeof DASHBOARD_TABS[keyof typeof DASHBOARD_TABS];
