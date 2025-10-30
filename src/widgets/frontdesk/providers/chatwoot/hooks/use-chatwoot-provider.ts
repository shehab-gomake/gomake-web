import { useCallback, useMemo, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import { useChatwootConversations } from "./use-chatwoot-conversations";
import {
  chatwootSelectedConversationAtom,
  chatwootSelectedAccountAtom,
  chatwootProfileAtom,
  chatwootProfileLoadingAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";

export const useChatwootProvider = () => {
  const [selectedAccountId, setSelectedAccountId] = useRecoilState(chatwootSelectedAccountAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(chatwootSelectedConversationAtom);
  const profile = useRecoilValue(chatwootProfileAtom);
  const profileLoading = useRecoilValue(chatwootProfileLoadingAtom);

  // Use conversations hook
  const conversations = useChatwootConversations({
    accountId: selectedAccountId,
  });

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

    // Selected conversation
    selectedConversation,
    handleConversationSelect,
    handleBack,
  };
};
