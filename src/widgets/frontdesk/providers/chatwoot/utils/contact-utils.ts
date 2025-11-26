/**
 * Contact Utilities
 * 
 * Helper functions for contact-related operations, matching Chatwoot's behavior.
 */

/**
 * Generate a capitalized name from an email address.
 * Matches Chatwoot's behavior: extracts username (part before @) and capitalizes first letter.
 * 
 * @param email - Email address (e.g., "john.doe@example.com")
 * @returns Capitalized name (e.g., "John.doe")
 * 
 * @example
 * getCapitalizedNameFromEmail("john.doe@example.com") // "John.doe"
 * getCapitalizedNameFromEmail("jane@test.com") // "Jane"
 */
export function getCapitalizedNameFromEmail(email: string): string {
  // Extract username part (before @)
  const name = email.match(/^([^@]*)@/)?.[1] || email.split('@')[0];
  // Capitalize first letter
  return name.charAt(0).toUpperCase() + name.slice(1);
}

