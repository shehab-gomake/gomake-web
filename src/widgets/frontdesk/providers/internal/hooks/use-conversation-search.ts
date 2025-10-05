import { useCallback, useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { directMessagesService } from '@/services/frontdesk/api/direct-messages.service';
import {
  dmSearchModeState,
  dmGlobalSearchResultsState,
  dmConversationSearchResultsState,
  dmConversationSearchQueryState,
  dmCurrentSearchIndexState,
  dmHighlightedMessageIdState,
  dmSearchLoadingState,
  dmGlobalSearchOpenState,
  dmConversationSearchOpenState,
  dmMessagesState,
  dmErrorState,
  MessageSearchResult,
  ConversationSearchResult,
} from '@/store/direct-messages';
import { DMMessage } from '@/widgets/frontdesk/providers/internal/types/direct-messages.types';

/**
 * Hook for managing message search (global and in-conversation)
 *
 * Extracted from monolithic use-direct-messages.ts as part of Phase 5 Part 2
 *
 * Responsibilities:
 * - Global message search across all conversations
 * - In-conversation message search
 * - Search result navigation
 * - Message highlighting and jump-to functionality
 * - Search state management (open/close, query, results)
 * - Auto-clear search when conversation changes
 */
export function useConversationSearch(deps: {
  activeConversationId: string | null;
  conversations: any[];
  messages: Record<string, DMMessage[]>;
  selectConversation: (conversation: any) => Promise<void>;
  loadMessageHistory: (conversationId: string) => Promise<void>;
}) {
  // State
  const [searchMode, setSearchMode] = useRecoilState(dmSearchModeState);
  const [globalSearchResults, setGlobalSearchResults] = useRecoilState(dmGlobalSearchResultsState);
  const [conversationSearchResults, setConversationSearchResults] = useRecoilState(dmConversationSearchResultsState);
  const [conversationSearchQuery, setConversationSearchQuery] = useRecoilState(dmConversationSearchQueryState);
  const [currentSearchIndex, setCurrentSearchIndex] = useRecoilState(dmCurrentSearchIndexState);
  const [highlightedMessageId, setHighlightedMessageId] = useRecoilState(dmHighlightedMessageIdState);
  const [searchLoading, setSearchLoading] = useRecoilState(dmSearchLoadingState);
  const [globalSearchOpen, setGlobalSearchOpen] = useRecoilState(dmGlobalSearchOpenState);
  const [conversationSearchOpen, setConversationSearchOpen] = useRecoilState(dmConversationSearchOpenState);
  const setMessages = useSetRecoilState(dmMessagesState);
  const setError = useSetRecoilState(dmErrorState);

  /**
   * Perform global search across all conversations
   */
  const performGlobalSearch = useCallback(
    async (query: string): Promise<MessageSearchResult[]> => {
      if (!query.trim()) {
        setGlobalSearchResults([]);
        return [];
      }

      try {
        setSearchLoading(true);
        const response = await directMessagesService.searchAllMessages(query, {
          limit: 50,
          sortBy: 'relevance',
          useFullText: true,
          includeConversationInfo: true,
        });

        const results = response.results;
        setGlobalSearchResults(results);
        return results;
      } catch (error: any) {
        console.error("Global search failed:", error);
        setError(error.message || "Search failed");
        setGlobalSearchResults([]);
        return [];
      } finally {
        setSearchLoading(false);
      }
    },
    [setGlobalSearchResults, setSearchLoading, setError]
  );

  /**
   * Perform search within active conversation
   */
  const performConversationSearch = useCallback(
    async (query: string): Promise<ConversationSearchResult[]> => {
      setConversationSearchQuery(query);

      const normalizedQuery = query.trim();

      if (!normalizedQuery || !deps.activeConversationId) {
        setConversationSearchResults([]);
        setCurrentSearchIndex(0);
        setHighlightedMessageId(null);
        return [];
      }

      try {
        setSearchLoading(true);
        const response = await directMessagesService.searchMessagesInConversation(
          deps.activeConversationId,
          normalizedQuery,
          {
            limit: 100,
            sortBy: 'relevance',
            useFullText: true,
          }
        );

        const results = response.results;
        setConversationSearchResults(results);
        setCurrentSearchIndex(0);
        return results;
      } catch (error: any) {
        console.error("Conversation search failed:", error);
        setError(error.message || "Search failed");
        setConversationSearchResults([]);
        setCurrentSearchIndex(0);
        setHighlightedMessageId(null);
        return [];
      } finally {
        setSearchLoading(false);
      }
    },
    [
      deps.activeConversationId,
      setConversationSearchQuery,
      setConversationSearchResults,
      setCurrentSearchIndex,
      setHighlightedMessageId,
      setSearchLoading,
      setError,
    ]
  );

  /**
   * Jump to a specific message (with smart loading)
   */
  const jumpToMessage = useCallback(
    async (conversationId: string, messageId: string) => {
      try {
        // Switch conversation if necessary
        if (conversationId !== deps.activeConversationId) {
          const conversation = deps.conversations.find(c => c.id === conversationId);
          if (conversation) {
            await deps.selectConversation(conversation);
          }
        }

        // Highlight the message immediately
        setHighlightedMessageId(messageId);

        // Check if message already exists in current messages
        const conversationMessages = deps.messages[conversationId] || [];
        const messageExists = conversationMessages.some(m => m.id === messageId);

        if (!messageExists) {
          // Use smart loading to get messages around the target
          const contextResult = await directMessagesService.loadMessagesAroundTarget(conversationId, messageId, {
            beforeCount: 25,
            afterCount: 10,
          });

          if (contextResult.targetExists) {
            // Merge the loaded messages with existing ones
            setMessages(prev => {
              const existing = prev[conversationId] || [];
              const allMessages = [
                ...contextResult.messagesBefore,
                ...contextResult.messagesAfter,
                ...existing,
              ];

              // Remove duplicates and sort by timestamp
              const uniqueMessages = allMessages.reduce((acc: DMMessage[], msg) => {
                if (!acc.some(m => m.id === msg.id)) {
                  acc.push(msg);
                }
                return acc;
              }, []);

              uniqueMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

              return {
                ...prev,
                [conversationId]: uniqueMessages,
              };
            });
          } else {
            // Fallback to regular message history loading
            await deps.loadMessageHistory(conversationId);
          }
        }

        // Clear highlight after 3 seconds
        setTimeout(() => {
          setHighlightedMessageId(null);
        }, 3000);
      } catch (error: any) {
        console.error("Failed to jump to message:", error);
        setError(error.message || "Failed to jump to message");
      }
    },
    [deps.activeConversationId, deps.conversations, deps.messages, deps.selectConversation, deps.loadMessageHistory, setHighlightedMessageId, setMessages, setError]
  );

  /**
   * Navigate to a specific search result
   */
  const navigateToSearchResult = useCallback(
    (messageId: string, index: number) => {
      setCurrentSearchIndex(index);

      if (deps.activeConversationId) {
        void jumpToMessage(deps.activeConversationId, messageId);
        return;
      }

      setHighlightedMessageId(messageId);

      // Clear highlight after 3 seconds when we cannot jump
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 3000);
    },
    [deps.activeConversationId, setCurrentSearchIndex, jumpToMessage, setHighlightedMessageId]
  );

  /**
   * Clear search results
   */
  const clearSearch = useCallback(
    (scope: 'global' | 'conversation' | 'all' = 'all') => {
      if (scope === 'global' || scope === 'all') {
        setGlobalSearchResults([]);
        setGlobalSearchOpen(false);
        if (searchMode === 'global') {
          setSearchMode(null);
        }
      }

      if (scope === 'conversation' || scope === 'all') {
        setConversationSearchResults([]);
        setConversationSearchQuery('');
        setCurrentSearchIndex(0);
        setHighlightedMessageId(null);
        setConversationSearchOpen(false);
        if (scope === 'conversation' && searchMode === 'conversation') {
          setSearchMode(null);
        }
      }

      if (scope === 'all') {
        setSearchMode(null);
      }
    },
    [
      searchMode,
      setSearchMode,
      setGlobalSearchResults,
      setConversationSearchResults,
      setConversationSearchQuery,
      setCurrentSearchIndex,
      setHighlightedMessageId,
      setGlobalSearchOpen,
      setConversationSearchOpen,
    ]
  );

  /**
   * Open global search modal
   */
  const openGlobalSearch = useCallback(() => {
    setSearchMode('global');
    setGlobalSearchOpen(true);
    setConversationSearchOpen(false);
  }, [setSearchMode, setGlobalSearchOpen, setConversationSearchOpen]);

  /**
   * Open conversation search
   */
  const openConversationSearch = useCallback(() => {
    setSearchMode('conversation');
    setConversationSearchOpen(true);
    setGlobalSearchOpen(false);
  }, [setSearchMode, setConversationSearchOpen, setGlobalSearchOpen]);

  /**
   * Auto-clear conversation search when switching conversations
   */
  useEffect(() => {
    setConversationSearchResults([]);
    setConversationSearchQuery('');
    setCurrentSearchIndex(0);
    setHighlightedMessageId(null);
    setConversationSearchOpen(false);
  }, [
    deps.activeConversationId,
    setConversationSearchResults,
    setConversationSearchQuery,
    setCurrentSearchIndex,
    setHighlightedMessageId,
    setConversationSearchOpen,
  ]);

  return {
    // State
    searchMode,
    globalSearchResults,
    conversationSearchResults,
    conversationSearchQuery,
    currentSearchIndex,
    highlightedMessageId,
    searchLoading,
    globalSearchOpen,
    conversationSearchOpen,

    // Actions
    performGlobalSearch,
    performConversationSearch,
    jumpToMessage,
    navigateToSearchResult,
    clearSearch,
    openGlobalSearch,
    openConversationSearch,
  };
}

export type UseConversationSearchResult = ReturnType<typeof useConversationSearch>;