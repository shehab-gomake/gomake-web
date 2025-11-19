import { useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';
import { internalLoadingStatesAtom } from '@/store/frontdesk/atoms/internal.atoms';
import { directMessagesService } from '@/services/frontdesk/api/direct-messages.service';
import { Conversation } from '../types/direct-messages.types';
import { dmConversationsState } from '@/store/direct-messages';

/**
 * Hook to fetch a single DM conversation by ID
 *
 * Handles loading state, error handling, and API communication
 * for fetching conversations that aren't in the local list.
 * Automatically adds fetched conversations to the local store.
 *
 * @example
 * const { fetchConversation, isLoading, error } = useFetchDMConversation();
 *
 * const conversation = await fetchConversation(conversationId);
 * if (conversation) {
 *   // Conversation is now in the store and can be selected
 * }
 */
export const useFetchDMConversation = () => {
  const [loadingStates, setLoadingStates] = useRecoilState(internalLoadingStatesAtom);
  const [conversations, setConversations] = useRecoilState(dmConversationsState);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch a conversation by ID from the API
   *
   * @param conversationId - The conversation ID to fetch
   * @returns The fetched conversation or null if failed
   */
  const fetchConversation = useCallback(async (
    conversationId: string
  ): Promise<Conversation | null> => {
    console.log('[DM Fetch] Fetching conversation:', conversationId);

    setLoadingStates(prev => ({ ...prev, conversationDetail: true }));
    setError(null);

    try {
      const conversation = await directMessagesService.getConversation(conversationId);

      console.log('[DM Fetch] Successfully fetched conversation:', conversationId);

      // Add to conversations list if not already present
      setConversations(prev => {
        const exists = prev.some(c => c.id === conversationId);
        if (exists) {
          console.log('[DM Fetch] Conversation already in list, not adding');
          return prev;
        }
        console.log('[DM Fetch] Adding conversation to list');
        return [conversation, ...prev];
      });

      return conversation;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch conversation';
      setError(errorMsg);
      console.error('[DM Fetch] Failed to fetch conversation:', conversationId, err);
      return null;
    } finally {
      setLoadingStates(prev => ({ ...prev, conversationDetail: false }));
    }
  }, [setLoadingStates, setConversations]);

  /**
   * Clear any fetch errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    /**
     * Fetch a conversation by ID
     */
    fetchConversation,

    /**
     * Whether a conversation is currently being fetched
     */
    isLoading: loadingStates.conversationDetail,

    /**
     * Error message if fetch failed
     */
    error,

    /**
     * Clear the error state
     */
    clearError,
  };
};
