/**
 * Shared search utilities for FrontDesk providers
 *
 * Consolidates search/filter logic for conversations, messages, and users.
 */

import { containsQuery } from './string.utils';

/**
 * Generic text search across multiple fields
 *
 * @param items - Array of items to search
 * @param query - Search query
 * @param fields - Array of field names to search in
 * @returns Filtered array of items
 */
export function searchText<T extends Record<string, any>>(
  items: T[],
  query: string,
  fields: (keyof T)[]
): T[] {
  if (!query) return items;

  const lowerQuery = query.toLowerCase();

  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      if (typeof value === "string") {
        return value.toLowerCase().includes(lowerQuery);
      }
      if (typeof value === "number") {
        return value.toString().includes(lowerQuery);
      }
      return false;
    })
  );
}

/**
 * Searches conversations by multiple criteria
 *
 * @param conversations - Array of conversations
 * @param query - Search query
 * @returns Filtered conversations
 */
export function searchConversations<T extends {
  subject?: string;
  from?: string;
  snippet?: string;
  [key: string]: any;
}>(conversations: T[], query: string): T[] {
  if (!query) return conversations;

  const lowerQuery = query.toLowerCase();

  return conversations.filter(
    (conv) =>
      containsQuery(conv.subject || "", query) ||
      containsQuery(conv.from || "", query) ||
      containsQuery(conv.snippet || "", query)
  );
}

/**
 * Searches users by name and email
 *
 * @param users - Array of users
 * @param query - Search query
 * @returns Filtered users
 */
export function searchUsers<T extends {
  name?: string;
  email?: string;
  displayName?: string;
  [key: string]: any;
}>(users: T[], query: string): T[] {
  if (!query) return users;

  const lowerQuery = query.toLowerCase();

  return users.filter(
    (user) =>
      containsQuery(user.name || "", query) ||
      containsQuery(user.email || "", query) ||
      containsQuery(user.displayName || "", query)
  );
}

/**
 * Filters items by online status
 *
 * @param items - Array of items with user IDs
 * @param onlineUserIds - Set or array of online user IDs
 * @param getUserId - Function to extract user ID from item
 * @returns Filtered array
 */
export function filterByOnlineStatus<T>(
  items: T[],
  onlineUserIds: Set<string> | string[],
  getUserId: (item: T) => string
): T[] {
  const onlineSet = Array.isArray(onlineUserIds) ? new Set(onlineUserIds) : onlineUserIds;

  return items.filter((item) => onlineSet.has(getUserId(item)));
}

/**
 * Sorts conversations by date (most recent first)
 *
 * @param conversations - Array of conversations
 * @param dateField - Field name containing the date
 * @returns Sorted conversations
 */
export function sortByDate<T extends Record<string, any>>(
  conversations: T[],
  dateField: keyof T = "receivedAt"
): T[] {
  return [...conversations].sort((a, b) => {
    const dateA = new Date(a[dateField]);
    const dateB = new Date(b[dateField]);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Filters conversations by unread status
 *
 * @param conversations - Array of conversations
 * @param unreadOnly - Whether to show only unread
 * @returns Filtered conversations
 */
export function filterByUnreadStatus<T extends { unread?: boolean }>(
  conversations: T[],
  unreadOnly: boolean
): T[] {
  if (!unreadOnly) return conversations;
  return conversations.filter((conv) => conv.unread === true);
}

/**
 * Groups items by a field value
 *
 * @param items - Array of items
 * @param getKey - Function to extract grouping key
 * @returns Map of key to array of items
 */
export function groupBy<T>(items: T[], getKey: (item: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();

  items.forEach((item) => {
    const key = getKey(item);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  });

  return groups;
}

/**
 * Debounce function for search inputs
 *
 * @param func - Function to debounce
 * @param wait - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}