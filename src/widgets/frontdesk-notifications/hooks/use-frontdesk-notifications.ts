import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import {
  frontdeskNotificationsAtom,
  notificationCountsSelector,
  messageNotificationsSelector,
  ticketNotificationsSelector,
  notificationsLoadingAtom,
  notificationsErrorAtom,
  BackendNotification,
  BackendNotificationType,
} from "@/store/frontdesk/atoms/notifications.atoms";
import { notificationsService, notificationsWebSocketService } from "@/services/frontdesk";
import { snackbarState } from "@/store/snackbar";
import { useFrontDeskRouter } from "@/widgets/frontdesk/routing/hooks/use-frontdesk-router";
import { TicketView } from "@/widgets/frontdesk/routing/types";

/**
 * Hook for managing FrontDesk notifications
 * Provides state, actions, real-time updates, navigation handlers, and infinite scroll
 */
export const useFrontdeskNotifications = () => {
  const router = useRouter();
  const { goToTicket, goToEmailConversation, goToDMConversation, RouteBuilder } = useFrontDeskRouter();

  // State
  const [notifications, setNotifications] = useRecoilState(frontdeskNotificationsAtom);
  const [loading, setLoading] = useRecoilState(notificationsLoadingAtom);
  const [error, setError] = useRecoilState(notificationsErrorAtom);
  const setSnackbar = useSetRecoilState(snackbarState);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Selectors
  const counts = useRecoilValue(notificationCountsSelector);
  const messageNotifications = useRecoilValue(messageNotificationsSelector);
  const ticketNotifications = useRecoilValue(ticketNotificationsSelector);

  /**
   * Fetch notifications from API with pagination support
   *
   * @param page - Page number to fetch (default: 1)
   * @param append - Whether to append results to existing notifications or replace them
   */
  const fetchNotifications = useCallback(
    async (page = 1, append = false) => {
      try {
        // Set appropriate loading state
        if (append) {
          setIsLoadingMore(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const response = await notificationsService.getNotifications({
          unreadOnly: false,
          limit: 20, // Load 20 notifications per page
          page,
        });

        console.log("[useFrontdeskNotifications] Raw response:", response);

        // Extract notifications array from response
        // Handle both unwrapped array and { data, pagination } structure
        const notificationsData = Array.isArray(response) ? response : response.data || [];

        // Update notifications state
        if (append) {
          // Append mode: Add new notifications while preventing duplicates
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n.id));
            const newNotifications = notificationsData.filter((n) => !existingIds.has(n.id));
            return [...prev, ...newNotifications];
          });
        } else {
          // Replace mode: Set as new list
          setNotifications(notificationsData);
        }

        // Update pagination state
        setCurrentPage(page);
        setHasMore(response.pagination?.hasNext || false);

        console.log(`[useFrontdeskNotifications] Loaded page ${page}, hasMore: ${response.pagination?.hasNext}`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch notifications";
        console.error("[useFrontdeskNotifications] Fetch error:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [setNotifications, setLoading, setError]
  );

  /**
   * Load more notifications (next page)
   * Used by infinite scroll component
   */
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) {
      console.log("[useFrontdeskNotifications] loadMore skipped:", { hasMore, isLoadingMore });
      return;
    }

    console.log("[useFrontdeskNotifications] Loading more, current page:", currentPage);
    await fetchNotifications(currentPage + 1, true);
  }, [currentPage, hasMore, isLoadingMore, fetchNotifications]);

  /**
   * Mark a single notification as read
   */
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        // Optimistic update
        setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, readAt: new Date() } : n)));

        // API call
        await notificationsService.markAsRead(notificationId);
      } catch (err) {
        console.error("[useFrontdeskNotifications] Mark as read error:", err);

        // Revert optimistic update on error
        setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, readAt: null } : n)));

        throw err;
      }
    },
    [setNotifications]
  );

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    try {
      // Optimistic update
      const now = new Date();
      setNotifications((prev) => prev.map((n) => ({ ...n, readAt: now })));

      // API call
      await notificationsService.markAllAsRead();
    } catch (err) {
      console.error("[useFrontdeskNotifications] Mark all as read error:", err);

      // Revert optimistic update on error
      setNotifications((prev) => prev.map((n) => ({ ...n, readAt: null })));

      throw err;
    }
  }, [setNotifications]);

  /**
   * Handle notification click - mark as read and navigate using RouteBuilder
   */
  const handleNotificationClick = useCallback(
    async (notification: BackendNotification) => {
      try {
        // Mark as read if unread
        if (!notification.readAt) {
          await markAsRead(notification.id);
        }

        // Navigate based on entity type using modern RouteBuilder
        if (notification.entityType === "ticket" && notification.entityId) {
          // Navigate to specific ticket (default to MY_TICKETS view)
          goToTicket(notification.entityId, TicketView.MY_TICKETS);
        } else if (notification.entityType === "email" && notification.entityId) {
          // Extract accountId and conversationId from metadata
          // Priority: conversationId > threadId > entityId
          const accountId = notification.metadata?.accountId;
          const conversationId =
            notification.metadata?.conversationId || // Option 1: Database conversation ID
            notification.metadata?.threadId || // Option 2: Provider thread ID
            notification.entityId; // Option 3: Fallback to entityId

          console.log("[Notification] Navigating to email conversation:", {
            accountId,
            conversationId,
            conversationIdSource: notification.metadata?.conversationId
              ? "metadata.conversationId"
              : notification.metadata?.threadId
              ? "metadata.threadId"
              : "entityId (fallback)",
            entityId: notification.entityId,
            hasAccountId: !!accountId,
          });

          // Navigate with both accountId and conversationId
          goToEmailConversation(conversationId, accountId);
        } else if (notification.entityType === "conversation" && notification.entityId) {
          // Navigate to DM conversation
          goToDMConversation(notification.entityId);
        } else if (notification.entityType === "message" && notification.entityId) {
          // Navigate to message's conversation (for DMs, the entityId should be the conversation ID)
          goToDMConversation(notification.entityId);
        } else {
          // Default: navigate to frontdesk inbox
          router.push("/frontdesk/inbox");
        }
      } catch (err) {
        console.error("[useFrontdeskNotifications] Click handler error:", err);
      }
    },
    [markAsRead, goToTicket, goToEmailConversation, goToDMConversation, router]
  );

  /**
   * Navigate to FrontDesk main view
   */
  const navigateToFrontdesk = useCallback(() => {
    router.push("/frontdesk/chatwoot?view=dashboard");
  }, [router]);

  /**
   * Retry fetching notifications (for error recovery)
   */
  const retryFetch = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /**
   * Setup WebSocket connection and event handlers
   */
  useEffect(() => {
    // Connect to WebSocket
    notificationsWebSocketService.connect();

    // Handle new notification
    notificationsWebSocketService.onNewNotification((notification) => {
      console.log("[useFrontdeskNotifications] New notification received:", notification);
      setNotifications((prev) => [notification, ...prev]);

      // Show toast notification for EMAIL_RECEIVED type
      if (notification.type === BackendNotificationType.EMAIL_RECEIVED) {
        const senderName = notification.title.replace("New email from ", "") || "Unknown Sender";
        setSnackbar({
          state: true,
          message: `📧 ${notification.title}\n${notification.body || ""}`,
          type: "success",
        });
      }
    });

    // Handle notification read
    notificationsWebSocketService.onNotificationRead(({ id, readAt }) => {
      console.log("[useFrontdeskNotifications] Notification marked as read:", id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, readAt: new Date(readAt) } : n)));
    });

    // Handle unread count change
    notificationsWebSocketService.onUnreadCountChange(({ count }) => {
      console.log("[useFrontdeskNotifications] Unread count changed:", count);
      // Count is automatically calculated by selector, so we don't need to do anything
    });

    // Handle connection state
    notificationsWebSocketService.onConnectionChange((connected) => {
      console.log("[useFrontdeskNotifications] WebSocket connection:", connected ? "Connected" : "Disconnected");
    });

    // Handle errors
    notificationsWebSocketService.onError((error) => {
      console.error("[useFrontdeskNotifications] WebSocket error:", error);
      setError(`WebSocket error: ${error}`);
    });

    // Cleanup on unmount
    return () => {
      notificationsWebSocketService.clearHandlers();
      notificationsWebSocketService.disconnect();
    };
  }, [setNotifications, setError, setSnackbar]);

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    // State
    notifications,
    messageNotifications,
    ticketNotifications,
    counts,
    loading,
    error,

    // Pagination state
    hasMore,
    isLoadingMore,
    currentPage,

    // Actions
    markAsRead,
    markAllAsRead,
    handleNotificationClick,
    navigateToFrontdesk,
    retryFetch,
    fetchNotifications,
    loadMore,

    // Computed
    hasNotifications: counts.total > 0,
    hasMessages: counts.messages > 0,
    hasTickets: counts.tickets > 0,
  };
};
