/**
 * Normalization Utilities for Chatwoot Conversations
 *
 * Provides helper functions for normalizing and denormalizing conversation data.
 * Used to convert between array format and normalized (by ID) format.
 */

import { SetterOrUpdater } from "recoil";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";

// ============================================================================
// TYPES
// ============================================================================

export interface NormalizedData<T> {
  byId: Record<number, T>;
  allIds: number[];
}

export interface ConversationUpdatePayload {
  id: number;
  updates: Partial<ChatwootConversation>;
}

// ============================================================================
// NORMALIZATION FUNCTIONS
// ============================================================================

/**
 * Normalize an array of conversations into a lookup table and ID list
 *
 * @param conversations - Array of conversations
 * @returns Normalized structure with byId lookup and allIds array
 */
export function normalizeConversations(conversations: ChatwootConversation[]): NormalizedData<ChatwootConversation> {
  const byId: Record<number, ChatwootConversation> = {};
  const allIds: number[] = [];

  for (const conversation of conversations) {
    byId[conversation.id] = conversation;
    allIds.push(conversation.id);
  }

  return { byId, allIds };
}

/**
 * Denormalize back to an array
 *
 * @param normalized - Normalized data structure
 * @returns Array of conversations in order
 */
export function denormalizeConversations(normalized: NormalizedData<ChatwootConversation>): ChatwootConversation[] {
  return normalized.allIds.map((id) => normalized.byId[id]).filter((c): c is ChatwootConversation => c !== undefined);
}

/**
 * Merge new conversations into existing normalized data
 * Handles both updates to existing conversations and adding new ones
 *
 * @param existing - Existing normalized data
 * @param newConversations - New conversations to merge
 * @param prepend - If true, new IDs are added at the start; if false, at the end
 * @returns Merged normalized data
 */
export function mergeNormalizedConversations(
  existing: NormalizedData<ChatwootConversation>,
  newConversations: ChatwootConversation[],
  prepend: boolean = false
): NormalizedData<ChatwootConversation> {
  const byId = { ...existing.byId };
  const existingIdSet = new Set(existing.allIds);
  const newIds: number[] = [];

  for (const conversation of newConversations) {
    byId[conversation.id] = conversation;
    if (!existingIdSet.has(conversation.id)) {
      newIds.push(conversation.id);
    }
  }

  const allIds = prepend ? [...newIds, ...existing.allIds] : [...existing.allIds, ...newIds];

  return { byId, allIds };
}

/**
 * Update a single conversation in normalized data
 *
 * @param normalized - Current normalized data
 * @param conversationId - ID of conversation to update
 * @param updates - Partial updates to apply
 * @returns Updated normalized data (or original if conversation not found)
 */
export function updateNormalizedConversation(
  normalized: NormalizedData<ChatwootConversation>,
  conversationId: number,
  updates: Partial<ChatwootConversation>
): NormalizedData<ChatwootConversation> {
  const existing = normalized.byId[conversationId];
  if (!existing) {
    return normalized;
  }

  return {
    ...normalized,
    byId: {
      ...normalized.byId,
      [conversationId]: { ...existing, ...updates },
    },
  };
}

/**
 * Remove a conversation from normalized data
 *
 * @param normalized - Current normalized data
 * @param conversationId - ID of conversation to remove
 * @returns Updated normalized data
 */
export function removeNormalizedConversation(
  normalized: NormalizedData<ChatwootConversation>,
  conversationId: number
): NormalizedData<ChatwootConversation> {
  const { [conversationId]: removed, ...restById } = normalized.byId;
  return {
    byId: restById,
    allIds: normalized.allIds.filter((id) => id !== conversationId),
  };
}

/**
 * Reorder conversations in normalized data
 * Moves a conversation to a new position
 *
 * @param normalized - Current normalized data
 * @param conversationId - ID of conversation to move
 * @param newIndex - New index position
 * @returns Updated normalized data
 */
export function reorderNormalizedConversation(
  normalized: NormalizedData<ChatwootConversation>,
  conversationId: number,
  newIndex: number
): NormalizedData<ChatwootConversation> {
  const currentIndex = normalized.allIds.indexOf(conversationId);
  if (currentIndex === -1 || currentIndex === newIndex) {
    return normalized;
  }

  const newAllIds = [...normalized.allIds];
  newAllIds.splice(currentIndex, 1);
  newAllIds.splice(newIndex, 0, conversationId);

  return {
    ...normalized,
    allIds: newAllIds,
  };
}

/**
 * Move a conversation to the top (e.g., when new message received)
 */
export function moveToTop(
  normalized: NormalizedData<ChatwootConversation>,
  conversationId: number
): NormalizedData<ChatwootConversation> {
  return reorderNormalizedConversation(normalized, conversationId, 0);
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

/**
 * Apply multiple updates in a single operation
 *
 * @param normalized - Current normalized data
 * @param updates - Array of update payloads
 * @returns Updated normalized data
 */
export function batchUpdateNormalizedConversations(
  normalized: NormalizedData<ChatwootConversation>,
  updates: ConversationUpdatePayload[]
): NormalizedData<ChatwootConversation> {
  const byId = { ...normalized.byId };

  for (const { id, updates: conversationUpdates } of updates) {
    const existing = byId[id];
    if (existing) {
      byId[id] = { ...existing, ...conversationUpdates };
    }
  }

  return { ...normalized, byId };
}

/**
 * Filter normalized conversations
 *
 * @param normalized - Current normalized data
 * @param predicate - Filter function
 * @returns New normalized data with only matching conversations
 */
export function filterNormalizedConversations(
  normalized: NormalizedData<ChatwootConversation>,
  predicate: (conversation: ChatwootConversation) => boolean
): NormalizedData<ChatwootConversation> {
  const filteredIds = normalized.allIds.filter((id) => {
    const conversation = normalized.byId[id];
    return conversation && predicate(conversation);
  });

  const byId: Record<number, ChatwootConversation> = {};
  for (const id of filteredIds) {
    byId[id] = normalized.byId[id];
  }

  return { byId, allIds: filteredIds };
}

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Get statistics about normalized data
 */
export function getNormalizedStats(normalized: NormalizedData<ChatwootConversation>): {
  total: number;
  byStatus: Record<string, number>;
  unread: number;
  unassigned: number;
} {
  const stats = {
    total: normalized.allIds.length,
    byStatus: {} as Record<string, number>,
    unread: 0,
    unassigned: 0,
  };

  for (const id of normalized.allIds) {
    const conversation = normalized.byId[id];
    if (!conversation) continue;

    // Count by status
    const status = conversation.status || "unknown";
    stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

    // Count unread
    if ((conversation.unread_count || 0) > 0) {
      stats.unread++;
    }

    // Count unassigned
    if (!conversation.meta?.assignee?.id) {
      stats.unassigned++;
    }
  }

  return stats;
}

// ============================================================================
// RECOIL INTEGRATION HELPERS
// ============================================================================

/**
 * Create an updater function for use with Recoil's SetterOrUpdater
 * Handles partial updates to a conversation
 */
export function createConversationUpdater(
  conversationId: number,
  updates: Partial<ChatwootConversation>
): (prev: ChatwootConversation | null) => ChatwootConversation | null {
  return (prev) => {
    if (!prev) return null;
    return { ...prev, ...updates };
  };
}

/**
 * Create a setter that adds a conversation to an ID list if not present
 */
export function createIdListAdder(conversationId: number, prepend: boolean = true): (prev: number[]) => number[] {
  return (prev) => {
    if (prev.includes(conversationId)) return prev;
    return prepend ? [conversationId, ...prev] : [...prev, conversationId];
  };
}

/**
 * Create a setter that removes a conversation from an ID list
 */
export function createIdListRemover(conversationId: number): (prev: number[]) => number[] {
  return (prev) => prev.filter((id) => id !== conversationId);
}

