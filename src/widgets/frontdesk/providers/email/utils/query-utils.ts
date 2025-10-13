/**
 * Maps label IDs and names to Gmail query syntax
 *
 * This utility converts email labels to Gmail search operators that can be used
 * with the email API. The backend supports Gmail query syntax for filtering messages.
 */
export const getGmailQueryFromLabel = (labelId: string, labelName: string): string | null => {
  const lowerId = labelId.toLowerCase();
  const lowerName = labelName.toLowerCase();

  // System labels mapping
  if (lowerId.includes("inbox") || lowerName.includes("inbox")) return "in:inbox";
  if (lowerId.includes("sent") || lowerName.includes("sent")) return "in:sent";
  if (lowerId.includes("draft") || lowerName.includes("draft")) return "in:drafts";
  if (lowerId.includes("trash") || lowerName.includes("trash") || lowerName.includes("bin")) return "in:trash";
  if (lowerId.includes("spam") || lowerName.includes("spam") || lowerName.includes("junk")) return "in:spam";
  if (lowerId.includes("starred") || lowerName.includes("starred")) return "is:starred";
  if (lowerId.includes("unread") || lowerName.includes("unread")) return "is:unread";
  if (lowerId.includes("important") || lowerName.includes("important")) return "is:important";

  // For user labels, use the label name directly
  if (
    lowerName &&
    !lowerId.includes("inbox") &&
    !lowerId.includes("sent") &&
    !lowerId.includes("draft") &&
    !lowerId.includes("trash") &&
    !lowerId.includes("spam") &&
    !lowerId.includes("starred") &&
    !lowerId.includes("unread") &&
    !lowerId.includes("important")
  ) {
    return `label:${lowerName}`;
  }

  return null;
};

/**
 * Available Gmail Search Operators for reference:
 * - in:inbox - Inbox folder
 * - in:sent - Sent folder
 * - in:drafts - Drafts folder
 * - in:trash - Trash folder
 * - in:spam - Spam folder
 * - is:unread - Unread messages
 * - is:read - Read messages
 * - is:starred - Starred messages
 * - is:important - Important messages
 * - from:email@example.com - From specific sender
 * - to:email@example.com - To specific recipient
 * - subject:keyword - Subject contains keyword
 * - label:labelname - Messages with specific label
 *
 * Can combine multiple filters: in:sent is:unread
 */

/**
 * Combines multiple Gmail queries with AND logic
 */
export const combineGmailQueries = (...queries: (string | null)[]): string | null => {
  const validQueries = queries.filter((q): q is string => q !== null && q.trim() !== "");
  return validQueries.length > 0 ? validQueries.join(" ") : null;
};

/**
 * Parses a search input and converts it to Gmail query syntax
 */
export const parseSearchInput = (input: string): string => {
  if (!input.trim()) return "";

  // If the input already contains Gmail operators, return as is
  if (
    input.includes(":") ||
    input.includes("in:") ||
    input.includes("is:") ||
    input.includes("from:") ||
    input.includes("to:") ||
    input.includes("subject:")
  ) {
    return input.trim();
  }

  // Otherwise, treat as a general search term
  return input.trim();
};
