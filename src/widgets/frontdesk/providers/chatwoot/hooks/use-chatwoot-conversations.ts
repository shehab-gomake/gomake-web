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

export const useChatwootConversations = (
  accountId: number | null,
  options: Partial<ConversationListParams> = {},
  skipFetch: boolean = false // NEW: Allow caller to skip fetching when navigating to a conversation
) => {
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

  // Track previous skip state to detect when we return from conversation view
  const prevSkipFetchRef = useRef<boolean>(false);

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

        if (append) {
          setConversations((prev) => [...prev, ...conversationsList]);
        } else {
          setConversations(conversationsList);
        }

        // Check if there are more pages
        const meta = response.data?.meta || response.meta || {};
        setHasMore(meta?.page ? meta.page < (meta.total_pages || meta.count || 0) : false);

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

  useEffect(() => {
    // Create a stable filter key to detect changes
    const filterKey = JSON.stringify({
      accountId,
      inbox_id: options.inbox_id,
      status: options.status,
      assignee_type: options.assignee_type,
      q: options.q,
      team_id: options.team_id,
    });

    // Skip the first mount to prevent double fetch during initialization
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      prevFilterKeyRef.current = filterKey;
      prevSkipFetchRef.current = skipFetch;
      // Still fetch on first mount (unless skipFetch is true), but the deduplication will prevent multiple calls
      if (!skipFetch) {
        fetchConversations(1, false, false);
      }
      return;
    }

    // If skipFetch is true, we're viewing a conversation - don't refetch the list
    // This preserves the conversation list and counters during navigation
    if (skipFetch) {
      prevFilterKeyRef.current = filterKey;
      prevSkipFetchRef.current = skipFetch;
      return;
    }

    // Detect if filters have changed
    const isFilterChange = filterKey !== prevFilterKeyRef.current;
    const wasSkipping = prevSkipFetchRef.current;

    prevFilterKeyRef.current = filterKey;
    prevSkipFetchRef.current = skipFetch;

    // If we just returned from viewing a conversation (was skipping, now not)
    // and filters haven't changed, don't refetch - preserve the list
    if (wasSkipping && !isFilterChange) {
      return;
    }

    // Clear stale conversations immediately when filters change
    // This prevents showing old conversations from previous view during fetch
    if (isFilterChange) {
      setConversations([]);
      setLoadingType('initialLoading', true);
    }

    // Fetch conversations with filter change flag
    fetchConversations(1, false, isFilterChange);
  }, [accountId, options, skipFetch, fetchConversations, setConversations, setLoadingType]);

  return {
    conversations,
    loading: loadingState,
    error,
    hasMore,
    loadMore,
    refresh,
    fetchConversations,
  };
};
