import { atom } from 'recoil';
import { Channel, Message } from '@/widgets/frontdesk/providers/internal/types/internal.types';

/**
 * Internal chat channels
 */
export const internalChannelsAtom = atom<Channel[]>({
  key: 'frontdesk.internal.channels',
  default: []
});

/**
 * Internal direct messages
 */
export const internalDirectMessagesAtom = atom<Channel[]>({
  key: 'frontdesk.internal.directMessages',
  default: []
});

/**
 * Selected internal conversation (channel or DM)
 */
export const internalSelectedConversationAtom = atom<Channel | null>({
  key: 'frontdesk.internal.selectedConversation',
  default: null
});

/**
 * Internal messages for current conversation
 */
export const internalMessagesAtom = atom<Message[]>({
  key: 'frontdesk.internal.messages',
  default: []
});

/**
 * Internal connection state
 */
export const internalConnectionStateAtom = atom<{
  isConnected: boolean;
  isConnecting: boolean;
  error?: string;
}>({
  key: 'frontdesk.internal.connectionState',
  default: {
    isConnected: false,
    isConnecting: false
  }
});

/**
 * Internal loading states
 */
export const internalLoadingStatesAtom = atom<{
  channels: boolean;
  messages: boolean;
  sending: boolean;
}>({
  key: 'frontdesk.internal.loadingStates',
  default: {
    channels: false,
    messages: false,
    sending: false
  }
});

/**
 * Internal search query
 */
export const internalSearchQueryAtom = atom<string>({
  key: 'frontdesk.internal.searchQuery',
  default: ''
});

/**
 * Internal user presence states
 * Maps user ID to online/offline/away status
 */
export const internalUserPresenceAtom = atom<Record<string, 'online' | 'offline' | 'away'>>({
  key: 'frontdesk.internal.userPresence',
  default: {}
});

/**
 * Internal typing indicators
 * Maps conversation ID to array of user IDs currently typing
 */
export const internalTypingUsersAtom = atom<Record<string, string[]>>({
  key: 'frontdesk.internal.typingUsers',
  default: {}
});