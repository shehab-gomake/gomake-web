import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
  chatwootConversationsCacheFamily,
  chatwootCacheKeysAtom,
  CONVERSATION_CACHE_STALE_TIME,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { useFetchDeduplication } from "./use-chatwoot-initialization";
import { useChatwootMetrics } from "./use-chatwoot-metrics";
import { createFilterKey } from "../utils/filter-utils";

// Global flag to prevent concurrent conversation fetches across all instances
// Similar to globalTeamsFetchInProgress pattern used in useChatwootTeams
let globalConversationsFetchInProgress = false;
let globalLastFetchParamsKey: string | null = null;

export const useChatwootConversations = (accountId: number | null, options: Partial<ConversationListParams> = {}) => {
  // CACHE-FIRST: Create stable filter key for caching
  const stableFilterKey = useMemo(() => {
    return createFilterKey(accountId, options || {});
  }, [
    accountId,
    options?.inbox_id,
    options?.status,
    options?.assignee_type,
    options?.q,
    options?.team_id,
    options?.labels,
    options?.sort_by,
  ]);

  // CACHE-FIRST: Use cache atom family for this filter key
  const [cache, setCache] = useRecoilState(chatwootConversationsCacheFamily(stableFilterKey));
  const [cacheKeys, setCacheKeys] = useRecoilState(chatwootCacheKeysAtom);

  // Backward compatibility: Keep legacy atom updated for components that still use it
  const setConversations = useSetRecoilState(chatwootConversationsAtom);

  const [loadingState, setLoadingState] = useRecoilState(chatwootConversationsLoadingAtom);
  const [error, setError] = useRecoilState(chatwootConversationsErrorAtom);
  const setCounts = useSetRecoilState(chatwootConversationCountsAtom);

  // State derived from cache
  const conversations = cache.conversations;
  const hasMore = cache.hasMore;
  const currentPage = cache.totalPages;

  // Performance metrics tracking
  const metrics = useChatwootMetrics();

  // Fetch deduplication to prevent redundant API calls
  const { shouldFetch, markFetchStart, markFetchComplete, markFetchFailed } = useFetchDeduplication<ConversationListParams>();

  // Track if this is the first mount
  const isFirstMountRef = useRef(true);

  // Track previous filter key to detect filter changes
  const prevFilterKeyRef = useRef<string>("");

  // Track if a fetch is currently in progress to prevent concurrent calls
  const isFetchingRef = useRef(false);

  // Track conversations length in a ref to avoid recreating fetchConversations callback
  const conversationsLengthRef = useRef(conversations.length);
  useEffect(() => {
    conversationsLengthRef.current = conversations.length;
  }, [conversations.length]);

  // CACHE-FIRST: Track this cache key
  useEffect(() => {
    if (stableFilterKey && !cacheKeys.has(stableFilterKey)) {
      setCacheKeys((prev) => new Set([...Array.from(prev), stableFilterKey]));
    }
  }, [stableFilterKey, cacheKeys, setCacheKeys]);

  // Helper to update specific loading states
  const setLoadingType = useCallback(
    (type: keyof ChatwootConversationsLoadingState, value: boolean) => {
      setLoadingState((prev) => ({ ...prev, [type]: value }));
    },
    [setLoadingState]
  );

  const fetchConversations = useCallback(
    async (page: number = 1, append: boolean = false, isFilterChange: boolean = false, forceRefresh: boolean = false) => {
      // Note: accountId can be null - the API endpoint /api/accounts/conversations
      // doesn't require accountId in the URL path, it uses the authenticated user's account automatically
      // So we allow the call even if accountId is null

      // CACHE-FIRST: Check if we have fresh cache (unless force refresh or append)
      if (!append && !forceRefresh && cache.conversations.length > 0) {
        const cacheAge = Date.now() - cache.timestamp;
        const isCacheFresh = cacheAge < CONVERSATION_CACHE_STALE_TIME;

        if (isCacheFresh) {
          console.log(`[useChatwootConversations] ✨ Using fresh cache (age: ${Math.round(cacheAge / 1000)}s)`);
          // Track cache hit
          metrics.trackCacheHit("conversations.list", 500);
          // Update legacy atom for backward compatibility
          setConversations(cache.conversations);
          return;
        } else {
          console.log(`[useChatwootConversations] 🔄 Cache stale (age: ${Math.round(cacheAge / 1000)}s), refetching...`);
        }
      }

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

      // Create stable key for global deduplication
      const paramsKey = createFilterKey(accountId, listParams);

      // Global deduplication guard (prevents concurrent requests across all component instances)
      // This check happens FIRST to prevent race conditions
      if (!append) {
        if (globalConversationsFetchInProgress) {
          console.log("[useChatwootConversations] ⏭️ Global fetch already in progress, skipping duplicate");
          return;
        }

        // Check if same params as last successful fetch
        if (paramsKey === globalLastFetchParamsKey) {
          console.log("[useChatwootConversations] ⏭️ Same params as last fetch, skipping duplicate");
          return;
        }

        // Mark global fetch as in progress
        globalConversationsFetchInProgress = true;
      }

      // Instance-level deduplication check (backup)
      if (!append && !shouldFetch(listParams)) {
        console.log("[useChatwootConversations] Skipping duplicate/concurrent fetch (instance-level)");
        if (!append) {
          globalConversationsFetchInProgress = false;
        }
        return;
      }

      // Mark fetch start AFTER the check passes
      markFetchStart();

      // Set appropriate loading state based on operation type
      if (append) {
        setLoadingType("loadingMore", true);
      } else if (isFilterChange && conversationsLengthRef.current > 0) {
        setLoadingType("filtering", true);
      } else {
        setLoadingType("initialLoading", true);
      }

      setError(null);

      // Track API call timing
      const apiStartTime = Date.now();

      try {
        // Pass accountId (can be null) - the service will handle it
        const response = await chatwootService.conversations.listConversations(accountId, listParams);

        // Track successful API call
        metrics.trackAPICall("conversations.list", "GET", apiStartTime, true, false, listParams);

        // Chatwoot API returns: { data: { payload: [...], meta: {...} } }
        // Handle nested structure
        const conversationsList = response.data?.payload || response.payload || [];
        const limit = listParams.limit || 20;

        // Check if there are more pages
        const meta = response.data?.meta || response.meta || {};
        const hasMoreData = append
          ? conversationsList.length > 0 && conversationsList.length >= limit
          : conversationsList.length >= limit;

        // CACHE-FIRST: Update cache with new data
        setCache((prev) => ({
          conversations: append ? [...prev.conversations, ...conversationsList] : conversationsList,
          timestamp: Date.now(),
          hasMore: hasMoreData,
          totalPages: page,
          error: null,
        }));

        // Backward compatibility: Update legacy atom
        setConversations(append ? [...cache.conversations, ...conversationsList] : conversationsList);

        // Extract counts from API response meta
        setCounts({
          mine: meta.mine_count ?? 0,
          unassigned: meta.unassigned_count ?? 0,
          all: meta.all_count ?? meta.total_count ?? 0,
        });

        // Mark fetch as complete to prevent duplicate calls
        if (!append) {
          markFetchComplete(listParams);
          // Update global state
          globalLastFetchParamsKey = paramsKey;
          globalConversationsFetchInProgress = false;
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load conversations";
        setError(errorMessage);

        // Track failed API call
        metrics.trackAPICall("conversations.list", "GET", apiStartTime, false, false, listParams);

        // CACHE-FIRST: Store error in cache
        setCache((prev) => ({
          ...prev,
          error: errorMessage,
        }));

        console.error("Failed to fetch Chatwoot conversations:", err);
        markFetchFailed();
        // Reset global flag on error
        if (!append) {
          globalConversationsFetchInProgress = false;
        }
      } finally {
        // Reset all loading states
        setLoadingState({
          initialLoading: false,
          filtering: false,
          loadingMore: false,
        });
        // Ensure global flag is reset even if something goes wrong
        if (!append && globalConversationsFetchInProgress) {
          globalConversationsFetchInProgress = false;
        }
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
      cache, // CACHE-FIRST: Added cache dependency
      setCache, // CACHE-FIRST: Added setCache dependency
      metrics, // METRICS: Added metrics tracking
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
      fetchConversations(currentPage + 1, true, false, false);
    }
  }, [loadingState, hasMore, currentPage, fetchConversations]);

  const refresh = useCallback(() => {
    // CACHE-FIRST: Force refresh (bypass cache)
    fetchConversations(1, false, false, true);
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
    async (conversationId: number, newStatus: "open" | "resolved" | "pending" | "snoozed") => {
      if (!accountId) {
        console.error("[updateConversationStatus] Account ID is required");
        return;
      }

      // Find the conversation to update
      const conversationToUpdate = conversations.find((c) => c.id === conversationId);
      if (!conversationToUpdate) {
        console.error("[updateConversationStatus] Conversation not found in state:", conversationId);
        return;
      }

      // Store original status for revert
      const originalStatus = conversationToUpdate.status;

      // Step 1: Optimistic Update - Immediately update UI and cache
      const updatedConversations = conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, status: newStatus } : conv
      );

      // Update cache
      setCache((prev) => ({
        ...prev,
        conversations: updatedConversations,
      }));

      // Update legacy atom
      setConversations(updatedConversations);

      try {
        // Step 2: Background API Call
        const response = await chatwootService.conversations.updateConversationStatus(accountId, conversationId, {
          status: newStatus,
        });

        // Verify success from API response
        if (response.payload?.success && response.payload.current_status) {
          // API confirmed the status change, ensure UI and cache are synced with server response
          const serverStatus = response.payload.current_status;
          const syncedConversations = conversations.map((conv) =>
            conv.id === conversationId ? { ...conv, status: serverStatus } : conv
          );

          // Update cache
          setCache((prev) => ({
            ...prev,
            conversations: syncedConversations,
          }));

          // Update legacy atom
          setConversations(syncedConversations);

          console.log(`[updateConversationStatus] Successfully updated conversation ${conversationId} to ${serverStatus}`);
        } else {
          // API call succeeded but response format unexpected - log warning but keep optimistic update
          console.warn("[updateConversationStatus] Unexpected response format:", response);
        }
      } catch (err: any) {
        // Step 3: Revert on Failure
        console.error("[updateConversationStatus] Failed to update status, reverting:", err);

        const revertedConversations = conversations.map((conv) =>
          conv.id === conversationId ? { ...conv, status: originalStatus } : conv
        );

        // Revert cache
        setCache((prev) => ({
          ...prev,
          conversations: revertedConversations,
        }));

        // Revert legacy atom
        setConversations(revertedConversations);

        // Set error for UI feedback
        setError(err.message || "Failed to update conversation status");

        // Clear error after 5 seconds
        setTimeout(() => setError(null), 5000);

        // Re-throw for component error handling
        throw err;
      }
    },
    [accountId, conversations, setCache, setConversations, setError]
  );

  // Effect to fetch conversations when filters change or on first mount
  // NOTE: stableFilterKey is already defined at the top of the hook (line 30) for cache management
  useEffect(() => {
    // Skip if already fetching to prevent concurrent calls
    if (isFetchingRef.current) {
      console.log("[useChatwootConversations] Skipping - fetch already in progress");
      return;
    }

    // Skip the first mount to prevent double fetch during initialization
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      prevFilterKeyRef.current = stableFilterKey;
      // Still fetch on first mount, but the deduplication will prevent multiple calls
      isFetchingRef.current = true;
      fetchConversations(1, false, false).finally(() => {
        isFetchingRef.current = false;
      });
      return;
    }

    // Detect if filters have changed
    const isFilterChange = stableFilterKey !== prevFilterKeyRef.current;

    // If filters haven't changed, don't do anything
    if (!isFilterChange) {
      return;
    }

    // Update the previous filter key
    prevFilterKeyRef.current = stableFilterKey;

    // Mark as fetching to prevent concurrent calls
    isFetchingRef.current = true;

    // Clear stale conversations immediately when filters change
    // This prevents showing old conversations from previous view during fetch
    setConversations([]);
    setLoadingType("initialLoading", true);

    // Fetch conversations with filter change flag
    fetchConversations(1, false, true).finally(() => {
      isFetchingRef.current = false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableFilterKey]); // Only depend on stableFilterKey - fetchConversations is stable enough via its own deps

  return {
    conversations,
    loading: loadingState,
    error,
    hasMore,
    loadMore,
    refresh,
    fetchConversations,
    updateConversationStatus,
    // Performance metrics
    metrics: {
      getStats: metrics.getStats,
      logStats: metrics.logStats,
      clearMetrics: metrics.clearMetrics,
      enabled: metrics.enabled,
    },
  };
};
