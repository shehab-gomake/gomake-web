import { useCallback, useMemo } from "react";
import { useEmailAccounts } from "./use-email-accounts";
import { useEmailAuth } from "./use-email-auth";
import { useEmailLabels } from "./use-email-labels";
import { useEmailConversations } from "./use-email-conversations";
import { useEmailConversationManager } from "./use-email-conversation-manager";
import { useEmailComposer } from "./use-email-composer";

export const useEmailProvider = () => {
  // Core email functionality
  const emailAccounts = useEmailAccounts();
  const emailAuth = useEmailAuth();
  const emailLabels = useEmailLabels(emailAccounts.selectedAccountId || undefined);
  const emailConversations = useEmailConversations({
    folder: emailLabels.selectedLabelId || undefined,
  });

  // Component management
  const conversationManager = useEmailConversationManager({
    selectedAccountId: emailAccounts.selectedAccountId,
    onRefresh: emailConversations.refresh,
  });

  const composer = useEmailComposer({
    selectedAccountId: emailAccounts.selectedAccountId,
    onRefresh: emailConversations.refresh,
  });

  // Connection status
  const connectionStatus = useMemo(() => {
    if (emailAccounts.accounts.length === 0) return "disconnected";
    if (emailAccounts.loading) return "connecting";
    if (emailAccounts.error) return "error";
    return "connected";
  }, [emailAccounts.accounts.length, emailAccounts.loading, emailAccounts.error]);

  const isConnected = connectionStatus === "connected";

  // Handlers
  const handleAuthenticate = useCallback(
    async (provider: string) => {
      try {
        await emailAuth.authenticate(provider);
        await emailAccounts.fetchAccounts();
      } catch (error) {
        console.error("Auth failed:", error);
        throw error;
      }
    },
    [emailAuth.authenticate, emailAccounts.fetchAccounts]
  );

  const handleReplyWithComposer = useCallback(
    async (conversation: any) => {
      const draft = await conversationManager.handleReply(conversation);
      if (draft) {
        composer.openComposerWithDraft(draft);
      }
    },
    [conversationManager.handleReply, composer.openComposerWithDraft]
  );

  return {
    // Connection state
    isConnected,
    connectionStatus,

    // Accounts
    accounts: emailAccounts.accounts,
    selectedAccountId: emailAccounts.selectedAccountId,
    accountsLoading: emailAccounts.loading,
    accountsError: emailAccounts.error,
    selectAccount: emailAccounts.selectAccount,
    disconnectAccount: emailAccounts.disconnectAccount,
    refreshAccounts: emailAccounts.fetchAccounts,

    // Auth
    authenticate: handleAuthenticate,
    isAuthenticating: emailAuth.isAuthenticating,
    authError: emailAuth.error,

    // Labels
    labels: emailLabels.labels,
    systemLabels: emailLabels.systemLabels,
    userLabels: emailLabels.userLabels,
    selectedLabel: emailLabels.selectedLabel,
    selectedLabelId: emailLabels.selectedLabelId,
    labelsLoading: emailLabels.loading,
    labelsError: emailLabels.error,
    selectLabel: emailLabels.selectLabel,

    // Conversations
    conversations: emailConversations.conversations,
    conversationsLoading: emailConversations.loading,
    conversationsError: emailConversations.error,
    hasMore: emailConversations.hasMore,
    loadMore: emailConversations.loadMore,
    refresh: emailConversations.refresh,
    starConversation: emailConversations.starConversation,
    deleteConversation: emailConversations.deleteConversation,
    archiveConversation: emailConversations.archiveConversation,

    // Conversation management
    selectedConversation: conversationManager.selectedConversation,
    handleConversationSelect: conversationManager.handleConversationSelect,
    handleBack: conversationManager.handleBack,
    handleSendReply: conversationManager.handleSendReply,

    // Composer
    showComposer: composer.showComposer,
    composerDraft: composer.composerDraft,
    isSending: composer.isSending,
    handleCompose: composer.handleCompose,
    handleCloseComposer: composer.handleCloseComposer,
    handleSendEmail: composer.handleSendEmail,
    handleReplyWithComposer,
  };
};
