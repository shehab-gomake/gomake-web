import { atom } from 'recoil';
import { Conversation, DMMessage } from '@/widgets/frontdesk/providers/internal/types/direct-messages.types';

/**
 * Internal conversations (direct messages and group chats)
 */
export const internalChannelsAtom = atom<Conversation[]>({
  key: 'frontdesk.internal.channels',
  default: []
});

/**
 * Internal direct messages (alias for conversations)
 */
export const internalDirectMessagesAtom = atom<Conversation[]>({
  key: 'frontdesk.internal.directMessages',
  default: []
});

/**
 * Selected internal conversation
 */
export const internalSelectedConversationAtom = atom<Conversation | null>({
  key: 'frontdesk.internal.selectedConversation',
  default: null
});

/**
 * Selected Direct Messages conversation
 */
export const internalSelectedDMConversationAtom = atom<Conversation | null>({
  key: 'frontdesk.internal.selectedDMConversation',
  default: null
});

/**
 * Internal messages for current conversation
 */
export const internalMessagesAtom = atom<DMMessage[]>({
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