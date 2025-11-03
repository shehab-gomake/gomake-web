import { useState, useEffect, useCallback, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
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
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { useFetchDeduplication } from "./use-chatwoot-initialization";

export const useChatwootConversations = (accountId: number | null, options: Partial<ConversationListParams> = {}) => {
  const [conversations, setConversations] = useRecoilState(chatwootConversationsAtom);
  const [loading, setLoading] = useRecoilState(chatwootConversationsLoadingAtom);
  const [error, setError] = useRecoilState(chatwootConversationsErrorAtom);
  const setCounts = useSetRecoilState(chatwootConversationCountsAtom);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch deduplication to prevent redundant API calls
  const { shouldFetch, markFetchStart, markFetchComplete, markFetchFailed } = useFetchDeduplication<ConversationListParams>();

  // Track if this is the first mount
  const isFirstMountRef = useRef(true);

  const fetchConversations = useCallback(
    async (page: number = 1, append: boolean = false) => {
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
      setLoading(true);
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
        setLoading(false);
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
      setConversations,
      setLoading,
      setError,
      setCounts,
      shouldFetch,
      markFetchStart,
      markFetchComplete,
      markFetchFailed,
    ]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchConversations(currentPage + 1, true);
    }
  }, [loading, hasMore, currentPage, fetchConversations]);

  const refresh = useCallback(() => {
    fetchConversations(1, false);
  }, [fetchConversations]);

  useEffect(() => {
    // Skip the first mount to prevent double fetch during initialization
    // The parent provider will coordinate the initial fetch
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      // Still fetch on first mount, but the deduplication will prevent multiple calls
      fetchConversations(1, false);
      return;
    }

    // Fetch conversations even if accountId is null
    // The API endpoint uses authenticated user's account automatically
    fetchConversations(1, false);
  }, [accountId, options, fetchConversations]);

  return {
    conversations,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    fetchConversations,
  };
};
