/**
 * Chatwoot Conversation Selectors
 *
 * Recoil selectors for derived conversation state.
 * Optimizes performance by computing filtered/sorted data once and memoizing.
 */

import { selector, selectorFamily } from "recoil";
import {
  chatwootConversationsAtom,
  chatwootConversationCountsAtom,
  chatwootSelectedConversationAtom,
} from "../atoms/chatwoot.atoms";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";

/**
 * Conversations by Status Selector Family
 *
 * Returns conversations filtered by status.
 * Memoized per status value for optimal performance.
 *
 * @param status - 'open' | 'resolved' | 'pending' | 'snoozed' | 'all'
 * @returns Filtered conversation array
 */
export const conversationsByStatusSelector = selectorFamily<
  ChatwootConversation[],
  string | undefined
>({
  key: "chatwoot.conversations.byStatus",
  get:
    (status) =>
    ({ get }) => {
      const conversations = get(chatwootConversationsAtom);

      if (!status || status === "all") {
        return conversations;
      }

      return conversations.filter((conv) => conv.status === status);
    },
});

/**
 * Conversations by Inbox Selector Family
 *
 * Returns conversations filtered by inbox ID.
 *
 * @param inboxId - Inbox ID to filter by
 * @returns Filtered conversation array
 */
export const conversationsByInboxSelector = selectorFamily<
  ChatwootConversation[],
  number | null | undefined
>({
  key: "chatwoot.conversations.byInbox",
  get:
    (inboxId) =>
    ({ get }) => {
      const conversations = get(chatwootConversationsAtom);

      if (!inboxId) {
        return conversations;
      }

      return conversations.filter((conv) => conv.inbox_id === inboxId);
    },
});

/**
 * Conversations by Assignee Selector Family
 *
 * Returns conversations filtered by assignee type.
 *
 * @param params - { assigneeType: 'me' | 'unassigned' | 'all', currentUserId?: number }
 * @returns Filtered conversation array
 */
export const conversationsByAssigneeSelector = selectorFamily<
  ChatwootConversation[],
  { assigneeType?: string; currentUserId?: number }
>({
  key: "chatwoot.conversations.byAssignee",
  get:
    ({ assigneeType, currentUserId }) =>
    ({ get }) => {
      const conversations = get(chatwootConversationsAtom);

      if (!assigneeType || assigneeType === "all") {
        return conversations;
      }

      if (assigneeType === "unassigned") {
        return conversations.filter(
          (conv) => !conv.meta?.assignee || conv.meta.assignee.id === null
        );
      }

      if (assigneeType === "me" && currentUserId) {
        return conversations.filter(
          (conv) => conv.meta?.assignee?.id === currentUserId
        );
      }

      return conversations;
    },
});

/**
 * Unread Conversations Selector
 *
 * Returns only conversations with unread messages.
 */
export const unreadConversationsSelector = selector<ChatwootConversation[]>({
  key: "chatwoot.conversations.unread",
  get: ({ get }) => {
    const conversations = get(chatwootConversationsAtom);
    return conversations.filter((conv) => conv.unread_count && conv.unread_count > 0);
  },
});

/**
 * Total Unread Count Selector
 *
 * Returns sum of all unread messages across conversations.
 */
export const totalUnreadCountSelector = selector<number>({
  key: "chatwoot.conversations.totalUnreadCount",
  get: ({ get }) => {
    const conversations = get(chatwootConversationsAtom);
    return conversations.reduce((total, conv) => total + (conv.unread_count || 0), 0);
  },
});

/**
 * Conversations Search Selector Family
 *
 * Returns conversations matching search query.
 * Searches in: contact name, email, and recent message content.
 *
 * @param query - Search query string
 * @returns Filtered conversation array
 */
export const conversationSearchSelector = selectorFamily<
  ChatwootConversation[],
  string
>({
  key: "chatwoot.conversations.search",
  get:
    (query) =>
    ({ get }) => {
      const conversations = get(chatwootConversationsAtom);

      if (!query || query.trim() === "") {
        return conversations;
      }

      const lowerQuery = query.toLowerCase();

      return conversations.filter((conv) => {
        // Search in contact name
        if (conv.meta?.sender?.name?.toLowerCase().includes(lowerQuery)) {
          return true;
        }

        // Search in contact email
        if (conv.meta?.sender?.email?.toLowerCase().includes(lowerQuery)) {
          return true;
        }

        // Search in recent messages
        if (conv.messages && conv.messages.length > 0) {
          const hasMatchingMessage = conv.messages.some((msg) =>
            msg.content?.toLowerCase().includes(lowerQuery)
          );
          if (hasMatchingMessage) {
            return true;
          }
        }

        return false;
      });
    },
});

/**
 * Selected Conversation Detail Selector
 *
 * Returns the currently selected conversation with all its details.
 * Returns null if no conversation is selected or not found.
 */
export const selectedConversationDetailSelector = selector<ChatwootConversation | null>({
  key: "chatwoot.conversation.selectedDetail",
  get: ({ get }) => {
    const selectedConversation = get(chatwootSelectedConversationAtom);
    const conversations = get(chatwootConversationsAtom);

    if (!selectedConversation?.id) {
      return null;
    }

    // Find the conversation in the list (might have updated data)
    const foundConversation = conversations.find(
      (conv) => conv.id === selectedConversation.id
    );

    return foundConversation || selectedConversation;
  },
});

/**
 * Conversation Counts By Status Selector
 *
 * Returns breakdown of conversation counts by status.
 * Computed from actual conversation list, not from API meta.
 */
export const conversationCountsByStatusSelector = selector<{
  open: number;
  resolved: number;
  pending: number;
  snoozed: number;
  all: number;
}>({
  key: "chatwoot.conversations.countsByStatus",
  get: ({ get }) => {
    const conversations = get(chatwootConversationsAtom);

    return {
      open: conversations.filter((c) => c.status === "open").length,
      resolved: conversations.filter((c) => c.status === "resolved").length,
      pending: conversations.filter((c) => c.status === "pending").length,
      snoozed: conversations.filter((c) => c.status === "snoozed").length,
      all: conversations.length,
    };
  },
});

/**
 * Has More Conversations Selector
 *
 * Determines if there are more conversations to load based on counts.
 */
export const hasMoreConversationsSelector = selector<boolean>({
  key: "chatwoot.conversations.hasMore",
  get: ({ get }) => {
    const conversations = get(chatwootConversationsAtom);
    const counts = get(chatwootConversationCountsAtom);

    // If we have fewer conversations than the reported count, there's more
    return conversations.length < (counts.all || 0);
  },
});
