// Direct Messages Types based on the API specification
// This replaces the channel-based messaging with conversation-based DM system

export interface Conversation {
  id: string;
  type: 'DM' | 'GROUP_DM';
  participantCount: number;
  lastMessageAt?: string;
  name?: string;
  isActive: boolean;
  unreadCount?: number;
  members?: ConversationMember[];
}

export interface ConversationMember {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  isArchived: boolean;
  isFavorite: boolean;
  lastReadAt?: string;
  lastReadMessageId?: string;
  role: 'member' | 'admin';
}

export interface DMMessage {
  id: string;
  conversationId: string;
  userId: string;
  userEmail: string;
  userName: string;
  content: string;
  createdAt: string;
  isSystem?: boolean;
  editedAt?: string;
  deletedAt?: string;
  tempId?: string; // For optimistic updates
  metadata?: {
    type: 'text' | 'file' | 'image';
    [key: string]: any;
  };
}

// Context types for contextual conversations
export type ConversationContextType = 'QUOTE';

export interface CreateConversationRequest {
  participantIds: string[];
  name?: string;
  contextId?: string;
  contextType?: ConversationContextType;
}

export interface CreateConversationResponse {
  conversation: Conversation;
  members: ConversationMember[];
}

export interface ListConversationsResponse {
  conversations: Conversation[];
  hasMore: boolean;
  total: number;
}

export interface ListMessagesResponse {
  messages: DMMessage[];
  hasMore: boolean;
  total: number;
}

export interface SendMessageRequest {
  content: string;
  metadata?: object;
  tempId?: string;
}

export interface MarkAsReadRequest {
  lastReadMessageId?: string;
  lastReadAt?: string;
}

export interface AddMembersRequest {
  participantIds: string[];
}

// WebSocket Events for Direct Messages
export interface DMSendMessageEvent {
  conversationId: string;
  content: string;
  tempId?: string;
  metadata?: object;
}

export interface DMMessageConfirmedEvent {
  conversationId: string;
  messageId: string;
  content: string;
  userId: string;
  timestamp: string;
  tempId?: string;
  status: 'sent';
}

export interface DMNewMessageEvent {
  conversationId: string;
  messageId: string;
  content: string;
  userId: string;
  timestamp: string;
  tempId?: string;
}

export interface DMUnreadCountUpdatedEvent {
  conversationId: string;
  unreadCount: number;
}

export interface DMTypingEvent {
  conversationId: string;
}

export interface DMUserTypingEvent {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

export interface DMMarkAsReadEvent {
  conversationId: string;
  lastReadMessageId?: string;
  lastReadAt?: string;
}

export interface DMMessageReadEvent {
  conversationId: string;
  userId: string;
  lastReadMessageId?: string;
  lastReadAt: string;
}

export interface JoinConversationEvent {
  conversationId: string;
}

// User presence for DM
export interface DMPresenceData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: string;
  timestamp: string;
}

// State management types
export interface DirectMessagesState {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  currentUser: ConversationMember | null;
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, DMMessage[]>;
  unreadCounts: Record<string, number>;
  onlineUsers: string[];
  userPresence: Record<string, DMPresenceData>;
  typingUsers: Record<string, string[]>;
  isTyping: boolean;
  draft: Record<string, string>;
  isLoading: boolean;
  isLoadingHistory: boolean;
  isSending: boolean;
  error: string | null;
}

// UI Component Props
export interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  currentUserId?: string;
  onSelect: (conversation: Conversation) => void;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export interface MessageListProps {
  messages: DMMessage[];
  currentUserId?: string;
  typingUsers: string[];
  userPresence: Record<string, DMPresenceData>;
  isLoadingHistory?: boolean;
  onLoadMore?: () => void;
  lastReadMessageId?: string;
  onScrollToUnread?: () => void;
}

export interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isSending?: boolean;
}

export interface UserSelectorProps {
  users: ConversationMember[];
  onSelect?: (user: ConversationMember) => void;
  onConfirm?: (users: ConversationMember[]) => void;
  onSearch?: (query: string) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

