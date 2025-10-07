// Conversation (DMs) Types
export interface Conversation {
  id: string;
  name?: string;
  participantIds: string[];
  participants?: User[];
  lastMessage?: Message;
  lastReadMessageId?: string;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
  isGroup: boolean;
}

export interface Message {
  id: string;
  conversationId?: string;
  channelId?: string;
  content: string;
  senderId: string;
  sender?: User;
  tempId?: string;
  createdAt: string;
  updatedAt: string;
  readBy?: string[];
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

// Channel Types
export interface Channel {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  memberIds?: string[];
  members?: User[];
  lastMessage?: Message;
  createdById: string;
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
}

// API Request Types
// Context types for contextual conversations
export type ConversationContextType = 'QUOTE';

export interface CreateConversationRequest {
  participantIds: string[];
  name?: string;
  contextId?: string;
  contextType?: ConversationContextType;
}

export interface CreateChannelRequest {
  name: string;
  description?: string;
  isPrivate?: boolean;
}

export interface SendMessageRequest {
  content: string;
  tempId?: string;
  attachments?: File[];
}

export interface AddMembersRequest {
  memberIds: string[];
}

// API Response Types
export interface ConversationResponse {
  success: boolean;
  data: Conversation;
  message?: string;
}

export interface ConversationsListResponse {
  success: boolean;
  data: Conversation[];
  total?: number;
  page?: number;
  message?: string;
}

export interface MessagesListResponse {
  success: boolean;
  data: Message[];
  total?: number;
  hasMore?: boolean;
  message?: string;
}

export interface ChannelResponse {
  success: boolean;
  data: Channel;
  message?: string;
}

export interface ChannelsListResponse {
  success: boolean;
  data: Channel[];
  total?: number;
  page?: number;
  message?: string;
}

// WebSocket Event Types
export interface JoinConversationPayload {
  conversationId: string;
}

export interface JoinChannelPayload {
  channelId: string;
}

export interface SendMessagePayload {
  conversationId?: string;
  channelId?: string;
  content: string;
  tempId?: string;
}

export interface TypingPayload {
  conversationId?: string;
  channelId?: string;
  isTyping?: boolean;
}

export interface MarkAsReadPayload {
  conversationId: string;
  lastReadMessageId: string;
}

export interface MessageConfirmedPayload {
  tempId: string;
  message: Message;
}

export interface UserTypingPayload {
  userId: string;
  user?: User;
  conversationId?: string;
  channelId?: string;
  isTyping: boolean;
}

export interface ConversationUpdatedPayload {
  conversation: Conversation;
  updateType: 'new_message' | 'member_added' | 'member_removed' | 'archived' | 'unarchived';
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

// Filter Types
export interface ConversationFilters {
  isArchived?: boolean;
  isGroup?: boolean;
  hasUnread?: boolean;
}

export interface ChannelFilters {
  isPrivate?: boolean;
  isMember?: boolean;
}