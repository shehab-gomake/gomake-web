import { useCallback, useMemo, useState } from "react";
import { useEmailAccounts } from "./use-email-accounts";
import { useEmailAuth } from "./use-email-auth";
import { useEmailLabels } from "./use-email-labels";
import { useEmailConversations } from "./use-email-conversations";
import { useEmailConversationManager } from "./use-email-conversation-manager";
import { useEmailComposer } from "./use-email-composer";
import { useProviders } from "./use-providers";
import { getGmailQueryFromLabel, combineGmailQueries } from "../utils/query-utils";
import { ticketsService } from "@/services/frontdesk";

export const useEmailProvider = () => {
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

  // Create ticket from email conversation (using simplified providers API)
  const handleCreateTicket = useCallback(
    async (conversationId: string, explicitProviderId?: string) => {
      try {
        let providerId = explicitProviderId;

        // If not explicitly provided, get from providers mapping
        if (!providerId) {
          // Check if providers are still loading
          if (providers.isLoading) {
            throw new Error(
              'Providers are still loading. Please wait a moment and try again.'
            );
          }

          // Check if providers have been loaded
          const hasMappings = Object.keys(providers.mapping).length > 0;
          if (!hasMappings && !providers.error) {
            console.warn('[Email] ⚠️ Providers mapping is empty, attempting to fetch...');
            await providers.fetchProviders();
          }

          // Get selected account
          const account = emailAccounts.accounts.find(
            (acc) => acc.id === emailAccounts.selectedAccountId
          );

          console.log('[Email] Selected account for ticket creation:', {
            accountId: account?.id,
            email: account?.email,
            availableMappings: Object.keys(providers.mapping),
          });

          if (!account) {
            throw new Error('No email account selected. Please select an account first.');
          }

          // Get provider ID from unified providers
          console.log('[Email] Looking up provider for:', account.email);
          console.log('[Email] Available provider mappings:', providers.mapping);

          providerId = providers.getProviderId(account);

          if (!providerId) {
            throw new Error(
              `No provider found for ${account.email}.\n\n` +
              `Available providers:\n${Object.keys(providers.mapping).join('\n')}\n\n` +
              `The backend GET /providers must return an EMAIL provider with metadata.email="${account.email}".`
            );
          }

          console.log('[Email] ✅ Found provider ID:', providerId);
        }

        const payload = {
          providerId: providerId,                      // From GET /providers (simplified!)
          externalConversationId: conversationId,      // threadId from Gmail/Outlook
          priority: "MEDIUM" as const,
        };

        console.log('[Email] Creating ticket with payload:', payload);

        const ticket = await ticketsService.createTicketFromConversation(payload);

        console.log("✅ Ticket created successfully:", ticket);
        alert(`Ticket #${ticket.ticketNumber} created successfully!`);
        return ticket;
      } catch (error) {
        console.error("❌ Failed to create ticket:", error);
        alert(`Failed to create ticket: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
      }
    },
    [emailAccounts.accounts, emailAccounts.selectedAccountId, providers]
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
  };
};
