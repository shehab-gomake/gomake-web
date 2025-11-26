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

// ============================================================================
// FETCH LOCK SYSTEM
// Centralized deduplication for API calls across all component instances
// ============================================================================

/**
 * Fetch Lock Entry
 * Tracks individual lock with timeout for deadlock prevention
 */
export interface FetchLockEntry {
  acquiredAt: number;
  timeout: number; // Lock timeout in milliseconds
}

/**
 * Centralized fetch lock atom
 * Prevents duplicate API calls across all component instances
 * Keys are resource identifiers (e.g., "profile", "conversations:filter-key", "labels")
 */
export const chatwootFetchLocksAtom = atom<Map<string, FetchLockEntry>>({
  key: "frontdesk.chatwoot.fetchLocks",
  default: new Map(),
});

/**
 * Lock statistics for debugging
 */
export interface FetchLockStats {
  totalLocks: number;
  activeLocks: string[];
  expiredLocks: number;
  lastCleanup: number;
}

export const chatwootFetchLockStatsAtom = atom<FetchLockStats>({
  key: "frontdesk.chatwoot.fetchLockStats",
  default: {
    totalLocks: 0,
    activeLocks: [],
    expiredLocks: 0,
    lastCleanup: 0,
  },
});

/**
 * Default lock timeout (30 seconds) - prevents deadlocks
 */
export const FETCH_LOCK_TIMEOUT = 30000;

// ============================================================================
// PROFILE STATE
// ============================================================================

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
 * - Track lastAccessed for LRU eviction
 * - Invalidate on explicit refresh or account switch
 */
export interface ConversationCacheEntry {
  conversations: ChatwootConversation[];
  timestamp: number;
  lastAccessed: number; // LRU: Track when cache was last read
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
    lastAccessed: 0,
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
 * Cache configuration atom
 * Allows runtime configuration of cache behavior
 */
export interface CacheConfig {
  /** Maximum number of cache entries before LRU eviction (default: 50) */
  maxSize: number;
  /** Stale time in milliseconds (default: 30000) */
  staleTime: number;
  /** Enable LRU eviction (default: true) */
  enableLRU: boolean;
  /** Eviction threshold - trigger eviction when size exceeds this (default: 40) */
  evictionThreshold: number;
}

export const chatwootCacheConfigAtom = atom<CacheConfig>({
  key: "frontdesk.chatwoot.cacheConfig",
  default: {
    maxSize: 50,
    staleTime: CONVERSATION_CACHE_STALE_TIME,
    enableLRU: true,
    evictionThreshold: 40,
  },
});

/**
 * Track active cache keys for cleanup/invalidation
 * Used to clear all caches on account switch or manual refresh
 */
export const chatwootCacheKeysAtom = atom<Set<string>>({
  key: "frontdesk.chatwoot.cacheKeys",
  default: new Set(),
});

/**
 * Cache statistics for monitoring
 */
export interface CacheStatistics {
  totalEntries: number;
  totalConversations: number;
  oldestEntry: number | null;
  newestEntry: number | null;
  hitCount: number;
  missCount: number;
  evictionCount: number;
  lastEviction: number | null;
}

export const chatwootCacheStatsAtom = atom<CacheStatistics>({
  key: "frontdesk.chatwoot.cacheStats",
  default: {
    totalEntries: 0,
    totalConversations: 0,
    oldestEntry: null,
    newestEntry: null,
    hitCount: 0,
    missCount: 0,
    evictionCount: 0,
    lastEviction: null,
  },
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

// Notification meta (count and unread_count from API)
export const chatwootNotificationMetaAtom = atom<{
  count: number;
  unread_count: number;
}>({
  key: "frontdesk.chatwoot.notificationMeta",
  default: { count: 0, unread_count: 0 },
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

// Inbox Agents Mapping
// Maps inboxId to list of agents assigned to that inbox
export const chatwootInboxAgentsMapAtom = atom<Record<number, Agent[]>>({
  key: "frontdesk.chatwoot.inboxAgentsMap",
  default: {},
});

export const chatwootInboxAgentsLoadingAtom = atom<boolean>({
  key: "frontdesk.chatwoot.inboxAgentsLoading",
  default: false,
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

/**
 * Navigation Count Selectors
 * Efficient selectors for computing navigation bar counts
 * These selectors compute derived data from conversations and cache results
 */

/**
 * My Inbox Count Selector
 * Counts open conversations assigned to the current user
 */
export const myInboxCountSelector = selector<number>({
  key: "frontdesk.chatwoot.myInboxCount",
  get: ({ get }) => {
    const conversations = get(chatwootConversationsAtom);
    const profile = get(chatwootProfileAtom);
    const currentUserId = profile?.id;

    if (!currentUserId) {
      return 0;
    }

    return conversations.filter(
      (conv) =>
        conv.status === "open" &&
        conv.meta?.assignee?.id === currentUserId
    ).length;
  },
});

/**
 * Mentions Count Selector
 * Counts conversations with unread messages (proxy for mentions)
 * Note: Chatwoot API doesn't have a dedicated mentions filter yet,
 * so we use unread_count > 0 as a proxy
 */
export const mentionsCountSelector = selector<number>({
  key: "frontdesk.chatwoot.mentionsCount",
  get: ({ get }) => {
    const conversations = get(chatwootConversationsAtom);

    return conversations.filter(
      (conv) => (conv.unread_count || 0) > 0 && conv.meta?.sender?.name
    ).length;
  },
});

/**
 * Unattended Count Selector
 * Counts open conversations that are unassigned
 */
export const unattendedCountSelector = selector<number>({
  key: "frontdesk.chatwoot.unattendedCount",
  get: ({ get }) => {
    const conversations = get(chatwootConversationsAtom);

    return conversations.filter(
      (conv) =>
        conv.status === "open" &&
        (!conv.meta?.assignee || conv.meta.assignee.id === null || conv.meta.assignee.id === undefined)
    ).length;
  },
});

// ============================================================================
// UNIFIED REQUEST STATE ATOMS
// ============================================================================

import {
  RequestState,
  PaginatedRequestState,
  createRequestState,
  createPaginatedRequestState,
  DEFAULT_TTL,
} from "@/store/frontdesk/types/request-state.types";

/**
 * Unified Profile State
 * Combines profile data with loading/error states
 */
export const chatwootProfileRequestAtom = atom<RequestState<ChatwootUser>>({
  key: "frontdesk.chatwoot.profile.request",
  default: createRequestState<ChatwootUser>(DEFAULT_TTL.STANDARD),
});

/**
 * Backward compatibility selector: Extract profile from RequestState
 */
export const chatwootProfileFromRequestSelector = selector<ChatwootUser | null>({
  key: "frontdesk.chatwoot.profile.fromRequest",
  get: ({ get }) => get(chatwootProfileRequestAtom).data,
});

/**
 * Unified Inboxes State
 * Combines inboxes data with loading/error states
 */
export const chatwootInboxesRequestAtom = atom<RequestState<ChatwootInbox[]>>({
  key: "frontdesk.chatwoot.inboxes.request",
  default: createRequestState<ChatwootInbox[]>(DEFAULT_TTL.STANDARD),
});

/**
 * Backward compatibility selector: Extract inboxes from RequestState
 */
export const chatwootInboxesFromRequestSelector = selector<ChatwootInbox[]>({
  key: "frontdesk.chatwoot.inboxes.fromRequest",
  get: ({ get }) => get(chatwootInboxesRequestAtom).data || [],
});

/**
 * Unified Messages State
 * Combines messages data with loading/error states
 */
export const chatwootMessagesRequestAtom = atom<RequestState<ChatwootMessage[]>>({
  key: "frontdesk.chatwoot.messages.request",
  default: createRequestState<ChatwootMessage[]>(DEFAULT_TTL.SHORT),
});

/**
 * Backward compatibility selector: Extract messages from RequestState
 */
export const chatwootMessagesFromRequestSelector = selector<ChatwootMessage[]>({
  key: "frontdesk.chatwoot.messages.fromRequest",
  get: ({ get }) => get(chatwootMessagesRequestAtom).data || [],
});

/**
 * Unified Notifications State
 * Paginated notifications with loading/error states
 */
export const chatwootNotificationsRequestAtom = atom<PaginatedRequestState<ChatwootNotification>>({
  key: "frontdesk.chatwoot.notifications.request",
  default: createPaginatedRequestState<ChatwootNotification>(DEFAULT_TTL.SHORT),
});

/**
 * Backward compatibility selector: Extract notifications from RequestState
 */
export const chatwootNotificationsFromRequestSelector = selector<ChatwootNotification[]>({
  key: "frontdesk.chatwoot.notifications.fromRequest",
  get: ({ get }) => get(chatwootNotificationsRequestAtom).data || [],
});

/**
 * Unified Agents State
 */
export const chatwootAgentsRequestAtom = atom<RequestState<Agent[]>>({
  key: "frontdesk.chatwoot.agents.request",
  default: createRequestState<Agent[]>(DEFAULT_TTL.STANDARD),
});

/**
 * Unified Teams State
 */
export const chatwootTeamsRequestAtom = atom<RequestState<Team[]>>({
  key: "frontdesk.chatwoot.teams.request",
  default: createRequestState<Team[]>(DEFAULT_TTL.STANDARD),
});

/**
 * Unified Labels State
 */
export const chatwootLabelsRequestAtom = atom<RequestState<ChatwootLabel[]>>({
  key: "frontdesk.chatwoot.labels.request",
  default: createRequestState<ChatwootLabel[]>(DEFAULT_TTL.LONG),
});

// ============================================================================
// REQUEST STATE HELPER SELECTORS
// ============================================================================

/**
 * Combined loading state selector
 * Returns true if any primary resource is loading
 */
export const chatwootAnyLoadingSelector = selector<boolean>({
  key: "frontdesk.chatwoot.anyLoading",
  get: ({ get }) => {
    return (
      get(chatwootProfileRequestAtom).loading ||
      get(chatwootInboxesRequestAtom).loading ||
      get(chatwootConversationsLoadingAtom).initialLoading ||
      get(chatwootConversationsLoadingAtom).filtering
    );
  },
});

/**
 * Combined error state selector
 * Returns first error found, if any
 */
export const chatwootFirstErrorSelector = selector<string | null>({
  key: "frontdesk.chatwoot.firstError",
  get: ({ get }) => {
    return (
      get(chatwootProfileRequestAtom).error ||
      get(chatwootInboxesRequestAtom).error ||
      get(chatwootConversationsErrorAtom) ||
      null
    );
  },
});

/**
 * Profile ready selector
 * Returns true when profile is loaded and valid
 */
export const chatwootProfileReadySelector = selector<boolean>({
  key: "frontdesk.chatwoot.profileReady",
  get: ({ get }) => {
    const profileState = get(chatwootProfileRequestAtom);
    return profileState.data !== null && !profileState.loading && !profileState.error;
  },
});

/**
 * Selected inbox selector
 * Returns the currently selected inbox object
 */
export const chatwootSelectedInboxSelector = selector<ChatwootInbox | null>({
  key: "frontdesk.chatwoot.selectedInbox",
  get: ({ get }) => {
    const selectedId = get(chatwootSelectedInboxIdAtom);
    if (!selectedId) return null;

    const inboxesState = get(chatwootInboxesRequestAtom);
    return inboxesState.data?.find((inbox) => inbox.id === selectedId) || null;
  },
});
