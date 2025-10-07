/**
 * Shared string utilities for FrontDesk providers
 *
 * Consolidates common string operations like truncation, capitalization,
 * HTML stripping, and text highlighting.
 */

/**
 * Truncates a string to a maximum length with ellipsis
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length (including ellipsis)
 * @param ellipsis - Ellipsis string (defaults to "...")
 * @returns Truncated string
 */
export function truncate(text: string, maxLength: number, ellipsis: string = "..."): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength - ellipsis.length).trim();
  return truncated + ellipsis;
}

/**
 * Capitalizes the first letter of a string
 *
 * @param text - Text to capitalize
 * @returns Capitalized string
 */
export function capitalize(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Capitalizes the first letter of each word
 *
 * @param text - Text to title case
 * @returns Title cased string
 */
export function titleCase(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

/**
 * Removes HTML tags from a string
 *
 * @param html - HTML string
 * @returns Plain text string
 */
export function stripHtml(html: string): string {
  if (!html) return "";

  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, "");

  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");

  return text.trim();
}

/**
 * Extracts plain text from HTML with basic formatting preservation
 *
 * Converts <br>, <p>, and block elements to newlines
 *
 * @param html - HTML string
 * @returns Plain text with preserved line breaks
 */
export function htmlToText(html: string): string {
  if (!html) return "";

  // Convert block elements to newlines
  let text = html
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n\n");

  // Remove remaining tags
  text = stripHtml(text);

  // Clean up excessive newlines
  text = text.replace(/\n{3,}/g, "\n\n").trim();

  return text;
}

/**
 * Highlights search terms in text with markers
 *
 * @param text - Text to highlight
 * @param query - Search query
 * @param caseInsensitive - Whether search is case insensitive (default: true)
 * @returns Array of text segments with highlight flags
 */
export function highlightSearchTerms(
  text: string,
  query: string,
  caseInsensitive: boolean = true
): Array<{ text: string; highlighted: boolean }> {
  if (!text || !query) {
    return [{ text, highlighted: false }];
  }

  const flags = caseInsensitive ? "gi" : "g";
  const regex = new RegExp(`(${escapeRegex(query)})`, flags);
  const parts = text.split(regex);

  return parts
    .filter((part) => part.length > 0)
    .map((part) => ({
      text: part,
      highlighted: regex.test(part),
    }));
}

/**
 * Escapes special regex characters in a string
 *
 * @param str - String to escape
 * @returns Escaped string safe for regex
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Extracts a snippet from text around a search query
 *
 * @param text - Full text
 * @param query - Search query
 * @param maxLength - Maximum snippet length (default: 150)
 * @returns Text snippet centered around query match
 */
export function extractSnippet(text: string, query: string, maxLength: number = 150): string {
  if (!text || !query) return truncate(text, maxLength);

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return truncate(text, maxLength);
  }

  // Calculate snippet boundaries
  const before = Math.floor((maxLength - query.length) / 2);
  const after = maxLength - query.length - before;

  const start = Math.max(0, index - before);
  const end = Math.min(text.length, index + query.length + after);

  let snippet = text.slice(start, end);

  // Add ellipsis if truncated
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";

  return snippet;
}

/**
 * Pluralizes a word based on count
 *
 * @param count - Number of items
 * @param singular - Singular form
 * @param plural - Plural form (defaults to singular + "s")
 * @returns Pluralized string with count
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const pluralForm = plural || singular + "s";
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

/**
 * Converts a string to a URL-safe slug
 *
 * @param text - Text to convert
 * @returns URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars
    .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Checks if a string contains a query (case insensitive)
 *
 * @param text - Text to search in
 * @param query - Search query
 * @returns True if text contains query
 */
export function containsQuery(text: string, query: string): boolean {
  if (!text || !query) return false;
  return text.toLowerCase().includes(query.toLowerCase());
}