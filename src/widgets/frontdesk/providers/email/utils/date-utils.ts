import { formatDistanceToNow } from "date-fns";

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
      return "Unknown date";
    }

    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 1) {
      return "Just now";
    } else if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffHours < 168) {
      // 7 days
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  } catch (error) {
    console.warn("Error formatting conversation date:", dateString, error);
    return "Unknown date";
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
