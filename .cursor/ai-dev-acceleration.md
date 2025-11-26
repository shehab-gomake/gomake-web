# AI Development Acceleration Guide - gomake-web

This file contains everything AI needs to develop FrontDesk Chatwoot features as fast as possible.

## 🏢 Workspace Context

This is the **FrontDesk frontend project**. For related projects:
- **Proxy Service**: See `/Users/omarsabbah/Desktop/gomake-services/messaging-hub-v2/.cursor/ai-dev-acceleration.md`
- **Backend Reference**: See `/Users/omarsabbah/Desktop/messaging/chatwoot/.cursor/ai-dev-acceleration.md`

## 🚀 Quick Start - Copy & Paste Patterns

### New Chatwoot Feature Checklist
```markdown
1. ✅ Check Chatwoot reference: `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/`
2. ✅ Use existing service: `chatwootService` from `@/services/frontdesk`
3. ✅ Follow provider pattern: `src/widgets/frontdesk/providers/chatwoot/`
4. ✅ Use Recoil atoms: `src/store/frontdesk/atoms/chatwoot.atoms.ts`
5. ✅ Account scoping: All operations need `accountId` (except profile)
```

### Import Pattern (Always Use)
```typescript
// Service
import { chatwootService } from '@/services/frontdesk';

// Hooks
import { useChatwootProvider } from '@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-provider';

// Atoms
import { chatwootConversationsAtom, chatwootSelectedAccountAtom } from '@/store/frontdesk/atoms/chatwoot.atoms';

// Types
import { ChatwootConversation, ConversationStatus } from '@/services/frontdesk/api/chatwoot/types';
```

### Service Usage Template
```typescript
// Profile (no accountId)
const user = await chatwootService.profile.getProfile();

// Conversations (requires accountId)
const conversations = await chatwootService.conversations.listConversations(
  accountId,
  { status: ['open'], page: 1, per_page: 20 }
);

// Messages (requires accountId + conversationId)
const messages = await chatwootService.messages.listMessages(accountId, conversationId);

// Create message
const message = await chatwootService.messages.createMessage(accountId, conversationId, {
  content: 'Hello!',
  message_type: 'outgoing'
});
```

### Hook Pattern Template
```typescript
import { useRecoilState, useRecoilValue } from 'recoil';
import { chatwootConversationsAtom, chatwootSelectedAccountAtom } from '@/store/frontdesk/atoms/chatwoot.atoms';
import { chatwootService } from '@/services/frontdesk';
import { useCallback, useEffect, useState } from 'react';

export const useMyFeature = () => {
  const accountId = useRecoilValue(chatwootSelectedAccountAtom);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!accountId) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await chatwootService.myService.getData(accountId);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};
```

### Component Pattern Template
```typescript
import React from 'react';
import { useChatwootProvider } from '@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-provider';
import { useMyFeature } from './hooks/use-my-feature';

export const MyComponent: React.FC = () => {
  const { selectedAccountId } = useChatwootProvider();
  const { data, loading, error } = useMyFeature();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      {/* Your component UI */}
    </div>
  );
};
```

## 📋 API Endpoint Quick Reference

### Profile Endpoints (No accountId)
```typescript
chatwootService.profile.getProfile()
// GET /api/v1/profile
```

### Conversation Endpoints (Requires accountId)
```typescript
// List conversations
chatwootService.conversations.listConversations(accountId, filters)
// GET /api/v1/accounts/{accountId}/conversations

// Get conversation details
chatwootService.conversations.getConversationDetails(accountId, conversationId)
// GET /api/v1/accounts/{accountId}/conversations/{id}

// Update conversation
chatwootService.conversations.updateConversation(accountId, conversationId, data)
// PUT /api/v1/accounts/{accountId}/conversations/{id}

// Search conversations
chatwootService.conversations.searchConversations(accountId, query)
// GET /api/v1/accounts/{accountId}/conversations/search
```

### Message Endpoints (Requires accountId + conversationId)
```typescript
// List messages
chatwootService.messages.listMessages(accountId, conversationId)
// GET /api/v1/accounts/{accountId}/conversations/{id}/messages

// Create message
chatwootService.messages.createMessage(accountId, conversationId, data)
// POST /api/v1/accounts/{accountId}/conversations/{id}/messages

// Delete message
chatwootService.messages.deleteMessage(accountId, conversationId, messageId)
// DELETE /api/v1/accounts/{accountId}/conversations/{id}/messages/{messageId}
```

### Inbox Endpoints (Requires accountId)
```typescript
// List all inboxes
chatwootService.inboxes.listAllInboxes()
// GET /api/v1/accounts/{accountId}/inboxes

// Get inbox details
chatwootService.inboxes.getInboxDetails(accountId, inboxId)
// GET /api/v1/accounts/{accountId}/inboxes/{id}
```

### Contact Endpoints (Requires accountId)
```typescript
// List contacts
chatwootService.contacts.listContacts(accountId, filters)
// GET /api/v1/accounts/{accountId}/contacts

// Get contact details
chatwootService.contacts.getContactDetails(accountId, contactId)
// GET /api/v1/accounts/{accountId}/contacts/{id}
```

## 🎨 Common Type Definitions

### Conversation Types
```typescript
import {
  ChatwootConversation,
  ConversationStatus,
  ConversationAssigneeType,
  ConversationListParams
} from '@/services/frontdesk/api/chatwoot/types';

// Status values
ConversationStatus.OPEN
ConversationStatus.RESOLVED
ConversationStatus.PENDING
ConversationStatus.SNOOZED

// Assignee types
ConversationAssigneeType.ME
ConversationAssigneeType.UNASSIGNED
ConversationAssigneeType.ALL
```

### Filter Patterns
```typescript
// Common filter object
const filters: ConversationListParams = {
  status: [ConversationStatus.OPEN],
  assignee_type: ConversationAssigneeType.ME,
  inbox_id: inboxId,
  team_id: teamId,
  labels: ['label1', 'label2'],
  page: 1,
  per_page: 20,
  sort_by: 'last_activity_at',
  sort_order: 'desc'
};
```

## 🔄 State Management Patterns

### Recoil Atom Usage
```typescript
// Reading atom
const conversations = useRecoilValue(chatwootConversationsAtom);
const accountId = useRecoilValue(chatwootSelectedAccountAtom);

// Writing atom
const [conversations, setConversations] = useRecoilState(chatwootConversationsAtom);
setConversations(newConversations);

// Setting atom
const setAccountId = useSetRecoilState(chatwootSelectedAccountAtom);
setAccountId(newAccountId);
```

### Common Atoms
```typescript
// Profile & Account
chatwootProfileAtom
chatwootSelectedAccountAtom
chatwootAccountsAtom

// Conversations
chatwootConversationsAtom
chatwootSelectedConversationAtom
chatwootConversationCountsAtom

// Messages
chatwootMessagesAtom

// Inboxes
chatwootInboxesAtom
chatwootSelectedInboxIdAtom

// Notifications
chatwootNotificationsAtom
```

## 🛠️ Utility Functions

### Filter Utilities
```typescript
import {
  buildConversationFilters,
  createFilterKey,
  matchesStatusFilter
} from '@/widgets/frontdesk/providers/chatwoot/utils/filter-utils';

// Build filters
const filters = buildConversationFilters({
  status: ConversationStatus.OPEN,
  assigneeType: ConversationAssigneeType.ME,
  inboxId: selectedInboxId
});

// Create stable filter key for caching
const filterKey = createFilterKey(filters);
```

### API Response Utilities
```typescript
import {
  extractPayload,
  extractMetadata,
  extractPaginationInfo
} from '@/widgets/frontdesk/providers/chatwoot/utils/api-response-utils';

// Extract data array from response
const conversations = extractPayload(response);

// Extract metadata
const metadata = extractMetadata(response);

// Extract pagination info
const pagination = extractPaginationInfo(response);
```

## 📁 File Structure Patterns

### New Feature Structure
```
src/widgets/frontdesk/providers/chatwoot/
├── components/
│   └── my-feature/
│       ├── my-feature.tsx
│       └── my-feature-item.tsx
├── hooks/
│   └── use-my-feature.ts
├── utils/
│   └── my-feature-utils.ts
└── types/
    └── my-feature.types.ts
```

### Service Addition Pattern
```
src/services/frontdesk/api/chatwoot/
├── services/
│   └── chatwoot-my-service.service.ts
└── types/
    └── my-service.types.ts
```

## 🎯 Common Development Tasks

### Task: Add New API Endpoint
1. Add method to service: `src/services/frontdesk/api/chatwoot/services/chatwoot-{service}.service.ts`
2. Add types: `src/services/frontdesk/api/chatwoot/types/{service}.types.ts`
3. Export from service index
4. Use in hook: `src/widgets/frontdesk/providers/chatwoot/hooks/use-{feature}.ts`
5. Use in component: `src/widgets/frontdesk/providers/chatwoot/components/`

### Task: Add New UI Component
1. Check Chatwoot reference: `chatwoot/app/javascript/dashboard/components/widgets/`
2. Create component: `src/widgets/frontdesk/providers/chatwoot/components/my-component.tsx`
3. Create hook if needed: `src/widgets/frontdesk/providers/chatwoot/hooks/use-my-component.ts`
4. Add to view: `src/widgets/frontdesk/providers/chatwoot/views/`

### Task: Add New Filter
1. Update filter types: `src/services/frontdesk/api/chatwoot/types/conversations.types.ts`
2. Update filter utils: `src/widgets/frontdesk/providers/chatwoot/utils/filter-utils.ts`
3. Update filter component: `src/widgets/frontdesk/providers/chatwoot/components/filters/`
4. Update hook: `src/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-conversations.ts`

## 🔍 Chatwoot Reference Locations

### UI Components
- Location: `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/components/widgets/`
- Pattern: Check component structure before building new ones

### API Client
- Location: `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/api/ApiClient.js`
- Pattern: See how Chatwoot structures API calls

### State Management
- Location: `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/store/modules/`
- Pattern: Understand data structures and state organization

### Routing
- Location: `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/routes/`
- Pattern: See how views are organized

## ⚡ Performance Best Practices

### Always Use
```typescript
// Memoization for derived state
const filteredData = useMemo(() => {
  return data.filter(item => item.status === filter);
}, [data, filter]);

// Callback memoization
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies]);

// Filter key for caching
const filterKey = useMemo(() => createFilterKey(filters), [filters]);
```

### Avoid
```typescript
// ❌ Don't fetch without accountId check
const data = await chatwootService.conversations.listConversations(null);

// ✅ Always check accountId first
if (!accountId) return;
const data = await chatwootService.conversations.listConversations(accountId);
```

## 🐛 Common Pitfalls

1. **Missing accountId**: Always check `accountId` exists before API calls
2. **Account scoping**: All endpoints except profile need `accountId`
3. **Filter key stability**: Use `createFilterKey()` to prevent unnecessary refetches
4. **State updates**: Always use Recoil atoms, not local state for shared data
5. **Reference patterns**: Always check Chatwoot frontend demo first

## 🔧 State Management Bug Fixes (2025)

### Fetch Deduplication
Use centralized `useFetchLock` hook instead of scattered refs/global flags:

```typescript
import { useFetchLock, FETCH_LOCK_KEYS } from './core/use-fetch-lock';

const { acquireLock, releaseLock, isLocked } = useFetchLock();

const fetchData = async () => {
  if (!acquireLock(FETCH_LOCK_KEYS.PROFILE)) {
    return; // Another component is fetching
  }
  try {
    const data = await chatwootService.profile.getProfile();
  } finally {
    releaseLock(FETCH_LOCK_KEYS.PROFILE);
  }
};
```

### LRU Cache Sorting
Use explicit `> 0` checks (not `||` operator which treats `0` as falsy):

```typescript
// ❌ Wrong - 0 is falsy, falls back incorrectly
const time = entry.lastAccessed || entry.timestamp || 0;

// ✅ Correct - explicit check
const time = entry.lastAccessed > 0 ? entry.lastAccessed : entry.timestamp > 0 ? entry.timestamp : 0;
```

### Recoil Callback Closures
Read from snapshot inside callbacks, not closure variables:

```typescript
// ❌ Wrong - stale closure
const getCacheEntries = useRecoilCallback(({ snapshot }) => () => {
  cacheKeys.forEach(key => { ... }); // Stale!
}, [cacheKeys]);

// ✅ Correct - read from snapshot
const getCacheEntries = useRecoilCallback(({ snapshot }) => () => {
  const currentKeys = snapshot.getLoadable(cacheKeysAtom).getValue();
  currentKeys.forEach(key => { ... });
}, []);
```

### Event Listener Cleanup
Use named function references (not arrow functions):

```typescript
// ❌ Wrong - different references, memory leak!
service.on('event', () => handler());
return () => service.off('event', () => handler());

// ✅ Correct - same reference
const handleEvent = () => handler();
service.on('event', handleEvent);
return () => service.off('event', handleEvent);
```

### Persistence Serialize/Deserialize Contract
`saveToStorage` must serialize only the inner value, not the wrapper:

```typescript
// ❌ Wrong - serialize received entire wrapper
const wrapper = { value, version, timestamp };
localStorage.setItem(key, serialize(wrapper)); // Breaks deserialize contract!

// ✅ Correct - serialize inner value only, wrap with JSON
const serializedValue = serialize(value);  // Inner value only
const wrapper = { value: serializedValue, version, timestamp };
localStorage.setItem(key, JSON.stringify(wrapper));  // Wrapper is always JSON
```

### Falsy Check for Optional Numbers
Use `!== undefined` instead of `?` for optional number parameters:

```typescript
// ❌ Wrong - 0 is falsy, falls back incorrectly
const target = count ? currentSize - count : defaultValue;

// ✅ Correct - explicit undefined check
const target = count !== undefined ? currentSize - count : defaultValue;
```

## 📞 Quick Help

- **Architecture**: `docs/frontdesk/FRONTDESK_CHATWOOT_ARCHITECTURE.md`
- **API Docs**: `src/services/frontdesk/api/chatwoot/README.md`
- **Component Patterns**: `src/widgets/frontdesk/providers/chatwoot/README.md`
- **Chatwoot Reference**: `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/`

## 🆕 New Acceleration Files

### Quick Commands (`quick-commands.md`)
Copy-paste commands for:
- Development server
- File operations
- Search & find
- Debugging
- Git operations

### Troubleshooting (`troubleshooting.md`)
Solutions for:
- Common errors (accountId, API responses, infinite loops)
- Debugging checklist
- Network issues
- State management problems

### Performance Patterns (`performance-patterns.md`)
Optimized patterns for:
- Preventing duplicate API calls
- Stable filter keys
- Memoization
- Component optimization
- Common pitfalls

## ⚡ Performance Quick Tips

1. **Always use base hooks**: `useChatwootDataFetch` prevents duplicate requests
2. **Use filter keys**: `createFilterKey()` prevents unnecessary refetches
3. **Memoize everything**: `useMemo`/`useCallback` for stable references
4. **Check accountId**: Always verify before API calls
5. **Use Recoil**: Shared state, not local state

See `performance-patterns.md` for detailed patterns.

