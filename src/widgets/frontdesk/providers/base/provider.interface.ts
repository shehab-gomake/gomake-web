// Base message interface for all providers
export interface Message {
  id: string;
  conversationId: string;
  content: string;
  userId: string;
  userEmail: string;
  userName: string;
  organizationId: string;
  timestamp: string;
  recipientId?: string;
  metadata?: {
    type: 'text' | 'file' | 'image';
    timestamp?: string;
    [key: string]: any;
  };
}

// Base conversation interface
export interface BaseConversation {
  id: string;
  name: string;
  type: 'dm' | 'group';
  unreadCount?: number;
  lastMessage?: string;
  lastMessageAt?: string;
  members?: string[];
}

// Account type for multi-account providers
export interface Account {
  id: string;
  email?: string;
  name: string;
  avatar?: string;
  isConnected: boolean;
  lastSyncedAt?: string;
  provider: 'email' | 'whatsapp' | 'internal';
}

// Provider-specific conversation type
export interface Conversation extends BaseConversation {
  accountId?: string;
  metadata?: Record<string, any>;
}

// Legacy alias for backward compatibility - will be removed
export type Channel = BaseConversation;

// Provider capabilities
export interface ProviderCapabilities {
  multiAccount: boolean;
  directMessages: boolean;
  groupConversations: boolean;
  attachments: boolean;
  reactions: boolean;
  typing: boolean;
  presence: boolean;
  search: boolean;
  archive: boolean;
  labels: boolean;
}

// Provider interface that all providers must implement
export interface IProvider {
  // Identification
  readonly providerId: string;
  readonly providerName: string;
  readonly providerIcon: React.ReactNode;
  readonly capabilities: ProviderCapabilities;
  
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  connectionError?: string;
  
  // Account management (for multi-account providers)
  accounts: Account[];
  selectedAccount: Account | null;
  
  // Conversations
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  conversationsLoading: boolean;
  conversationsError?: string;
  
  // Messages
  messages: Message[];
  messagesLoading: boolean;
  messagesError?: string;
  hasMoreMessages: boolean;
  
  // Unread counts
  totalUnreadCount: number;
  
  // Connection methods
  connect: (account?: Account) => Promise<void>;
  disconnect: (accountId?: string) => Promise<void>;
  addAccount: () => Promise<void>;
  removeAccount: (accountId: string) => Promise<void>;
  selectAccount: (accountId: string) => void;
  
  // Conversation methods
  fetchConversations: (accountId?: string) => Promise<Conversation[]>;
  selectConversation: (conversationId: string) => void;
  markAsRead: (conversationId: string) => Promise<void>;
  archiveConversation: (conversationId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  
  // Message methods
  fetchMessages: (conversationId: string, before?: string) => Promise<Message[]>;
  sendMessage: (conversationId: string, content: string, attachments?: File[]) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  
  // Search and filter
  searchConversations: (query: string) => Promise<Conversation[]>;
  searchMessages: (query: string, conversationId?: string) => Promise<Message[]>;
  
  // Refresh and sync
  refresh: () => Promise<void>;
  syncAccount: (accountId: string) => Promise<void>;
  
  // Event handlers
  onNewMessage?: (message: Message) => void;
  onMessageUpdate?: (message: Message) => void;
  onMessageDelete?: (messageId: string) => void;
  onConversationUpdate?: (conversation: Conversation) => void;
  onConnectionChange?: (isConnected: boolean) => void;
  onTyping?: (conversationId: string, userId: string, isTyping: boolean) => void;
  onPresenceUpdate?: (userId: string, status: 'online' | 'offline' | 'away') => void;
}

// Provider hook return type
export interface UseProviderReturn {
  // All IProvider properties
  provider: IProvider;
  
  // UI state helpers
  isReady: boolean;
  isEmpty: boolean;
  canSendMessage: boolean;
  canLoadMore: boolean;
  
  // Computed values
  unreadConversations: Conversation[];
  recentConversations: Conversation[];
  pinnedConversations: Conversation[];
  
  // UI actions
  handleSendMessage: (content: string) => Promise<void>;
  handleLoadMore: () => Promise<void>;
  handleRefresh: () => Promise<void>;
  handleSearch: (query: string) => void;
  handleFilter: (filter: any) => void;
  handleSort: (sortBy: string) => void;
}