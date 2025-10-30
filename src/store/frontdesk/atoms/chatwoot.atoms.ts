import { atom } from "recoil";

/**
 * Chatwoot State Atoms
 * Manages all state for Chatwoot integration
 */

// Profile
export const chatwootProfileAtom = atom<any | null>({
  key: "frontdesk.chatwoot.profile",
  default: null,
});

export const chatwootProfileLoadingAtom = atom<boolean>({
  key: "frontdesk.chatwoot.profileLoading",
  default: false,
});

// Accounts (from profile)
export const chatwootAccountsAtom = atom<any[]>({
  key: "frontdesk.chatwoot.accounts",
  default: [],
});

export const chatwootSelectedAccountAtom = atom<number | null>({
  key: "frontdesk.chatwoot.selectedAccount",
  default: null,
});

export const chatwootAccountsLoadingAtom = atom<boolean>({
  key: "frontdesk.chatwoot.accountsLoading",
  default: false,
});

// Conversations
export const chatwootConversationsAtom = atom<any[]>({
  key: "frontdesk.chatwoot.conversations",
  default: [],
});

export const chatwootSelectedConversationAtom = atom<any | null>({
  key: "frontdesk.chatwoot.selectedConversation",
  default: null,
});

export const chatwootConversationsLoadingAtom = atom<boolean>({
  key: "frontdesk.chatwoot.conversationsLoading",
  default: false,
});

export const chatwootConversationsErrorAtom = atom<string | null>({
  key: "frontdesk.chatwoot.conversationsError",
  default: null,
});

// Messages
export const chatwootMessagesAtom = atom<any[]>({
  key: "frontdesk.chatwoot.messages",
  default: [],
});

export const chatwootMessagesLoadingAtom = atom<boolean>({
  key: "frontdesk.chatwoot.messagesLoading",
  default: false,
});

export const chatwootMessagesErrorAtom = atom<string | null>({
  key: "frontdesk.chatwoot.messagesError",
  default: null,
});

