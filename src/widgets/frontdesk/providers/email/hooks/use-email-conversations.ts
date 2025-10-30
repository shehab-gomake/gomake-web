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
import { emailWebSocketService } from "@/services/frontdesk/websocket/email-websocket.service";

interface UseEmailConversationsOptions {
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

  const fetchConversations = useCallback(
    async (reset = false) => {
      if (!selectedAccountId) {
        setConversations([]);
        return;
      }

      if (loading) return;

      setLoading(true);
      setError(null);

      try {
        const response = await emailApiClient.getConversations(selectedAccountId, {
          query: options.query,
          limit: options.limit || 20,
          pageToken: reset ? undefined : pageToken || undefined,
        });

        if (reset) {
          setConversations(response.conversations);
        } else {
          setConversations((prev) => {
            // Prevent duplicates when appending
            const existingIds = new Set(prev.map(c => c.id));
            const newConversations = response.conversations.filter(c => !existingIds.has(c.id));
            return [...prev, ...newConversations];
          });
        }

        setPageToken(response.nextPageToken || null);
        setHasMore(!!response.nextPageToken);
      } catch (err: any) {
        setError(err.message || "Failed to fetch conversations");
      } finally {
        setLoading(false);
      }
    },
    [selectedAccountId, options.query, options.limit, pageToken, loading, setConversations, setLoading, setError]
  );

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchConversations(false);
    }
  }, [hasMore, loading, fetchConversations]);

  const refresh = useCallback(() => {
    setPageToken(null);
    fetchConversations(true);
  }, [fetchConversations]);

  const starConversation = useCallback(
    async (conversationId: string, starred: boolean) => {
      if (!selectedAccountId) return;

      try {
        await emailApiClient.updateMessage(selectedAccountId, conversationId, { starred });

        setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, isRead: !starred } : conv)));
      } catch (err: any) {
        console.error("Failed to star conversation:", err);
      }
    },
    [selectedAccountId]
  );

  const deleteConversation = useCallback(
    async (conversationId: string) => {
      if (!selectedAccountId) return;

      try {
        await emailApiClient.deleteMessage(selectedAccountId, conversationId);

        setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
      } catch (err: any) {
        console.error("Failed to delete conversation:", err);
      }
    },
    [selectedAccountId]
  );

  const archiveConversation = useCallback(
    async (conversationId: string) => {
      if (!selectedAccountId) return;

      try {
        await emailApiClient.archiveMessage(selectedAccountId, conversationId);

        setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
      } catch (err: any) {
        console.error("Failed to archive conversation:", err);
      }
    },
    [selectedAccountId]
  );

  const markAsRead = useCallback(
    async (conversationId: string) => {
      if (!selectedAccountId) return;

      try {
        await emailApiClient.markAsRead(selectedAccountId, conversationId);

        setConversations((prev) =>
          prev.map((conv) => (conv.id === conversationId ? { ...conv, isRead: true } : conv))
        );
      } catch (err: any) {
        console.error("Failed to mark conversation as read:", err);
      }
    },
    [selectedAccountId]
  );

  const markAsUnread = useCallback(
    async (conversationId: string) => {
      if (!selectedAccountId) return;

      try {
        await emailApiClient.markAsUnread(selectedAccountId, conversationId);

        setConversations((prev) =>
          prev.map((conv) => (conv.id === conversationId ? { ...conv, isRead: false } : conv))
        );
      } catch (err: any) {
        console.error("Failed to mark conversation as unread:", err);
      }
    },
    [selectedAccountId]
  );

  const trashConversation = useCallback(
    async (conversationId: string) => {
      if (!selectedAccountId) return;

      try {
        await emailApiClient.trashMessage(selectedAccountId, conversationId);

        setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
      } catch (err: any) {
        console.error("Failed to move conversation to trash:", err);
      }
    },
    [selectedAccountId]
  );

  // Fetch conversations when account or filter changes
  useEffect(() => {
    if (selectedAccountId) {
      setPageToken(null);
      fetchConversations(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccountId, options.query]);

  // Real-time email updates via WebSocket
  useEffect(() => {
    if (!selectedAccountId) return;

    // Initialize WebSocket if not already done
    if (!emailWebSocketService.isInitialized()) {
      emailWebSocketService.initialize();
    }

    // Subscribe to email events
    const unsubscribe = emailWebSocketService.subscribe((event) => {
      // Only process events for the currently selected account
      if (event.accountId !== selectedAccountId) return;

      console.log('[Email Conversations] WebSocket event:', event.type, event.data);

      switch (event.type) {
        case 'NEW_EMAIL':
          handleNewEmail(event.data);
          break;
        case 'EMAIL_UPDATED':
          handleEmailUpdated(event.data);
          break;
        case 'EMAIL_READ':
          handleEmailRead(event.data);
          break;
        case 'EMAIL_DELETED':
          handleEmailDeleted(event.data);
          break;
      }
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccountId]);

  // Handler for new email
  const handleNewEmail = useCallback((newConversation: EmailConversation) => {
    setConversations((prev) => {
      // Check for duplicates
      const exists = prev.some((conv) => conv.id === newConversation.id);
      if (exists) {
        console.log('[Email Conversations] Duplicate email, skipping:', newConversation.id);
        return prev;
      }

      // Add to the top (most recent first)
      console.log('[Email Conversations] Adding new email:', newConversation.subject);
      return [newConversation, ...prev];
    });
  }, []);

  // Handler for email updated
  const handleEmailUpdated = useCallback((updatedConversation: EmailConversation) => {
    setConversations((prev) => {
      const exists = prev.some((conv) => conv.id === updatedConversation.id);

      if (!exists) {
        // New conversation, add it
        return [updatedConversation, ...prev];
      }

      // Update existing conversation
      return prev
        .map((conv) =>
          conv.id === updatedConversation.id
            ? { ...conv, ...updatedConversation }
            : conv
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }, []);

  // Handler for email read
  const handleEmailRead = useCallback((conversation: EmailConversation) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversation.id
          ? { ...conv, isRead: true, unreadCount: 0 }
          : conv
      )
    );
  }, []);

  // Handler for email deleted
  const handleEmailDeleted = useCallback((conversation: EmailConversation) => {
    setConversations((prev) =>
      prev.filter((conv) => conv.id !== conversation.id)
    );
  }, []);

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
    markAsRead,
    markAsUnread,
    trashConversation,
  };
};
