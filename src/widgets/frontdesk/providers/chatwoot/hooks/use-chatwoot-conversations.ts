import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import { createLogger } from "@/services/frontdesk/utils/logger";

const logger = createLogger("useChatwootConversations");
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
import { createFilterKey, extractPayload, extractMetadata, extractCounts, extractPaginationInfo } from "../utils";

export const useChatwootConversations = (
  accountId: number | null,
  options: Partial<ConversationListParams> = {}
) => {
  const [conversations, setConversations] = useRecoilState(chatwootConversationsAtom);
  const [loading, setLoading] = useRecoilState(chatwootConversationsLoadingAtom);
  const [error, setError] = useRecoilState(chatwootConversationsErrorAtom);
  const setCounts = useSetRecoilState(chatwootConversationCountsAtom);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Create a stable serialized key from filter options to prevent unnecessary re-fetches
  // This ensures we only fetch when the actual filter values change, not just the object reference
  const filterKey = useMemo(() => {
    return createFilterKey(accountId, options);
  }, [
    accountId,
    options.status,
    options.inbox_id,
    options.assignee_type,
    options.sort_by,
    options.q,
    options.team_id,
    options.labels,
    options.limit,
  ]);

  // Track the last filter key that was used for fetching to prevent duplicate requests
  const lastFetchedKeyRef = useRef<string | null>(null);
  const isFetchingRef = useRef(false);

  const fetchConversations = useCallback(
    async (page: number = 1, append: boolean = false) => {
      // Prevent duplicate concurrent requests with the same filters
      if (isFetchingRef.current && !append) {
        return;
      }

      // Note: accountId can be null - the API endpoint /api/accounts/conversations 
      // doesn't require accountId in the URL path, it uses the authenticated user's account automatically
      // So we allow the call even if accountId is null
      
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      try {
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

        // Pass accountId (can be null) - the service will handle it
        const response = await chatwootService.conversations.listConversations(accountId, listParams);

        // Use utility functions to extract data and metadata
        const conversationsList = extractPayload(response);
        const meta = extractMetadata(response);
        const paginationInfo = extractPaginationInfo(meta);
        const counts = extractCounts(meta);
        
        if (append) {
          setConversations((prev) => [...prev, ...conversationsList]);
        } else {
          setConversations(conversationsList);
        }

        // Update pagination state
        setHasMore(paginationInfo.hasMore);

        // Extract counts from API response meta
        setCounts(counts);

        setCurrentPage(page);
        
        // Update the last fetched key to track what was fetched
        if (!append) {
          lastFetchedKeyRef.current = filterKey;
        }
      } catch (err: any) {
        setError(err.message || "Failed to load conversations");
        logger.error("Failed to fetch conversations", err);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [accountId, filterKey, options.limit, options.status, options.inbox_id, options.assignee_type, options.sort_by, options.q, options.team_id, options.labels, setConversations, setLoading, setError, setCounts]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore && !isFetchingRef.current) {
      fetchConversations(currentPage + 1, true);
    }
  }, [loading, hasMore, currentPage, fetchConversations]);

  const refresh = useCallback(() => {
    lastFetchedKeyRef.current = null; // Reset to force fetch
    fetchConversations(1, false);
  }, [fetchConversations]);

  useEffect(() => {
    // Only fetch if:
    // 1. The filter key has actually changed (not just object reference)
    // 2. We're not currently fetching (to prevent duplicate concurrent requests)
    if (filterKey !== lastFetchedKeyRef.current && !isFetchingRef.current) {
      // Clear conversations immediately when filters change (e.g., channel switch)
      // This provides instant visual feedback that a change is happening
      setConversations([]);
      setHasMore(true);
      setCurrentPage(1);
      setError(null);
      
      // Then fetch new conversations
      fetchConversations(1, false);
    }
  }, [filterKey, fetchConversations, setConversations]);

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

