import { useCallback, useMemo, useEffect } from "react";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useChatwootConversations } from "./use-chatwoot-conversations";
import { useChatwootRouter } from "./use-chatwoot-router";
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
  chatwootProfileAtom,
  chatwootProfileLoadingAtom,
  chatwootSelectedInboxIdAtom,
  chatwootConversationsAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";

export const useChatwootProvider = () => {
  const [selectedAccountId, setSelectedAccountId] = useRecoilState(chatwootSelectedAccountAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(chatwootSelectedConversationAtom);
  const [conversationsList, setConversationsList] = useRecoilState(chatwootConversationsAtom);
  const selectedInboxId = useRecoilValue(chatwootSelectedInboxIdAtom);
  const profile = useRecoilValue(chatwootProfileAtom);
  const profileLoading = useRecoilValue(chatwootProfileLoadingAtom);

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

  useEffect(() => {
    if (!selectedAccountId && currentAccountId) {
      setSelectedAccountId(currentAccountId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccountId, currentAccountId]);

  // Clear selected conversation when channel/inbox changes
  // This ensures we don't show a conversation from the previous channel
  useEffect(() => {
    setSelectedConversation(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInboxId]);

  // Auto-select first conversation only when loading completes and no conversation is selected
  // Add a guard to prevent race conditions
  useEffect(() => {
    if (
      selectedInboxId &&
      conversations.conversations.length > 0 &&
      !selectedConversation &&
      !conversations.loading // Wait for loading to complete
    ) {
      const firstConversation = conversations.conversations[0];
      if (firstConversation) {
        setSelectedConversation(firstConversation);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInboxId, conversations.conversations, selectedConversation, conversations.loading]);

  const handleConversationSelect = useCallback(
    (conversation: ChatwootConversation) => {
      setSelectedConversation(conversation);
    },
    [setSelectedConversation]
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
  const updateConversationInList = useCallback((updatedConversation: ChatwootConversation) => {
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
        return prev.map((conv) =>
          conv.id === updatedConversation.id
            ? { ...conv, ...updatedConversation }
            : conv
        );
      }
    });

    // Update selected conversation
    if (selectedConversation?.id === updatedConversation.id) {
      if (!matchesFilter) {
        // If conversation no longer matches filter, deselect it (similar to how it disappears from list)
        setSelectedConversation(null);
      } else {
        setSelectedConversation((prev) => prev ? { ...prev, ...updatedConversation } : prev);
      }
    }
  }, [setConversationsList, selectedConversation, setSelectedConversation, statusFilter]);

  // Handle filter changes - support status, assignee_type, etc.
  const handleFiltersChange = useCallback((newFilters: Partial<ConversationListParams>) => {
    // Handle status filter - the component sends ConversationStatus.ALL when "All" is selected
    // Check if status property exists in the newFilters object (could be undefined or ConversationStatus.ALL)
    if ('status' in newFilters) {
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
