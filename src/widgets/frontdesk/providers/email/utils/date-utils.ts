import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

/**
 * Safely formats a date string with fallback for invalid dates
 */
export const safeFormatDate = (dateString: string, fallback: string = "Unknown date"): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn("Invalid date format:", dateString);
      return fallback;
    }
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.warn("Error formatting date:", dateString, error);
    return fallback;
  }
};

/**
 * Formats a date for conversation list display
 */
export const formatConversationDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn("Invalid date format in conversation list:", dateString);
      return "";
    }

    if (isToday(date)) {
      return format(date, "p"); // e.g., 4:30 PM
    }
    if (isYesterday(date)) {
      return "Yesterday";
    }
    return format(date, "MMM d"); // e.g., Jul 2
  } catch (error) {
    console.warn("Error formatting conversation date:", dateString, error);
    return "";
  }
};

/**
 * Formats a date for message display
 */
export const formatMessageDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Try to parse common non-standard formats if possible, or return fallback
      return "Invalid date";
    }

    const now = new Date();
    const distance = formatDistanceToNow(date, { addSuffix: true });

    if (isToday(date)) {
      return `${format(date, "h:mm a")} (${distance})`; // e.g., 4:30 PM (about 2 hours ago)
    }
    if (isYesterday(date)) {
      return `Yesterday at ${format(date, "h:mm a")} (${distance})`;
    }
    return `${format(date, "MMM d, yyyy 'at' h:mm a")} (${distance})`; // e.g., Jul 2, 2023 at 4:30 PM (2 days ago)
  } catch (error) {
    console.warn("Error formatting message date:", dateString, error);
    return "Date unavailable";
  }
};

/**
 * Validates if a date string is valid
 */
export const isValidDate = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
};
