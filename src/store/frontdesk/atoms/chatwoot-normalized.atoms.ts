/**
 * Normalized Chatwoot State Atoms
 *
 * Implements data normalization using atom families for efficient updates.
 * Instead of storing conversations as arrays, we store them individually
 * and track their order separately.
 *
 * Benefits:
 * - Updating a single conversation only re-renders components using that conversation
 * - WebSocket updates are O(1) instead of O(n)
 * - Easier optimistic updates with automatic rollback
 * - Better memory efficiency for large conversation lists
 */

import { atom, atomFamily, selector, selectorFamily } from "recoil";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import type { ChatwootMessage } from "@/services/frontdesk/api/chatwoot/types/conversations.types";

// ============================================================================
// CONVERSATION NORMALIZATION
// ============================================================================

/**
 * Atom family for individual conversations
 * Access: chatwootConversationByIdAtom(conversationId)
 *
 * @example
 * ```typescript
 * const [conversation, setConversation] = useRecoilState(chatwootConversationByIdAtom(123));
 * ```
 */
export const chatwootConversationByIdAtom = atomFamily<ChatwootConversation | null, number>({
  key: "frontdesk.chatwoot.normalized.conversationById",
  default: null,
});

/**
 * Atom to track conversation IDs per view/filter
 * Key: filter key (same as cache key)
 * Value: Ordered array of conversation IDs
 *
 * This allows different views to have different orderings of conversations
 */
export const chatwootConversationIdsByFilterAtom = atomFamily<number[], string>({
  key: "frontdesk.chatwoot.normalized.conversationIdsByFilter",
  default: [],
});

/**
 * Track all known conversation IDs globally
 * Used for cleanup and invalidation
 */
export const chatwootAllConversationIdsAtom = atom<Set<number>>({
  key: "frontdesk.chatwoot.normalized.allConversationIds",
  default: new Set(),
});

/**
 * Selector family to get conversations for a filter as an array
 * Reconstructs the list from normalized data
 */
export const chatwootConversationsForFilterSelector = selectorFamily<ChatwootConversation[], string>({
  key: "frontdesk.chatwoot.normalized.conversationsForFilter",
  get:
    (filterKey: string) =>
    ({ get }) => {
      const ids = get(chatwootConversationIdsByFilterAtom(filterKey));
      const conversations: ChatwootConversation[] = [];

      for (const id of ids) {
        const conversation = get(chatwootConversationByIdAtom(id));
        if (conversation) {
          conversations.push(conversation);
        }
      }

      return conversations;
    },
});

/**
 * Selector to get a conversation with computed properties
 */
export const chatwootEnrichedConversationSelector = selectorFamily<
  (ChatwootConversation & { isUnread: boolean; lastMessagePreview: string }) | null,
  number
>({
  key: "frontdesk.chatwoot.normalized.enrichedConversation",
  get:
    (conversationId: number) =>
    ({ get }) => {
      const conversation = get(chatwootConversationByIdAtom(conversationId));
      if (!conversation) return null;

      return {
        ...conversation,
        isUnread: (conversation.unread_count || 0) > 0,
        lastMessagePreview: conversation.last_non_activity_message?.content?.slice(0, 100) || "",
      };
    },
});

// ============================================================================
// MESSAGE NORMALIZATION
// ============================================================================

/**
 * Atom family for individual messages
 */
export const chatwootMessageByIdAtom = atomFamily<ChatwootMessage | null, number>({
  key: "frontdesk.chatwoot.normalized.messageById",
  default: null,
});

/**
 * Track message IDs per conversation
 * Ordered from oldest to newest
 */
export const chatwootMessageIdsByConversationAtom = atomFamily<number[], number>({
  key: "frontdesk.chatwoot.normalized.messageIdsByConversation",
  default: [],
});

/**
 * Selector to get all messages for a conversation
 */
export const chatwootMessagesForConversationSelector = selectorFamily<ChatwootMessage[], number>({
  key: "frontdesk.chatwoot.normalized.messagesForConversation",
  get:
    (conversationId: number) =>
    ({ get }) => {
      const ids = get(chatwootMessageIdsByConversationAtom(conversationId));
      const messages: ChatwootMessage[] = [];

      for (const id of ids) {
        const message = get(chatwootMessageByIdAtom(id));
        if (message) {
          messages.push(message);
        }
      }

      return messages;
    },
});

// ============================================================================
// NORMALIZATION METADATA
// ============================================================================

/**
 * Track normalization state per filter
 */
export interface NormalizationState {
  isNormalized: boolean;
  lastNormalizedAt: number;
  conversationCount: number;
}

export const chatwootNormalizationStateAtom = atomFamily<NormalizationState, string>({
  key: "frontdesk.chatwoot.normalized.state",
  default: {
    isNormalized: false,
    lastNormalizedAt: 0,
    conversationCount: 0,
  },
});

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Normalized data structure for batch operations
 */
export interface NormalizedConversations {
  byId: Record<number, ChatwootConversation>;
  allIds: number[];
}

/**
 * Normalize an array of conversations into the normalized structure
 */
export function normalizeConversations(conversations: ChatwootConversation[]): NormalizedConversations {
  const byId: Record<number, ChatwootConversation> = {};
  const allIds: number[] = [];

  for (const conversation of conversations) {
    byId[conversation.id] = conversation;
    allIds.push(conversation.id);
  }

  return { byId, allIds };
}

/**
 * Denormalize (convert back to array) - useful for backward compatibility
 */
export function denormalizeConversations(normalized: NormalizedConversations): ChatwootConversation[] {
  return normalized.allIds.map((id) => normalized.byId[id]).filter(Boolean);
}

// ============================================================================
// SELECTORS FOR DERIVED STATE
// ============================================================================

/**
 * Count conversations matching a predicate
 */
export const chatwootConversationCountByPredicateSelector = selectorFamily<
  number,
  { filterKey: string; predicate: "open" | "resolved" | "pending" | "unread" | "unassigned" }
>({
  key: "frontdesk.chatwoot.normalized.countByPredicate",
  get:
    ({ filterKey, predicate }) =>
    ({ get }) => {
      const ids = get(chatwootConversationIdsByFilterAtom(filterKey));
      let count = 0;

      for (const id of ids) {
        const conversation = get(chatwootConversationByIdAtom(id));
        if (!conversation) continue;

        switch (predicate) {
          case "open":
            if (conversation.status === "open") count++;
            break;
          case "resolved":
            if (conversation.status === "resolved") count++;
            break;
          case "pending":
            if (conversation.status === "pending") count++;
            break;
          case "unread":
            if ((conversation.unread_count || 0) > 0) count++;
            break;
          case "unassigned":
            if (!conversation.meta?.assignee?.id) count++;
            break;
        }
      }

      return count;
    },
});

/**
 * Get conversation IDs that need attention (unread or unassigned)
 */
export const chatwootAttentionNeededIdsSelector = selectorFamily<number[], string>({
  key: "frontdesk.chatwoot.normalized.attentionNeededIds",
  get:
    (filterKey: string) =>
    ({ get }) => {
      const ids = get(chatwootConversationIdsByFilterAtom(filterKey));
      const attentionNeeded: number[] = [];

      for (const id of ids) {
        const conversation = get(chatwootConversationByIdAtom(id));
        if (!conversation) continue;

        if ((conversation.unread_count || 0) > 0 || !conversation.meta?.assignee?.id) {
          attentionNeeded.push(id);
        }
      }

      return attentionNeeded;
    },
});

