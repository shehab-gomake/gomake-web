import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useEmailAccounts } from "./use-email-accounts";
import { useEmailAuth } from "./use-email-auth";
import { useEmailLabels } from "./use-email-labels";
import { useEmailConversations } from "./use-email-conversations";
import { useEmailConversationManager } from "./use-email-conversation-manager";
import { useEmailComposer } from "./use-email-composer";
import { useProviders } from "./use-providers";
import { getGmailQueryFromLabel, combineGmailQueries } from "../utils/query-utils";
import { useCreateTicketModal } from "../../tickets/hooks/use-create-ticket-modal";

export const useEmailProvider = () => {
  const router = useRouter();

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Core email functionality
  const emailAccounts = useEmailAccounts();
  const emailAuth = useEmailAuth();
  const emailLabels = useEmailLabels(emailAccounts.selectedAccountId || undefined);

  // Providers for unified ticketing (simplified API)
  const providers = useProviders();

  // Combine label query with search query
  const labelQuery = emailLabels.selectedLabelId
    ? getGmailQueryFromLabel(emailLabels.selectedLabelId, emailLabels.selectedLabel?.name || "")
    : null;
  const combinedQuery = combineGmailQueries(labelQuery, searchQuery || null);

  const emailConversations = useEmailConversations({
    query: combinedQuery || undefined,
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

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Clear search when account changes
  const handleAccountSelect = useCallback(
    (accountId: string) => {
      setSearchQuery("");
      emailAccounts.selectAccount(accountId);
    },
    [emailAccounts.selectAccount]
  );

  // State to store provider ID and conversation ID for modal
  const [pendingTicketData, setPendingTicketData] = useState<{ providerId: string; conversationId: string } | null>(null);

  // Initialize create ticket modal
  const createTicketModal = useCreateTicketModal({
    providerId: pendingTicketData?.providerId,
    externalConversationId: pendingTicketData?.conversationId,
    onSuccess: (ticket) => {
      console.log("✅ Ticket created successfully:", ticket.ticketNumber);
      setPendingTicketData(null);

      // Navigate to the newly created ticket
      router.push(`/frontdesk/tickets?provider=${ticket.id}`);
    },
    onError: (error) => {
      console.error("❌ Failed to create ticket:", error);
      setPendingTicketData(null);
    },
  });

  // Create ticket from email conversation - opens modal
  const handleCreateTicket = useCallback(
    async (conversationId: string) => {
      try {
        // Check if providers are still loading
        if (providers.isLoading) {
          throw new Error("Providers are still loading. Please wait a moment and try again.");
        }

        // Check if providers have been loaded
        if (providers.providers.length === 0 && !providers.error) {
          console.warn("[Email] ⚠️ No providers loaded, attempting to fetch...");
          await providers.fetchProviders();
        }

        // Get selected account
        const account = emailAccounts.accounts.find((acc) => acc.id === emailAccounts.selectedAccountId);

        console.log("[Email] Selected account for ticket creation:", {
          accountId: account?.id,
          email: account?.email,
          availableProviders: providers.providers.length,
        });

        if (!account) {
          throw new Error("No email account selected. Please select an account first.");
        }

        // Find EMAIL provider that matches the selected account
        console.log("[Email] 🔍 Looking for EMAIL provider for account:", account.email);

        const emailProvider = providers.providers.find(
          (provider) => provider.type === "EMAIL" && provider.metadata?.email?.toLowerCase() === account.email.toLowerCase()
        );

        if (!emailProvider) {
          console.error("[Email] ❌ No EMAIL provider found for:", account.email);
          throw new Error(
            `No EMAIL provider found for ${account.email}.\n\n` +
              `The backend GET /providers must return an EMAIL provider with metadata.email="${account.email}".`
          );
        }

        const providerId = emailProvider.id;
        console.log("[Email] ✅ Found provider ID:", providerId, "for account:", account.email);

        // Set pending data and open modal
        setPendingTicketData({
          providerId,
          conversationId,
        });

        // Open the modal
        createTicketModal.openModal();
      } catch (error) {
        console.error("❌ Failed to prepare ticket creation:", error);
        alert(`Failed to open ticket modal: ${error instanceof Error ? error.message : "Unknown error"}`);
        throw error;
      }
    },
    [emailAccounts.accounts, emailAccounts.selectedAccountId, providers, createTicketModal]
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
    selectAccount: handleAccountSelect,
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
    markAsRead: emailConversations.markAsRead,
    markAsUnread: emailConversations.markAsUnread,
    trashConversation: emailConversations.trashConversation,

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

    // Search
    searchQuery,
    onSearch: handleSearch,

    // Ticket creation
    createTicket: handleCreateTicket,

    // Ticket modal
    ticketModal: createTicketModal,
  };
};
