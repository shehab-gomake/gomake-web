import { useCallback, useMemo, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import { useChatwootConversations } from "./use-chatwoot-conversations";
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
} from "@/store/frontdesk/atoms/chatwoot.atoms";

export const useChatwootProvider = () => {
  const [selectedAccountId, setSelectedAccountId] = useRecoilState(chatwootSelectedAccountAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(chatwootSelectedConversationAtom);
  const selectedInboxId = useRecoilValue(chatwootSelectedInboxIdAtom);
  const profile = useRecoilValue(chatwootProfileAtom);
  const profileLoading = useRecoilValue(chatwootProfileLoadingAtom);

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

  // Build filters based on selected inbox
  // When an inbox is selected, apply: status=open, assignee_type=me, sort_by=last_activity_at_desc, inbox_id
  // When "All Conversations" (no inbox selected), apply: status=open, assignee_type=me, sort_by=last_activity_at_desc (no inbox_id)
  const filters = useMemo<Partial<ConversationListParams>>(() => {
    const baseFilters: Partial<ConversationListParams> = {
      status: ConversationStatus.OPEN,
      assignee_type: ConversationAssigneeType.ME,
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
  }, [selectedInboxId]);

  // Use conversations hook with accountId and filters
  const conversations = useChatwootConversations(currentAccountId, filters);

  useEffect(() => {
    if (!selectedAccountId && currentAccountId) {
      setSelectedAccountId(currentAccountId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccountId, currentAccountId]);

  // Auto-select first conversation when inbox is selected and conversations are loaded
  useEffect(() => {
    if (selectedInboxId && conversations.conversations.length > 0 && !selectedConversation) {
      // Auto-select the first conversation from the filtered list
      const firstConversation = conversations.conversations[0];
      if (firstConversation) {
        setSelectedConversation(firstConversation);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInboxId, conversations.conversations, selectedConversation]);

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

  // Note: Filters are now automatically computed based on selectedInboxId
  // To change filters, update the selectedInboxId atom or modify this hook to support custom filters
  const handleFiltersChange = useCallback((newFilters: Partial<ConversationListParams>) => {
    // This is a no-op for now since filters are computed from selectedInboxId
    // If custom filters are needed in the future, implement a filter override state
    console.warn("handleFiltersChange: Filters are now computed from selectedInboxId. Use selectInbox instead.");
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

    // Selected conversation
    selectedConversation,
    handleConversationSelect,
    handleBack,
  };
};
