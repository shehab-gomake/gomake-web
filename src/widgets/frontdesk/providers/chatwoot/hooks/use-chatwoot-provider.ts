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
  // When an inbox is selected, apply: status=open, assignee_type=me, sort_by=last_activity_at_desc
  const filters = useMemo<Partial<ConversationListParams>>(() => {
    const baseFilters: Partial<ConversationListParams> = {
      sort_by: ConversationSortBy.LAST_ACTIVITY_AT_DESC,
    };

    // If an inbox is selected, apply the required filters
    if (selectedInboxId) {
      return {
        ...baseFilters,
        inbox_id: selectedInboxId,
        status: ConversationStatus.OPEN,
        assignee_type: ConversationAssigneeType.ME,
        page: 1,
        sort_by: ConversationSortBy.LAST_ACTIVITY_AT_DESC,
      };
    }

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
