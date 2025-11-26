/**
 * Email Validation Utilities
 *
 * Reusable email validation and parsing functions.
 * Consolidates shared logic used across FrontDesk and Quote Page modals.
 */

/**
 * Email Recipient interface
 */
export interface EmailRecipient {
  email: string;
  name?: string;
}

/**
 * Validate a single email address
 *
 * @param email - Email address to validate
 * @returns True if valid email format
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== "string") {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate comma-separated list of email addresses
 *
 * @param emails - Comma-separated email addresses
 * @returns True if all emails are valid
 */
export function validateEmails(emails: string): boolean {
  if (!emails || typeof emails !== "string") {
    return true; // Empty/null is valid (optional field)
  }

  const emailList = emails.split(",").map((e) => e.trim()).filter(Boolean);

  // Empty list is valid
  if (emailList.length === 0) {
    return true;
  }

  // All emails must be valid
  return emailList.every((email) => validateEmail(email));
}

/**
 * Parse comma-separated email string into array of EmailRecipient objects
 *
 * @param emailString - Comma-separated email addresses
 * @returns Array of EmailRecipient objects
 */
export function parseEmails(emailString: string): EmailRecipient[] {
  if (!emailString || typeof emailString !== "string") {
    return [];
  }

  return emailString
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean)
    .filter((email) => validateEmail(email))
    .map((email) => ({ email }));
}

/**
 * Format array of EmailRecipient objects to comma-separated string
 *
 * @param recipients - Array of EmailRecipient objects
 * @returns Comma-separated email string
 */
export function formatEmailRecipients(recipients: EmailRecipient[]): string {
  if (!recipients || !Array.isArray(recipients)) {
    return "";
  }

  return recipients
    .map((r) => r.email)
    .filter(Boolean)
    .join(",");
}

/**
 * Check if a query string looks like an email address
 * Less strict than validateEmail - used for search/autocomplete
 *
 * @param query - Query string to check
 * @returns True if query looks like an email
 */
export function looksLikeEmail(query: string): boolean {
  if (!query || typeof query !== "string") {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(query.trim());
}

/**
 * Check if a query string looks like a phone number
 * Less strict - used for search/autocomplete
 *
 * @param query - Query string to check
 * @returns True if query looks like a phone number
 */
export function looksLikePhone(query: string): boolean {
  if (!query || typeof query !== "string") {
    return false;
  }

  // Remove common phone formatting characters
  const cleaned = query.trim().replace(/[\s\-\(\)]/g, "");

  // Check if it starts with + and has digits, or just has enough digits (7+)
  return /^\+?\d{7,}$/.test(cleaned);
}

/**
 * Normalize email addresses to lowercase for comparison
 *
 * @param email - Email address
 * @returns Lowercase email address
 */
export function normalizeEmail(email: string): string {
  if (!email || typeof email !== "string") {
    return "";
  }

  return email.trim().toLowerCase();
}

/**
 * Compare two emails (case-insensitive)
 *
 * @param email1 - First email
 * @param email2 - Second email
 * @returns True if emails match (case-insensitive)
 */
export function emailsMatch(email1?: string, email2?: string): boolean {
  if (!email1 || !email2) {
    return false;
  }

  return normalizeEmail(email1) === normalizeEmail(email2);
}

/**
 * Extract name from email address (e.g., "john.doe@example.com" -> "John Doe")
 * Used when contact name is not available
 *
 * @param email - Email address
 * @returns Capitalized name extracted from email
 */
export function getNameFromEmail(email: string): string {
  if (!email || typeof email !== "string") {
    return "Unnamed Contact";
  }

  const localPart = email.split("@")[0];
  if (!localPart) {
    return "Unnamed Contact";
  }

  // Replace dots, underscores, and hyphens with spaces
  const name = localPart.replace(/[._-]/g, " ");

  // Capitalize each word
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Validate email field with custom error messages
 *
 * @param email - Email address
 * @param fieldName - Field name for error message (e.g., "CC", "BCC")
 * @returns Error message if invalid, undefined if valid
 */
export function validateEmailField(email: string, fieldName: string = "Email"): string | undefined {
  if (!email || !email.trim()) {
    return `${fieldName} is required`;
  }

  if (!validateEmail(email)) {
    return `${fieldName} must be a valid email address`;
  }

  return undefined;
}

/**
 * Validate emails field (comma-separated) with custom error messages
 *
 * @param emails - Comma-separated email addresses
 * @param fieldName - Field name for error message (e.g., "CC", "BCC")
 * @returns Error message if invalid, undefined if valid
 */
export function validateEmailsField(emails: string, fieldName: string = "Emails"): string | undefined {
  if (!emails || !emails.trim()) {
    return undefined; // Empty is valid (optional field)
  }

  if (!validateEmails(emails)) {
    return `${fieldName} must contain valid email addresses separated by commas`;
  }

  return undefined;
}
