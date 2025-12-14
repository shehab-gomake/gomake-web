import { useState, useCallback, useEffect, useRef } from "react";
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
import { messagingService } from "@/services/frontdesk/websocket/messaging-socket.service";

interface UseEmailConversationsOptions {
  query?: string;
  limit?: number;
  /**
   * Polling interval in milliseconds for automatic refresh
   * Set to 0 or undefined to disable polling
   * Default: 30000 (30 seconds)
   */
  pollingInterval?: number;
}

export const useEmailConversations = (options: UseEmailConversationsOptions = {}) => {
  console.log('[Email Conversations] 🟢 Hook initialized', {
    pollingInterval: options.pollingInterval,
    query: options.query,
    limit: options.limit,
  });

  const [conversations, setConversations] = useRecoilState(emailConversationsState);
  const [loading, setLoading] = useRecoilState(emailConversationsLoadingState);
  const [error, setError] = useRecoilState(emailConversationsErrorState);
  const selectedAccountId = useRecoilValue(selectedEmailAccountIdState);

  console.log('[Email Conversations] 🟡 Hook render', {
    selectedAccountId,
    pollingInterval: options.pollingInterval,
    conversationsCount: conversations.length,
  });

  const [pageToken, setPageToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  // Polling interval ref to track and cleanup
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Track last fetch time to avoid duplicate fetches
  const lastFetchTimeRef = useRef<number>(0);
  // Ref to track loading state for polling (avoids recreating interval)
  const loadingRef = useRef<boolean>(false);
  // Minimum time between fetches (1 second) to prevent rapid polling
  const MIN_FETCH_INTERVAL = 1000;

  const fetchConversations = useCallback(
    async (reset = false, skipLoadingCheck = false) => {
      console.log('[Email Conversations] fetchConversations called', {
        reset,
        skipLoadingCheck,
        selectedAccountId,
        hasAccountId: !!selectedAccountId,
      });

      if (!selectedAccountId) {
        console.log('[Email Conversations] No account ID, clearing conversations');
        setConversations([]);
        return;
      }

      // Prevent rapid successive fetches
      const now = Date.now();
      if (!skipLoadingCheck && now - lastFetchTimeRef.current < MIN_FETCH_INTERVAL) {
        console.log('[Email Conversations] ⏸️ Skipping fetch - too soon after last fetch', {
          timeSinceLastFetch: now - lastFetchTimeRef.current,
          minInterval: MIN_FETCH_INTERVAL,
        });
        return;
      }

      if (!skipLoadingCheck && loading) {
        console.log('[Email Conversations] ⏸️ Skipping fetch - already loading');
        return;
      }

      console.log('[Email Conversations] ✅ Starting fetch', {
        accountId: selectedAccountId,
        reset,
        query: options.query,
        limit: options.limit || 20,
      });

      lastFetchTimeRef.current = now;
      loadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const response = await emailApiClient.getConversations(selectedAccountId, {
          query: options.query,
          limit: options.limit || 20,
          pageToken: reset ? undefined : pageToken || undefined,
        });

        console.log('[Email Conversations] ✅ Fetch successful', {
          conversationCount: response.conversations?.length || 0,
          hasNextPageToken: !!response.nextPageToken,
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
        console.error('[Email Conversations] Fetch error:', err);
      } finally {
        loadingRef.current = false;
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

    // Ensure messaging service socket is connected before initializing email WebSocket
    const initializeWebSocket = async () => {
      try {
        // Check if messaging service socket is connected
        if (!messagingService.isConnected()) {
          console.log('[Email Conversations] Messaging service not connected, attempting to connect...');
          await messagingService.connect();
        }

        // Initialize email WebSocket service if not already done
        if (!emailWebSocketService.isInitialized()) {
          console.log('[Email Conversations] Initializing email WebSocket service...');
          emailWebSocketService.initialize();
        }
      } catch (error) {
        console.error('[Email Conversations] Failed to initialize WebSocket:', error);
        // Continue without WebSocket - polling will handle updates
      }
    };

    initializeWebSocket();

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

  // Automatic polling for real-time updates (fallback/backup mechanism)
  useEffect(() => {
    // Log at the very start to ensure effect is running
    console.log('[Email Conversations] 🔵 POLLING EFFECT RUNNING', {
      selectedAccountId,
      pollingInterval: options.pollingInterval,
      hasExistingInterval: !!pollingIntervalRef.current,
      timestamp: new Date().toISOString(),
    });

    if (!selectedAccountId) {
      // Clear polling if no account selected
      if (pollingIntervalRef.current) {
        console.log('[Email Conversations] Clearing polling - no account selected');
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    // Get polling interval from options (default: 30 seconds)
    const pollingInterval = options.pollingInterval ?? 30000;

    // Disable polling if interval is 0 or negative
    if (pollingInterval <= 0) {
      console.log('[Email Conversations] Polling disabled (interval <= 0)');
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    // Clear existing interval if it exists (will be recreated below)
    if (pollingIntervalRef.current) {
      console.log('[Email Conversations] Clearing existing polling interval before creating new one');
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    console.log(`[Email Conversations] ✅ Starting polling with interval: ${pollingInterval}ms for account: ${selectedAccountId}`);

    // Set up polling interval
    pollingIntervalRef.current = setInterval(() => {
      console.log('[Email Conversations] 🔄 Polling interval triggered', {
        loadingRef: loadingRef.current,
        selectedAccountId,
        timestamp: new Date().toISOString(),
      });

      // Only poll if not currently loading (to avoid overlapping requests)
      // Use ref to avoid stale closure issues
      if (!loadingRef.current) {
        console.log('[Email Conversations] ✅ Executing poll - calling fetchConversations');
        // Use skipLoadingCheck=true to allow polling even if loading state is true
        // This ensures we can poll even during initial load
        fetchConversations(true, true).catch((error) => {
          console.error('[Email Conversations] ❌ Poll fetch error:', error);
        });
      } else {
        console.log('[Email Conversations] ⏸️ Skipping poll - already loading (loadingRef.current = true)');
      }
    }, pollingInterval);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (pollingIntervalRef.current) {
        console.log('[Email Conversations] 🧹 Cleaning up polling interval');
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
    // Only recreate interval when account or polling interval changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccountId, options.pollingInterval]);

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
