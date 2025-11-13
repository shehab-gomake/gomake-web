/**
 * Chatwoot Conversations Hook
 *
 * Fetches and manages conversations with deduplication and optimistic updates.
 *
 * @example
 * ```typescript
 * const { conversations, loading, error, loadMore, refresh } = useChatwootConversations(accountId, {
 *   status: ConversationStatus.OPEN,
 *   assignee_type: ConversationAssigneeType.ME
 * });
 * ```
 */

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import {
  ConversationListParams,
  ConversationStatus,
  ConversationAssigneeType,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import {
  chatwootConversationsAtom,
  chatwootConversationsLoadingAtom,
  chatwootConversationsErrorAtom,
  chatwootConversationCountsAtom,
  ChatwootConversationsLoadingState,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { useFetchDeduplication } from "./use-chatwoot-initialization";
import { createFilterKey } from "../utils/filter-utils";

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

  // Synchronous guard to prevent duplicate fetches when React runs effect multiple times rapidly
  // This is checked BEFORE shouldFetch to prevent race conditions
  const isEffectRunningRef = useRef(false);

  // Track conversations length in a ref to avoid recreating fetchConversations callback
  const conversationsLengthRef = useRef(conversations.length);
  useEffect(() => {
    conversationsLengthRef.current = conversations.length;
  }, [conversations.length]);

  // Helper to update specific loading states
  const setLoadingType = useCallback(
    (type: keyof ChatwootConversationsLoadingState, value: boolean) => {
      setLoadingState((prev) => ({ ...prev, [type]: value }));
    },
    [setLoadingState]
  );

  const fetchConversations = useCallback(
    async (
      page: number = 1,
      append: boolean = false,
      isFilterChange: boolean = false,
      skipDeduplicationCheck: boolean = false
    ) => {
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

      // Prevent duplicate requests
      // Skip check if already validated in useEffect (skipDeduplicationCheck = true)
      if (!append && !skipDeduplicationCheck && !shouldFetch(listParams)) {
        return;
      }
      // Note: If skipDeduplicationCheck is true, shouldFetch was already called in useEffect
      // and marked fetch as started atomically

      // Set appropriate loading state based on operation type
      if (append) {
        setLoadingType("loadingMore", true);
      } else if (isFilterChange && conversationsLengthRef.current > 0) {
        setLoadingType("filtering", true);
      } else {
        setLoadingType("initialLoading", true);
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

        if (!append) {
          markFetchComplete(listParams);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load conversations";
        setError(errorMessage);
        markFetchFailed();
      } finally {
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
      // Removed conversations.length - using ref instead to prevent unnecessary re-renders
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

      // Step 1: Optimistic Update - Immediately update UI
      setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, status: newStatus } : conv)));

      try {
        // Step 2: Background API Call
        const response = await chatwootService.conversations.updateConversationStatus(accountId, conversationId, {
          status: newStatus,
        });

        // Verify success from API response
        if (response.payload?.success && response.payload.current_status) {
          // API confirmed the status change, ensure UI is synced with server response
          const serverStatus = response.payload.current_status;

          setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, status: serverStatus } : conv)));

          console.log(`[updateConversationStatus] Successfully updated conversation ${conversationId} to ${serverStatus}`);
        } else {
          // API call succeeded but response format unexpected - log warning but keep optimistic update
          console.warn("[updateConversationStatus] Unexpected response format:", response);
        }
      } catch (err: any) {
        // Step 3: Revert on Failure
        console.error("[updateConversationStatus] Failed to update status, reverting:", err);

        setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, status: originalStatus } : conv)));

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

  // Create a stable filter key using the same utility function used elsewhere
  // This ensures consistent comparison and prevents unnecessary re-renders
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
    options?.limit,
  ]);

  useEffect(() => {
    // Build params to check deduplication BEFORE calling fetchConversations
    const listParams: ConversationListParams = {
      page: 1,
      limit: options.limit || 20,
      ...(options.status && { status: options.status }),
      ...(options.inbox_id && { inbox_id: options.inbox_id }),
      ...(options.assignee_type && { assignee_type: options.assignee_type }),
      ...(options.sort_by && { sort_by: options.sort_by }),
      ...(options.q && { q: options.q }),
      ...(options.team_id && { team_id: options.team_id }),
      ...(options.labels && { labels: options.labels }),
    };

    // Check deduplication FIRST - if already fetching or duplicate params, skip immediately
    // shouldFetch atomically checks and marks, preventing race conditions
    if (!shouldFetch(listParams)) {
      return;
    }
    // Note: shouldFetch already marked fetch as started atomically

    // Set synchronous guard AFTER shouldFetch check to prevent duplicate effect runs
    // This ensures that if React runs this effect multiple times rapidly,
    // only the first one that passes shouldFetch proceeds
    if (isEffectRunningRef.current) {
      // Reset the flag since shouldFetch already marked it, but we're skipping this run
      markFetchFailed();
      return;
    }
    isEffectRunningRef.current = true;

    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      prevFilterKeyRef.current = stableFilterKey;
      // Pass skipDeduplicationCheck=true since we already checked and marked start
      fetchConversations(1, false, false, true).finally(() => {
        isEffectRunningRef.current = false;
      });
      return;
    }

    const isFilterChange = stableFilterKey !== prevFilterKeyRef.current;
    if (!isFilterChange) {
      // Reset flags if we're not actually fetching (filter didn't change)
      markFetchFailed();
      isEffectRunningRef.current = false;
      return;
    }

    prevFilterKeyRef.current = stableFilterKey;

    setConversations([]);
    setLoadingType("initialLoading", true);

    // Pass skipDeduplicationCheck=true since we already checked and marked start
    fetchConversations(1, false, true, true).finally(() => {
      isEffectRunningRef.current = false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableFilterKey]);

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
