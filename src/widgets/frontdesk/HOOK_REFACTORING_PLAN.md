# Internal Provider Hook Refactoring Plan

## Current State

The `use-direct-messages.ts` hook is **1621 lines** with **78 return values** managing all Direct Messages functionality. This violates single responsibility principle and makes testing/maintenance difficult.

## Goal

Break down into **8 focused hooks** (~50-400 lines each) with a clean orchestrator pattern exposing max **30 return values**.

---

## Proposed Hook Architecture

### 1. `use-connection-manager.ts` (~150 lines)

**Responsibility:** WebSocket connection lifecycle

**State:**
- `connectionStatus` (dmConnectionState)
- `connected` (dmConnectedState)
- `isLoading` (dmIsLoadingState)
- `error` (dmErrorState)

**Functions:**
- `connect()` - establish WebSocket connection
- `disconnect()` - close WebSocket connection

**Line Numbers from Original:**
- Lines 67-68, 80, 148-191, 1241-1254, 1508-1519

**Returns:**
```typescript
{
  connected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}
```

---

### 2. `use-participants.ts` (~100 lines)

**Responsibility:** User suggestions for creating conversations

**State:**
- `userSuggestions` (dmUserSuggestionsState)
- `isLoadingSuggestions` (dmIsLoadingSuggestionsState)
- `suggestionsOnlineOnly` (local state)

**Functions:**
- `loadUserSuggestions()` - fetch user suggestions from API
- `setUserSuggestionsOnlineOnly()` - toggle online filter

**Line Numbers from Original:**
- Lines 86-87, 89, 108, 805-835

**Returns:**
```typescript
{
  userSuggestions: UserSuggestion[];
  isLoadingSuggestions: boolean;
  suggestionsOnlineOnly: boolean;
  loadUserSuggestions: (query?: string) => Promise<void>;
  setUserSuggestionsOnlineOnly: (value: boolean) => void;
}
```

---

### 3. `use-presence.ts` (~350 lines)

**Responsibility:** User presence, online status, typing indicators

**State:**
- `currentUser` (dmCurrentUserState)
- `onlineUsers` (dmOnlineUsersState)
- `userPresence` (dmUserPresenceState)
- `typingUsers` (dmTypingUsersState)
- `isTyping` (dmIsTypingState)

**Functions:**
- `startTyping()` - send typing indicator
- `stopTyping()` - stop typing indicator
- Internal: handle presence events, typing events

**Line Numbers from Original:**
- Lines 69, 75-79, 103-107, 762-802, 1196-1237, 1313-1401, 1522-1536

**Returns:**
```typescript
{
  currentUser: ConversationMember | null;
  onlineUsers: string[];
  onlineUsersWithPresence: DMPresenceData[];
  userPresence: Record<string, DMPresenceData>;
  typingUsers: string[]; // for active conversation
  allTypingUsers: Record<string, string[]>; // all conversations
  isTyping: boolean;
  otherMembers: ConversationMember[];
  startTyping: () => void;
  stopTyping: () => void;
}
```

---

### 4. `use-drafts.ts` (~50 lines)

**Responsibility:** Draft message management per conversation

**State:**
- `draft` (dmDraftState)

**Functions:**
- `updateDraft()` - update draft for conversation

**Line Numbers from Original:**
- Lines 79, 791-802

**Returns:**
```typescript
{
  draft: string; // active conversation's draft
  allDrafts: Record<string, string>; // all conversation drafts
  updateDraft: (convId: string, content: string) => void;
  clearDraft: (convId: string) => void;
}
```

---

### 5. `use-conversations.ts` (~400 lines)

**Responsibility:** Conversation CRUD, selection, filtering

**State:**
- `conversations` (dmConversationsState)
- `conversationsFilter` (dmConversationsFilterState)
- `activeConversationId` (dmActiveConversationIdState)
- `unreadCounts` (dmUnreadCountsState)
- `isLoadingConversations` (dmIsLoadingConversationsState)

**Functions:**
- `loadConversations()` - fetch conversations from API
- `selectConversation()` - set active conversation
- `createConversation()` - create new conversation
- `startDirectMessage()` - create/select DM with user
- `favoriteConversation()` - toggle favorite status
- `archiveConversation()` - archive/unarchive conversation
- `addMembersToConversation()` - add members to group

**Line Numbers from Original:**
- Lines 70-72, 74, 85, 111-118 (selectors), 120-145 (effects), 194-304, 300-304, 456-659, 1256-1282, 1284-1300, 1427-1463

**Returns:**
```typescript
{
  conversations: Conversation[];
  activeConversation: Conversation | null;
  activeConversationId: string | null;
  unreadCounts: Record<string, number>;
  totalUnreadCount: number;
  isLoadingConversations: boolean;
  conversationsFilter: 'all' | 'archived';
  loadConversations: () => Promise<void>;
  selectConversation: (conv: Conversation) => Promise<void>;
  createConversation: (data: CreateConversationRequest) => Promise<Conversation | null>;
  startDirectMessage: (userId: string) => Promise<Conversation | null>;
  favoriteConversation: (id: string) => Promise<void>;
  archiveConversation: (id: string, archive?: boolean) => Promise<void>;
  addMembersToConversation: (id: string, userIds: string[]) => Promise<void>;
  setActiveConversationId: (id: string | null) => void;
  setConversationFilter: (filter: 'all' | 'archived') => void;
}
```

---

### 6. `use-messages.ts` (~350 lines)

**Responsibility:** Message CRUD, sending, pagination

**State:**
- `messages` (dmMessagesState)
- `messageCursors` (dmMessageCursorsState)
- `isSending` (dmIsSendingState)
- `isLoadingHistory` (dmIsLoadingHistoryState)

**Functions:**
- `loadMessageHistory()` - fetch messages with pagination
- `loadMoreMessages()` - load older messages (infinite scroll)
- `sendMessage()` - send message via WebSocket

**Line Numbers from Original:**
- Lines 73, 83, 84, 88, 307-453, 689-759, 1062-1193

**Returns:**
```typescript
{
  messages: DMMessage[]; // active conversation's messages
  allMessages: Record<string, DMMessage[]>; // all conversation messages
  messageCursors: Record<string, MessageCursor>;
  isSending: boolean;
  isLoadingHistory: boolean;
  loadMessageHistory: (convId: string, options?: PaginationOptions) => Promise<boolean>;
  loadMoreMessages: (convId: string) => Promise<boolean>;
  sendMessage: (content: string) => Promise<boolean>;
}
```

---

### 7. `use-conversation-search.ts` (~350 lines)

**Responsibility:** Global and in-conversation message search

**State:**
- `searchMode` (dmSearchModeState)
- `globalSearchResults` (dmGlobalSearchResultsState)
- `conversationSearchResults` (dmConversationSearchResultsState)
- `conversationSearchQuery` (dmConversationSearchQueryState)
- `currentSearchIndex` (dmCurrentSearchIndexState)
- `highlightedMessageId` (dmHighlightedMessageIdState)
- `searchLoading` (dmSearchLoadingState)
- `globalSearchOpen` (dmGlobalSearchOpenState)
- `conversationSearchOpen` (dmConversationSearchOpenState)

**Functions:**
- `performGlobalSearch()` - search all messages
- `performConversationSearch()` - search in active conversation
- `jumpToMessage()` - navigate to specific message
- `navigateToSearchResult()` - navigate through results
- `clearSearch()` - clear search state
- `openGlobalSearch()` / `openConversationSearch()` - open search UI

**Line Numbers from Original:**
- Lines 92-100, 838-1055, 1492-1505

**Returns:**
```typescript
{
  searchMode: 'global' | 'conversation' | null;
  globalSearchResults: MessageSearchResult[];
  conversationSearchResults: ConversationSearchResult[];
  conversationSearchQuery: string;
  currentSearchIndex: number;
  highlightedMessageId: string | null;
  searchLoading: boolean;
  globalSearchOpen: boolean;
  conversationSearchOpen: boolean;
  performGlobalSearch: (query: string) => Promise<MessageSearchResult[]>;
  performConversationSearch: (query: string) => Promise<ConversationSearchResult[]>;
  jumpToMessage: (convId: string, msgId: string) => Promise<void>;
  navigateToSearchResult: (msgId: string, index: number) => void;
  clearSearch: (scope?: 'global' | 'conversation' | 'all') => void;
  openGlobalSearch: () => void;
  openConversationSearch: () => void;
  setConversationSearchQuery: (query: string) => void;
}
```

---

### 8. `use-internal-provider.ts` (Orchestrator, ~150 lines)

**Responsibility:** Compose all hooks and expose unified interface

**Implementation:**
```typescript
export function useInternalProvider() {
  // Initialize hooks in dependency order
  const connection = useConnectionManager();
  const presence = usePresence(connection.connected);
  const drafts = useDrafts();
  const conversations = useConversations(connection, presence);
  const messages = useMessages(conversations.activeConversationId, presence, drafts);
  const search = useConversationSearch(conversations, messages);
  const participants = useParticipants();

  return {
    // Connection (3)
    connected: connection.connected,
    connectionStatus: connection.connectionStatus,
    error: connection.error,

    // Conversations (7)
    conversations: conversations.conversations,
    activeConversation: conversations.activeConversation,
    unreadCounts: conversations.unreadCounts,
    totalUnreadCount: conversations.totalUnreadCount,
    selectConversation: conversations.selectConversation,
    startDirectMessage: conversations.startDirectMessage,
    archiveConversation: conversations.archiveConversation,

    // Messages (4)
    messages: messages.messages,
    isSending: messages.isSending,
    sendMessage: messages.sendMessage,
    loadMoreMessages: messages.loadMoreMessages,

    // Presence (3)
    currentUser: presence.currentUser,
    onlineUsers: presence.onlineUsersWithPresence,
    typingUsers: presence.typingUsers,

    // Drafts (2)
    draft: drafts.draft,
    updateDraft: drafts.updateDraft,

    // Search (5)
    searchMode: search.searchMode,
    globalSearchResults: search.globalSearchResults,
    conversationSearchResults: search.conversationSearchResults,
    performGlobalSearch: search.performGlobalSearch,
    performConversationSearch: search.performConversationSearch,

    // Additional actions (6)
    createConversation: conversations.createConversation,
    loadUserSuggestions: participants.loadUserSuggestions,
    jumpToMessage: search.jumpToMessage,
    clearSearch: search.clearSearch,
    startTyping: presence.startTyping,
    stopTyping: presence.stopTyping,
  };
}
// Total: 30 return values
```

---

## Implementation Order

### Phase 1: Pure Hooks (No Inter-hook Dependencies)
1. ✅ **use-connection-manager.ts**
2. ✅ **use-participants.ts**

### Phase 2: Core Data Hooks
3. ✅ **use-presence.ts** (depends on: connection)
4. ✅ **use-drafts.ts** (standalone, used by presence for typing)

### Phase 3: Dependent Hooks
5. ✅ **use-conversations.ts** (depends on: connection, presence)
6. ✅ **use-messages.ts** (depends on: conversations, presence, drafts)

### Phase 4: Complex Feature Hooks
7. ✅ **use-conversation-search.ts** (depends on: conversations, messages)

### Phase 5: Orchestrator
8. ✅ **use-internal-provider.ts** (composes all hooks)

### Phase 6: Integration
9. ✅ Update `direct-messages-provider-view.tsx` to use orchestrator
10. ✅ Test all functionality
11. ✅ Remove or deprecate old `use-direct-messages.ts`

---

## Benefits of Refactoring

### Maintainability
- **1621 lines → 8 files** (~50-400 lines each)
- Single responsibility per hook
- Easier to locate and fix bugs

### Testability
- Each hook can be tested in isolation
- Mock dependencies easily
- Faster test execution

### Performance
- Granular re-renders (only affected hooks re-render)
- Easier to memoize expensive operations
- Better code splitting

### Developer Experience
- Clear separation of concerns
- Explicit dependencies
- Self-documenting code structure
- Easier onboarding for new developers

### Future Extensibility
- Easy to add new features (new hooks)
- Hooks can be reused in other providers
- Can optimize individual hooks without affecting others

---

## Risk Mitigation

### Testing Strategy
1. Extract one hook at a time
2. Keep old hook alongside new hooks during migration
3. Add integration tests comparing old vs new behavior
4. Use feature flags to toggle between implementations

### Rollback Plan
- Each hook extraction is a separate PR
- Can revert individual PRs without losing all work
- Old implementation remains until all hooks are extracted and tested

### Breaking Changes
- Maintain backward compatibility in orchestrator
- View component should not need changes (same interface)
- Internal implementation details hidden from consumers

---

## Line Number Reference for Extraction

| Hook | Lines in Original | Estimated New Size |
|------|-------------------|-------------------|
| use-connection-manager.ts | 67-68, 80, 148-191, 1241-1254, 1508-1519 | ~150 lines |
| use-participants.ts | 86-87, 89, 108, 805-835 | ~100 lines |
| use-presence.ts | 69, 75-79, 103-107, 762-802, 1196-1237, 1313-1401, 1522-1536 | ~350 lines |
| use-drafts.ts | 79, 791-802 | ~50 lines |
| use-conversations.ts | 70-72, 74, 85, 111-118, 120-145, 194-304, 456-659, 1256-1300, 1427-1463 | ~400 lines |
| use-messages.ts | 73, 83-84, 88, 307-453, 689-759, 1062-1193 | ~350 lines |
| use-conversation-search.ts | 92-100, 838-1055, 1492-1505 | ~350 lines |
| use-internal-provider.ts | 1538-1620 (return interface) | ~150 lines |

---

## Current Status

✅ **Completed:**
- Hook moved from global `/hooks/` to `providers/internal/hooks/`
- Created simplified orchestrator wrapper (`use-internal-provider.ts`)
- Documented full refactoring plan

⏳ **Remaining:**
- Extract 7 focused hooks from monolithic hook
- Update orchestrator to compose focused hooks
- Update provider view to use orchestrator
- Remove old monolithic hook

---

## Next Steps

1. Schedule refactoring work (estimate: 2-3 days)
2. Create feature flag for new implementation
3. Extract hooks one at a time following implementation order
4. Add integration tests for each extracted hook
5. Update orchestrator incrementally
6. Switch feature flag when all hooks extracted
7. Remove old implementation after 1 sprint of stability

---

**Document Version:** 1.0
**Created:** 2025-09-30
**Status:** Plan Ready - Implementation Pending