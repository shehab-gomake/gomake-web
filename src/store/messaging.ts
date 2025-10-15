import { atom } from 'recoil';
import {
  DMMessage,
  Conversation,
  ConversationMember,
  DMPresenceData,
} from '@/widgets/frontdesk/providers/internal/types';

// Type aliases for compatibility
export type Message = DMMessage;
export type Channel = Conversation;
export type User = ConversationMember;
export type PresenceData = DMPresenceData;

// Define MessagingState since it was removed from legacy types
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

// Connection state
export const messagingConnectionState = atom<any>({
  key: 'messagingConnectionState',
  default: 'disconnected'
});

export const messagingConnectedState = atom<boolean>({
  key: 'messagingConnectedState',
  default: false
});

// Current user
export const messagingCurrentUserState = atom<User | null>({
  key: 'messagingCurrentUserState',
  default: null
});

// Channels
export const messagingChannelsState = atom<Channel[]>({
  key: 'messagingChannelsState',
  default: [
    { id: 'general', name: 'General', type: 'GROUP_DM', participantCount: 1, isActive: true, unreadCount: 0 },
    { id: 'development', name: 'Development', type: 'GROUP_DM', participantCount: 1, isActive: true, unreadCount: 0 },
    { id: 'design', name: 'Design', type: 'GROUP_DM', participantCount: 1, isActive: true, unreadCount: 0 }
  ]
});

export const messagingActiveChannelIdState = atom<string | null>({
  key: 'messagingActiveChannelIdState',
  default: 'general'
});

// Messages grouped by channel
export const messagingMessagesState = atom<Record<string, Message[]>>({
  key: 'messagingMessagesState',
  default: {}
});

// Unread message counts per channel
export const messagingUnreadCountsState = atom<Record<string, number>>({
  key: 'messagingUnreadCountsState',
  default: {}
});

// Online users
export const messagingOnlineUsersState = atom<string[]>({
  key: 'messagingOnlineUsersState',
  default: []
});

// User presence data
export const messagingUserPresenceState = atom<Record<string, PresenceData>>({
  key: 'messagingUserPresenceState',
  default: {}
});

// Typing indicators grouped by channel
export const messagingTypingUsersState = atom<Record<string, string[]>>({
  key: 'messagingTypingUsersState',
  default: {}
});

// UI state
export const messagingIsTypingState = atom<boolean>({
  key: 'messagingIsTypingState',
  default: false
});

// Draft messages per channel
export const messagingDraftState = atom<Record<string, string>>({
  key: 'messagingDraftState',
  default: {}
});

// Sidebar open state for mobile
export const messagingIsSidebarOpenState = atom<boolean>({
  key: 'messagingIsSidebarOpenState',
  default: true
});

// Error state
export const messagingErrorState = atom<string | null>({
  key: 'messagingErrorState',
  default: null
});

// Loading states
export const messagingIsLoadingState = atom<boolean>({
  key: 'messagingIsLoadingState',
  default: false
});

export const messagingIsSendingState = atom<boolean>({
  key: 'messagingIsSendingState',
  default: false
});

export const messagingIsLoadingHistoryState = atom<boolean>({
  key: 'messagingIsLoadingHistoryState',
  default: false
});