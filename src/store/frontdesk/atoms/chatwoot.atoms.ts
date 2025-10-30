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

// Conversation counts from API
export const chatwootConversationCountsAtom = atom<{
  mine: number;
  unassigned: number;
  all: number;
}>({
  key: "frontdesk.chatwoot.conversationCounts",
  default: { mine: 0, unassigned: 0, all: 0 },
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

// Inboxes (Channels)
export const chatwootInboxesAtom = atom<any[]>({
  key: "frontdesk.chatwoot.inboxes",
  default: [],
});

export const chatwootSelectedInboxIdAtom = atom<number | null>({
  key: "frontdesk.chatwoot.selectedInboxId",
  default: null,
});

export const chatwootInboxesLoadingAtom = atom<boolean>({
  key: "frontdesk.chatwoot.inboxesLoading",
  default: false,
});

export const chatwootInboxesErrorAtom = atom<string | null>({
  key: "frontdesk.chatwoot.inboxesError",
  default: null,
});

