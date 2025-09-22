import { useState, useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  emailMessagesState,
  emailMessagesLoadingState,
  emailMessagesErrorState,
  selectedEmailAccountIdState,
} from "../store/email-store";
import { emailApiClient } from "../utils/email-api-client";
import { EmailMessage } from "../types/email.types";

interface UseEmailMessagesOptions {
  folder?: string;
  query?: string;
  limit?: number;
}

export const useEmailMessages = (options: UseEmailMessagesOptions = {}) => {
  const [messages, setMessages] = useRecoilState(emailMessagesState);
  const [loading, setLoading] = useRecoilState(emailMessagesLoadingState);
  const [error, setError] = useRecoilState(emailMessagesErrorState);
  const selectedAccountId = useRecoilValue(selectedEmailAccountIdState);

  const [pageToken, setPageToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchMessages = useCallback(async (reset = false) => {
    if (!selectedAccountId) {
      setMessages([]);
      return;
    }

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await emailApiClient.getMessages(selectedAccountId, {
        query: options.query,
        limit: options.limit || 20,
        pageToken: reset ? undefined : pageToken || undefined,
      });

      if (reset) {
        setMessages(response.messages);
      } else {
        setMessages((prev) => [...prev, ...response.messages]);
      }

      setPageToken(response.nextPageToken || null);
      setHasMore(!!response.nextPageToken);
    } catch (err: any) {
      setError(err.message || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [selectedAccountId, options, pageToken, loading]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchMessages(false);
    }
  }, [hasMore, loading, fetchMessages]);

  const refresh = useCallback(() => {
    setPageToken(null);
    fetchMessages(true);
  }, [fetchMessages]);

  const starMessage = useCallback(async (messageId: string, starred: boolean) => {
    if (!selectedAccountId) return;

    try {
      await emailApiClient.updateMessage(selectedAccountId, messageId, { starred });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isStarred: starred } : msg
        )
      );
    } catch (err: any) {
      console.error("Failed to star message:", err);
    }
  }, [selectedAccountId]);

  const deleteMessage = useCallback(async (messageId: string) => {
    if (!selectedAccountId) return;

    try {
      await emailApiClient.deleteMessage(selectedAccountId, messageId);

      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (err: any) {
      console.error("Failed to delete message:", err);
    }
  }, [selectedAccountId]);

  const archiveMessage = useCallback(async (messageId: string) => {
    if (!selectedAccountId) return;

    try {
      await emailApiClient.archiveMessage(selectedAccountId, messageId);

      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (err: any) {
      console.error("Failed to archive message:", err);
    }
  }, [selectedAccountId]);

  // Fetch messages when account changes
  useEffect(() => {
    if (selectedAccountId) {
      refresh();
    }
  }, [selectedAccountId, options.folder, options.query]);

  return {
    messages,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    starMessage,
    deleteMessage,
    archiveMessage,
  };
};