import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from "date-fns";

/**
 * Shared date formatting utilities for FrontDesk providers
 *
 * Consolidates date formatting logic from Email, Tickets, and other providers
 * to ensure consistent date display across the application.
 */

/**
 * Safely formats a date string with fallback for invalid dates
 *
 * @param dateString - ISO date string or Date object
 * @param fallback - Fallback string if date is invalid
 * @returns Formatted relative time (e.g., "2 hours ago")
 */
export function safeFormatDate(dateString: string | Date, fallback: string = "Unknown date"): string {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    if (isNaN(date.getTime())) {
      console.warn("Invalid date format:", dateString);
      return fallback;
    }
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.warn("Error formatting date:", dateString, error);
    return fallback;
  }
}

/**
 * Formats a date for conversation/list display
 *
 * - Today: "4:30 PM"
 * - Yesterday: "Yesterday"
 * - This year: "Jul 2"
 * - Older: "Jul 2, 2023"
 *
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string
 */
export function formatConversationDate(dateString: string | Date): string {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (isNaN(date.getTime())) {
      console.warn("Invalid date format in conversation list:", dateString);
      return "";
    }

    if (isToday(date)) {
      return format(date, "h:mm a"); // e.g., 4:30 PM
    }
    if (isYesterday(date)) {
      return "Yesterday";
    }

    // Check if same year
    const now = new Date();
    if (date.getFullYear() === now.getFullYear()) {
      return format(date, "MMM d"); // e.g., Jul 2
    }

    return format(date, "MMM d, yyyy"); // e.g., Jul 2, 2023
  } catch (error) {
    console.warn("Error formatting conversation date:", dateString, error);
    return "";
  }
}

/**
 * Formats a date for detailed message display with relative time
 *
 * - Today: "4:30 PM (2 hours ago)"
 * - Yesterday: "Yesterday at 4:30 PM (1 day ago)"
 * - Older: "Jul 2, 2023 at 4:30 PM (2 days ago)"
 *
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string with relative time
 */
export function formatMessageDate(dateString: string | Date): string {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const distance = formatDistanceToNow(date, { addSuffix: true });

    if (isToday(date)) {
      return `${format(date, "h:mm a")} (${distance})`; // e.g., 4:30 PM (2 hours ago)
    }
    if (isYesterday(date)) {
      return `Yesterday at ${format(date, "h:mm a")} (${distance})`;
    }
    return `${format(date, "MMM d, yyyy 'at' h:mm a")} (${distance})`; // e.g., Jul 2, 2023 at 4:30 PM (2 days ago)
  } catch (error) {
    console.warn("Error formatting message date:", dateString, error);
    return "Date unavailable";
  }
}

/**
 * Formats a date for compact display (no relative time)
 *
 * - Today: "4:30 PM"
 * - Yesterday: "Yesterday"
 * - This week: "Monday"
 * - This year: "Jul 2"
 * - Older: "Jul 2, 2023"
 *
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string
 */
export function formatCompactDate(dateString: string | Date): string {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (isNaN(date.getTime())) {
      return "";
    }

    if (isToday(date)) {
      return format(date, "h:mm a");
    }
    if (isYesterday(date)) {
      return "Yesterday";
    }

    // Within last 7 days - show day name
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return format(date, "EEEE"); // e.g., "Monday"
    }

    // Same year
    if (date.getFullYear() === now.getFullYear()) {
      return format(date, "MMM d");
    }

    return format(date, "MMM d, yyyy");
  } catch (error) {
    console.warn("Error formatting compact date:", dateString, error);
    return "";
  }
}

/**
 * Validates if a date string is valid
 *
 * @param dateString - Date string to validate
 * @returns True if valid date, false otherwise
 */
export function isValidDate(dateString: string | Date): boolean {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}

/**
 * Formats a timestamp for file/export names
 *
 * @param date - Date object (defaults to now)
 * @returns Formatted timestamp (e.g., "2023-07-02_16-30")
 */
export function formatTimestampForFilename(date: Date = new Date()): string {
  return format(date, "yyyy-MM-dd_HH-mm");
}