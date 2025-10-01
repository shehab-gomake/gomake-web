/**
 * Shared avatar utilities for FrontDesk providers
 *
 * Consolidates avatar generation, color picking, and initials extraction
 * to ensure consistent user representation across the application.
 */

/**
 * Predefined avatar colors for consistency
 */
const AVATAR_COLORS = [
  "#1976d2", // Blue
  "#388e3c", // Green
  "#f57c00", // Orange
  "#7b1fa2", // Purple
  "#c62828", // Red
  "#0288d1", // Light Blue
  "#689f38", // Light Green
  "#f9a825", // Yellow
];

/**
 * Generates a consistent color for a given identifier (email, user ID, etc.)
 *
 * Uses a simple hash function to ensure the same identifier always gets
 * the same color, providing visual consistency across the app.
 *
 * @param identifier - Email, user ID, or any string identifier
 * @param colors - Optional custom color palette (defaults to AVATAR_COLORS)
 * @returns Hex color string
 */
export function getAvatarColor(identifier: string, colors: string[] = AVATAR_COLORS): string {
  if (!identifier || typeof identifier !== 'string') return AVATAR_COLORS[0];

  // Simple hash function
  const hash = identifier.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

/**
 * Extracts initials from an email address
 *
 * Takes the first two characters from the local part (before @)
 *
 * @param email - Email address
 * @returns Two-character initials in uppercase
 */
export function getEmailInitials(email: string): string {
  if (!email || typeof email !== 'string') return "??";

  const localPart = email.split("@")[0];
  return localPart.substring(0, 2).toUpperCase();
}

/**
 * Extracts initials from a display name
 *
 * Takes the first character of each word (max 2 words)
 *
 * @param displayName - Full name or display name
 * @returns Up to two-character initials in uppercase
 */
export function getDisplayNameInitials(displayName: string): string {
  if (!displayName || typeof displayName !== 'string') return "??";

  const words = displayName.trim().split(/\s+/);

  if (words.length === 0) return "??";
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();

  // Take first char of first two words
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Gets initials from user data (prefers name over email)
 *
 * @param user - User object with optional name and email
 * @returns Two-character initials in uppercase
 */
export function getUserInitials(user: { name?: string; email?: string; displayName?: string }): string {
  if (user.name) {
    return getDisplayNameInitials(user.name);
  }
  if (user.displayName) {
    return getDisplayNameInitials(user.displayName);
  }
  if (user.email) {
    return getEmailInitials(user.email);
  }
  return "??";
}

/**
 * Gets initials for a account/contact (backward compatible with old API)
 *
 * @param email - Email address
 * @param displayName - Optional display name
 * @returns Two-character initials in uppercase
 */
export function getAccountInitials(email: string, displayName?: string): string {
  if (displayName) {
    return getDisplayNameInitials(displayName);
  }
  return getEmailInitials(email);
}

/**
 * Generates avatar data (color + initials) for a user
 *
 * @param user - User object with identifier and optional name
 * @returns Object with background color and initials
 */
export function generateAvatarData(user: {
  id?: string;
  email?: string;
  name?: string;
  displayName?: string;
}): {
  backgroundColor: string;
  initials: string;
} {
  const identifier = user.id || user.email || user.name || "unknown";
  return {
    backgroundColor: getAvatarColor(identifier),
    initials: getUserInitials(user),
  };
}