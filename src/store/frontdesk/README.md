# FrontDesk Chatwoot State Management

Production-ready Recoil state management for the FrontDesk Chatwoot provider.

## Architecture Overview

```
src/store/frontdesk/
├── atoms/
│   ├── chatwoot.atoms.ts          # Core Chatwoot atoms (profile, conversations, etc.)
│   ├── chatwoot-normalized.atoms.ts  # Normalized data with atom families
│   └── chatwoot-shared.atoms.ts   # Shared resources (agents, teams, contacts)
├── selectors/
│   ├── chatwoot-conversations.selectors.ts  # Conversation filtering/sorting
│   └── chatwoot-dashboard.selectors.ts      # Dashboard stats/metrics
├── effects/
│   ├── chatwoot-websocket.effect.ts    # WebSocket lifecycle management
│   └── chatwoot-persistence.effect.ts  # localStorage persistence
├── types/
│   └── request-state.types.ts     # RequestState pattern types/utilities
├── debug/
│   └── RecoilDebugObserver.tsx    # Development debugging tools
└── index.ts                       # Central exports
```

## Key Patterns

### 1. RequestState Pattern

Unified state structure combining data, loading, and error:

```typescript
import { createRequestState, DEFAULT_TTL } from "@/store/frontdesk";

// Instead of 3 atoms:
// ❌ const dataAtom = atom([]);
// ❌ const loadingAtom = atom(false);
// ❌ const errorAtom = atom(null);

// Use 1 unified atom:
// ✅
const resourceAtom = atom<RequestState<MyData[]>>({
  key: "resource",
  default: createRequestState<MyData[]>(DEFAULT_TTL.STANDARD),
});
```

### 2. Centralized Fetch Locks

Prevent duplicate API calls across all component instances:

```typescript
import { useFetchLock, FETCH_LOCK_KEYS } from "@/widgets/frontdesk/providers/chatwoot/hooks/core/use-fetch-lock";

const { acquireLock, releaseLock, isLocked } = useFetchLock();

const fetchData = async () => {
  if (!acquireLock(FETCH_LOCK_KEYS.PROFILE)) {
    return; // Another component is already fetching
  }

  try {
    const data = await api.fetchProfile();
    return data;
  } finally {
    releaseLock(FETCH_LOCK_KEYS.PROFILE);
  }
};
```

### 3. LRU Cache Eviction

Automatic cache management with configurable limits:

```typescript
import { useChatwootCache } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-cache";

const { evictLRU, evictStale, getStats, cacheCount } = useChatwootCache(accountId);

// Manually evict oldest entries
evictLRU(10); // Remove 10 oldest entries

// Remove stale entries
evictStale();

// Get cache statistics
const stats = getStats();
console.log(`Fresh: ${stats.freshEntries}, Stale: ${stats.staleEntries}`);
```

**Important Implementation Notes:**

- **LRU Sorting:** Uses explicit `> 0` checks instead of `||` operator to avoid treating `0` as falsy (which would incorrectly fall back to `timestamp` for newly cached entries)
- **Cache Keys from Snapshot:** The `getCacheEntriesWithMetadata` callback reads `cacheKeys` from the Recoil snapshot (not closure) to ensure fresh data when called from other `useRecoilCallback` functions
- **Count Parameter:** `evictLRU(count)` uses `count !== undefined` check to correctly handle `evictLRU(0)` (evict zero items)

### 4. Data Normalization

Efficient updates with atom families:

```typescript
import {
  chatwootConversationByIdAtom,
  chatwootConversationIdsByFilterAtom,
  chatwootConversationsForFilterSelector,
} from "@/store/frontdesk";

// Read a single conversation (O(1) update)
const [conversation, setConversation] = useRecoilState(chatwootConversationByIdAtom(conversationId));

// Update without affecting other conversations
setConversation((prev) => (prev ? { ...prev, status: "resolved" } : null));

// Get list view (reconstructed from normalized data)
const conversations = useRecoilValue(chatwootConversationsForFilterSelector(filterKey));
```

### 5. Selectors for Derived State

Memoized computations:

```typescript
import { conversationsByStatusSelector, conversationsByInboxSelector, dashboardOverviewStatsSelector } from "@/store/frontdesk";

// Filtered conversations (memoized)
const openConversations = useRecoilValue(conversationsByStatusSelector("open"));

// Dashboard stats (computed once)
const stats = useRecoilValue(dashboardOverviewStatsSelector);
```

### 6. Persistence Effects

Persist critical state to localStorage:

```typescript
import { persistToLocalStorage } from "@/store/frontdesk";

const selectedAccountAtom = atom<number | null>({
  key: "selectedAccount",
  default: null,
  effects: [
    persistToLocalStorage("selectedAccount", {
      ttl: 24 * 60 * 60 * 1000, // 24 hours
      validate: (value) => typeof value === "number" || value === null,
      // Custom deserializer for complex types
      deserialize: (stored) => JSON.parse(stored),
    }),
  ],
});
```

**Important Implementation Notes:**

- **Serialize/Deserialize Contract:** `saveToStorage` serializes only the inner value using custom `serialize`, then wraps with JSON for metadata. `loadFromStorage` JSON-parses the wrapper and applies custom `deserialize` to the inner value string.
- **Backwards Compatible:** Handles data saved before this fix where `rawData.value` might not be a string
- **Custom Deserializer:** Always invoked when the inner value is a string (which it will be after proper `saveToStorage`)

### 7. WebSocket Integration

Atom effects for WebSocket lifecycle:

```typescript
import { createChatwootWebSocketEffect, syncWebSocketStateEffect } from "@/store/frontdesk";

const wsConnectionAtom = atom<boolean>({
  key: "wsConnection",
  default: false,
  effects: [
    createChatwootWebSocketEffect(() => ({
      accountId: 123,
      pubsubToken: "token",
      autoReconnect: true,
    })),
  ],
});
```

**Important Implementation Notes:**

- **Event Listener Cleanup:** Uses named function references (not arrow functions) to ensure the same reference is used for both `on()` and `off()` calls, preventing memory leaks from orphaned event listeners
- **Correct Pattern:**

  ```typescript
  // ✅ Good - named handlers
  const handleConnected = () => setSelf(mapConnectionState("connected"));
  service.on("connected", handleConnected);
  return () => service.off("connected", handleConnected); // Same reference

  // ❌ Bad - arrow functions create new references
  service.on("connected", () => handleState("connected"));
  return () => service.off("connected", () => handleState("connected")); // Different reference!
  ```

## Development Debugging

### RecoilDebugObserver

Add to your app in development:

```tsx
import { RecoilDebugObserver } from "@/store/frontdesk";

<RecoilRoot>
  {process.env.NODE_ENV === "development" && <RecoilDebugObserver />}
  <App />
</RecoilRoot>;
```

### Console Utilities

Available globally in development as `window.__RECOIL_DEBUG__`:

```javascript
// Log all Chatwoot state
__RECOIL_DEBUG__.logChatwootState();

// Get snapshot history
__RECOIL_DEBUG__.getHistory();

// Compare two snapshots
__RECOIL_DEBUG__.compareSnapshots(0, 5);

// Search in snapshots
__RECOIL_DEBUG__.findInSnapshots((key, value) => key.includes("profile"));
```

## Best Practices

1. **Use selectors for derived state** - Don't compute in components
2. **Use atom families for collections** - Enable granular updates
3. **Use RequestState for async data** - Consistent loading/error handling
4. **Use fetch locks** - Prevent duplicate API calls
5. **Keep atoms small and focused** - One concern per atom
6. **Use TypeScript** - Full type safety throughout

## Migration Guide

### From Separate Loading/Error Atoms

```typescript
// Before
const [data, setData] = useRecoilState(dataAtom);
const [loading, setLoading] = useRecoilState(loadingAtom);
const [error, setError] = useRecoilState(errorAtom);

// After
import { startLoading, setSuccess, setError } from "@/store/frontdesk";

const [state, setState] = useRecoilState(resourceRequestAtom);
setState(startLoading); // Sets loading: true, error: null
setState((prev) => setSuccess(prev, data)); // Sets data, loading: false
setState((prev) => setError(prev, "Error message")); // Sets error, loading: false
```

### From Array-Based State

```typescript
// Before - Updates entire array
setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));

// After - Updates single atom
setRecoilState(chatwootConversationByIdAtom(id), (prev) => (prev ? { ...prev, ...updates } : null));
```

## File Reference

| File                                  | Purpose                                              |
| ------------------------------------- | ---------------------------------------------------- |
| `chatwoot.atoms.ts`                   | Core atoms for profile, conversations, inboxes, etc. |
| `chatwoot-normalized.atoms.ts`        | Normalized data structures with atom families        |
| `chatwoot-shared.atoms.ts`            | Shared resources with RequestState pattern           |
| `chatwoot-conversations.selectors.ts` | Filtering, sorting, searching selectors              |
| `chatwoot-dashboard.selectors.ts`     | Dashboard statistics and metrics                     |
| `chatwoot-websocket.effect.ts`        | WebSocket connection lifecycle                       |
| `chatwoot-persistence.effect.ts`      | localStorage persistence                             |
| `request-state.types.ts`              | RequestState utilities and helpers                   |
| `RecoilDebugObserver.tsx`             | Development debugging component                      |

## Performance Considerations

- **Atom families**: Use for collections to enable O(1) updates
- **Selectors**: Memoized by default, recompute only when dependencies change
- **Cache eviction**: LRU policy prevents unbounded memory growth
- **Fetch deduplication**: Prevents redundant API calls
- **Persistence**: Only persist critical state, not large data sets
