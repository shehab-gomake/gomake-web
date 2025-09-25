import { atom } from 'recoil';
import { Account, Conversation } from '@/widgets/frontdesk/providers/base/provider.interface';
import { Message } from '@/widgets/frontdesk/providers/internal/types/internal.types';

/**
 * Connected WhatsApp accounts
 */
export const whatsappAccountsAtom = atom<Account[]>({
  key: 'frontdesk.whatsapp.accounts',
  default: []
});

/**
 * Selected WhatsApp account
 */
export const whatsappSelectedAccountAtom = atom<Account | null>({
  key: 'frontdesk.whatsapp.selectedAccount',
  default: null
});

/**
 * WhatsApp conversations for all accounts
 * Keyed by account ID
 */
export const whatsappConversationsAtom = atom<Record<string, Conversation[]>>({
  key: 'frontdesk.whatsapp.conversations',
  default: {}
});

/**
 * Selected WhatsApp conversation
 */
export const whatsappSelectedConversationAtom = atom<Conversation | null>({
  key: 'frontdesk.whatsapp.selectedConversation',
  default: null
});

/**
 * WhatsApp messages for current conversation
 */
export const whatsappMessagesAtom = atom<Message[]>({
  key: 'frontdesk.whatsapp.messages',
  default: []
});

/**
 * WhatsApp connection state
 */
export const whatsappConnectionStateAtom = atom<{
  isConnected: boolean;
  isConnecting: boolean;
  qrCode?: string;
  error?: string;
}>({
  key: 'frontdesk.whatsapp.connectionState',
  default: {
    isConnected: false,
    isConnecting: false
  }
});

/**
 * WhatsApp loading states
 */
export const whatsappLoadingStatesAtom = atom<{
  conversations: boolean;
  messages: boolean;
  sending: boolean;
}>({
  key: 'frontdesk.whatsapp.loadingStates',
  default: {
    conversations: false,
    messages: false,
    sending: false
  }
});

/**
 * WhatsApp search query
 */
export const whatsappSearchQueryAtom = atom<string>({
  key: 'frontdesk.whatsapp.searchQuery',
  default: ''
});

/**
 * WhatsApp contact groups
 */
export const whatsappGroupsAtom = atom<Array<{ id: string; name: string; participants: string[] }>>({
  key: 'frontdesk.whatsapp.groups',
  default: []
});

/**
 * WhatsApp broadcast lists
 */
export const whatsappBroadcastListsAtom = atom<Array<{ id: string; name: string; recipients: string[] }>>({
  key: 'frontdesk.whatsapp.broadcastLists',
  default: []
});