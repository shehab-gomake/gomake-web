/**
 * Date Utilities
 * Utility functions for date formatting and time calculations
 */

/**
 * Format a date string to a relative time string (e.g., "5m ago", "2h ago")
 */
export function formatTimeAgo(dateString?: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString();
}

/**
 * Format a full date string
 */
export function formatFullDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString();
}

/**
 * Check if a date is in the future
 */
export function isFutureDate(dateString?: string): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  return date > now;
}

/**
 * Get time difference in milliseconds
 */
export function getTimeDiffMs(dateString1: string, dateString2: string): number {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);
  return Math.abs(date1.getTime() - date2.getTime());
}
