import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  dmDraftState,
  dmActiveDraftSelector,
} from '@/store/direct-messages';

/**
 * Hook for managing draft messages per conversation
 *
 * Extracted from monolithic use-direct-messages.ts as part of Phase 5 Part 2
 *
 * Responsibilities:
 * - Draft message storage per conversation
 * - Draft updates and retrieval
 * - Active conversation draft tracking
 *
 * Note: Typing indicators are handled by use-presence.ts
 */
export function useDrafts() {
  // State
  const [draft, setDraft] = useRecoilState(dmDraftState);

  // Selectors
  const activeDraft = useRecoilValue(dmActiveDraftSelector);

  /**
   * Update draft for a specific conversation
   * Note: Typing indicator logic is handled by the parent orchestrator
   */
  const updateDraft = useCallback(
    (conversationId: string, content: string) => {
      setDraft((prev) => ({ ...prev, [conversationId]: content }));
    },
    [setDraft]
  );

  /**
   * Clear draft for a specific conversation
   */
  const clearDraft = useCallback(
    (conversationId: string) => {
      setDraft((prev) => {
        const newDrafts = { ...prev };
        delete newDrafts[conversationId];
        return newDrafts;
      });
    },
    [setDraft]
  );

  /**
   * Get draft for a specific conversation
   */
  const getDraft = useCallback(
    (conversationId: string): string => {
      return draft[conversationId] || '';
    },
    [draft]
  );

  return {
    // State
    draft,
    activeDraft,

    // Actions
    updateDraft,
    clearDraft,
    getDraft,
  };
}

export type UseDraftsResult = ReturnType<typeof useDrafts>;