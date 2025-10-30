import { useState, useEffect, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import {
  chatwootConversationsAtom,
  chatwootConversationsLoadingAtom,
  chatwootConversationsErrorAtom,
  chatwootSelectedConversationAtom,
  chatwootSelectedAccountAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";

interface UseChatwootConversationsOptions {
  accountId?: number;
  status?: string[];
  inboxId?: number[];
  page?: number;
  limit?: number;
}

export const useChatwootConversations = (options: UseChatwootConversationsOptions = {}) => {
  const [conversations, setConversations] = useRecoilState(chatwootConversationsAtom);
  const [loading, setLoading] = useRecoilState(chatwootConversationsLoadingAtom);
  const [error, setError] = useRecoilState(chatwootConversationsErrorAtom);
  const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const accountId = options.accountId || selectedAccountId;

  const fetchConversations = useCallback(
    async (page: number = 1, append: boolean = false) => {
      if (!accountId) {
        setError("No account selected");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await chatwootService.conversations.listConversations(accountId, {
          page,
          limit: options.limit || 20,
          status: options.status,
          inbox_id: options.inboxId,
        });

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
    [accountId, options.limit, options.status, options.inboxId, setConversations, setLoading, setError]
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
    if (accountId) {
      fetchConversations(1, false);
    } else {
      setConversations([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

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

