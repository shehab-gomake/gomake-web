export interface Message {
  channelId: string;
  content: string;
  userId: string;
  userEmail: string;
  userName: string;
  organizationId: string;
  timestamp: string;
  recipientId?: string;
  messageId?: string;
  metadata?: {
    type: 'text' | 'file' | 'image';
    timestamp?: string;
  };
}

export interface Channel {
  id: string;
  name: string;
  type: 'channel' | 'direct';
  unreadCount?: number;
  lastMessage?: string;
  lastMessageAt?: string;
  members?: string[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: string;
}

export interface PresenceData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  timestamp: string;
  lastSeen?: string;
}

export interface TypingIndicator {
  userId: string;
  userEmail: string;
  userName: string;
  channelId: string;
  isTyping: boolean;
}

export interface MessageReadReceipt {
  messageId: string;
  readBy: string;
  readAt: string;
}

export interface SendMessageData {
  channelId: string;
  content: string;
  recipientId?: string;
  messageId: string;
  metadata?: {
    type: 'text' | 'file' | 'image';
  };
}

export interface JoinChannelData {
  channelId: string;
}

export interface TypingData {
  channelId: string;
}

export interface MarkAsReadData {
  messageId: string;
}

export interface UpdateStatusData {
  status: 'online' | 'away' | 'busy' | 'offline';
}

export interface GetPresenceData {
  userIds?: string[];
}

export interface SocketResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
  messageId?: string;
  channelId?: string;
  onlineUsers?: string[];
  presence?: Record<string, PresenceData>;
}

export interface MessagingState {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  currentUser: User | null;
  channels: Channel[];
  activeChannelId: string | null;
  messages: Record<string, Message[]>;
  unreadCounts: Record<string, number>;
  onlineUsers: string[];
  userPresence: Record<string, PresenceData>;
  typingUsers: Record<string, string[]>;
  isTyping: boolean;
  draft: Record<string, string>;
}