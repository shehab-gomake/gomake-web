/**
 * Utility functions for avatar generation and styling
 */

/**
 * Generates a consistent color for an email address
 */
export const getAvatarColor = (email: string, primaryColor: (shade: number) => string): string => {
  const colors = [primaryColor(500), "#388e3c", "#f57c00", "#7b1fa2", "#c62828", "#1976d2"];
  const hash = email.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

/**
 * Generates initials from an email address
 */
export const getEmailInitials = (email: string): string => {
  const name = email.split("@")[0];
  return name.substring(0, 2).toUpperCase();
};

/**
 * Generates initials from a display name
 */
export const getDisplayNameInitials = (displayName: string): string => {
  return displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Gets initials for an account (prefers display name over email)
 */
export const getAccountInitials = (email: string, displayName?: string): string => {
  if (displayName) {
    return getDisplayNameInitials(displayName);
  }
  return getEmailInitials(email);
};
