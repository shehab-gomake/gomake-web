import { useState, useEffect, useCallback, useRef } from "react";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import {
  ConversationListParams,
  ConversationStatus,
  ConversationAssigneeType,
  ConversationSortBy,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import {
  chatwootConversationsAtom,
  chatwootConversationsLoadingAtom,
  chatwootConversationsErrorAtom,
  chatwootConversationCountsAtom,
  ChatwootConversationsLoadingState,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { useFetchDeduplication } from "./use-chatwoot-initialization";

export const useChatwootConversations = (accountId: number | null, options: Partial<ConversationListParams> = {}) => {
  const [conversations, setConversations] = useRecoilState(chatwootConversationsAtom);
  const [loadingState, setLoadingState] = useRecoilState(chatwootConversationsLoadingAtom);
  const [error, setError] = useRecoilState(chatwootConversationsErrorAtom);
  const setCounts = useSetRecoilState(chatwootConversationCountsAtom);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch deduplication to prevent redundant API calls
  const { shouldFetch, markFetchStart, markFetchComplete, markFetchFailed } = useFetchDeduplication<ConversationListParams>();

  // Track if this is the first mount
  const isFirstMountRef = useRef(true);

  // Track previous filter key to detect filter changes
  const prevFilterKeyRef = useRef<string>("");

  // Helper to update specific loading states
  const setLoadingType = useCallback((type: keyof ChatwootConversationsLoadingState, value: boolean) => {
    setLoadingState(prev => ({ ...prev, [type]: value }));
  }, [setLoadingState]);

  const fetchConversations = useCallback(
    async (page: number = 1, append: boolean = false, isFilterChange: boolean = false) => {
      // Note: accountId can be null - the API endpoint /api/accounts/conversations
      // doesn't require accountId in the URL path, it uses the authenticated user's account automatically
      // So we allow the call even if accountId is null

      const listParams: ConversationListParams = {
        page,
        limit: options.limit || 20,
        ...(options.status && { status: options.status }),
        ...(options.inbox_id && { inbox_id: options.inbox_id }),
        ...(options.assignee_type && { assignee_type: options.assignee_type }),
        ...(options.sort_by && { sort_by: options.sort_by }),
        ...(options.q && { q: options.q }),
        ...(options.team_id && { team_id: options.team_id }),
        ...(options.labels && { labels: options.labels }),
      };

      // Check if we should proceed with this fetch (prevents duplicates and concurrent fetches)
      if (!append && !shouldFetch(listParams)) {
        console.log("[useChatwootConversations] Skipping duplicate/concurrent fetch");
        return;
      }

      markFetchStart();

      // Set appropriate loading state based on operation type
      if (append) {
        setLoadingType('loadingMore', true);
      } else if (isFilterChange && conversations.length > 0) {
        setLoadingType('filtering', true);
      } else {
        setLoadingType('initialLoading', true);
      }

      setError(null);

      try {
        // Pass accountId (can be null) - the service will handle it
        const response = await chatwootService.conversations.listConversations(accountId, listParams);

        // Chatwoot API returns: { data: { payload: [...], meta: {...} } }
        // Handle nested structure
        const conversationsList = response.data?.payload || response.payload || [];
        const limit = listParams.limit || 20;

        if (append) {
          setConversations((prev) => [...prev, ...conversationsList]);
        } else {
          setConversations(conversationsList);
        }

        // Check if there are more pages
        // Chatwoot API doesn't return pagination metadata (page, total_pages)
        // Instead, we determine hasMore by checking if the returned array length equals the limit
        // If length < limit, we've reached the end. If length === limit, there might be more.
        // Also, if we get an empty array when appending, we've definitely reached the end.
        const meta = response.data?.meta || response.meta || {};
        const hasMoreData = append 
          ? conversationsList.length > 0 && conversationsList.length >= limit
          : conversationsList.length >= limit;
        setHasMore(hasMoreData);

        // Extract counts from API response meta
        setCounts({
          mine: meta.mine_count ?? 0,
          unassigned: meta.unassigned_count ?? 0,
          all: meta.all_count ?? meta.total_count ?? 0,
        });

        setCurrentPage(page);

        // Mark fetch as complete to prevent duplicate calls
        if (!append) {
          markFetchComplete(listParams);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load conversations");
        console.error("Failed to fetch Chatwoot conversations:", err);
        markFetchFailed();
      } finally {
        // Reset all loading states
        setLoadingState({
          initialLoading: false,
          filtering: false,
          loadingMore: false,
        });
      }
    },
    [
      accountId,
      options.limit,
      options.status,
      options.inbox_id,
      options.assignee_type,
      options.sort_by,
      options.q,
      options.team_id,
      options.labels,
      conversations.length,
      setConversations,
      setLoadingState,
      setLoadingType,
      setError,
      setCounts,
      shouldFetch,
      markFetchStart,
      markFetchComplete,
      markFetchFailed,
    ]
  );

  const loadMore = useCallback(() => {
    const isLoading = loadingState.initialLoading || loadingState.filtering || loadingState.loadingMore;
    if (!isLoading && hasMore) {
      fetchConversations(currentPage + 1, true, false);
    }
  }, [loadingState, hasMore, currentPage, fetchConversations]);

  const refresh = useCallback(() => {
    fetchConversations(1, false, false);
  }, [fetchConversations]);

  /**
   * Update Conversation Status (Optimistic Update Pattern)
   *
   * Implements Chatwoot's optimistic update pattern:
   * 1. Immediately update UI (optimism)
   * 2. Make API call in background
   * 3. Revert on failure
   *
   * @param conversationId - The conversation ID to update
   * @param newStatus - The new status ('open' | 'resolved' | 'pending' | 'snoozed')
   * @returns Promise<void>
   */
  const updateConversationStatus = useCallback(
    async (conversationId: number, newStatus: 'open' | 'resolved' | 'pending' | 'snoozed') => {
      if (!accountId) {
        console.error("[updateConversationStatus] Account ID is required");
        return;
      }

      // Find the conversation to update
      const conversationToUpdate = conversations.find(c => c.id === conversationId);
      if (!conversationToUpdate) {
        console.error("[updateConversationStatus] Conversation not found in state:", conversationId);
        return;
      }

      // Store original status for revert
      const originalStatus = conversationToUpdate.status;

      // Step 1: Optimistic Update - Immediately update UI
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, status: newStatus }
            : conv
        )
      );

      try {
        // Step 2: Background API Call
        const response = await chatwootService.conversations.updateConversationStatus(
          accountId,
          conversationId,
          { status: newStatus }
        );

        // Extract updated conversation from response
        const updatedConversation = response.data || response.payload;

        if (updatedConversation) {
          // Merge server response with local state
          setConversations(prev =>
            prev.map(conv =>
              conv.id === conversationId
                ? { ...conv, ...updatedConversation, status: newStatus }
                : conv
            )
          );
        }

        console.log(`[updateConversationStatus] Successfully updated conversation ${conversationId} to ${newStatus}`);
      } catch (err: any) {
        // Step 3: Revert on Failure
        console.error("[updateConversationStatus] Failed to update status, reverting:", err);

        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? { ...conv, status: originalStatus }
              : conv
          )
        );

        // Set error for UI feedback
        setError(err.message || "Failed to update conversation status");

        // Clear error after 5 seconds
        setTimeout(() => setError(null), 5000);

        // Re-throw for component error handling
        throw err;
      }
    },
    [accountId, conversations, setConversations, setError]
  );

  useEffect(() => {
    // Create a stable filter key to detect changes
    const filterKey = JSON.stringify({
      accountId,
      inbox_id: options.inbox_id,
      status: options.status,
      assignee_type: options.assignee_type,
      q: options.q,
      team_id: options.team_id,
      labels: options.labels, // ← Added labels to trigger refetch when they change
    });

    // Skip the first mount to prevent double fetch during initialization
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      prevFilterKeyRef.current = filterKey;
      // Still fetch on first mount, but the deduplication will prevent multiple calls
      fetchConversations(1, false, false);
      return;
    }

    // Detect if filters have changed
    const isFilterChange = filterKey !== prevFilterKeyRef.current;
    prevFilterKeyRef.current = filterKey;

    // Clear stale conversations immediately when filters change
    // This prevents showing old conversations from previous view during fetch
    if (isFilterChange) {
      setConversations([]);
      setLoadingType('initialLoading', true);
    }

    // Fetch conversations with filter change flag
    fetchConversations(1, false, isFilterChange);
  }, [accountId, options, fetchConversations, setConversations, setLoadingType]);

  return {
    conversations,
    loading: loadingState,
    error,
    hasMore,
    loadMore,
    refresh,
    fetchConversations,
    updateConversationStatus,
  };
};
