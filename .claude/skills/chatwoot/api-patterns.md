---
name: chatwoot-api-patterns
description: Use when implementing API calls, creating new service methods, or understanding how Chatwoot structures API clients with account-scoped URLs and CRUD operations
---

# Chatwoot API Client Patterns

## When to Use This Skill

- Implementing new API calls in FrontDesk
- Creating new service methods that call Chatwoot endpoints
- Understanding account-scoped URL construction
- Learning how to handle API errors and responses
- Structuring API client classes or services

## Core Pattern: ApiClient Base Class

Chatwoot uses a **base class pattern** for all API clients. Every domain-specific API client extends this base class.

**Location:** `app/javascript/dashboard/api/ApiClient.js:1`

### Base Class Structure

```javascript
class ApiClient {
  constructor(resource, options = {}) {
    this.apiVersion = `/api/${options.apiVersion || 'v1'}`;
    this.options = options;
    this.resource = resource;
  }

  get url() {
    return `${this.baseUrl()}/${this.resource}`;
  }

  baseUrl() {
    let url = this.apiVersion;
    if (this.options.accountScoped) {
      const isInsideAccountScopedURLs = window.location.pathname.includes(
        '/app/accounts'
      );
      if (isInsideAccountScopedURLs) {
        const accountId = window.location.pathname.split('/')[3];
        url = `${url}/accounts/${accountId}`;
      }
    }
    return url;
  }

  // Standard CRUD methods
  get(url = '', params = {}) {
    return axios.get(url || this.url, { params });
  }

  show(id, params = {}) {
    return axios.get(`${this.url}/${id}`, { params });
  }

  create(data) {
    return axios.post(this.url, data);
  }

  update(id, data) {
    return axios.patch(`${this.url}/${id}`, data);
  }

  delete(id) {
    return axios.delete(`${this.url}/${id}`);
  }
}

export default ApiClient;
```

### Key Features

1. **Account Scoping**: Automatically adds `/accounts/{accountId}` to URLs when `accountScoped: true`
2. **URL Construction**: Builds URLs from base API version + resource name
3. **Standard CRUD**: Provides get, show, create, update, delete methods
4. **Extensible**: Child classes can add custom methods
5. **Account ID Detection**: Extracts account ID from browser URL path

## URL Pattern Examples

### Without Account Scoping
```javascript
new ApiClient('platform/accounts', { accountScoped: false });
// URL: /api/v1/platform/accounts
```

### With Account Scoping
```javascript
new ApiClient('conversations', { accountScoped: true });
// URL: /api/v1/accounts/123/conversations
//      (123 extracted from window.location.pathname)
```

## Pattern 1: Simple Wrapper API Client

For basic CRUD operations without custom logic.

**Location:** `app/javascript/dashboard/api/conversations.js:1`

```javascript
import ApiClient from './ApiClient';

class ConversationApi extends ApiClient {
  constructor() {
    super('conversations', { accountScoped: true });
  }

  // Add domain-specific methods
  getLabels(conversationID) {
    return axios.get(`${this.url}/${conversationID}/labels`);
  }

  updateLabels(conversationID, labels) {
    return axios.post(`${this.url}/${conversationID}/labels`, { labels });
  }
}

export default new ConversationApi();
```

### Usage

```javascript
import ConversationApi from 'dashboard/api/conversations';

// Get all conversations
const response = await ConversationApi.get();

// Get single conversation
const response = await ConversationApi.show(123);

// Get conversation labels
const response = await ConversationApi.getLabels(123);
```

## Pattern 2: Complex API Client with Helpers

For operations that need payload transformation or complex logic.

**Location:** `app/javascript/dashboard/api/inbox/message.js:1`

```javascript
import ApiClient from '../ApiClient';

// Helper to build FormData for file uploads
const buildCreatePayload = ({
  message,
  isPrivate,
  contentAttributes,
  files,
  ccEmails = '',
  bccEmails = '',
  templateParams = {},
}) => {
  let payload;
  if (files && files.length !== 0) {
    // Use FormData for file uploads
    payload = new FormData();
    payload.append('content', message);
    payload.append('private', isPrivate);
    payload.append('cc_emails', ccEmails);
    payload.append('bcc_emails', bccEmails);
    payload.append('template_params', JSON.stringify(templateParams));
    files.forEach(file => {
      payload.append('attachments[]', file);
    });
    if (contentAttributes) {
      payload.append('content_attributes', JSON.stringify(contentAttributes));
    }
  } else {
    // Use JSON for text-only messages
    payload = {
      content: message,
      private: isPrivate,
      cc_emails: ccEmails,
      bcc_emails: bccEmails,
      template_params: templateParams,
      content_attributes: contentAttributes,
    };
  }
  return payload;
};

class MessageApi extends ApiClient {
  constructor() {
    super('conversations', { accountScoped: true });
  }

  create({
    conversationId,
    message,
    private: isPrivate = false,
    contentAttributes = {},
    files = [],
    ccEmails = '',
    bccEmails = '',
    templateParams = {},
  }) {
    const payload = buildCreatePayload({
      message,
      isPrivate,
      contentAttributes,
      files,
      ccEmails,
      bccEmails,
      templateParams,
    });

    return axios.post(`${this.url}/${conversationId}/messages`, payload);
  }

  getPreviousMessages({ conversationId, before }) {
    return axios.get(`${this.url}/${conversationId}/messages`, {
      params: { before },
    });
  }

  delete(conversationID, messageId) {
    return axios.delete(`${this.url}/${conversationID}/messages/${messageId}`);
  }

  retry(conversationID, messageId) {
    return axios.post(
      `${this.url}/${conversationID}/messages/${messageId}/retry`
    );
  }
}

export default new MessageApi();
```

### Key Patterns

1. **Helper Functions**: `buildCreatePayload()` transforms input to correct format
2. **FormData for Files**: Use FormData when uploading attachments
3. **JSON for Text**: Use plain object for text-only messages
4. **Custom Methods**: `getPreviousMessages()`, `delete()`, `retry()`
5. **Nested Resources**: Messages are nested under conversations

### Usage

```javascript
import MessageApi from 'dashboard/api/inbox/message';

// Send text message
await MessageApi.create({
  conversationId: 123,
  message: 'Hello!',
  private: false,
});

// Send message with files
await MessageApi.create({
  conversationId: 123,
  message: 'See attached',
  files: [file1, file2],
  private: false,
});

// Get previous messages (pagination)
await MessageApi.getPreviousMessages({
  conversationId: 123,
  before: messageId,
});

// Retry failed message
await MessageApi.retry(123, messageId);
```

## Pattern 3: API Client with Query Parameters

For list endpoints that support filtering, pagination, sorting.

**Location:** `app/javascript/dashboard/api/contacts.js:1`

```javascript
import ApiClient from './ApiClient';

class ContactAPI extends ApiClient {
  constructor() {
    super('contacts', { accountScoped: true });
  }

  get(page = 1, sortAttr = 'name', label = '') {
    const params = {
      page,
      sort: sortAttr,
    };
    if (label) {
      params.labels = [label];
    }
    return axios.get(this.url, { params });
  }

  search(searchQuery = '', page = 1, sortAttr = 'name', label = '') {
    const params = {
      q: searchQuery,
      page,
      sort: sortAttr,
    };
    if (label) {
      params.labels = [label];
    }
    return axios.get(`${this.url}/search`, { params });
  }

  filter(page = 1, queryPayload = {}) {
    const params = {
      page,
      payload: queryPayload,
    };
    return axios.post(`${this.url}/filter`, params);
  }

  merge(childId, parentId) {
    return axios.post(`${this.url}/${childId}/merge`, {
      parent_id: parentId,
    });
  }
}

export default new ContactAPI();
```

### Usage

```javascript
import ContactAPI from 'dashboard/api/contacts';

// List contacts with pagination
await ContactAPI.get(1, 'name', 'vip-label');

// Search contacts
await ContactAPI.search('john doe', 1, 'name');

// Filter contacts with complex query
await ContactAPI.filter(1, {
  name: { operator: 'contains', value: 'john' },
  email: { operator: 'equals', value: 'john@example.com' },
});

// Merge duplicate contacts
await ContactAPI.merge(456, 123); // Merge 456 into 123
```

## Pattern 4: Inbox/Channel-Specific API

For operations specific to a channel/inbox.

**Location:** `app/javascript/dashboard/api/inboxes.js:1`

```javascript
import ApiClient from './ApiClient';

class InboxesAPI extends ApiClient {
  constructor() {
    super('inboxes', { accountScoped: true });
  }

  getCampaigns(inboxId) {
    return axios.get(`${this.url}/${inboxId}/campaigns`);
  }

  deleteInboxAvatar(inboxId) {
    return axios.delete(`${this.url}/${inboxId}/avatar`);
  }

  getAgentBot(inboxId) {
    return axios.get(`${this.url}/${inboxId}/agent_bot`);
  }

  setAgentBot(inboxId, botId) {
    return axios.post(`${this.url}/${inboxId}/set_agent_bot`, {
      agent_bot: botId,
    });
  }
}

export default new InboxesAPI();
```

## Error Handling Pattern

Chatwoot handles API errors at the component level:

```vue
<script setup>
import MessageApi from 'dashboard/api/inbox/message';

const sendMessage = async () => {
  try {
    const response = await MessageApi.create({
      conversationId: conversationId.value,
      message: message.value,
    });

    // Success handling
    showSuccessNotification('Message sent!');
  } catch (error) {
    // Error handling
    if (error.response) {
      // Server responded with error
      const { message } = error.response.data;
      showErrorNotification(message || 'Failed to send message');
    } else {
      // Network error
      showErrorNotification('Network error. Please try again.');
    }
  }
};
</script>
```

## Response Structure

Chatwoot API responses follow consistent patterns:

### Single Resource
```json
{
  "id": 123,
  "content": "Hello world",
  "created_at": "2025-01-12T10:00:00Z",
  "conversation_id": 456,
  ...
}
```

### Collection with Pagination
```json
{
  "data": {
    "meta": {
      "count": 50,
      "current_page": 1,
      "all_count": 200
    },
    "payload": [
      { "id": 1, ... },
      { "id": 2, ... }
    ]
  }
}
```

## Key API Clients Reference

| Domain | File Path | Account Scoped |
|--------|-----------|----------------|
| **Conversations** | `api/conversations.js` | Yes |
| **Messages** | `api/inbox/message.js` | Yes |
| **Contacts** | `api/contacts.js` | Yes |
| **Inboxes** | `api/inboxes.js` | Yes |
| **Agents** | `api/agents.js` | Yes |
| **Teams** | `api/teams.js` | Yes |
| **Labels** | `api/labels.js` | Yes |
| **Canned Responses** | `api/cannedResponse.js` | Yes |
| **Notifications** | `api/notifications.js` | Yes |
| **Reports** | `api/reports.js` | Yes |

## Common Patterns Summary

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Simple Wrapper** | Basic CRUD | `ConversationApi` |
| **Payload Builder** | Complex data transformation | `MessageApi.create()` |
| **Query Parameters** | Filtering, pagination, search | `ContactAPI.get()` |
| **Nested Resources** | Sub-resources | `/conversations/{id}/messages` |
| **Custom Actions** | Non-CRUD operations | `ContactAPI.merge()` |
| **FormData** | File uploads | `MessageApi.create()` with files |

## Best Practices

1. **Always extend ApiClient** - Don't create standalone API functions
2. **Use account scoping** - Set `accountScoped: true` for tenant data
3. **Export singleton instance** - `export default new ConversationApi()`
4. **Handle files with FormData** - Use FormData for any file uploads
5. **Use params for GET** - Pass query params via axios `{ params }` option
6. **Build URL from base** - Use `${this.url}/...` for nested resources
7. **Transform data in helpers** - Keep API client methods clean with helper functions

## Adapting to FrontDesk

When implementing in FrontDesk (React/TypeScript):

1. Create service classes instead of singleton instances
2. Use TypeScript interfaces for request/response types
3. Inject `HttpClient` via dependency injection
4. Return typed responses
5. Keep the URL construction pattern
6. Maintain account-scoped architecture

**Example FrontDesk equivalent:**
```typescript
// src/services/frontdesk/api/chatwoot/services/chatwoot-messages.service.ts
export class ChatwootMessagesService {
  constructor(private httpClient: ChatwootHttpClient) {}

  async createMessage(
    accountId: number,
    conversationId: number,
    data: CreateMessageDto
  ): Promise<Message> {
    const url = `/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`;
    return this.httpClient.post<Message>(url, data);
  }
}
```

## References

- **ApiClient Base:** `app/javascript/dashboard/api/ApiClient.js:1`
- **Message API:** `app/javascript/dashboard/api/inbox/message.js:1`
- **Conversation API:** `app/javascript/dashboard/api/conversations.js:1`
- **Contact API:** `app/javascript/dashboard/api/contacts.js:1`
- **All API Clients:** `app/javascript/dashboard/api/`
