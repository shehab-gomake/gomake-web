import { useCallback, useMemo, useEffect, useRef } from "react";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useChatwootConversations } from "./use-chatwoot-conversations";
import { useChatwootRouter } from "./use-chatwoot-router";
import { useChatwootProfile } from "./use-chatwoot-profile";
import { useChatwootInboxes } from "./use-chatwoot-inboxes";
import { useChatwootNotifications } from "./use-chatwoot-notifications";
import {
  ConversationListParams,
  ConversationStatus,
  ConversationAssigneeType,
  ChatwootConversation,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { buildConversationFilters, matchesStatusFilter } from "../utils/filter-utils";
import {
  chatwootSelectedConversationAtom,
  chatwootSelectedAccountAtom,
  chatwootSelectedInboxIdAtom,
  chatwootConversationsAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";

export const useChatwootProvider = () => {
  const [selectedAccountId, setSelectedAccountId] = useRecoilState(chatwootSelectedAccountAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(chatwootSelectedConversationAtom);
  const [conversationsList, setConversationsList] = useRecoilState(chatwootConversationsAtom);
  const selectedInboxId = useRecoilValue(chatwootSelectedInboxIdAtom);

  // Use the custom hook to get profile state (prevents multiple API calls)
  const { profile, loading: profileLoading } = useChatwootProfile();

  // Use the custom hook to get inboxes state (prevents multiple API calls from child components)
  const { inboxes, loading: inboxesLoading, selectedInbox, selectInbox } = useChatwootInboxes();

  // Use notifications hook for marking conversation notifications as read
  const { markConversationAsRead } = useChatwootNotifications({ enableWebSocket: false });

  // Initialize router
  const router = useChatwootRouter();

  // Get account from user profile
  const availableAccounts = useMemo(() => {
    return profile?.accounts || [];
  }, [profile]);

  // Auto-select first account if available
  const currentAccountId = useMemo(() => {
    if (selectedAccountId) return selectedAccountId;
    if (availableAccounts.length > 0) {
      return availableAccounts[0].id;
    }
    return null;
  }, [selectedAccountId, availableAccounts]);

  // Filter state - default to OPEN status and ME assignee type
  const [statusFilter, setStatusFilter] = React.useState<ConversationStatus>(ConversationStatus.OPEN);
  const [assigneeFilter, setAssigneeFilter] = React.useState<ConversationAssigneeType>(ConversationAssigneeType.ME);

  // Build filters based on selected inbox, status filter, and assignee filter
  // Supports toggling between Mine/Unassigned/All via assignee filter
  const filters = useMemo<Partial<ConversationListParams>>(() => {
    return buildConversationFilters(selectedInboxId, statusFilter, assigneeFilter);
  }, [selectedInboxId, statusFilter, assigneeFilter]);

  // Use conversations hook with accountId and filters
  const conversations = useChatwootConversations(currentAccountId, filters);

  // Track initialization to prevent cascading state updates
  const lastInboxIdRef = useRef<number | null>(selectedInboxId);

  // Consolidated initialization effect
  // Handles account selection, conversation clearing, and auto-selection in a coordinated manner
  useEffect(() => {
    // 1. Auto-select account if needed
    if (!selectedAccountId && currentAccountId) {
      setSelectedAccountId(currentAccountId);
    }

    // 2. Clear selected conversation when inbox changes (but not on initial mount)
    if (lastInboxIdRef.current !== selectedInboxId) {
      lastInboxIdRef.current = selectedInboxId;
      setSelectedConversation(null);
    }

    // 3. Auto-select first conversation when appropriate
    // Only do this if:
    // - We have an inbox selected
    // - Conversations have loaded
    // - No conversation is currently selected
    // - We have conversations to select from
    if (selectedInboxId && conversations.conversations.length > 0 && !selectedConversation && !conversations.loading) {
      const firstConversation = conversations.conversations[0];
      if (firstConversation) {
        setSelectedConversation(firstConversation);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedAccountId,
    currentAccountId,
    selectedInboxId,
    conversations.conversations,
    selectedConversation,
    conversations.loading,
  ]);

  const handleConversationSelect = useCallback(
    async (conversation: ChatwootConversation) => {
      setSelectedConversation(conversation);

      // Mark all notifications for this conversation as read (dual-call pattern)
      if (conversation.id) {
        try {
          await markConversationAsRead(conversation.id);
        } catch (err) {
          // Error is logged by the notification hook, don't block conversation selection
          console.error('Failed to mark conversation notifications as read:', err);
        }
      }
    },
    [setSelectedConversation, markConversationAsRead]
  );

  const handleBack = useCallback(() => {
    setSelectedConversation(null);
  }, [setSelectedConversation]);

  const selectAccount = useCallback(
    (accountId: number | null) => {
      setSelectedAccountId(accountId);
      setSelectedConversation(null); // Clear selected conversation when switching accounts
    },
    [setSelectedAccountId, setSelectedConversation]
  );

  // Use the utility function for status matching (already imported from utils)

  // Update conversation in the list after status changes
  // Similar to Vue: commit(types.CHANGE_CONVERSATION_STATUS, { conversationId, status })
  const updateConversationInList = useCallback(
    (updatedConversation: ChatwootConversation) => {
      const newStatus = updatedConversation.status;
      const currentFilterStatus = statusFilter === ConversationStatus.ALL ? undefined : statusFilter;

      // Check if updated conversation matches current filter using utility function
      const matchesFilter = matchesStatusFilter(newStatus, currentFilterStatus);

      setConversationsList((prev) => {
        if (!matchesFilter) {
          // Remove conversation from list if it doesn't match filter (similar to Vue filtering)
          return prev.filter((conv) => conv.id !== updatedConversation.id);
        } else {
          // Update conversation in list if it matches filter
          return prev.map((conv) => (conv.id === updatedConversation.id ? { ...conv, ...updatedConversation } : conv));
        }
      });

      // Update selected conversation
      if (selectedConversation?.id === updatedConversation.id) {
        if (!matchesFilter) {
          // If conversation no longer matches filter, deselect it (similar to how it disappears from list)
          setSelectedConversation(null);
        } else {
          setSelectedConversation((prev) => (prev ? { ...prev, ...updatedConversation } : prev));
        }
      }
    },
    [setConversationsList, selectedConversation, setSelectedConversation, statusFilter]
  );

  // Handle filter changes - support status, assignee_type, etc.
  const handleFiltersChange = useCallback((newFilters: Partial<ConversationListParams>) => {
    // Handle status filter - the component sends ConversationStatus.ALL when "All" is selected
    // Check if status property exists in the newFilters object (could be undefined or ConversationStatus.ALL)
    if ("status" in newFilters) {
      // Convert ConversationStatus.ALL or undefined to ConversationStatus.ALL for internal state
      const statusToSet =
        newFilters.status === ConversationStatus.ALL || newFilters.status === undefined
          ? ConversationStatus.ALL
          : (newFilters.status as ConversationStatus);
      setStatusFilter(statusToSet);
    }
    if (newFilters.assignee_type !== undefined) {
      setAssigneeFilter(newFilters.assignee_type);
    }
    // Note: Other filters (sort_by, etc.) can be extended in the future if needed
  }, []);

  return {
    // Account management
    accounts: availableAccounts,
    selectedAccountId: currentAccountId,
    selectAccount,

    // Profile
    profile,
    profileLoading,

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

    // Conversation updates
    updateConversationInList,

    // Selected conversation
    selectedConversation,
    handleConversationSelect,
    handleBack,

    // Router
    router,
  };
};
