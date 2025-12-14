import { useCallback, useMemo, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useChatwootConversations } from "./use-chatwoot-conversations";
import { useChatwootRouter } from "./use-chatwoot-router";
import { useChatwootProfile } from "./use-chatwoot-profile";
import { useChatwootInboxes } from "./use-chatwoot-inboxes";
import { useChatwootCache } from "./use-chatwoot-cache";
import { useChatwootConversationWebSocket } from "./use-chatwoot-conversation-websocket";
import { useSnackBar } from "@/hooks";
import {
  ChatwootConversation,
  ConversationStatus,
  ConversationAssigneeType,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import type { Message } from "@/services/frontdesk/api/chatwoot/types/messages.types";
import { createLogger } from "@/services/frontdesk/utils/logger";
import {
  chatwootSelectedAccountAtom,
  chatwootSelectedConversationAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";

// New hooks
import { useConversationSelection } from "./use-conversation-selection";
import { useConversationFilters } from "./use-conversation-filters";
import { useConversationUpdates } from "./use-conversation-updates";

const logger = createLogger("useChatwootProvider");

export const useChatwootProvider = () => {
  const [selectedAccountId, setSelectedAccountId] = useRecoilState(
    chatwootSelectedAccountAtom
  );
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    chatwootSelectedConversationAtom
  );

  // Toast notifications
  const { setSnackbarStateValue } = useSnackBar();

  // Core hooks
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    fetchProfile,
  } = useChatwootProfile();
  const {
    inboxes,
    loading: inboxesLoading,
    selectedInbox,
    selectInbox,
  } = useChatwootInboxes();
  const router = useChatwootRouter();

  // Account Management
  const availableAccounts = useMemo(() => profile?.accounts || [], [profile]);

  const currentAccountId = useMemo(() => {
    if (selectedAccountId) return selectedAccountId;
    if (availableAccounts.length > 0) return availableAccounts[0].id;
    return null;
  }, [selectedAccountId, availableAccounts]);

  // Cache Management
  const cache = useChatwootCache(currentAccountId);

  // Filter Management - also get isRouterReady to control when fetching starts
  const { filters, handleFiltersChange, isRouterReady } =
    useConversationFilters();

  // Selection Management
  const { handleConversationSelect, handleBack } = useConversationSelection(
    currentAccountId,
    filters
  );

  // Helper for filters (needed for other hooks)
  const statusFilter = useMemo(() => {
    return (filters.status as ConversationStatus) || ConversationStatus.OPEN;
  }, [filters.status]);

  const assigneeFilter = useMemo(() => {
    return (
      (filters.assignee_type as ConversationAssigneeType) ||
      ConversationAssigneeType.ME
    );
  }, [filters.assignee_type]);

  // Conversation Updates & WebSocket
  const { updateConversationInList } = useConversationUpdates(
    statusFilter,
    assigneeFilter
  );

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "warning" = "success") => {
      try {
        setSnackbarStateValue({ state: true, message, type });
      } catch (err) {
        logger.warn("Failed to show toast notification:", err);
      }
    },
    [setSnackbarStateValue]
  );

  const websocket = useChatwootConversationWebSocket({
    accountId: currentAccountId,
    enabled: true,
    onNewConversation: useCallback(
      (conversation: ChatwootConversation) => {
        if (!conversation?.id) {
          logger.warn("Received invalid conversation in WebSocket event");
          return;
        }
        const senderName = conversation.meta?.sender?.name || "Unknown";
        const inboxChannel = conversation.meta?.channel || "";
        logger.info("New conversation received via WebSocket:", {
          id: conversation.id,
          sender: senderName,
        });
        const channelIcon =
          inboxChannel === "Channel::Email"
            ? "📧"
            : inboxChannel === "Channel::Whatsapp"
            ? "💬"
            : "🔔";
        showToast(
          `${channelIcon} New conversation from ${senderName}`,
          "success"
        );
      },
      [showToast]
    ),
    onNewMessage: useCallback((conversationId: number, message: Message) => {
      logger.debug("New message received via WebSocket:", {
        conversationId,
        messageId: message?.id,
      });
    }, []),
  });

  // Conversations Data - only fetch when router is ready (filters are reliable)
  const conversations = useChatwootConversations(currentAccountId, {
    ...filters,
    enabled: isRouterReady,
    pollingInterval: 20000, // Poll every 20 seconds for real-time updates
  });

  // Auto-select account effect
  useEffect(() => {
    if (!selectedAccountId && currentAccountId) {
      setSelectedAccountId(currentAccountId);
    }
  }, [selectedAccountId, currentAccountId, setSelectedAccountId]);

  const selectAccount = useCallback(
    (accountId: number | null) => {
      setSelectedAccountId(accountId);
      setSelectedConversation(null);
    },
    [setSelectedAccountId, setSelectedConversation]
  );

  return {
    // Account
    accounts: availableAccounts,
    selectedAccountId: currentAccountId,
    selectAccount,

    // Profile
    profile,
    profileLoading,
    profileError,
    fetchProfile,

    // Inboxes
    inboxes,
    inboxesLoading,
    selectedInbox,
    selectInbox,

    // Conversations
    conversations: conversations.conversations,
    conversationsLoading: conversations.loading,
    conversationsError: conversations.error,
    hasMore: conversations.hasMore,
    loadMore: conversations.loadMore,
    refresh: conversations.refresh,

    // Filters
    filters,
    handleFiltersChange,

    // Updates
    updateConversationInList,
    updateConversationStatus: conversations.updateConversationStatus,

    // Selection
    selectedConversation,
    handleConversationSelect,
    handleBack,

    // Router
    router,

    // Cache
    cache: {
      clearAll: cache.clearAllCaches,
      clear: cache.clearCache,
      invalidate: cache.invalidateCaches,
      getStats: cache.getStats,
      count: cache.cacheCount,
    },

    // WebSocket
    websocket: {
      connected: websocket.connected,
      error: websocket.error,
      typing: websocket.typing,
    },
  };
};
