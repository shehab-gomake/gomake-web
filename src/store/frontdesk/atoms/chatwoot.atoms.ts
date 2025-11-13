import { atom, selector, selectorFamily, atomFamily } from "recoil";
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
import type { Agent } from "@/services/frontdesk/api/chatwoot/types/agents.types";
import type { Team } from "@/services/frontdesk/api/chatwoot/types/teams.types";

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

// Granular loading states for conversations
export interface ChatwootConversationsLoadingState {
  initialLoading: boolean;  // First load - shows full overlay
  filtering: boolean;       // Filter changes - shows subtle indicator
  loadingMore: boolean;     // Pagination - shows at bottom
}

export const chatwootConversationsLoadingAtom = atom<ChatwootConversationsLoadingState>({
  key: "frontdesk.chatwoot.conversationsLoading",
  default: {
    initialLoading: false,
    filtering: false,
    loadingMore: false,
  },
});

// Backward compatibility: Single loading state derived from granular states
export const chatwootConversationsLoadingLegacyAtom = selector<boolean>({
  key: "frontdesk.chatwoot.conversationsLoadingLegacy",
  get: ({ get }) => {
    const loading = get(chatwootConversationsLoadingAtom);
    return loading.initialLoading || loading.filtering || loading.loadingMore;
  },
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

/**
 * View-scoped Conversation Cache
 *
 * Caches conversations per view/filter combination to avoid refetching when
 * navigating between views. Each cache entry is keyed by a stable filter key.
 *
 * Cache Strategy:
 * - Store conversations per view/filter combination
 * - Track timestamp for stale detection (30 second default)
 * - Track pagination state (hasMore, current page)
 * - Invalidate on explicit refresh or account switch
 */
export interface ConversationCacheEntry {
  conversations: ChatwootConversation[];
  timestamp: number;
  hasMore: boolean;
  totalPages: number;
  error: string | null;
}

/**
 * Atom family for caching conversations per filter key
 * Key format: Stable JSON string of filter parameters
 * Example: '{"accountId":1,"inboxId":null,"status":"open","assigneeType":"me"}'
 */
export const chatwootConversationsCacheFamily = atomFamily<ConversationCacheEntry, string>({
  key: "frontdesk.chatwoot.conversationsCache",
  default: {
    conversations: [],
    timestamp: 0,
    hasMore: true,
    totalPages: 0,
    error: null,
  },
});

/**
 * Cache configuration
 */
export const CONVERSATION_CACHE_STALE_TIME = 30000; // 30 seconds

/**
 * Track active cache keys for cleanup/invalidation
 * Used to clear all caches on account switch or manual refresh
 */
export const chatwootCacheKeysAtom = atom<Set<string>>({
  key: "frontdesk.chatwoot.cacheKeys",
  default: new Set(),
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

// Notification Unread Count
// This is updated via WebSocket events or API responses
export const chatwootNotificationUnreadCountAtom = atom<number>({
  key: "frontdesk.chatwoot.notificationUnreadCount",
  default: 0,
});

// Notification Connection State
// Tracks whether we're connected to notification WebSocket events
export const chatwootNotificationConnectionAtom = atom<boolean>({
  key: "frontdesk.chatwoot.notificationConnection",
  default: false,
});

/**
 * Selectors for derived notification state
 */

// Get all unread notifications
export const chatwootUnreadNotificationsSelector = selector<ChatwootNotification[]>({
  key: "frontdesk.chatwoot.unreadNotificationsSelector",
  get: ({ get }) => {
    const notifications = get(chatwootNotificationsAtom);
    return notifications.filter((n) => !n.read_at);
  },
});

// Get notifications by conversation ID
export const chatwootNotificationsByConversationSelector = selectorFamily<
  ChatwootNotification[],
  number
>({
  key: "frontdesk.chatwoot.notificationsByConversationSelector",
  get:
    (conversationId: number) =>
    ({ get }) => {
      const notifications = get(chatwootNotificationsAtom);
      return notifications.filter(
        (n) =>
          n.primary_actor_type === "Conversation" &&
          n.primary_actor_id === conversationId
      );
    },
});

// Get unread notifications by conversation ID
export const chatwootUnreadNotificationsByConversationSelector = selectorFamily<
  ChatwootNotification[],
  number
>({
  key: "frontdesk.chatwoot.unreadNotificationsByConversationSelector",
  get:
    (conversationId: number) =>
    ({ get }) => {
      const notifications = get(chatwootNotificationsAtom);
      return notifications.filter(
        (n) =>
          !n.read_at &&
          n.primary_actor_type === "Conversation" &&
          n.primary_actor_id === conversationId
      );
    },
});

// Count unread notifications (computed from notifications array)
// This serves as a fallback if WebSocket unread count is not available
export const chatwootComputedUnreadCountSelector = selector<number>({
  key: "frontdesk.chatwoot.computedUnreadCountSelector",
  get: ({ get }) => {
    const notifications = get(chatwootNotificationsAtom);
    return notifications.filter((n) => !n.read_at).length;
  },
});

// WebSocket State
export enum ChatwootWebSocketState {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  ERROR = "error",
}

export interface ChatwootWebSocketEvent {
  id: string;
  event: string;
  data: any;
  timestamp: number;
}

export interface ChatwootWebSocketStats {
  eventsReceived: number;
  uptime: number | null;
  reconnectionAttempts: number;
  lastEventAt: number | null;
}

export const chatwootWebSocketStateAtom = atom<ChatwootWebSocketState>({
  key: "frontdesk.chatwoot.webSocketState",
  default: ChatwootWebSocketState.DISCONNECTED,
});

export const chatwootWebSocketEventsAtom = atom<ChatwootWebSocketEvent[]>({
  key: "frontdesk.chatwoot.webSocketEvents",
  default: [],
});

export const chatwootWebSocketErrorAtom = atom<string | null>({
  key: "frontdesk.chatwoot.webSocketError",
  default: null,
});

export const chatwootWebSocketStatsAtom = atom<ChatwootWebSocketStats>({
  key: "frontdesk.chatwoot.webSocketStats",
  default: {
    eventsReceived: 0,
    uptime: null,
    reconnectionAttempts: 0,
    lastEventAt: null,
  },
});

// Agents (Settings)
export const chatwootAgentsAtom = atom<Agent[]>({
  key: "frontdesk.chatwoot.agents",
  default: [],
});

export const chatwootAgentsLoadingAtom = atom<boolean>({
  key: "frontdesk.chatwoot.agentsLoading",
  default: false,
});

export const chatwootAgentsErrorAtom = atom<string | null>({
  key: "frontdesk.chatwoot.agentsError",
  default: null,
});

// Teams (Settings)
export const chatwootTeamsAtom = atom<Team[]>({
  key: "frontdesk.chatwoot.teams",
  default: [],
});

export const chatwootTeamsLoadingAtom = atom<boolean>({
  key: "frontdesk.chatwoot.teamsLoading",
  default: false,
});

export const chatwootTeamsErrorAtom = atom<string | null>({
  key: "frontdesk.chatwoot.teamsError",
  default: null,
});

// Labels (Settings) - Placeholder for future implementation
// Note: Labels service doesn't exist yet in Chatwoot API layer
export interface ChatwootLabel {
  id: number;
  title: string;
  description?: string;
  color: string;
  show_on_sidebar?: boolean;
}

export const chatwootLabelsAtom = atom<ChatwootLabel[]>({
  key: "frontdesk.chatwoot.labels",
  default: [],
});

export const chatwootLabelsLoadingAtom = atom<boolean>({
  key: "frontdesk.chatwoot.labelsLoading",
  default: false,
});

export const chatwootLabelsErrorAtom = atom<string | null>({
  key: "frontdesk.chatwoot.labelsError",
  default: null,
});

// OAuth State (for channel connection flow)
export const chatwootOAuthLoadingAtom = atom<boolean>({
  key: "frontdesk.chatwoot.oauthLoading",
  default: false,
});

export const chatwootOAuthErrorAtom = atom<string | null>({
  key: "frontdesk.chatwoot.oauthError",
  default: null,
});

export const chatwootOAuthProviderAtom = atom<string | null>({
  key: "frontdesk.chatwoot.oauthProvider",
  default: null,
});

