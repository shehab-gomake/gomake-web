/**
 * Email Recipient Utilities for Chip-Based UI
 *
 * Utilities for parsing, validating, and managing email recipients in chip-based UI.
 * Maintains compatibility with backend comma-separated string format.
 */

/**
 * Email validation regex pattern
 * Matches standard email format: local@domain.tld
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email address format
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const trimmed = email.trim();
  if (trimmed.length === 0) {
    return false;
  }

  return EMAIL_REGEX.test(trimmed);
};

/**
 * Parse comma-separated email string into array of individual emails
 * Handles various separators: comma, semicolon, space
 */
export const parseEmailString = (emailString: string): string[] => {
  if (!emailString || typeof emailString !== 'string') {
    return [];
  }

  // Split by comma, semicolon, or multiple spaces
  return emailString
    .split(/[,;\s]+/)
    .map(email => email.trim())
    .filter(email => email.length > 0);
};

/**
 * Convert array of emails to comma-separated string
 */
export const emailArrayToString = (emails: string[]): string => {
  if (!Array.isArray(emails)) {
    return '';
  }

  return emails
    .map(email => email.trim())
    .filter(email => email.length > 0)
    .join(',');
};

/**
 * Deduplicate email list (case-insensitive)
 */
export const deduplicateEmails = (emails: string[]): string[] => {
  if (!Array.isArray(emails)) {
    return [];
  }

  const seen = new Set<string>();
  const result: string[] = [];

  for (const email of emails) {
    const normalized = email.trim().toLowerCase();
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      result.push(email.trim());
    }
  }

  return result;
};

/**
 * Extract email addresses from various text formats
 * Handles formats like:
 * - "user@example.com"
 * - "John Doe <user@example.com>"
 * - "user@example.com (John Doe)"
 */
export const extractEmailsFromText = (text: string): string[] => {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Match email addresses in various formats
  const emailPattern = /<?([^\s@<>]+@[^\s@<>,;]+\.[^\s@<>,;]+)>?/g;
  const matches = text.match(emailPattern);

  if (!matches) {
    return [];
  }

  return matches
    .map(match => {
      // Remove angle brackets if present
      const cleaned = match.replace(/[<>]/g, '').trim();
      return cleaned;
    })
    .filter(email => isValidEmail(email));
};
