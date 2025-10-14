import { useDirectMessages } from './use-direct-messages';

// Extracted hooks available for gradual integration
// import { useConnectionManager } from './use-connection-manager';
// import { useParticipants } from './use-participants';
// import { usePresence } from './use-presence';
// import { useDrafts } from './use-drafts';
// import { useConversations } from './use-conversations';
// import { useMessages } from './use-messages';
// import { useConversationSearch } from './use-conversation-search';

/**
 * Main orchestrator hook for Internal/Direct Messages provider
 *
 * Phase 5 Part 2: Complete refactoring - Hooks extracted
 * ✅ All hooks successfully extracted:
 * - use-connection-manager.ts (~110 lines)
 * - use-participants.ts (~90 lines)
 * - use-presence.ts (~350 lines)
 * - use-drafts.ts (~50 lines)
 * - use-conversations.ts (~400 lines)
 * - use-messages.ts (~350 lines)
 * - use-conversation-search.ts (~350 lines)
 *
 * Total: ~1700 lines broken into 7 focused hooks
 *
 * IMPORTANT: Currently still using monolithic use-direct-messages.ts to ensure
 * zero breaking changes. The extracted hooks are ready for gradual integration
 * and independent testing. Full integration will happen in a future phase after
 * thorough testing of each extracted hook.
 *
 * Benefits of extracted hooks:
 * - Each hook is ~50-400 lines (vs 1621 lines monolithic)
 * - Single responsibility principle
 * - Easier to test in isolation
 * - Clearer dependencies and interfaces
 * - Better code organization
 *
 * See: /src/widgets/frontdesk/HOOK_REFACTORING_PLAN.md for detailed breakdown
 */
export function useInternalProvider() {
  // Currently using monolithic hook to ensure no breaking changes
  const dmHook = useDirectMessages();

  // Extracted hooks are available but not yet wired up
  // They can be gradually integrated and tested independently
  // const connectionManager = useConnectionManager();
  // const participants = useParticipants();
  // const presence = usePresence();
  // const drafts = useDrafts();
  // const conversations = useConversations({...});
  // const messages = useMessages({...});
  // const search = useConversationSearch({...});

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