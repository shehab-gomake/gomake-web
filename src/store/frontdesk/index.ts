/**
 * FrontDesk Store
 *
 * Central export for all FrontDesk Recoil state management.
 */

// ============================================================================
// NAVIGATION
// ============================================================================

export {
  selectedSectionAtom,
  selectedChannelAtom,
  selectedConversationIdAtom,
  selectedAccountsAtom,
  navigationHistoryAtom,
  navigationIndexAtom,
  sidebarCollapsedAtom,
  listPanelCollapsedAtom,
} from "./atoms/navigation.atoms";

// ============================================================================
// UNIFIED
// ============================================================================

export {
  unifiedConversationsAtom,
  unifiedSelectedConversationAtom,
  unifiedFiltersAtom,
  unifiedSortOptionsAtom,
  unifiedSearchQueryAtom,
  unifiedLoadingAtom,
  unifiedErrorAtom,
  unifiedLastRefreshAtom,
} from "./atoms/unified.atoms";

// ============================================================================
// EMAIL
// ============================================================================

export {
  emailAccountsAtom,
  emailSelectedAccountAtom,
  emailConversationsAtom,
  emailSelectedConversationAtom,
  emailMessagesAtom,
  emailConnectionStateAtom,
  emailLoadingStatesAtom,
  emailSearchQueryAtom,
  emailLabelsAtom,
  emailSelectedLabelAtom,
} from "./atoms/email.atoms";

// ============================================================================
// WHATSAPP
// ============================================================================

export {
  whatsappAccountsAtom,
  whatsappSelectedAccountAtom,
  whatsappConversationsAtom,
  whatsappSelectedConversationAtom,
  whatsappMessagesAtom,
  whatsappConnectionStateAtom,
  whatsappLoadingStatesAtom,
  whatsappSearchQueryAtom,
  whatsappGroupsAtom,
  whatsappBroadcastListsAtom,
} from "./atoms/whatsapp.atoms";

// ============================================================================
// INTERNAL (DMs)
// ============================================================================

export {
  internalChannelsAtom,
  internalDirectMessagesAtom,
  internalSelectedConversationAtom,
  internalSelectedDMConversationAtom,
  internalMessagesAtom,
  internalConnectionStateAtom,
  internalLoadingStatesAtom,
  internalSearchQueryAtom,
  internalUserPresenceAtom,
  internalTypingUsersAtom,
} from "./atoms/internal.atoms";

// ============================================================================
// CHATWOOT - MAIN ATOMS
// ============================================================================

export {
  // Profile
  chatwootProfileAtom,
  chatwootProfileLoadingAtom,

  // Accounts
  chatwootAccountsAtom,
  chatwootSelectedAccountAtom,
  chatwootAccountsLoadingAtom,

  // Conversations
  chatwootConversationsAtom,
  chatwootSelectedConversationAtom,
  chatwootConversationsLoadingAtom,
  chatwootConversationsErrorAtom,
  chatwootConversationCountsAtom,
  chatwootConversationsCacheFamily,
  chatwootCacheKeysAtom,
  chatwootCacheConfigAtom,
  chatwootCacheStatsAtom,
  CONVERSATION_CACHE_STALE_TIME,

  // Messages
  chatwootMessagesAtom,
  chatwootMessagesLoadingAtom,
  chatwootMessagesErrorAtom,

  // Inboxes
  chatwootInboxesAtom,
  chatwootSelectedInboxIdAtom,
  chatwootInboxesLoadingAtom,
  chatwootInboxesErrorAtom,

  // Notifications
  chatwootNotificationsAtom,
  chatwootNotificationsLoadingAtom,
  chatwootNotificationsErrorAtom,
  chatwootNotificationsFiltersAtom,
  chatwootNotificationUnreadCountAtom,
  chatwootNotificationMetaAtom,
  chatwootNotificationConnectionAtom,
  chatwootUnreadNotificationsSelector,
  chatwootNotificationsByConversationSelector,
  chatwootUnreadNotificationsByConversationSelector,
  chatwootComputedUnreadCountSelector,

  // Agents
  chatwootAgentsAtom,
  chatwootAgentsLoadingAtom,
  chatwootAgentsErrorAtom,
  chatwootInboxAgentsMapAtom,
  chatwootInboxAgentsLoadingAtom,

  // Teams
  chatwootTeamsAtom,
  chatwootTeamsLoadingAtom,
  chatwootTeamsErrorAtom,

  // Labels
  chatwootLabelsAtom,
  chatwootLabelsLoadingAtom,
  chatwootLabelsErrorAtom,

  // OAuth
  chatwootOAuthLoadingAtom,
  chatwootOAuthErrorAtom,
  chatwootOAuthProviderAtom,

  // WebSocket
  ChatwootWebSocketState,
  chatwootWebSocketStateAtom,
  chatwootWebSocketEventsAtom,
  chatwootWebSocketErrorAtom,
  chatwootWebSocketStatsAtom,

  // Fetch Locks
  chatwootFetchLocksAtom,
  chatwootFetchLockStatsAtom,
  FETCH_LOCK_TIMEOUT,

  // Navigation Count Selectors
  myInboxCountSelector,
  mentionsCountSelector,
  unattendedCountSelector,

  // Unified RequestState Atoms
  chatwootProfileRequestAtom,
  chatwootProfileFromRequestSelector,
  chatwootInboxesRequestAtom,
  chatwootInboxesFromRequestSelector,
  chatwootMessagesRequestAtom,
  chatwootMessagesFromRequestSelector,
  chatwootNotificationsRequestAtom,
  chatwootNotificationsFromRequestSelector,
  chatwootAgentsRequestAtom,
  chatwootTeamsRequestAtom,
  chatwootLabelsRequestAtom,

  // Helper Selectors
  chatwootAnyLoadingSelector,
  chatwootFirstErrorSelector,
  chatwootProfileReadySelector,
  chatwootSelectedInboxSelector,
} from "./atoms/chatwoot.atoms";

export type {
  ChatwootConversationsLoadingState,
  ConversationCacheEntry,
  CacheConfig,
  CacheStatistics,
  FetchLockEntry,
  FetchLockStats,
  ChatwootWebSocketEvent,
  ChatwootWebSocketStats,
  ChatwootLabel,
} from "./atoms/chatwoot.atoms";

// ============================================================================
// CHATWOOT - NORMALIZED ATOMS
// ============================================================================

export {
  chatwootConversationByIdAtom,
  chatwootConversationIdsByFilterAtom,
  chatwootAllConversationIdsAtom,
  chatwootConversationsForFilterSelector,
  chatwootEnrichedConversationSelector,
  chatwootMessageByIdAtom,
  chatwootMessageIdsByConversationAtom,
  chatwootMessagesForConversationSelector,
  chatwootNormalizationStateAtom,
  chatwootConversationCountByPredicateSelector,
  chatwootAttentionNeededIdsSelector,
  normalizeConversations,
  denormalizeConversations,
} from "./atoms/chatwoot-normalized.atoms";

export type { NormalizedConversations, NormalizationState } from "./atoms/chatwoot-normalized.atoms";

// ============================================================================
// CHATWOOT - SHARED RESOURCES
// ============================================================================

export {
  createInitialRequestState,
  isCacheValid,
  chatwootInboxAgentsAtom,
  chatwootContactsAtom,
  chatwootContactsPaginationAtom,
  chatwootAccountDataAtom,
  chatwootResourceLoadingAtom,
  chatwootCacheInvalidationTriggerAtom,
} from "./atoms/chatwoot-shared.atoms";

export type {
  RequestState,
  ContactsPaginationMeta,
  AccountData,
  ResourceLoadingState,
} from "./atoms/chatwoot-shared.atoms";

// ============================================================================
// SELECTORS
// ============================================================================

export * from "./selectors";

// ============================================================================
// TYPES
// ============================================================================

export * from "./types/request-state.types";

// ============================================================================
// EFFECTS
// ============================================================================

export * from "./effects";

// ============================================================================
// DEBUG (Development Only)
// ============================================================================

export * from "./debug";
