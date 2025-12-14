import { useEffect, useCallback, useRef, useMemo } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import { ConversationListParams } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import {
  chatwootConversationsAtom,
  chatwootConversationsLoadingAtom,
  chatwootConversationsErrorAtom,
  chatwootConversationCountsAtom,
  ChatwootConversationsLoadingState,
  chatwootConversationsCacheFamily,
  chatwootCacheKeysAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { useFetchDeduplication } from "./use-chatwoot-initialization";
import { useChatwootMetrics } from "./use-chatwoot-metrics";
import { createFilterKey } from "../utils/filter-utils";
import { CHATWOOT_CONSTANTS } from "../config/constants";
import { useFetchLock, createConversationsLockKey } from "./core/use-fetch-lock";

interface UseChatwootConversationsOptions extends Partial<ConversationListParams> {
  /**
   * When false, skips fetching. Use this to wait for router to be ready.
   * Default: true
   */
  enabled?: boolean;
  /**
   * Polling interval in milliseconds for automatic refresh
   * Set to 0 or undefined to disable polling
   * Default: undefined (no polling)
   */
  pollingInterval?: number;
}

export const useChatwootConversations = (accountId: number | null, options: UseChatwootConversationsOptions = {}) => {
  // Extract enabled flag and polling interval from options, default to true
  const { enabled = true, pollingInterval, ...filterOptions } = options;

  // CACHE-FIRST: Create stable filter key for caching
  const stableFilterKey = useMemo(() => {
    return createFilterKey(accountId, filterOptions || {});
  }, [
    accountId,
    filterOptions?.inbox_id,
    filterOptions?.status,
    filterOptions?.assignee_type,
    filterOptions?.conversation_type, // Bug fix: Include conversation_type for mentions/unattended views
    filterOptions?.q,
    filterOptions?.team_id,
    filterOptions?.labels,
    filterOptions?.sort_by,
  ]);

  // Centralized fetch lock for conversations
  const { acquireLock, releaseLock, isLocked } = useFetchLock({ prefix: "conversations" });

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

  // Fetch deduplication to prevent redundant API calls (instance-level backup)
  const { shouldFetch, markFetchStart, markFetchComplete, markFetchFailed } = useFetchDeduplication<ConversationListParams>();

  // Track if we've completed the initial fetch (when enabled)
  // This is different from "first mount" - we only want to track first ENABLED fetch
  const hasCompletedInitialFetchRef = useRef(false);

  // Track previous filter key to detect filter changes
  const prevFilterKeyRef = useRef<string>("");

  // Track if a fetch is currently in progress to prevent concurrent calls
  const isFetchingRef = useRef(false);

  // Track last successful fetch params for duplicate detection
  const lastFetchParamsKeyRef = useRef<string | null>(null);

  // Track conversations length in a ref to avoid recreating fetchConversations callback
  const conversationsLengthRef = useRef(conversations.length);
  useEffect(() => {
    conversationsLengthRef.current = conversations.length;
  }, [conversations.length]);

  // Polling interval ref to track and cleanup
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Ref to track if fetch is in progress for polling (avoids recreating interval)
  const isFetchingForPollRef = useRef<boolean>(false);
  // Track poll count for debugging
  const pollCountRef = useRef(0);
  // Track effect runs for debugging
  const effectRunCountRef = useRef(0);

  // CACHE-FIRST: Track this cache key
  useEffect(() => {
    if (stableFilterKey && !cacheKeys.has(stableFilterKey)) {
      setCacheKeys((prev) => new Set([...Array.from(prev), stableFilterKey]));
    }
  }, [stableFilterKey, cacheKeys, setCacheKeys]);

  // Cleanup: Reset state on unmount
  useEffect(() => {
    return () => {
      // Reset instance-level tracking
      hasCompletedInitialFetchRef.current = false;
      prevFilterKeyRef.current = "";
    };
  }, [stableFilterKey]);

  // Helper to update specific loading states
  const setLoadingType = useCallback(
    (type: keyof ChatwootConversationsLoadingState, value: boolean) => {
      setLoadingState((prev) => ({ ...prev, [type]: value }));
    },
    [setLoadingState]
  );

  const fetchConversations = useCallback(
    async (page: number = 1, append: boolean = false, isFilterChange: boolean = false, forceRefresh: boolean = false, overrideLimit?: number) => {
      // Note: accountId can be null - the API endpoint /api/accounts/conversations
      // doesn't require accountId in the URL path, it uses the authenticated user's account automatically
      // So we allow the call even if accountId is null

      // CACHE-FIRST: Check if we have fresh cache (unless force refresh or append)
      if (!append && !forceRefresh && cache.conversations.length > 0) {
        const cacheAge = Date.now() - cache.timestamp;
        const isCacheFresh = cacheAge < CHATWOOT_CONSTANTS.CACHE_STALE_TIME;

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
        limit: overrideLimit ?? filterOptions.limit ?? CHATWOOT_CONSTANTS.DEFAULT_PAGE_SIZE,
        ...(filterOptions.status && { status: filterOptions.status }),
        ...(filterOptions.inbox_id && { inbox_id: filterOptions.inbox_id }),
        ...(filterOptions.assignee_type && { assignee_type: filterOptions.assignee_type }),
        ...(filterOptions.sort_by && { sort_by: filterOptions.sort_by }),
        ...(filterOptions.q && { q: filterOptions.q }),
        ...(filterOptions.team_id && { team_id: filterOptions.team_id }),
        ...(filterOptions.labels && { labels: filterOptions.labels }),
      };

      // Create stable key for deduplication
      const paramsKey = createFilterKey(accountId, listParams);
      const lockKey = createConversationsLockKey(paramsKey);

      // Centralized deduplication guard (prevents concurrent requests with the SAME params)
      if (!append) {
        // Check if same params as last successful fetch (and not a forced refresh)
        if (!forceRefresh && paramsKey === lastFetchParamsKeyRef.current) {
          console.log("[useChatwootConversations] ⏭️ Same params as last fetch, skipping duplicate");
          return;
        }

        // Try to acquire lock for this specific filter combination
        if (!acquireLock(paramsKey)) {
          console.log("[useChatwootConversations] ⏭️ Fetch already in progress for these params, skipping duplicate");
          return;
        }
      }

      // Instance-level deduplication check (backup)
      if (!append && !shouldFetch(listParams)) {
        console.log("[useChatwootConversations] Skipping duplicate/concurrent fetch (instance-level)");
        if (!append) {
          releaseLock(paramsKey);
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
        const limit = listParams.limit || CHATWOOT_CONSTANTS.DEFAULT_PAGE_SIZE;

        // Check if there are more pages
        const meta = response.data?.meta || response.meta || {};
        const hasMoreData = append
          ? conversationsList.length > 0 && conversationsList.length >= limit
          : conversationsList.length >= limit;

        // CACHE-FIRST: Update cache with new data (include lastAccessed for LRU)
        const now = Date.now();
        setCache((prev) => ({
          conversations: append ? [...prev.conversations, ...conversationsList] : conversationsList,
          timestamp: now,
          lastAccessed: now,
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
          // Update last successful fetch params
          lastFetchParamsKeyRef.current = paramsKey;
          releaseLock(paramsKey);
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load conversations";
        setError(errorMessage);

        // Track failed API call
        metrics.trackAPICall("conversations.list", "GET", apiStartTime, false, false, listParams);

        // CACHE-FIRST: Store error in cache (preserve lastAccessed)
        setCache((prev) => ({
          ...prev,
          error: errorMessage,
          lastAccessed: Date.now(),
        }));

        console.error("Failed to fetch Chatwoot conversations:", err);
        markFetchFailed();
        // Release lock on error
        if (!append) {
          releaseLock(paramsKey);
        }
      } finally {
        // Reset all loading states
        setLoadingState({
          initialLoading: false,
          filtering: false,
          loadingMore: false,
        });
        // Ensure isFetchingRef is reset (important for polling)
        isFetchingRef.current = false;
      }
    },
    [
      accountId,
      filterOptions.limit,
      filterOptions.status,
      filterOptions.inbox_id,
      filterOptions.assignee_type,
      filterOptions.sort_by,
      filterOptions.q,
      filterOptions.team_id,
      filterOptions.labels,
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
      acquireLock,
      releaseLock,
    ]
  );

  const loadMore = useCallback(() => {
    const isLoading = loadingState.initialLoading || loadingState.filtering || loadingState.loadingMore;
    if (!isLoading && hasMore) {
      fetchConversations(currentPage + 1, true, false, false);
    }
  }, [loadingState, hasMore, currentPage, fetchConversations]);

  const refresh = useCallback(async () => {
    // CACHE-FIRST: Force refresh (bypass cache)
    await fetchConversations(1, false, false, true);
  }, [fetchConversations]);

  // Lightweight refresh for polling (uses limit=2 to reduce request time)
  const refreshForPolling = useCallback(async () => {
    // Force refresh with minimal limit for faster polling
    await fetchConversations(1, false, false, true, 2);
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

      // Update cache (update lastAccessed for LRU tracking)
      setCache((prev) => ({
        ...prev,
        conversations: updatedConversations,
        lastAccessed: Date.now(),
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

          // Update cache (sync with server response)
          setCache((prev) => ({
            ...prev,
            conversations: syncedConversations,
            lastAccessed: Date.now(),
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

        // Revert cache (on failure)
        setCache((prev) => ({
          ...prev,
          conversations: revertedConversations,
          lastAccessed: Date.now(),
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

  // Effect to fetch conversations when filters change or when first enabled
  // NOTE: stableFilterKey is already defined at the top of the hook for cache management
  useEffect(() => {
    console.log("[useChatwootConversations] Effect triggered", {
      enabled,
      accountId,
      stableFilterKey,
      hasCompletedInitialFetch: hasCompletedInitialFetchRef.current,
      prevFilterKey: prevFilterKeyRef.current,
      isFetching: isFetchingRef.current,
    });

    // Skip fetching if disabled (e.g., router not ready yet)
    if (!enabled) {
      console.log("[useChatwootConversations] Skipping - fetching disabled (waiting for router)");
      return;
    }

    // Skip if already fetching to prevent concurrent calls
    if (isFetchingRef.current) {
      console.log("[useChatwootConversations] Skipping - fetch already in progress");
      return;
    }

    // First enabled fetch: When we become enabled for the first time with valid filters
    // This handles the case where enabled transitions from false to true
    if (!hasCompletedInitialFetchRef.current) {
      console.log("[useChatwootConversations] Performing initial enabled fetch", { accountId, stableFilterKey });
      hasCompletedInitialFetchRef.current = true;
      prevFilterKeyRef.current = stableFilterKey;
      isFetchingRef.current = true;
      fetchConversations(1, false, false).finally(() => {
        isFetchingRef.current = false;
        console.log("[useChatwootConversations] Initial fetch completed");
      });
      return;
    }

    // Detect if filters have changed (subsequent fetches)
    const isFilterChange = stableFilterKey !== prevFilterKeyRef.current;
    console.log("[useChatwootConversations] Filter change check", {
      isFilterChange,
      stableFilterKey,
      prevKey: prevFilterKeyRef.current,
    });

    // If filters haven't changed, don't do anything
    if (!isFilterChange) {
      console.log("[useChatwootConversations] No filter change, skipping fetch");
      return;
    }

    // Update the previous filter key
    prevFilterKeyRef.current = stableFilterKey;

    // Mark as fetching to prevent concurrent calls
    isFetchingRef.current = true;

    // Clear stale conversations immediately when filters change
    // This prevents showing old conversations from previous view during fetch
    console.log("[useChatwootConversations] Filter changed, clearing and refetching", { accountId, stableFilterKey });
    setConversations([]);
    setLoadingType("initialLoading", true);

    // Fetch conversations with filter change flag
    fetchConversations(1, false, true).finally(() => {
      isFetchingRef.current = false;
      console.log("[useChatwootConversations] Filter change fetch completed");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableFilterKey, enabled]); // Depend on stableFilterKey and enabled flag

  // Automatic polling for real-time updates (fallback/backup mechanism)
  useEffect(() => {
    effectRunCountRef.current += 1;
    console.log('[Chatwoot Conversations] 🔵 POLLING EFFECT RUNNING', {
      effectRunCount: effectRunCountRef.current,
      accountId,
      pollingInterval,
      enabled,
      hasExistingInterval: !!pollingIntervalRef.current,
      previousIntervalId: pollingIntervalRef.current,
      timestamp: new Date().toISOString(),
    });

    // Don't poll if disabled or no accountId
    if (!enabled || !accountId) {
      if (pollingIntervalRef.current) {
        console.log('[Chatwoot Conversations] Clearing polling - disabled or no accountId');
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    // Get polling interval from options (default: disabled)
    const interval = pollingInterval ?? 0;

    // Disable polling if interval is 0 or negative
    if (interval <= 0) {
      console.log('[Chatwoot Conversations] Polling disabled (interval <= 0)');
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    // Clear existing interval if it exists (will be recreated below)
    if (pollingIntervalRef.current) {
      console.log('[Chatwoot Conversations] Clearing existing polling interval before creating new one');
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    console.log(`[Chatwoot Conversations] ✅ Starting polling with interval: ${interval}ms for account: ${accountId}`);

    // Set up polling interval - store the interval ID
    const intervalId = setInterval(() => {
      pollCountRef.current += 1;
      
      // Defensive check: ensure interval still exists
      if (!pollingIntervalRef.current) {
        console.warn('[Chatwoot Conversations] ⚠️ WARNING: Polling interval was cleared but callback fired!', {
          pollCount: pollCountRef.current,
        });
        return;
      }

      console.log('[Chatwoot Conversations] 🔄 Polling interval triggered', {
        pollCount: pollCountRef.current,
        isFetchingForPoll: isFetchingForPollRef.current,
        isFetching: isFetchingRef.current,
        accountId,
        hasInterval: !!pollingIntervalRef.current,
        intervalId: intervalId,
        timestamp: new Date().toISOString(),
      });

      // Only poll if not currently fetching (to avoid overlapping requests)
      // Use ref to avoid stale closure issues
      if (!isFetchingForPollRef.current && !isFetchingRef.current) {
        console.log('[Chatwoot Conversations] ✅ Executing poll - calling refreshForPolling (limit=2)');
        isFetchingForPollRef.current = true;
        
        // Use refreshForPolling which uses limit=2 for faster polling
        // Wrap in try-catch to ensure we always reset the flag
        refreshForPolling()
          .then(() => {
            console.log('[Chatwoot Conversations] ✅ Poll refresh completed successfully');
          })
          .catch((error) => {
            console.error('[Chatwoot Conversations] ❌ Poll refresh error:', error);
            // Don't stop polling on error - continue polling
          })
          .finally(() => {
            // Always reset the flag, even on error
            isFetchingForPollRef.current = false;
            console.log('[Chatwoot Conversations] 🔄 Poll flag reset, ready for next poll');
          });
      } else {
        console.log('[Chatwoot Conversations] ⏸️ Skipping poll - already fetching', {
          isFetchingForPoll: isFetchingForPollRef.current,
          isFetching: isFetchingRef.current,
        });
        // If stuck, force reset after a timeout (safety mechanism)
        if (isFetchingRef.current) {
          setTimeout(() => {
            if (isFetchingRef.current) {
              console.warn('[Chatwoot Conversations] ⚠️ isFetchingRef stuck, forcing reset');
              isFetchingRef.current = false;
            }
          }, 30000); // Reset after 30 seconds if stuck
        }
      }
    }, interval);

    // Store the interval ID
    pollingIntervalRef.current = intervalId;
    console.log('[Chatwoot Conversations] 📌 Polling interval created with ID:', intervalId);

    // Track when interval was created for debugging
    const intervalCreatedAt = Date.now();

    // Periodic health check to ensure interval is still active (every 60 seconds)
    const healthCheckInterval = setInterval(() => {
      if (!pollingIntervalRef.current) {
        console.warn('[Chatwoot Conversations] ⚠️ HEALTH CHECK: Polling interval is null!', {
          accountId,
          enabled,
          pollingInterval,
          intervalCreatedAt,
          timeSinceCreation: Date.now() - intervalCreatedAt,
          pollCount: pollCountRef.current,
        });
        // Don't recreate here - let the effect handle it
      } else {
        console.log('[Chatwoot Conversations] ✅ HEALTH CHECK: Polling interval is active', {
          intervalId: pollingIntervalRef.current,
          pollCount: pollCountRef.current,
          timeSinceCreation: Date.now() - intervalCreatedAt,
        });
      }
    }, 60000); // Check every 60 seconds

    // Cleanup on unmount or when dependencies change
    return () => {
      console.log('[Chatwoot Conversations] 🧹 CLEANUP FUNCTION CALLED', {
        accountId,
        enabled,
        pollingInterval,
        intervalId: pollingIntervalRef.current,
        pollCount: pollCountRef.current,
        effectRunCount: effectRunCountRef.current,
        timeSinceCreation: Date.now() - intervalCreatedAt,
        timestamp: new Date().toISOString(),
        stackTrace: new Error().stack?.split('\n').slice(0, 5).join('\n'), // First 5 lines of stack
      });
      
      // Clear health check
      clearInterval(healthCheckInterval);
      
      if (pollingIntervalRef.current) {
        console.log('[Chatwoot Conversations] 🧹 Clearing polling interval', {
          intervalId: pollingIntervalRef.current,
        });
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      isFetchingForPollRef.current = false;
    };
    // Only recreate interval when account, enabled, or polling interval changes
    // IMPORTANT: Don't include refresh or refreshForPolling in dependencies to avoid recreating interval
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, enabled, pollingInterval]);

  return useMemo(
    () => ({
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
    }),
    [conversations, loadingState, error, hasMore, loadMore, refresh, fetchConversations, updateConversationStatus, metrics]
  );
};
