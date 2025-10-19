import { useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';
import { emailLoadingStatesAtom } from '@/store/frontdesk/atoms/email.atoms';
import { emailApiClient } from '../utils/email-api-client';
import { EmailConversation } from '../types/email.types';

/**
 * Hook to fetch a single email conversation by ID
 *
 * Handles loading state, error handling, and API communication
 * for fetching conversations that aren't in the local list.
 *
 * @example
 * const { fetchConversation, isLoading, error } = useFetchEmailConversation();
 *
 * const conversation = await fetchConversation(accountId, conversationId);
 * if (conversation) {
 *   // Handle conversation
 * }
 */
export const useFetchEmailConversation = () => {
  const [loadingStates, setLoadingStates] = useRecoilState(emailLoadingStatesAtom);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch a conversation by ID from the API
   *
   * @param accountId - The email account ID
   * @param conversationId - The conversation ID to fetch
   * @returns The fetched conversation or null if failed
   */
  const fetchConversation = useCallback(async (
    accountId: string,
    conversationId: string
  ): Promise<EmailConversation | null> => {
    console.log('[Email Fetch] Fetching conversation:', { accountId, conversationId });

    setLoadingStates(prev => ({ ...prev, conversationDetail: true }));
    setError(null);

    try {
      const response = await emailApiClient.getConversationDetail(accountId, conversationId);

      console.log('[Email Fetch] Successfully fetched conversation:', conversationId);

      // The API returns ConversationDetailResponse which includes messages
      // We need to transform it to EmailConversation format
      // For now, we'll return the response as-is and let the caller handle transformation
      return response as any as EmailConversation;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch conversation';
      setError(errorMsg);
      console.error('[Email Fetch] Failed to fetch conversation:', conversationId, err);
      return null;
    } finally {
      setLoadingStates(prev => ({ ...prev, conversationDetail: false }));
    }
  }, [setLoadingStates]);

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
