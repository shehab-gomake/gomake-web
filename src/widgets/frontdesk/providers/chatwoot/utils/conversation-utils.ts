/**
 * Conversation Utility Functions
 *
 * Common operations and helpers for working with Chatwoot conversations.
 */

import { format } from "date-fns";
import { ChatwootConversation, ConversationStatus } from "@/services/frontdesk/api/chatwoot/types/conversations.types";

/**
 * Gets the display name for a conversation
 *
 * @param conversation - The conversation
 * @returns The sender's name or email, or "Unknown" if unavailable
 *
 * @example
 * ```typescript
 * const name = getConversationName(conversation); // "John Doe"
 * ```
 */
export function getConversationName(conversation: ChatwootConversation): string {
  return conversation.meta?.sender?.name || conversation.meta?.sender?.email || "Unknown";
}

/**
 * Gets the conversation channel/inbox name
 *
 * @param conversation - The conversation
 * @returns The channel name (e.g., "Email", "WhatsApp")
 *
 * @example
 * ```typescript
 * const channel = getConversationChannel(conversation); // "Email"
 * ```
 */
export function getConversationChannel(conversation: ChatwootConversation): string {
  const channel = conversation.meta?.channel;
  if (!channel) return "Unknown";

  // Clean up channel names (e.g., "Channel::Email" -> "Email")
  if (channel.includes("::")) {
    return channel.split("::")[1];
  }

  return channel;
}

/**
 * Checks if a conversation is unread
 *
 * @param conversation - The conversation
 * @returns True if the conversation has unread messages
 *
 * @example
 * ```typescript
 * if (isUnread(conversation)) {
 *   // Show unread indicator
 * }
 * ```
 */
export function isUnread(conversation: ChatwootConversation): boolean {
  return (conversation.unread_count ?? 0) > 0;
}

/**
 * Checks if a conversation is resolved
 *
 * @param conversation - The conversation
 * @returns True if the conversation is resolved
 *
 * @example
 * ```typescript
 * if (isResolved(conversation)) {
 *   // Show resolved badge
 * }
 * ```
 */
export function isResolved(conversation: ChatwootConversation): boolean {
  return conversation.status === ConversationStatus.RESOLVED;
}

/**
 * Checks if a conversation is assigned to someone
 *
 * @param conversation - The conversation
 * @returns True if the conversation has an assignee
 *
 * @example
 * ```typescript
 * if (isAssigned(conversation)) {
 *   // Show assignee avatar
 * }
 * ```
 */
export function isAssigned(conversation: ChatwootConversation): boolean {
  return conversation.meta?.assignee !== null && conversation.meta?.assignee !== undefined;
}

/**
 * Gets the last message preview text
 *
 * @param conversation - The conversation
 * @param maxLength - Maximum length of preview (default: 100)
 * @returns Truncated message content
 *
 * @example
 * ```typescript
 * const preview = getMessagePreview(conversation, 50); // "Hello, I have a question about..."
 * ```
 */
export function getMessagePreview(conversation: ChatwootConversation, maxLength: number = 100): string {
  const lastMessage = conversation.last_non_activity_message;
  if (!lastMessage?.content) return "";

  const content = lastMessage.content.trim();
  if (content.length <= maxLength) return content;

  return content.substring(0, maxLength) + "...";
}

/**
 * Formats a timestamp to relative time (e.g., "2 hours ago")
 *
 * @param timestamp - Unix timestamp in seconds
 * @returns Relative time string
 *
 * @example
 * ```typescript
 * const timeAgo = formatRelativeTime(conversation.last_activity_at); // "5 minutes ago"
 * ```
 */
export function formatRelativeTime(timestamp?: number): string {
  if (!timestamp) return "";

  const now = Date.now() / 1000;
  const diffSeconds = now - timestamp;

  if (diffSeconds < 60) return "just now";
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;

  // Format as day/month/year
  return format(new Date(timestamp * 1000), "d/M/yyyy");
}

/**
 * Gets a color for conversation status
 *
 * @param status - The conversation status
 * @returns A color string (e.g., "#10B981" for success)
 *
 * @example
 * ```typescript
 * const color = getStatusColor(conversation.status); // "#10B981"
 * ```
 */
export function getStatusColor(status?: string): string {
  switch (status) {
    case ConversationStatus.OPEN:
      return "#3B82F6"; // Blue
    case ConversationStatus.RESOLVED:
      return "#10B981"; // Green
    case ConversationStatus.PENDING:
      return "#F59E0B"; // Orange
    case ConversationStatus.SNOOZED:
      return "#6B7280"; // Gray
    default:
      return "#6B7280"; // Gray
  }
}

/**
 * Sorts conversations by last activity (most recent first)
 *
 * @param conversations - Array of conversations
 * @returns Sorted array (does not mutate original)
 *
 * @example
 * ```typescript
 * const sorted = sortByLastActivity(conversations);
 * ```
 */
export function sortByLastActivity(conversations: ChatwootConversation[]): ChatwootConversation[] {
  return [...conversations].sort((a, b) => {
    const aTime = a.last_activity_at ?? 0;
    const bTime = b.last_activity_at ?? 0;
    return bTime - aTime;
  });
}

/**
 * Filters conversations by search query
 *
 * Searches in: sender name, sender email, message content
 *
 * @param conversations - Array of conversations
 * @param query - Search query
 * @returns Filtered array
 *
 * @example
 * ```typescript
 * const results = searchConversations(conversations, "john");
 * ```
 */
export function searchConversations(conversations: ChatwootConversation[], query: string): ChatwootConversation[] {
  if (!query.trim()) return conversations;

  const lowerQuery = query.toLowerCase();

  return conversations.filter((conv) => {
    const senderName = conv.meta?.sender?.name?.toLowerCase() || "";
    const senderEmail = conv.meta?.sender?.email?.toLowerCase() || "";
    const messageContent = conv.last_non_activity_message?.content?.toLowerCase() || "";

    return (
      senderName.includes(lowerQuery) ||
      senderEmail.includes(lowerQuery) ||
      messageContent.includes(lowerQuery)
    );
  });
}

/**
 * Groups conversations by status
 *
 * @param conversations - Array of conversations
 * @returns Object with conversations grouped by status
 *
 * @example
 * ```typescript
 * const grouped = groupByStatus(conversations);
 * // { open: [...], resolved: [...], pending: [...] }
 * ```
 */
export function groupByStatus(conversations: ChatwootConversation[]): Record<string, ChatwootConversation[]> {
  return conversations.reduce((acc, conv) => {
    const status = conv.status || "unknown";
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(conv);
    return acc;
  }, {} as Record<string, ChatwootConversation[]>);
}
