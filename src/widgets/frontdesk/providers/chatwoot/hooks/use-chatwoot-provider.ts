import { useCallback, useMemo, useEffect } from "react";
import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import { useChatwootConversations } from "./use-chatwoot-conversations";
import { useChatwootRouter } from "./use-chatwoot-router";
import {
  ConversationListParams,
  ConversationStatus,
  ConversationAssigneeType,
  ConversationSortBy,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import {
  chatwootSelectedConversationAtom,
  chatwootSelectedAccountAtom,
  chatwootProfileAtom,
  chatwootProfileLoadingAtom,
  chatwootSelectedInboxIdAtom,
  chatwootConversationsAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { ChatwootView } from "@/widgets/frontdesk/routing/types";

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
    const baseFilters: Partial<ConversationListParams> = {
      status: statusFilter === ConversationStatus.ALL ? undefined : statusFilter,
      assignee_type: assigneeFilter, // Use state instead of hardcoded ME
      sort_by: ConversationSortBy.LAST_ACTIVITY_AT_DESC,
      page: 1,
    };

    // If an inbox is selected, add inbox_id filter to show only that inbox's conversations
    if (selectedInboxId) {
      return {
        ...baseFilters,
        inbox_id: selectedInboxId,
      };
    }

    // For "All Conversations" - return base filters without inbox_id
    // This will fetch conversations from all channels/inboxes
    return baseFilters;
  }, [selectedInboxId, statusFilter, assigneeFilter]);

  // Use conversations hook with accountId and filters
  const conversations = useChatwootConversations(currentAccountId, filters);

  useEffect(() => {
    if (!selectedAccountId && currentAccountId) {
      setSelectedAccountId(currentAccountId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccountId, currentAccountId]);

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
    (conversation: any) => {
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

  // Filter helper - similar to Vue: filterByStatus(chatStatus, filterStatus)
  const matchesStatusFilter = useCallback((conversationStatus: string, filterStatus?: ConversationStatus) => {
    if (!filterStatus || filterStatus === ConversationStatus.ALL) return true;
    return conversationStatus === filterStatus;
  }, []);

  // Update conversation in the list after status changes
  // Similar to Vue: commit(types.CHANGE_CONVERSATION_STATUS, { conversationId, status })
  const updateConversationInList = useCallback((updatedConversation: any) => {
    const newStatus = updatedConversation.status;
    const currentFilterStatus = statusFilter === ConversationStatus.ALL ? undefined : statusFilter;
    
    // Check if updated conversation matches current filter
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
  }, [setConversationsList, selectedConversation, setSelectedConversation, statusFilter, matchesStatusFilter]);

  // Handle filter changes - support status, assignee_type, etc.
  const handleFiltersChange = useCallback((newFilters: Partial<ConversationListParams>) => {
    if (newFilters.status !== undefined) {
      setStatusFilter(newFilters.status as ConversationStatus);
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
