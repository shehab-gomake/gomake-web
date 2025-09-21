import { useState, useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  emailConversationsState,
  emailConversationsLoadingState,
  emailConversationsErrorState,
  selectedEmailAccountIdState,
} from "../store/email-store";
import { emailApiClient } from "../utils/email-api-client";
import { EmailConversation } from "../types/email.types";

interface UseEmailConversationsOptions {
  folder?: string;
  query?: string;
  limit?: number;
}

export const useEmailConversations = (options: UseEmailConversationsOptions = {}) => {
  const [conversations, setConversations] = useRecoilState(emailConversationsState);
  const [loading, setLoading] = useRecoilState(emailConversationsLoadingState);
  const [error, setError] = useRecoilState(emailConversationsErrorState);
  const selectedAccountId = useRecoilValue(selectedEmailAccountIdState);

  const [pageToken, setPageToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchConversations = useCallback(async (reset = false) => {
    if (!selectedAccountId) {
      setConversations([]);
      return;
    }

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await emailApiClient.getConversations(selectedAccountId, {
        folder: options.folder,
        query: options.query,
        limit: options.limit || 20,
        pageToken: reset ? undefined : pageToken || undefined,
      });

      if (reset) {
        setConversations(response.conversations);
      } else {
        setConversations((prev) => [...prev, ...response.conversations]);
      }

      setPageToken(response.nextPageToken || null);
      setHasMore(!!response.nextPageToken);
    } catch (err: any) {
      setError(err.message || "Failed to fetch conversations");
    } finally {
      setLoading(false);
    }
  }, [selectedAccountId, options, pageToken, loading]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchConversations(false);
    }
  }, [hasMore, loading, fetchConversations]);

  const refresh = useCallback(() => {
    setPageToken(null);
    fetchConversations(true);
  }, [fetchConversations]);

  const starConversation = useCallback(async (conversationId: string, starred: boolean) => {
    if (!selectedAccountId) return;

    try {
      await emailApiClient.updateMessage(selectedAccountId, conversationId, { starred });

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, isRead: !starred } : conv
        )
      );
    } catch (err: any) {
      console.error("Failed to star conversation:", err);
    }
  }, [selectedAccountId]);

  const deleteConversation = useCallback(async (conversationId: string) => {
    if (!selectedAccountId) return;

    try {
      await emailApiClient.deleteMessage(selectedAccountId, conversationId);

      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
    } catch (err: any) {
      console.error("Failed to delete conversation:", err);
    }
  }, [selectedAccountId]);

  const archiveConversation = useCallback(async (conversationId: string) => {
    if (!selectedAccountId) return;

    try {
      await emailApiClient.archiveMessage(selectedAccountId, conversationId);

      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
    } catch (err: any) {
      console.error("Failed to archive conversation:", err);
    }
  }, [selectedAccountId]);

  // Fetch conversations when account or filter changes
  useEffect(() => {
    if (selectedAccountId) {
      setPageToken(null);
      fetchConversations(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccountId, options.folder, options.query]);

  return {
    conversations,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    starConversation,
    deleteConversation,
    archiveConversation,
  };
};