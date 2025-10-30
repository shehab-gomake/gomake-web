import { useState, useEffect, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
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
  chatwootSelectedConversationAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";

export const useChatwootConversations = (options: Partial<ConversationListParams> = {}) => {
  const [conversations, setConversations] = useRecoilState(chatwootConversationsAtom);
  const [loading, setLoading] = useRecoilState(chatwootConversationsLoadingAtom);
  const [error, setError] = useRecoilState(chatwootConversationsErrorAtom);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchConversations = useCallback(
    async (page: number = 1, append: boolean = false) => {
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

        const response = await chatwootService.conversations.listConversations(listParams);

        // Chatwoot API returns: { data: { payload: [...], meta: {...} } }
        // Handle nested structure
        const responseData = response.data || response;
        const conversationsList = responseData.payload || responseData.data || responseData || [];
        
        if (append) {
          setConversations((prev) => [...prev, ...conversationsList]);
        } else {
          setConversations(conversationsList);
        }

        // Check if there are more pages
        const meta = responseData.meta || response.meta || {};
        setHasMore(meta?.page ? meta.page < (meta.total_pages || meta.count || 0) : false);

        setCurrentPage(page);
      } catch (err: any) {
        setError(err.message || "Failed to load conversations");
        console.error("Failed to fetch Chatwoot conversations:", err);
      } finally {
        setLoading(false);
      }
    },
    [options.limit, options.status, options.inbox_id, options.assignee_type, options.sort_by, options.q, options.team_id, options.labels, setConversations, setLoading, setError]
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
    fetchConversations(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.status, options.assignee_type, options.sort_by, options.q, options.inbox_id, options.team_id, options.labels]);

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

