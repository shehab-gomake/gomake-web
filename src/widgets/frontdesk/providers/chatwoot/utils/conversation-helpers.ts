/**
 * Chatwoot Conversation Helper Utilities
 *
 * Centralized helper functions for working with Chatwoot conversations.
 * Provides consistent data transformation and extraction logic across components.
 */

import type { ChatwootConversation } from '@/services/frontdesk/api/chatwoot/types/conversations.types';

/**
 * Get display name for a conversation
 *
 * Priority order:
 * 1. Sender name
 * 2. Sender email
 * 3. Fallback: "Conversation #ID"
 *
 * @param conversation - The Chatwoot conversation object
 * @returns The display name for the conversation
 */
export const getConversationName = (conversation: ChatwootConversation): string => {
  return (
    conversation.meta?.sender?.name ||
    conversation.meta?.sender?.email ||
    `Conversation #${conversation.id}`
  );
};

/**
 * Get the last message content from a conversation
 *
 * Priority order:
 * 1. Last message from messages array
 * 2. last_non_activity_message content
 * 3. Fallback: "No messages yet"
 *
 * @param conversation - The Chatwoot conversation object
 * @returns The last message content
 */
export const getLastMessage = (conversation: ChatwootConversation): string => {
  if (conversation.messages && conversation.messages.length > 0) {
    const lastMsg = conversation.messages[conversation.messages.length - 1];
    return lastMsg.content || '';
  }
  return conversation.last_non_activity_message?.content || 'No messages yet';
};

/**
 * Get participant names from a conversation
 *
 * Includes:
 * - Sender name (if available)
 * - Assignee name (if available)
 *
 * @param conversation - The Chatwoot conversation object
 * @returns Array of participant names
 */
export const getParticipants = (conversation: ChatwootConversation): string[] => {
  const participants: string[] = [];

  if (conversation.meta?.sender?.name) {
    participants.push(conversation.meta.sender.name);
  }

  if (conversation.meta?.assignee?.name) {
    participants.push(conversation.meta.assignee.name);
  }

  return participants;
};

/**
 * Get conversation timestamp
 *
 * Returns the conversation timestamp or current time as fallback
 *
 * @param conversation - The Chatwoot conversation object
 * @returns ISO timestamp string
 */
export const getConversationTimestamp = (conversation: ChatwootConversation): string => {
  return conversation.timestamp || new Date().toISOString();
};

/**
 * Check if a conversation is unread
 *
 * @param conversation - The Chatwoot conversation object
 * @returns True if the conversation has unread messages
 */
export const isConversationUnread = (conversation: ChatwootConversation): boolean => {
  return (conversation.unread_count || 0) > 0;
};

/**
 * Get unread count for a conversation
 *
 * @param conversation - The Chatwoot conversation object
 * @returns Number of unread messages
 */
export const getUnreadCount = (conversation: ChatwootConversation): number => {
  return conversation.unread_count || 0;
};
