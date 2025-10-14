import type { UnifiedProvider, ProviderCapabilities, ProviderAdapter, Account } from '../unified-provider.interface';

/**
 * Adapter for Email Provider
 * Wraps the existing useEmailProvider hook to conform to UnifiedProvider interface
 */

const EMAIL_CAPABILITIES: ProviderCapabilities = {
  // Account Management
  multiAccount: true,
  authentication: true,

  // Conversation Features
  createConversation: true,       // Can compose new email
  groupConversations: true,       // Email threads
  archiveConversation: true,
  deleteConversation: true,
  favoriteConversation: true,     // Star emails
  muteConversation: false,

  // Message Features
  sendMessage: true,              // Reply/send
  editMessage: false,             // Can't edit sent emails
  deleteMessage: false,
  replyToMessage: true,
  forwardMessage: true,
  reactions: false,

  // Rich Content
  attachments: true,
  images: true,
  videos: true,
  richText: true,                 // HTML emails

  // Real-time Features
  typing: false,
  presence: false,
  readReceipts: false,

  // Organization Features
  labels: true,                   // Gmail labels
  folders: false,
  filters: true,

  // Search Features
  globalSearch: true,
  conversationSearch: false,
  fullTextSearch: true,           // Gmail search

  // Pagination
  infiniteScroll: true,
  pagination: true,
};

// Type for email provider hook (inferred from usage)
interface UseEmailProviderResult {
  // Connection
  isConnected: boolean;
  connectionStatus: string;

  // Accounts
  accounts: any[];
  selectedAccountId: string | null;
  accountsLoading: boolean;
  accountsError: string | undefined;
  selectAccount: (id: string) => void;
  disconnectAccount: (id: string) => Promise<void>;
  refreshAccounts: () => Promise<void>;
  authenticate: (provider: string) => Promise<void>;
  isAuthenticating: boolean;

  // Labels
  labels: any[];
  selectedLabel: any;
  selectedLabelId: string | null;
  selectLabel: (id: string) => void;

  // Conversations
  conversations: any[];
  conversationsLoading: boolean;
  conversationsError: string | undefined;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  starConversation: (id: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  archiveConversation: (id: string) => Promise<void>;

  // Conversation Management
  selectedConversation: any;
  handleConversationSelect: (conversation: any) => void;
  handleBack: () => void;
  handleSendReply: (to: string, subject: string, body: string) => Promise<void>;

  // Composer
  showComposer: boolean;
  handleCompose: () => void;
  handleCloseComposer: () => void;
  handleSendEmail: (draft: any) => Promise<void>;
  isSending: boolean;

  // Search
  searchQuery: string;
  onSearch: (query: string) => void;
}

export class EmailProviderAdapter implements ProviderAdapter<UseEmailProviderResult> {
  adapt(hook: UseEmailProviderResult): UnifiedProvider {
    const accounts: Account[] = hook.accounts.map(acc => ({
      id: acc.id,
      provider: 'email' as const,
      email: acc.email,
      name: acc.name || acc.email,
      avatar: acc.avatar,
      isConnected: true,
      isPrimary: acc.id === hook.selectedAccountId,
      lastSyncedAt: acc.lastSyncedAt ? new Date(acc.lastSyncedAt) : undefined,
    }));

    const selectedAccount = accounts.find(acc => acc.id === hook.selectedAccountId) || null;

    return {
      // Identity
      id: 'email',
      name: 'email',
      displayName: 'Email',
      icon: null, // TODO: Add icon
      capabilities: EMAIL_CAPABILITIES,

      // Connection State
      connection: {
        status: hook.connectionStatus as any,
        connected: hook.isConnected,
        connecting: hook.connectionStatus === 'connecting',
        error: hook.accountsError || null,
      },

      // Account Management
      accounts: {
        accounts,
        selectedAccount,
        loading: hook.accountsLoading,
        error: hook.accountsError || null,
        selectAccount: hook.selectAccount,
        disconnectAccount: hook.disconnectAccount,
        refreshAccounts: hook.refreshAccounts,
        authenticate: async () => {
          await hook.authenticate('google');
        },
      },

      // Current User
      currentUser: selectedAccount ? {
        id: selectedAccount.id,
        email: selectedAccount.email,
        name: selectedAccount.name,
        avatar: selectedAccount.avatar,
      } : null,

      // Conversations
      conversations: {
        items: hook.conversations.map(thread => ({
          id: thread.id,
          type: 'email' as const,
          name: thread.subject || '(No Subject)',
          subject: thread.subject,
          snippet: thread.snippet,
          participants: thread.from ? [{
            id: thread.from.email || thread.from,
            email: thread.from.email || thread.from,
            name: thread.from.name || thread.from.email || thread.from,
          }] : [],
          participantCount: thread.participantEmails?.length || 1,
          unreadCount: thread.unreadCount || (thread.isUnread ? 1 : 0),
          isFavorite: thread.isStarred,
          isArchived: false,
          lastMessageAt: thread.lastMessageDate ? new Date(thread.lastMessageDate) : new Date(thread.date),
          createdAt: new Date(thread.date),
          providerId: 'email',
          labels: thread.labelIds || [],
          providerData: {
            threadId: thread.threadId,
            historyId: thread.historyId,
            labelIds: thread.labelIds,
          },
        })),
        loading: hook.conversationsLoading,
        error: hook.conversationsError || null,
        hasMore: hook.hasMore,
        unread: hook.conversations.filter(t => t.isUnread || t.unreadCount > 0).map(thread => ({
          id: thread.id,
          type: 'email' as const,
          name: thread.subject || '(No Subject)',
          participants: [],
          unreadCount: thread.unreadCount || 1,
          createdAt: new Date(thread.date),
          providerId: 'email',
        })),
        favorites: hook.conversations.filter(t => t.isStarred).map(thread => ({
          id: thread.id,
          type: 'email' as const,
          name: thread.subject || '(No Subject)',
          participants: [],
          unreadCount: 0,
          createdAt: new Date(thread.date),
          providerId: 'email',
        })),
        archived: [],
      },

      selectedConversation: hook.selectedConversation ? {
        id: hook.selectedConversation.id,
        type: 'email' as const,
        name: hook.selectedConversation.subject || '(No Subject)',
        subject: hook.selectedConversation.subject,
        snippet: hook.selectedConversation.snippet,
        participants: [],
        unreadCount: 0,
        createdAt: new Date(hook.selectedConversation.date),
        providerId: 'email',
      } : null,

      // Messages - Email treats each message in a thread differently
      messages: hook.selectedConversation?.messages ? {
        items: hook.selectedConversation.messages.map((msg: any) => ({
          id: msg.id,
          conversationId: hook.selectedConversation.id,
          type: 'text' as const,
          content: msg.body || msg.snippet || '',
          userId: msg.from?.email || 'unknown',
          user: {
            id: msg.from?.email || 'unknown',
            email: msg.from?.email,
            name: msg.from?.name || msg.from?.email || 'Unknown',
            avatar: msg.from?.avatar,
          },
          to: msg.to?.map((t: any) => t.email || t) || [],
          cc: msg.cc?.map((c: any) => c.email || c) || [],
          createdAt: new Date(msg.date),
          providerId: 'email',
          providerData: {
            messageId: msg.messageId,
            labelIds: msg.labelIds,
          },
        })),
        loading: false,
        error: null,
        hasMore: false,
        sending: hook.isSending,
      } : undefined,

      // Search
      search: {
        query: hook.searchQuery,
        loading: false,
        error: null,
        conversationResults: [],
        messageResults: [],
      },

      // Actions
      actions: {
        connect: async () => {
          await hook.authenticate('google');
        },
        disconnect: async () => {
          if (hook.selectedAccountId) {
            await hook.disconnectAccount(hook.selectedAccountId);
          }
        },
        fetchConversations: async () => {
          await hook.refresh();
        },
        selectConversation: (id) => {
          const conversation = hook.conversations.find(c => c.id === id);
          if (conversation) {
            hook.handleConversationSelect(conversation);
          }
        },
        deselectConversation: hook.handleBack,
        refreshConversations: hook.refresh,
        loadMoreConversations: hook.loadMore,
        archiveConversation: hook.archiveConversation,
        deleteConversation: hook.deleteConversation,
        favoriteConversation: hook.starConversation,
        fetchMessages: async (conversationId) => {
          const conversation = hook.conversations.find(c => c.id === conversationId);
          if (conversation) {
            hook.handleConversationSelect(conversation);
          }
        },
        sendMessage: async (_conversationId, content) => {
          if (hook.selectedConversation) {
            // Email uses different send pattern (requires to, subject, body)
            await hook.handleSendReply(
              hook.selectedConversation.from?.email || '',
              `Re: ${hook.selectedConversation.subject || ''}`,
              content
            );
          }
        },
        searchConversations: async (query) => {
          hook.onSearch(query);
        },
        clearSearch: () => {
          hook.onSearch('');
        },
      },

      // Email-specific extensions
      extensions: {
        labels: hook.labels,
        selectedLabel: hook.selectedLabel,
        selectLabel: hook.selectLabel,
        compose: hook.handleCompose,
        closeComposer: hook.handleCloseComposer,
        showComposer: hook.showComposer,
      },
    };
  }
}

// Export singleton instance
export const emailProviderAdapter = new EmailProviderAdapter();