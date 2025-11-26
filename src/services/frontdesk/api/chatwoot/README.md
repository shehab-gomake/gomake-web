# Chatwoot API Integration

Comprehensive Chatwoot API integration for FrontDesk with modular, extensible architecture.

## Architecture

The Chatwoot integration follows a modular service architecture:

```
chatwoot/
├── core/
│   ├── base-chatwoot-service.ts   # Base class with account-scoped URL helpers
│   └── index.ts
├── services/                               # 13 service files
│   ├── chatwoot-profile.service.ts         # User profile (no account_id)
│   ├── chatwoot-conversations.service.ts   # Conversation management
│   ├── chatwoot-contacts.service.ts        # Contact management
│   ├── chatwoot-messages.service.ts        # Message operations
│   ├── chatwoot-inboxes.service.ts         # Inbox/channel management
│   ├── chatwoot-agents.service.ts          # Agent/user management
│   ├── chatwoot-teams.service.ts           # Team management
│   ├── chatwoot-labels.service.ts          # Label management
│   ├── chatwoot-notifications.service.ts   # Notification operations
│   ├── chatwoot-oauth.service.ts           # OAuth authorization
│   ├── chatwoot-contact-resolution.service.ts      # Helper: Contact resolution
│   ├── chatwoot-inbox-resolution.service.ts        # Helper: Inbox resolution
│   ├── chatwoot-conversation-composer.service.ts   # Helper: Compose validation
│   └── index.ts
├── types/
│   ├── profile.types.ts   # Profile-related types
│   └── index.ts
├── chatwoot-http-client.ts  # Base HTTP client
├── chatwoot.service.ts      # Main aggregator service
└── index.ts                  # Public exports
```

## Configuration

- **Base URL**: `http://localhost:8080` (configurable)
- **API Version**: v1 (`/api/v1/*`)
- **Authentication**: GoMake Bearer Token (automatically included)
- **Content-Type**: `application/json`

## Usage

### Main Service (Recommended)

The main `ChatwootService` provides organized access to all API groups:

```typescript
import { chatwootService } from '@/services/frontdesk';

// Profile operations (no account_id needed)
const user = await chatwootService.profile.getProfile();
console.log(user.name, user.email, user.accounts);

// Conversation operations
const conversations = await chatwootService.conversations.listConversations(accountId, {
  page: 1,
  status: ['open']
});

// Get conversation details
const conversation = await chatwootService.conversations.getConversationDetails(
  accountId, 
  conversationId
);

// Contact operations
const contacts = await chatwootService.contacts.listContacts(accountId, { page: 1 });
const contact = await chatwootService.contacts.getContactDetails(accountId, contactId);

// Message operations
const messages = await chatwootService.messages.listMessages(accountId, conversationId);
const message = await chatwootService.messages.createMessage(accountId, conversationId, {
  content: "Hello!",
  message_type: "outgoing"
});
```

### Individual Services (Advanced)

For advanced use cases, you can import and instantiate individual services:

```typescript
import { ChatwootConversationsService } from '@/services/frontdesk/api/chatwoot';

const conversationsService = new ChatwootConversationsService("http://localhost:8080");
const conversations = await conversationsService.listConversations(accountId);
```

### Types

```typescript
import { ChatwootUser, ChatwootUserAccount } from '@/services/frontdesk';

// Types are available for all Chatwoot API responses
const user: ChatwootUser = await chatwootService.profile.getProfile();
```

## Adding New Endpoints

The architecture makes it easy to add new endpoints:

### 1. Add to Existing Service

If the endpoint belongs to an existing API group:

```typescript
// In chatwoot-conversations.service.ts
async myNewEndpoint(accountId: number, param: string): Promise<any> {
  return await this.get<any>(
    this.accountScopedUrl(accountId, `conversations/${param}`)
  );
}
```

### 2. Create New Service

For a new API group:

1. Create service file: `services/chatwoot-{group}.service.ts`
2. Extend `BaseChatwootService`
3. Add methods following the pattern
4. Export from `services/index.ts`
5. Add to main `ChatwootService` aggregator

```typescript
// services/chatwoot-inboxes.service.ts
export class ChatwootInboxesService extends BaseChatwootService {
  constructor(baseUrl?: string) {
    super(baseUrl);
  }

  async listInboxes(accountId: number): Promise<any> {
    return await this.get<any>(
      this.accountScopedUrl(accountId, "inboxes")
    );
  }
}

// Then add to chatwoot.service.ts
public readonly inboxes: ChatwootInboxesService;
// And initialize in constructor
this.inboxes = new ChatwootInboxesService(this.baseUrl);
```

### 3. Add Types (if needed)

```typescript
// types/inboxes.types.ts
export interface ChatwootInbox {
  id: number;
  name: string;
  // ...
}

// Export from types/index.ts
export * from "./inboxes.types";
```

## URL Building Helpers

The `BaseChatwootService` provides convenient URL builders:

```typescript
// Account-scoped URLs (most common)
this.accountScopedUrl(accountId, "conversations")
// => "/api/v1/accounts/123/conversations"

this.accountScopedUrl(accountId, "conversations/456/messages")
// => "/api/v1/accounts/123/conversations/456/messages"

// Global URLs (like profile)
this.globalUrl("profile")
// => "/api/v1/profile"
```

## Error Handling

All services use the base HTTP client which includes comprehensive error handling:

```typescript
try {
  const user = await chatwootService.profile.getProfile();
} catch (error) {
  console.error('Chatwoot API Error:', error);
  // Error includes status, message, and URL details
}
```

## Available API Groups

### ✅ Implemented (10 Main Services)

1. **Profile** - User profile endpoints (no account_id needed)
2. **Conversations** - Conversation management (list, create, update, filter, search, labels, status changes, toggle, assign)
3. **Contacts** - Contact management (list, create, update, delete, search, filter, conversations)
4. **Messages** - Message operations (list, create, delete, translations, attachments)
5. **Inboxes** - Inbox/channel configuration (list, create, update, webhooks, agents)
6. **Agents** - Agent/user management (list, update, availability status, inbox assignments)
7. **Teams** - Team management (list, create, update, members)
8. **Labels** - Label management (list, create, update, delete)
9. **Notifications** - Notification operations (list, mark read, unread count, snooze, delete)
10. **OAuth** - OAuth authorization for Gmail/Outlook channel connections

### 🔧 Helper Services (3 Services)

1. **Contact Resolution** - Resolve contacts by email or phone number
2. **Inbox Resolution** - Resolve inboxes by channel type
3. **Conversation Composer** - Create conversations with validation and error handling

### 📋 Available for Future Implementation

Based on Chatwoot API documentation:

- **Accounts** - Account management endpoints
- **Automation** - Automation rules
- **Canned Responses** - Template messages
- **Custom Attributes** - Custom fields for contacts/conversations
- **Integrations** - Third-party integration management
- **Reports** - Analytics and reporting
- **Help Center** - Knowledge base management
- **Audit Logs** - Activity tracking and logs

## Patterns & Best Practices

1. **Always use `accountScopedUrl()` for account-based endpoints**
2. **Use TypeScript types for all requests/responses**
3. **Follow existing service patterns when adding new endpoints**
4. **Document all methods with JSDoc comments**
5. **Include references to API documentation files**
6. **Handle pagination consistently** (use query params)
7. **Use the main aggregator service for most use cases**

## Testing

```typescript
// Example test pattern
const chatwootService = new ChatwootService("http://localhost:8080");

// Test profile endpoint
const user = await chatwootService.profile.getProfile();
expect(user).toHaveProperty('id');
expect(user).toHaveProperty('email');
```

## Migration Guide

If you were using the old structure:

```typescript
// Old (still works via exports)
import { chatwootService } from '@/services/frontdesk';
const user = await chatwootService.getProfile();

// New (recommended)
import { chatwootService } from '@/services/frontdesk';
const user = await chatwootService.profile.getProfile();
```
