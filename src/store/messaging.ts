import { atom } from 'recoil';
import {
  Message,
  Channel,
  User,
  PresenceData,
  MessagingState
} from '@/widgets/frontdesk/providers/internal/types';

// Connection state
export const messagingConnectionState = atom<'connecting' | 'connected' | 'disconnected' | 'error'>({
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
    { id: 'general', name: 'General', type: 'channel', unreadCount: 0 },
    { id: 'development', name: 'Development', type: 'channel', unreadCount: 0 },
    { id: 'design', name: 'Design', type: 'channel', unreadCount: 0 }
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