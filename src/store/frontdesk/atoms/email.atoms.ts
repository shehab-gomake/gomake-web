import { atom } from 'recoil';
import { Account, Conversation } from '@/widgets/frontdesk/providers/base/provider.interface';
import { Message } from '@/widgets/frontdesk/providers/base/provider.interface';

/**
 * Connected email accounts
 */
export const emailAccountsAtom = atom<Account[]>({
  key: 'frontdesk.email.accounts',
  default: []
});

/**
 * Selected email account
 */
export const emailSelectedAccountAtom = atom<Account | null>({
  key: 'frontdesk.email.selectedAccount',
  default: null
});

/**
 * Email conversations for all accounts
 * Keyed by account ID
 */
export const emailConversationsAtom = atom<Record<string, Conversation[]>>({
  key: 'frontdesk.email.conversations',
  default: {}
});

/**
 * Selected email conversation
 */
export const emailSelectedConversationAtom = atom<Conversation | null>({
  key: 'frontdesk.email.selectedConversation',
  default: null
});

/**
 * Email messages for current conversation
 */
export const emailMessagesAtom = atom<Message[]>({
  key: 'frontdesk.email.messages',
  default: []
});

/**
 * Email provider connection state
 */
export const emailConnectionStateAtom = atom<{
  isConnected: boolean;
  isConnecting: boolean;
  error?: string;
}>({
  key: 'frontdesk.email.connectionState',
  default: {
    isConnected: false,
    isConnecting: false
  }
});

/**
 * Email loading states
 */
export const emailLoadingStatesAtom = atom<{
  conversations: boolean;
  messages: boolean;
  sending: boolean;
  conversationDetail: boolean; // For fetching single conversation by ID
}>({
  key: 'frontdesk.email.loadingStates',
  default: {
    conversations: false,
    messages: false,
    sending: false,
    conversationDetail: false
  }
});

/**
 * Email search query
 */
export const emailSearchQueryAtom = atom<string>({
  key: 'frontdesk.email.searchQuery',
  default: ''
});

/**
 * Email labels/folders
 */
export const emailLabelsAtom = atom<Array<{ id: string; name: string; color?: string }>>({
  key: 'frontdesk.email.labels',
  default: []
});

/**
 * Selected email label/folder
 */
export const emailSelectedLabelAtom = atom<string | null>({
  key: 'frontdesk.email.selectedLabel',
  default: null
});