/**
 * Unified Provider Interface for FrontDesk
 *
 * This interface standardizes all communication providers (Internal/DM, Email, WhatsApp, Tickets)
 * to enable:
 * - Unified Inbox functionality
 * - Consistent APIs across providers
 * - Type-safe provider implementations
 * - Capability-based feature detection
 *
 * Design Principles:
 * 1. Capability-Based: Providers declare what they support
 * 2. Optional Methods: Not all providers need all features
 * 3. Consistent Naming: Standardized method and property names
 * 4. Type Safety: Enforce interface implementation
 * 5. Extensible: Allow provider-specific features
 */

// ============================================================================
// CORE TYPES
// ============================================================================

export type ProviderId = 'internal' | 'email' | 'whatsapp' | 'tickets' | string;

export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error';

export type MessageType = 'text' | 'file' | 'image' | 'video' | 'audio' | 'system';

export type ConversationType = 'dm' | 'group' | 'channel' | 'ticket' | 'email';

export type UserPresence = 'online' | 'offline' | 'away' | 'busy' | 'unknown';

// ============================================================================
// CAPABILITY DEFINITION
// ============================================================================

/**
 * Declares what features a provider supports
 * Used for capability-based feature detection
 */
export interface ProviderCapabilities {
  // Account Management
  multiAccount: boolean;           // Can connect multiple accounts (e.g., Email)
  authentication: boolean;         // Requires OAuth/auth flow

  // Conversation Features
  createConversation: boolean;     // Can start new conversations
  groupConversations: boolean;     // Supports group/multi-user chats
  archiveConversation: boolean;    // Can archive conversations
  deleteConversation: boolean;     // Can delete conversations
  favoriteConversation: boolean;   // Can favorite/star conversations
  muteConversation: boolean;       // Can mute notifications

  // Message Features
  sendMessage: boolean;            // Can send messages
  editMessage: boolean;            // Can edit sent messages
  deleteMessage: boolean;          // Can delete messages
  replyToMessage: boolean;         // Can reply to specific messages
  forwardMessage: boolean;         // Can forward messages
  reactions: boolean;              // Supports emoji reactions

  // Rich Content
  attachments: boolean;            // Can send/receive files
  images: boolean;                 // Can send/receive images
  videos: boolean;                 // Can send/receive videos
  richText: boolean;               // Supports HTML/markdown formatting

  // Real-time Features
  typing: boolean;                 // Shows typing indicators
  presence: boolean;               // Shows online/offline status
  readReceipts: boolean;           // Shows read/delivered status

  // Organization Features
  labels: boolean;                 // Supports labels/tags
  folders: boolean;                // Supports folder organization
  filters: boolean;                // Supports custom filters

  // Search Features
  globalSearch: boolean;           // Can search across all conversations
  conversationSearch: boolean;     // Can search within a conversation
  fullTextSearch: boolean;         // Supports full-text search

  // Pagination
  infiniteScroll: boolean;         // Supports loading more messages
  pagination: boolean;             // Uses cursor-based pagination
}

// ============================================================================
// CONNECTION STATE
// ============================================================================

export interface ConnectionState {
  status: ConnectionStatus;
  connected: boolean;              // Quick boolean check
  connecting: boolean;             // Currently attempting connection
  error: string | null;            // Error message if status === 'error'
  lastConnectedAt?: Date;
  reconnectAttempts?: number;
}

// ============================================================================
// ACCOUNT (for multi-account providers)
// ============================================================================

export interface Account {
  id: string;
  provider: ProviderId;
  email?: string;
  name: string;
  avatar?: string;
  isConnected: boolean;
  isPrimary?: boolean;
  lastSyncedAt?: Date;
  metadata?: Record<string, any>;
}

export interface AccountManagement {
  accounts: Account[];
  selectedAccount: Account | null;
  loading: boolean;
  error: string | null;

  // Actions
  selectAccount: (accountId: string) => void;
  disconnectAccount: (accountId: string) => Promise<void>;
  refreshAccounts: () => Promise<void>;
  authenticate?: () => Promise<void>;
}

// ============================================================================
// USER & PARTICIPANT
// ============================================================================

export interface User {
  id: string;
  email?: string;
  name: string;
  avatar?: string;
  presence?: UserPresence;
  lastSeen?: Date;
}

export interface Participant extends User {
  role?: 'admin' | 'member' | 'guest';
  joinedAt?: Date;
  isTyping?: boolean;
}

// ============================================================================
// CONVERSATION
// ============================================================================

export interface Conversation {
  id: string;
  type: ConversationType;
  name: string;
  subject?: string;                // For emails/tickets
  avatar?: string;
  snippet?: string;                // Last message preview

  // Participants
  participants: Participant[];
  participantCount?: number;

  // Status
  unreadCount: number;
  isFavorite?: boolean;
  isArchived?: boolean;
  isMuted?: boolean;

  // Timestamps
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt?: Date;

  // Provider-specific
  providerId: ProviderId;
  providerData?: Record<string, any>;

  // Labels/Tags (if supported)
  labels?: string[];
  tags?: string[];
}

export interface ConversationList {
  items: Conversation[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount?: number;

  // Computed values
  unread: Conversation[];
  favorites: Conversation[];
  archived: Conversation[];
}

// ============================================================================
// MESSAGE
// ============================================================================

export interface Message {
  id: string;
  conversationId: string;
  type: MessageType;
  content: string;

  // Sender
  userId: string;
  user: User;

  // Recipients (for emails, group messages)
  to?: string[];
  cc?: string[];
  bcc?: string[];

  // Status
  isRead?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  deliveredAt?: Date;
  readAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt?: Date;

  // Attachments
  attachments?: Attachment[];

  // Threading (for emails, replies)
  replyToId?: string;
  threadId?: string;

  // Reactions
  reactions?: Reaction[];

  // Provider-specific
  providerId: ProviderId;
  providerData?: Record<string, any>;

  // Optimistic updates
  tempId?: string;
  pending?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
}

export interface Reaction {
  emoji: string;
  userId: string;
  createdAt: Date;
}

export interface MessageList {
  items: Message[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  sending: boolean;
}

// ============================================================================
// SEARCH
// ============================================================================

export interface SearchResult<T = Conversation | Message> {
  item: T;
  score: number;
  highlights?: string[];
  context?: string;
}

export interface SearchState {
  query: string;
  loading: boolean;
  error: string | null;
  conversationResults: SearchResult<Conversation>[];
  messageResults: SearchResult<Message>[];
}

// ============================================================================
// PROVIDER ACTIONS
// ============================================================================

export interface ProviderActions {
  // Connection
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  reconnect?: () => Promise<void>;

  // Conversations
  fetchConversations: (options?: FetchOptions) => Promise<void>;
  selectConversation: (conversationId: string) => void;
  deselectConversation: () => void;
  refreshConversations: () => Promise<void>;
  loadMoreConversations?: () => Promise<void>;

  // Conversation Management (capability-based)
  createConversation?: (participants: string[], name?: string) => Promise<string>;
  archiveConversation?: (conversationId: string) => Promise<void>;
  unarchiveConversation?: (conversationId: string) => Promise<void>;
  deleteConversation?: (conversationId: string) => Promise<void>;
  favoriteConversation?: (conversationId: string) => Promise<void>;
  unfavoriteConversation?: (conversationId: string) => Promise<void>;
  muteConversation?: (conversationId: string) => Promise<void>;
  unmuteConversation?: (conversationId: string) => Promise<void>;
  markAsRead?: (conversationId: string) => Promise<void>;
  markAsUnread?: (conversationId: string) => Promise<void>;

  // Messages
  fetchMessages: (conversationId: string, options?: FetchOptions) => Promise<void>;
  loadMoreMessages?: (conversationId: string) => Promise<void>;
  sendMessage?: (conversationId: string, content: string, options?: SendMessageOptions) => Promise<void>;
  editMessage?: (messageId: string, newContent: string) => Promise<void>;
  deleteMessage?: (messageId: string) => Promise<void>;
  replyToMessage?: (messageId: string, content: string) => Promise<void>;
  forwardMessage?: (messageId: string, toConversationId: string) => Promise<void>;
  addReaction?: (messageId: string, emoji: string) => Promise<void>;
  removeReaction?: (messageId: string, emoji: string) => Promise<void>;

  // Typing & Presence (capability-based)
  startTyping?: (conversationId: string) => void;
  stopTyping?: (conversationId: string) => void;
  updatePresence?: (status: UserPresence) => void;

  // Search (capability-based)
  searchConversations?: (query: string) => Promise<void>;
  searchMessages?: (query: string, conversationId?: string) => Promise<void>;
  clearSearch?: () => void;
}

export interface FetchOptions {
  limit?: number;
  offset?: number;
  before?: string;
  after?: string;
  cursor?: string;
  includeArchived?: boolean;
}

export interface SendMessageOptions {
  attachments?: File[];
  replyToId?: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// UNIFIED PROVIDER INTERFACE
// ============================================================================

/**
 * Unified Provider Interface
 * All FrontDesk providers should implement this interface
 */
export interface UnifiedProvider {
  // Identity
  readonly id: ProviderId;
  readonly name: string;
  readonly displayName: string;
  readonly icon: React.ReactNode;
  readonly capabilities: ProviderCapabilities;

  // Connection State
  connection: ConnectionState;

  // Account Management (for multi-account providers)
  accounts?: AccountManagement;

  // Current User
  currentUser: User | null;

  // Conversations
  conversations: ConversationList;
  selectedConversation: Conversation | null;

  // Messages (if supported)
  messages?: MessageList;

  // Search (if supported)
  search?: SearchState;

  // Typing Users (if supported)
  typingUsers?: Record<string, string[]>; // conversationId -> userIds

  // Online Users (if supported)
  onlineUsers?: string[]; // userIds

  // Actions
  actions: ProviderActions;

  // Provider-specific extensions
  extensions?: Record<string, any>;
}

// ============================================================================
// PROVIDER HOOK RESULT
// ============================================================================

/**
 * Standard return type for provider hooks
 * Makes it easy to use providers in components
 */
export interface UseProviderResult {
  // Core provider
  provider: UnifiedProvider;

  // Convenience flags
  isReady: boolean;                // Connected and has loaded data
  isEmpty: boolean;                // No conversations
  hasSelection: boolean;           // Has selected conversation
  canSendMessage: boolean;         // Can send in selected conversation

  // Convenience accessors
  activeConversation: Conversation | null;
  activeMessages: Message[];
  unreadCount: number;

  // Convenience actions
  send: (content: string) => Promise<void>;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}

// ============================================================================
// ADAPTER INTERFACE
// ============================================================================

/**
 * Adapter to wrap legacy provider hooks
 * Allows gradual migration to unified interface
 */
export interface ProviderAdapter<T = any> {
  adapt: (legacyHook: T) => UnifiedProvider;
}