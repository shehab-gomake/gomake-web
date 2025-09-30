import { useDirectMessages } from './use-direct-messages';
// import { useConnectionManager } from './use-connection-manager';
// import { useParticipants } from './use-participants';

/**
 * Main orchestrator hook for Internal/Direct Messages provider
 *
 * Phase 5 Part 1: Partial refactoring - Pattern demonstration
 * ✅ Extracted hooks created (not yet integrated):
 * - use-connection-manager.ts (~110 lines)
 * - use-participants.ts (~90 lines)
 *
 * ⏳ Remaining hooks to extract:
 * - use-presence.ts (~350 lines)
 * - use-drafts.ts (~50 lines)
 * - use-conversations.ts (~400 lines)
 * - use-messages.ts (~350 lines)
 * - use-conversation-search.ts (~350 lines)
 *
 * Integration will happen in Phase 5 Part 2 when all hooks are extracted.
 * This ensures no breaking changes and allows incremental testing.
 *
 * See: /src/widgets/frontdesk/HOOK_REFACTORING_PLAN.md for detailed breakdown
 */
export function useInternalProvider() {
  // Currently using monolithic hook
  const dmHook = useDirectMessages();

  // Extracted hooks (commented out until full integration):
  // const connectionManager = useConnectionManager();
  // const participants = useParticipants();

  // Return a curated subset of the most commonly used values
  // This provides a cleaner interface than exposing all 78 values
  return {
    // Connection (4 values)
    connected: dmHook.connected,
    connectionStatus: dmHook.connectionStatus,
    isLoading: dmHook.isLoading,
    error: dmHook.error,

    // Conversations (8 values)
    conversations: dmHook.conversations,
    activeConversation: dmHook.activeConversation,
    activeConversationId: dmHook.activeConversationId,
    unreadCounts: dmHook.unreadCounts,
    totalUnreadCount: dmHook.totalUnreadCount,
    conversationsFilter: dmHook.conversationsFilter,
    setConversationFilter: dmHook.setConversationFilter,
    isLoadingConversations: dmHook.isLoadingConversations,

    // Messages (6 values)
    messages: dmHook.messages,
    isSending: dmHook.isSending,
    isLoadingHistory: dmHook.isLoadingHistory,
    sendMessage: dmHook.sendMessage,
    loadMoreMessages: dmHook.loadMoreMessages,
    loadMessageHistory: dmHook.loadMessageHistory,

    // Presence (5 values)
    currentUser: dmHook.currentUser,
    onlineUsersWithPresence: dmHook.onlineUsersWithPresence,
    typingUsers: dmHook.typingUsers,
    otherMembers: dmHook.otherMembers,
    userPresence: dmHook.userPresence,

    // Drafts (2 values)
    draft: dmHook.draft,
    updateDraft: dmHook.updateDraft,

    // Search (9 values)
    searchMode: dmHook.searchMode,
    globalSearchResults: dmHook.globalSearchResults,
    conversationSearchResults: dmHook.conversationSearchResults,
    conversationSearchQuery: dmHook.conversationSearchQuery,
    currentSearchIndex: dmHook.currentSearchIndex,
    highlightedMessageId: dmHook.highlightedMessageId,
    performGlobalSearch: dmHook.performGlobalSearch,
    performConversationSearch: dmHook.performConversationSearch,
    clearSearch: dmHook.clearSearch,

    // Actions (10 values)
    connect: dmHook.connect,
    disconnect: dmHook.disconnect,
    selectConversation: dmHook.selectConversation,
    startDirectMessage: dmHook.startDirectMessage,
    createConversation: dmHook.createConversation,
    archiveConversation: dmHook.archiveConversation,
    favoriteConversation: dmHook.favoriteConversation,
    addMembersToConversation: dmHook.addMembersToConversation,
    loadUserSuggestions: dmHook.loadUserSuggestions,
    setActiveConversationId: dmHook.setActiveConversationId,

    // Additional commonly used (6 values)
    startTyping: dmHook.startTyping,
    stopTyping: dmHook.stopTyping,
    jumpToMessage: dmHook.jumpToMessage,
    globalSearchOpen: dmHook.globalSearchOpen,
    conversationSearchOpen: dmHook.conversationSearchOpen,
    userSuggestions: dmHook.userSuggestions,
  };
}

export type UseInternalProviderResult = ReturnType<typeof useInternalProvider>;