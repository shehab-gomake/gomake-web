import { useCallback, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { directMessagesService } from "@/services/frontdesk/api/direct-messages.service";
import {
  dmUserSuggestionsState,
  dmIsLoadingSuggestionsState,
  dmErrorState,
} from "@/store/direct-messages";
import { ConversationMember } from "../types/direct-messages.types";

export interface UseParticipantsResult {
  // State
  userSuggestions: ConversationMember[];
  isLoadingSuggestions: boolean;
  suggestionsOnlineOnly: boolean;

  // Actions
  loadUserSuggestions: (query?: string, onlineOnlyOverride?: boolean) => Promise<void>;
  setUserSuggestionsOnlineOnly: (value: boolean) => void;
}

/**
 * Manages user suggestions for creating conversations and adding participants
 *
 * Responsibilities:
 * - Fetch user suggestions from API with search query
 * - Filter by online status
 * - Cache last query for efficient reload
 *
 * Used by: Conversation creation, participant management
 */
export function useParticipants(): UseParticipantsResult {
  // State
  const [userSuggestions, setUserSuggestions] = useRecoilState(dmUserSuggestionsState);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useRecoilState(dmIsLoadingSuggestionsState);
  const [suggestionsOnlineOnly, setSuggestionsOnlineOnlyState] = useState(true);
  const setError = useSetRecoilState(dmErrorState);

  // Refs
  const userSuggestionQueryRef = useRef<string>("");

  /**
   * Load user suggestions with optional search query and online filter
   */
  const loadUserSuggestions = useCallback(
    async (query?: string, onlineOnlyOverride?: boolean) => {
      try {
        setIsLoadingSuggestions(true);

        // Update cached query if provided
        if (query !== undefined) {
          userSuggestionQueryRef.current = query;
        }

        const effectiveQuery = query ?? userSuggestionQueryRef.current ?? "";
        const effectiveOnlineOnly = onlineOnlyOverride ?? suggestionsOnlineOnly;

        const suggestions = await directMessagesService.getUserSuggestions(effectiveQuery, {
          limit: 10,
          onlineOnly: effectiveOnlineOnly ? true : undefined,
        });

        setUserSuggestions(suggestions);
      } catch (error: any) {
        console.error("[DM Participants] Failed to load user suggestions:", error);
        setError(error.message || "Failed to load user suggestions");
      } finally {
        setIsLoadingSuggestions(false);
      }
    },
    [setIsLoadingSuggestions, setUserSuggestions, setError, suggestionsOnlineOnly]
  );

  /**
   * Toggle online-only filter and reload suggestions
   */
  const setUserSuggestionsOnlineOnly = useCallback(
    (value: boolean) => {
      setSuggestionsOnlineOnlyState(value);
      loadUserSuggestions(undefined, value);
    },
    [loadUserSuggestions]
  );

  return {
    // State
    userSuggestions,
    isLoadingSuggestions,
    suggestionsOnlineOnly,

    // Actions
    loadUserSuggestions,
    setUserSuggestionsOnlineOnly,
  };
}