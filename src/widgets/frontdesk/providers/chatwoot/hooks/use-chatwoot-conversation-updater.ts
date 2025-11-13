/**
 * Chatwoot Conversation Updater Hook
 *
 * Provides cache-aware conversation update functions that sync updates across:
 * - All cache entries (view-scoped caches)
 * - Legacy conversation atom (backward compatibility)
 * - Selected conversation atom
 *
 * This ensures mutations (assign, priority, status, etc.) persist across view switches.
 */

import { useCallback } from 'react';
import { useRecoilState, useRecoilCallback } from 'recoil';
import {
  chatwootConversationsAtom,
  chatwootSelectedConversationAtom,
  chatwootConversationsCacheFamily,
  chatwootCacheKeysAtom,
} from '@/store/frontdesk/atoms/chatwoot.atoms';
import type { ChatwootConversation } from '@/services/frontdesk/api/chatwoot/types/conversations.types';
import { createLogger } from '@/services/frontdesk/utils/logger';

const logger = createLogger('useChatwootConversationUpdater');

export const useChatwootConversationUpdater = () => {
  const [selectedConversation, setSelectedConversation] = useRecoilState(chatwootSelectedConversationAtom);

  /**
   * Update a conversation across all caches and atoms
   * Uses Recoil callback to access all cache entries
   */
  const updateConversation = useRecoilCallback(
    ({ snapshot, set }) =>
      async (conversationId: number, updates: Partial<ChatwootConversation>) => {
        logger.debug(`Updating conversation ${conversationId} across all caches`, updates);

        // Get all cache keys
        const cacheKeys = await snapshot.getPromise(chatwootCacheKeysAtom);

        // Update each cache that contains this conversation
        let updatedCacheCount = 0;
        for (const cacheKey of Array.from(cacheKeys)) {
          const cache = await snapshot.getPromise(chatwootConversationsCacheFamily(cacheKey));

          // Check if this cache contains the conversation
          const conversationIndex = cache.conversations.findIndex(c => c.id === conversationId);
          if (conversationIndex !== -1) {
            // Update the conversation in this cache
            const updatedConversations = [...cache.conversations];
            updatedConversations[conversationIndex] = {
              ...updatedConversations[conversationIndex],
              ...updates,
            };

            set(chatwootConversationsCacheFamily(cacheKey), {
              ...cache,
              conversations: updatedConversations,
            });

            updatedCacheCount++;
          }
        }

        logger.debug(`Updated conversation in ${updatedCacheCount} cache(s)`);

        // Update legacy atom for backward compatibility
        const legacyConversations = await snapshot.getPromise(chatwootConversationsAtom);
        const updatedLegacy = legacyConversations.map(conv =>
          conv.id === conversationId ? { ...conv, ...updates } : conv
        );
        set(chatwootConversationsAtom, updatedLegacy);

        // Update selected conversation if it's the one being modified
        if (selectedConversation?.id === conversationId) {
          setSelectedConversation(prev => prev ? { ...prev, ...updates } : prev);
        }
      },
    [selectedConversation?.id, setSelectedConversation]
  );

  /**
   * Remove a conversation from all caches and atoms
   */
  const removeConversation = useRecoilCallback(
    ({ snapshot, set }) =>
      async (conversationId: number) => {
        logger.debug(`Removing conversation ${conversationId} from all caches`);

        // Get all cache keys
        const cacheKeys = await snapshot.getPromise(chatwootCacheKeysAtom);

        // Remove from each cache
        for (const cacheKey of Array.from(cacheKeys)) {
          const cache = await snapshot.getPromise(chatwootConversationsCacheFamily(cacheKey));
          const filteredConversations = cache.conversations.filter(c => c.id !== conversationId);

          if (filteredConversations.length !== cache.conversations.length) {
            set(chatwootConversationsCacheFamily(cacheKey), {
              ...cache,
              conversations: filteredConversations,
            });
          }
        }

        // Remove from legacy atom
        const legacyConversations = await snapshot.getPromise(chatwootConversationsAtom);
        set(chatwootConversationsAtom, legacyConversations.filter(c => c.id !== conversationId));

        // Clear selected conversation if it's the one being removed
        if (selectedConversation?.id === conversationId) {
          setSelectedConversation(null);
        }
      },
    [selectedConversation?.id, setSelectedConversation]
  );

  /**
   * Wrapper that accepts partial conversation updates (for backward compatibility)
   */
  const updateConversationInList = useCallback(
    (conversationId: number, updates: Partial<ChatwootConversation>) => {
      updateConversation(conversationId, updates);
    },
    [updateConversation]
  );

  return {
    updateConversation,
    removeConversation,
    updateConversationInList,
  };
};
