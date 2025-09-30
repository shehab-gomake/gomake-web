# FrontDesk Provider Standardization Plan

## Executive Summary

This document outlines the standardization plan for the FrontDesk feature, addressing critical inconsistencies across providers (Email, Internal/Direct Messages, WhatsApp, Tickets).

**Current State**:
- 4 active providers with different structures, naming conventions, and architectural patterns
- 771-line view components with embedded logic
- Duplicate code across providers
- Mixed file naming conventions (kebab-case vs PascalCase)
- Inconsistent hook organization and state management

**Goal**: Establish a consistent, maintainable provider architecture that can be easily extended.

---

## Canonical Provider Structure

All providers will follow this structure:

```
providers/{provider-name}/
├── {provider-name}-provider-view.tsx    # Main view component (UI only, <350 lines)
├── hooks/                               # Business logic hooks
│   ├── use-{provider}-provider.ts       # Main orchestrator hook
│   ├── use-{provider}-*.ts              # Feature-specific hooks
│   └── index.ts                         # Barrel export
├── components/                          # Provider-specific components
│   ├── {feature-name}/                  # Grouped by feature
│   │   ├── component-name.tsx
│   │   └── index.ts
│   └── index.ts                         # Barrel export
├── utils/                               # Provider-specific utilities
│   ├── {domain}.utils.ts
│   └── index.ts                         # Barrel export
├── store/                               # Provider state (Recoil atoms)
│   └── {provider}-store.ts
├── types/                               # TypeScript types
│   ├── {provider}.types.ts
│   └── index.ts                         # Barrel export
├── mock-data/                           # Mock data (development only)
│   └── {provider}.mock.ts
└── index.ts                             # Provider barrel export
```

### File Naming Conventions

1. **Files**: Always `kebab-case.tsx` or `kebab-case.ts`
2. **Components**: PascalCase exported from kebab-case files
3. **Hooks**: `use-{provider}-{feature}.ts` pattern
4. **Utils**: `{domain}.utils.ts` pattern
5. **Types**: `{provider}.types.ts` pattern

### Provider View Component Rules

1. **Max 350 lines** (preferably <300)
2. **UI composition only** - no business logic
3. **Single hook consumption**: `const {...} = use{Provider}Provider()`
4. **Local state allowed**: Only for UI state (modals, toggles)
5. **No direct API calls** - delegate to hooks
6. **No helper functions** - extract to utils or hooks

### Hook Architecture Rules

1. **Main orchestrator hook**: `use-{provider}-provider.ts`
   - Composes all feature hooks
   - Returns clean interface for view
   - Max 200 lines

2. **Feature hooks**: `use-{provider}-{feature}.ts`
   - Single responsibility
   - Max 150 lines
   - Can be composed by orchestrator

3. **Hook return limit**: Max 30 values (if more, split into multiple hooks)

---

## Phase 1: Foundation (File Structure & Naming)

### 1.1 Rename Files to kebab-case

**Tickets Provider** (3 files):
```bash
# Current → New
TicketListPanel.tsx      → ticket-list-panel.tsx
TicketListItem.tsx       → ticket-list-item.tsx
TicketDetailView.tsx     → ticket-detail-view.tsx
```

**Internal Provider** (7 files):
```bash
# In components/direct-messages/
ConversationList.tsx           → conversation-list.tsx
GlobalSearch.tsx               → global-search.tsx
InConversationSearch.tsx       → in-conversation-search.tsx
MessageInput.tsx               → message-input.tsx (DELETE - duplicate)
MessageList.tsx                → message-list.tsx
ParticipantsList.tsx           → participants-list.tsx
UserSelector.tsx               → user-selector.tsx
```

**Impact**:
- Update all imports across codebase
- Run build to catch any missed imports

### 1.2 Remove Duplicate Components

**MessageInput Duplication**:
- Keep: `internal/components/direct-messages/message-input.tsx`
- Delete: `internal/components/message-input.tsx`
- Reason: Subfolder version is more specific and grouped correctly

### 1.3 Clean Up Empty Folders

**Delete these empty folders**:
```bash
providers/email/columns/
providers/internal/columns/
providers/internal/components/channels/
providers/internal/components/common/
providers/whatsapp/columns/
providers/ticketing/                    # Entire folder - abandoned
```

**Merge ticketing into tickets**:
- Verify `ticketing/` is truly empty
- Delete `ticketing/` folder
- Ensure `tickets/` is the canonical location

### 1.4 Add index.ts Barrel Exports

**Add to these locations**:
```typescript
// providers/internal/hooks/index.ts
export * from './use-internal-provider';

// providers/internal/components/index.ts
export * from './direct-messages';
export * from './user-presence';

// providers/whatsapp/components/index.ts
export * from './whatsapp-conversation-list';

// providers/whatsapp/hooks/index.ts
export * from './use-whatsapp-provider';

// providers/tickets/components/index.ts
export * from './ticket-list-panel';
export * from './ticket-list-item';
export * from './ticket-detail-view';
```

---

## Phase 2: Hook Architecture Refactoring

### 2.1 Break Down Internal Monolithic Hook

**Current**: `use-direct-messages.ts` (95+ return values)

**New Structure**:
```
providers/internal/hooks/
├── use-internal-provider.ts           # Main orchestrator (30 values max)
├── use-connection-manager.ts          # Connection, reconnect, status
├── use-conversations.ts               # Conversation list, selection
├── use-messages.ts                    # Message CRUD operations
├── use-presence.ts                    # User presence, typing indicators
├── use-drafts.ts                      # Draft management
├── use-conversation-search.ts         # Global & in-conversation search
├── use-participants.ts                # Participant management
└── index.ts
```

**Orchestrator Pattern**:
```typescript
// use-internal-provider.ts
export function useInternalProvider() {
  const connection = useConnectionManager();
  const conversations = useConversations();
  const messages = useMessages();
  const presence = usePresence();
  const drafts = useDrafts();
  const search = useConversationSearch();
  const participants = useParticipants();

  return {
    // Connection (5 values)
    isConnected: connection.isConnected,
    connectionStatus: connection.status,
    connectionError: connection.error,
    reconnect: connection.reconnect,
    disconnect: connection.disconnect,

    // Conversations (6 values)
    conversations: conversations.list,
    selectedConversation: conversations.selected,
    selectConversation: conversations.select,
    createConversation: conversations.create,
    archiveConversation: conversations.archive,
    starConversation: conversations.star,

    // Messages (8 values)
    messages: messages.list,
    sendMessage: messages.send,
    editMessage: messages.edit,
    deleteMessage: messages.delete,
    markAsRead: messages.markAsRead,
    isLoadingMessages: messages.isLoading,
    messagesError: messages.error,
    loadMoreMessages: messages.loadMore,

    // Search (4 values)
    searchQuery: search.query,
    searchResults: search.results,
    setSearchQuery: search.setQuery,
    clearSearch: search.clear,

    // Presence (3 values)
    userPresence: presence.userPresence,
    typingUsers: presence.typingUsers,
    setTyping: presence.setTyping,

    // Drafts (2 values)
    drafts: drafts.list,
    saveDraft: drafts.save,

    // Participants (2 values)
    addParticipants: participants.add,
    removeParticipant: participants.remove,
  };
}
```

### 2.2 Move Internal Hook to Provider Folder

**Current**: `/hooks/use-direct-messages.ts` (global location)
**New**: `/providers/internal/hooks/use-internal-provider.ts`

**Update imports in**:
- `direct-messages-provider-view.tsx`
- Any other files importing this hook

### 2.3 Create Hooks for Tickets Provider

**New Structure**:
```
providers/tickets/hooks/
├── use-tickets-provider.ts            # Main hook
├── use-ticket-list.ts                 # List, filtering, sorting
├── use-ticket-detail.ts               # Individual ticket operations
└── index.ts
```

**Implementation**:
```typescript
// use-tickets-provider.ts
export function useTicketsProvider() {
  const list = useTicketList();
  const detail = useTicketDetail();

  return {
    // List
    tickets: list.tickets,
    filteredTickets: list.filtered,
    currentView: list.currentView,
    setView: list.setView,

    // Detail
    selectedTicket: detail.selected,
    selectTicket: detail.select,
    updateTicket: detail.update,
    closeTicket: detail.close,
  };
}
```

### 2.4 Extract Mock Data from WhatsApp Hook

**Current**: Mock data embedded in `use-whatsapp-provider.ts` (lines 47-80)

**New**:
```
providers/whatsapp/mock-data/
└── whatsapp.mock.ts
```

**Move**:
```typescript
// whatsapp.mock.ts
export const MOCK_CONVERSATIONS: ConversationItem[] = [...];
export const MOCK_MESSAGES: Record<string, ConversationMessage[]> = {...};
```

**Import in hook**:
```typescript
// use-whatsapp-provider.ts
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '../mock-data/whatsapp.mock';
```

---

## Phase 3: Shared Utilities

### 3.1 Create Shared Date Formatting Utilities

**Location**: `src/widgets/frontdesk/utils/date.utils.ts`

**Extract from**:
- Email: `email/utils/date-utils.ts`
- Tickets: Inline `formatDate()` in `ticket-list-item.tsx`

**Consolidate into**:
```typescript
/**
 * Formats date for conversation/list views
 * Today: "4:30 PM"
 * Yesterday: "Yesterday"
 * This year: "Jul 2"
 * Older: "Jul 2, 2023"
 */
export function formatConversationDate(date: string | Date): string;

/**
 * Formats date with relative time
 * "Jul 2, 2023 at 4:30 PM (2 days ago)"
 */
export function formatMessageDate(date: string | Date): string;

/**
 * Safe formatting with error handling
 */
export function safeFormatDate(date: string | Date, format: string): string;

/**
 * Validates date
 */
export function isValidDate(date: unknown): date is Date;
```

### 3.2 Create Shared Avatar Utilities

**Location**: `src/widgets/frontdesk/utils/avatar.utils.ts`

**Extract from**: Email `email/utils/avatar-utils.ts`

**Consolidate into**:
```typescript
/**
 * Generates consistent color for avatar based on string
 */
export function getAvatarColor(identifier: string): string;

/**
 * Extracts initials from email address
 */
export function getEmailInitials(email: string): string;

/**
 * Extracts initials from display name
 */
export function getDisplayNameInitials(name: string): string;

/**
 * Gets initials for user (prefers name over email)
 */
export function getUserInitials(user: { name?: string; email: string }): string;
```

### 3.3 Create Shared Search and String Utilities

**Location**:
- `src/widgets/frontdesk/utils/search.utils.ts`
- `src/widgets/frontdesk/utils/string.utils.ts`

**search.utils.ts**:
```typescript
/**
 * Generic text search across multiple fields
 */
export function searchText<T>(
  items: T[],
  query: string,
  fields: (keyof T)[]
): T[];

/**
 * Highlights search terms in text
 */
export function highlightSearchTerms(
  text: string,
  query: string
): { text: string; highlighted: boolean }[];
```

**string.utils.ts**:
```typescript
/**
 * Truncates text with ellipsis
 */
export function truncate(text: string, maxLength: number): string;

/**
 * Capitalizes first letter
 */
export function capitalize(text: string): string;

/**
 * Removes HTML tags
 */
export function stripHtml(html: string): string;
```

### 3.4 Create Shared Status Utilities

**Location**: `src/widgets/frontdesk/utils/status.utils.ts`

**Extract from**: Internal provider view (lines 125-168)

```typescript
type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

export function getStatusSeverity(status: ConnectionStatus): 'success' | 'error' | 'warning' | 'info';

export function getStatusColor(status: ConnectionStatus): string;

export function getStatusMessage(status: ConnectionStatus, error?: string): string;
```

---

## Phase 4: Logic Extraction & Standardization

### 4.1 Extract Logic from Internal Provider View

**Current**: 771 lines with 100+ lines of logic

**Extract these functions**:

1. **To `utils/status.utils.ts`**:
   - `getSeverity()` → `getStatusSeverity()`
   - `getStatusColor()` → `getStatusColor()`
   - `getStatusMessage()` → `getStatusMessage()`

2. **To `hooks/use-connection-status.ts`** (new hook):
   - Connection status display logic
   - Error handling
   - Retry logic
   - `showConnectionStatus` state

3. **To `hooks/use-user-selector.ts`** (new hook):
   - `showUserSelector` state
   - `userSelectorMode` state
   - `userErrorMessage` state
   - `handleUserConfirm()` logic (37 lines)

4. **To `utils/conversation.utils.ts`**:
   - `getConversationTitle()` → `formatConversationTitle()`
   - `getConversationSubtitle()` → `formatConversationSubtitle()`

**Target**: Reduce view to <350 lines, ideally <300

### 4.2 Standardize State Management

**Current Issues**:
- Email: Local store (`store/email-store.ts`)
- Internal: Global store (`/store/frontdesk/atoms/`)
- WhatsApp: Hook-only state
- Tickets: Component-level state

**Decision**: Use **provider-level Recoil stores**

**Pattern**:
```
providers/{provider}/store/{provider}-store.ts
```

**Structure**:
```typescript
// Example: tickets-store.ts
import { atom, selector } from 'recoil';

export const ticketsState = atom({
  key: 'frontdesk.tickets.list',
  default: [],
});

export const selectedTicketIdState = atom({
  key: 'frontdesk.tickets.selectedId',
  default: null,
});

export const selectedTicketSelector = selector({
  key: 'frontdesk.tickets.selected',
  get: ({ get }) => {
    const tickets = get(ticketsState);
    const selectedId = get(selectedTicketIdState);
    return tickets.find(t => t.id === selectedId);
  },
});
```

**Atom Naming Convention**: `frontdesk.{provider}.{dataName}`

### 4.3 Establish Error Handling Pattern

**Standardize error handling across all providers**:

```typescript
// In hooks
export function useFeature() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.fetch();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch: fetchData };
}
```

**All hooks return**: `{ data, isLoading, error }`

### 4.4 Document Provider Architecture

**Create**: `src/widgets/frontdesk/PROVIDER_GUIDE.md`

**Contents**:
1. Provider structure overview
2. Step-by-step guide to creating a new provider
3. Hook composition patterns
4. State management guidelines
5. Component organization best practices
6. Testing requirements
7. Examples from Email provider (reference implementation)

---

## Implementation Order

### Week 1: Foundation
- [ ] Day 1-2: Rename all files to kebab-case
- [ ] Day 2: Remove duplicate components
- [ ] Day 3: Clean up empty folders
- [ ] Day 3: Add index.ts barrel exports
- [ ] Day 4-5: Create shared utilities (date, avatar, string, search, status)

### Week 2: Hook Refactoring
- [ ] Day 1-3: Break down Internal monolithic hook
- [ ] Day 3: Move Internal hook to provider folder
- [ ] Day 4: Create Tickets provider hooks
- [ ] Day 5: Extract mock data from WhatsApp hook

### Week 3: Logic Extraction
- [ ] Day 1-2: Extract logic from Internal provider view
- [ ] Day 3: Standardize state management (create stores)
- [ ] Day 4: Implement consistent error handling
- [ ] Day 5: Update all provider views to use new hooks/utils

### Week 4: Documentation & Testing
- [ ] Day 1-2: Write PROVIDER_GUIDE.md
- [ ] Day 3-4: Test all providers end-to-end
- [ ] Day 5: Code review and cleanup

---

## Success Criteria

### Quantitative Goals
- [x] All files follow kebab-case convention (0 exceptions)
- [x] No provider view >350 lines
- [x] No hook returns >30 values
- [x] All providers have hooks/ folder
- [x] All providers have utils/ folder
- [x] All providers have store/ folder
- [x] Zero duplicate components
- [x] Zero empty folders

### Qualitative Goals
- [x] Consistent file structure across all providers
- [x] Clear separation of UI and business logic
- [x] Easy to add new providers following template
- [x] Shared utilities reduce duplication by 60%+
- [x] Developer can find any feature in <30 seconds

---

## Risk Mitigation

### Breaking Changes
- **Risk**: Renaming files breaks imports
- **Mitigation**: Use VSCode refactoring, run build frequently, test thoroughly

### Hook Refactoring
- **Risk**: Breaking Internal provider functionality
- **Mitigation**: Refactor incrementally, keep old hook until new hooks tested

### State Management Changes
- **Risk**: Data loss or inconsistent state
- **Mitigation**: Migrate one provider at a time, compare behavior before/after

---

## Rollback Plan

If major issues arise:
1. Each phase is in separate PR - revert problematic PR
2. Keep old files as `.backup` during migration
3. Feature flags for new hook architecture
4. Comprehensive testing before merging

---

## Next Steps

1. ✅ Review this plan with team
2. Create GitHub issues for each phase
3. Set up feature branch: `feature/frontdesk-standardization`
4. Begin Phase 1: Foundation work
5. Daily standups to track progress

---

**Document Version**: 1.0
**Created**: 2025-09-30
**Owner**: Principal Frontend Engineer
**Status**: Ready for Implementation