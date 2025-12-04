# API Reference - FrontDesk Chatwoot

**Base**: `chatwootService` from `@/services/frontdesk`

## Profile (no accountId)
```typescript
chatwootService.profile.getProfile()  // GET /api/v1/profile
```

## Conversations (accountId required)
```typescript
listConversations(accountId, filters?)       // GET conversations
getConversationDetails(accountId, id)        // GET conversations/{id}
updateConversation(accountId, id, data)      // PUT conversations/{id}
searchConversations(accountId, query)        // GET conversations/search?q=
updateLabels(accountId, id, labels)          // POST conversations/{id}/labels
```

## Messages (accountId + conversationId required)
```typescript
listMessages(accountId, convId)              // GET conversations/{id}/messages
createMessage(accountId, convId, data)       // POST conversations/{id}/messages
deleteMessage(accountId, convId, msgId)      // DELETE conversations/{id}/messages/{msgId}
```

## Inboxes (accountId required)
```typescript
listAllInboxes()                             // GET inboxes
getInboxDetails(accountId, inboxId)          // GET inboxes/{id}
```

## Contacts (accountId required)
```typescript
listContacts(accountId, filters?)            // GET contacts
getContactDetails(accountId, contactId)      // GET contacts/{id}
searchContacts(accountId, query)             // GET contacts/search?q=
createContact(accountId, data)               // POST contacts
```

## Other Services
```typescript
chatwootService.notifications.listNotifications(filters?)  // GET notifications
chatwootService.agents.listAgents(accountId)               // GET agents
chatwootService.teams.listTeams(accountId)                 // GET teams
```

## Filter Types
```typescript
const filters: ConversationListParams = {
  status: [ConversationStatus.OPEN],
  assignee_type: ConversationAssigneeType.ME,
  inbox_id: number,
  team_id: number,
  labels: string[],
  page: number,
  per_page: number,
  sort_by: 'last_activity_at',
  sort_order: 'desc'
};
```

## Response Extraction
```typescript
import { extractPayload, extractMetadata } from '@/widgets/frontdesk/providers/chatwoot/utils/api-response-utils';

const response = await chatwootService.conversations.listConversations(accountId);
const conversations = extractPayload(response);  // Data array
const meta = extractMetadata(response);          // Pagination info
```
