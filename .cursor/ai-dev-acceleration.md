# AI Development Acceleration - FrontDesk Chatwoot

## 🚀 Quick Patterns

### Imports
```typescript
import { chatwootService } from '@/services/frontdesk';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { chatwootSelectedAccountAtom, chatwootConversationsAtom } from '@/store/frontdesk/atoms/chatwoot.atoms';
import { ChatwootConversation, ConversationStatus } from '@/services/frontdesk/api/chatwoot/types';
```

### Service Usage
```typescript
// Profile (no accountId)
const user = await chatwootService.profile.getProfile();

// Conversations (requires accountId)
const conversations = await chatwootService.conversations.listConversations(
  accountId, { status: ['open'], page: 1, per_page: 20 }
);

// Messages (requires accountId + conversationId)
const messages = await chatwootService.messages.listMessages(accountId, conversationId);
const sent = await chatwootService.messages.createMessage(accountId, conversationId, {
  content: 'Hello!', message_type: 'outgoing'
});
```

### Hook Pattern
```typescript
export const useMyFeature = () => {
  const accountId = useRecoilValue(chatwootSelectedAccountAtom);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!accountId) return;
    setLoading(true);
    try {
      const result = await chatwootService.myService.getData(accountId);
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, refresh: fetchData };
};
```

### Component Pattern
```typescript
export const MyComponent: React.FC = () => {
  const { data, loading, error } = useMyFeature();
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;
  return <div>{/* UI */}</div>;
};
```

## 📁 File Structure

```
src/widgets/frontdesk/providers/chatwoot/
├── components/my-feature/
│   └── my-feature.tsx
├── hooks/use-my-feature.ts
├── utils/my-feature-utils.ts
└── types/my-feature.types.ts

src/services/frontdesk/api/chatwoot/
├── services/chatwoot-my-service.service.ts
└── types/my-service.types.ts
```

## 🎨 Common Types
```typescript
import {
  ChatwootConversation, ChatwootMessage, ChatwootInbox, ChatwootContact,
  ConversationStatus, ConversationAssigneeType, ConversationListParams
} from '@/services/frontdesk/api/chatwoot/types';

// Status values
ConversationStatus.OPEN | ConversationStatus.RESOLVED | ConversationStatus.PENDING

// Assignee types  
ConversationAssigneeType.ME | ConversationAssigneeType.UNASSIGNED | ConversationAssigneeType.ALL
```

## 🛠️ Utilities
```typescript
import { buildConversationFilters, createFilterKey } from '@/widgets/frontdesk/providers/chatwoot/utils/filter-utils';
import { extractPayload, extractMetadata } from '@/widgets/frontdesk/providers/chatwoot/utils/api-response-utils';

const filters = buildConversationFilters({ status: ConversationStatus.OPEN, assigneeType: ConversationAssigneeType.ME });
const filterKey = createFilterKey(filters);  // Stable key for caching

const response = await chatwootService.conversations.listConversations(accountId);
const conversations = extractPayload(response);
```

## ⚡ Performance

```typescript
// Memoize derived state
const filtered = useMemo(() => data.filter(x => x.status === filter), [data, filter]);

// Memoize callbacks
const handleClick = useCallback(() => { /* logic */ }, [deps]);

// Stable filter keys
const filterKey = useMemo(() => createFilterKey(filters), [filters]);

// Always check accountId
if (!accountId) return;
```

## 🐛 Common Pitfalls

1. **Missing accountId** - Always check before API calls
2. **Unstable filter keys** - Use `createFilterKey()` 
3. **Local state for shared data** - Use Recoil atoms
4. **No reference check** - Always check Chatwoot demo first

## 🔧 Bug Fix Patterns

### Fetch Deduplication
```typescript
import { useFetchLock, FETCH_LOCK_KEYS } from './core/use-fetch-lock';

const { acquireLock, releaseLock } = useFetchLock();
const fetchData = async () => {
  if (!acquireLock(FETCH_LOCK_KEYS.PROFILE)) return;
  try { /* fetch */ } finally { releaseLock(FETCH_LOCK_KEYS.PROFILE); }
};
```

### Event Listener Cleanup
```typescript
// ✅ Same reference
const handleEvent = () => handler();
service.on('event', handleEvent);
return () => service.off('event', handleEvent);
```

### LRU Cache Sorting
```typescript
// ✅ Explicit check (0 is falsy!)
const time = entry.lastAccessed > 0 ? entry.lastAccessed : entry.timestamp > 0 ? entry.timestamp : 0;
```

## 📞 Quick Help

- **Architecture**: `docs/frontdesk/FRONTDESK_CHATWOOT_ARCHITECTURE.md`
- **API Docs**: `src/services/frontdesk/api/chatwoot/README.md`
- **Chatwoot Ref**: `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/`
