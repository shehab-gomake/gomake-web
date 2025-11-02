import { atom } from "recoil";
import type {
  ChatwootUser,
  ChatwootUserAccount,
} from "@/services/frontdesk/api/chatwoot/types/profile.types";
import type {
  ChatwootConversation,
  ChatwootMessage,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import type {
  ChatwootNotification,
  NotificationListParams,
} from "@/services/frontdesk/api/chatwoot/types/notifications.types";

/**
 * Chatwoot State Atoms
 * Manages all state for Chatwoot integration
 * All atoms are properly typed for type safety
 */

// Profile
export const chatwootProfileAtom = atom<ChatwootUser | null>({
  key: "frontdesk.chatwoot.profile",
  default: null,
});

export const chatwootProfileLoadingAtom = atom<boolean>({
  key: "frontdesk.chatwoot.profileLoading",
  default: false,
});

// Accounts (from profile)
export const chatwootAccountsAtom = atom<ChatwootUserAccount[]>({
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
export const chatwootConversationsAtom = atom<ChatwootConversation[]>({
  key: "frontdesk.chatwoot.conversations",
  default: [],
});

export const chatwootSelectedConversationAtom = atom<ChatwootConversation | null>({
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
export const chatwootMessagesAtom = atom<ChatwootMessage[]>({
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
export const chatwootInboxesAtom = atom<ChatwootInbox[]>({
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

// Notifications
export const chatwootNotificationsAtom = atom<ChatwootNotification[]>({
  key: "frontdesk.chatwoot.notifications",
  default: [],
});

export const chatwootNotificationsLoadingAtom = atom<boolean>({
  key: "frontdesk.chatwoot.notificationsLoading",
  default: false,
});

export const chatwootNotificationsErrorAtom = atom<string | null>({
  key: "frontdesk.chatwoot.notificationsError",
  default: null,
});

export const chatwootNotificationsFiltersAtom = atom<NotificationListParams>({
  key: "frontdesk.chatwoot.notificationsFilters",
  default: {
    page: 1,
    sort_order: "desc",
  },
});

