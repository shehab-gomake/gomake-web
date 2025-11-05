# FrontDesk Chatwoot API Reference

Quick reference for all Chatwoot API endpoints available in FrontDesk.

## Base Configuration

- **Base URL**: `http://localhost:8080` (dev) or Cloud Run URL (prod)
- **API Version**: v1 (`/api/v1/*`)
- **Authentication**: JWT Bearer token (automatically included)
- **Service**: `chatwootService` from `@/services/frontdesk`

## Service Groups

```typescript
import { chatwootService } from '@/services/frontdesk';

// Available service groups:
chatwootService.profile         // User profile (no accountId)
chatwootService.conversations  // Conversation management
chatwootService.messages       // Message operations
chatwootService.inboxes        // Inbox/channel management
chatwootService.contacts        // Contact management
chatwootService.notifications  // Notification operations
chatwootService.agents         // Agent/user management
chatwootService.teams          // Team management
```

---

## Profile Service

**No accountId required**

### `getProfile()`
```typescript
const user = await chatwootService.profile.getProfile();
```
- **Endpoint**: `GET /api/v1/profile`
- **Returns**: `ChatwootUser` with accounts array
- **Use case**: Get current user profile and available accounts

---

## Conversations Service

**All methods require `accountId`**

### `listConversations(accountId, filters?)`
```typescript
const conversations = await chatwootService.conversations.listConversations(
  accountId,
  {
    status: ['open'],
    assignee_type: 'me',
    inbox_id: 1,
    team_id: 1,
    labels: ['label1'],
    page: 1,
    per_page: 20,
    sort_by: 'last_activity_at',
    sort_order: 'desc'
  }
);
```
- **Endpoint**: `GET /api/v1/accounts/{accountId}/conversations`
- **Returns**: `{ payload: ChatwootConversation[], meta: {...} }`
- **Use case**: List conversations with filters

### `getConversationDetails(accountId, conversationId)`
```typescript
const conversation = await chatwootService.conversations.getConversationDetails(
  accountId,
  conversationId
);
```
- **Endpoint**: `GET /api/v1/accounts/{accountId}/conversations/{id}`
- **Returns**: `ChatwootConversation`
- **Use case**: Get single conversation details

### `updateConversation(accountId, conversationId, data)`
```typescript
const updated = await chatwootService.conversations.updateConversation(
  accountId,
  conversationId,
  { status: 'resolved' }
);
```
- **Endpoint**: `PUT /api/v1/accounts/{accountId}/conversations/{id}`
- **Returns**: `ChatwootConversation`
- **Use case**: Update conversation status, assignee, etc.

### `searchConversations(accountId, query)`
```typescript
const results = await chatwootService.conversations.searchConversations(
  accountId,
  'search query'
);
```
- **Endpoint**: `GET /api/v1/accounts/{accountId}/conversations/search?q={query}`
- **Returns**: `{ payload: ChatwootConversation[] }`
- **Use case**: Search conversations

### `updateLabels(accountId, conversationId, labels)`
```typescript
await chatwootService.conversations.updateLabels(
  accountId,
  conversationId,
  ['label1', 'label2']
);
```
- **Endpoint**: `POST /api/v1/accounts/{accountId}/conversations/{id}/labels`
- **Returns**: `{ labels: ChatwootLabel[] }`
- **Use case**: Update conversation labels

---

## Messages Service

**All methods require `accountId` and `conversationId`**

### `listMessages(accountId, conversationId)`
```typescript
const messages = await chatwootService.messages.listMessages(
  accountId,
  conversationId
);
```
- **Endpoint**: `GET /api/v1/accounts/{accountId}/conversations/{id}/messages`
- **Returns**: `{ payload: ChatwootMessage[] }`
- **Use case**: Get conversation messages

### `createMessage(accountId, conversationId, data)`
```typescript
const message = await chatwootService.messages.createMessage(
  accountId,
  conversationId,
  {
    content: 'Hello!',
    message_type: 'outgoing',
    private: false
  }
);
```
- **Endpoint**: `POST /api/v1/accounts/{accountId}/conversations/{id}/messages`
- **Returns**: `ChatwootMessage`
- **Use case**: Send a message

### `deleteMessage(accountId, conversationId, messageId)`
```typescript
await chatwootService.messages.deleteMessage(
  accountId,
  conversationId,
  messageId
);
```
- **Endpoint**: `DELETE /api/v1/accounts/{accountId}/conversations/{id}/messages/{messageId}`
- **Returns**: `void`
- **Use case**: Delete a message

---

## Inboxes Service

**All methods require `accountId`**

### `listAllInboxes()`
```typescript
const inboxes = await chatwootService.inboxes.listAllInboxes();
```
- **Endpoint**: `GET /api/v1/accounts/{accountId}/inboxes`
- **Returns**: `{ payload: ChatwootInbox[] }`
- **Use case**: List all inboxes/channels

### `getInboxDetails(accountId, inboxId)`
```typescript
const inbox = await chatwootService.inboxes.getInboxDetails(accountId, inboxId);
```
- **Endpoint**: `GET /api/v1/accounts/{accountId}/inboxes/{id}`
- **Returns**: `ChatwootInbox`
- **Use case**: Get inbox details

---

## Contacts Service

**All methods require `accountId`**

### `listContacts(accountId, filters?)`
```typescript
const contacts = await chatwootService.contacts.listContacts(accountId, {
  page: 1,
  per_page: 20
});
```
- **Endpoint**: `GET /api/v1/accounts/{accountId}/contacts`
- **Returns**: `{ payload: ChatwootContact[] }`
- **Use case**: List contacts

### `getContactDetails(accountId, contactId)`
```typescript
const contact = await chatwootService.contacts.getContactDetails(accountId, contactId);
```
- **Endpoint**: `GET /api/v1/accounts/{accountId}/contacts/{id}`
- **Returns**: `ChatwootContact`
- **Use case**: Get contact details

---

## Notifications Service

**No accountId required**

### `listNotifications(filters?)`
```typescript
const notifications = await chatwootService.notifications.listNotifications({
  page: 1,
  sort_order: 'desc'
});
```
- **Endpoint**: `GET /api/v1/notifications`
- **Returns**: `{ payload: ChatwootNotification[] }`
- **Use case**: List user notifications

---

## Agents Service

**All methods require `accountId`**

### `listAgents(accountId)`
```typescript
const agents = await chatwootService.agents.listAgents(accountId);
```
- **Endpoint**: `GET /api/v1/accounts/{accountId}/agents`
- **Returns**: `{ payload: ChatwootAgent[] }`
- **Use case**: List account agents

---

## Teams Service

**All methods require `accountId`**

### `listTeams(accountId)`
```typescript
const teams = await chatwootService.teams.listTeams(accountId);
```
- **Endpoint**: `GET /api/v1/accounts/{accountId}/teams`
- **Returns**: `{ payload: ChatwootTeam[] }`
- **Use case**: List account teams

---

## Common Patterns

### Error Handling
```typescript
try {
  const data = await chatwootService.conversations.listConversations(accountId);
} catch (error) {
  console.error('API Error:', error);
  // Handle error
}
```

### AccountId Check
```typescript
if (!accountId) {
  return; // or show error
}
const data = await chatwootService.conversations.listConversations(accountId);
```

### Response Extraction
```typescript
import { extractPayload, extractMetadata } from '@/widgets/frontdesk/providers/chatwoot/utils/api-response-utils';

const response = await chatwootService.conversations.listConversations(accountId);
const conversations = extractPayload(response);
const metadata = extractMetadata(response);
```

---

## Type Definitions

All types are available from:
```typescript
import {
  ChatwootUser,
  ChatwootConversation,
  ChatwootMessage,
  ChatwootInbox,
  ChatwootContact,
  ChatwootNotification,
  ChatwootAgent,
  ChatwootTeam,
  ConversationStatus,
  ConversationAssigneeType,
  ConversationListParams
} from '@/services/frontdesk/api/chatwoot/types';
```

