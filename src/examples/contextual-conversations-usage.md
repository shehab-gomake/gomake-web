# Contextual Conversations Usage Examples

The POST /api/dms endpoint now supports contextual conversations, allowing you to create chats that are specifically linked to business objects like quotes.

## API Changes

### Updated Interface

```typescript
export interface CreateConversationRequest {
  participantIds: string[];
  name?: string;
  contextId?: string;        // NEW: ID of the business object
  contextType?: ConversationContextType; // NEW: Type of context
}

export type ConversationContextType = 'QUOTE';
```

## Usage Examples

### 1. Quote-Specific Conversations

When a user needs to discuss a specific quote (e.g., an employee sending a quote to a manager for approval), include the quote's ID in the request:

```typescript
// User is viewing a quote with ID "quote_abc123"
const conversation = await directMessagesService.createConversation({
  participantIds: ['manager_user_id'],
  name: `Quote Approval - ${quoteId}`,
  contextId: 'quote_abc123',
  contextType: 'QUOTE'
});
// Now you have a conversation specifically for this quote
```

### 2. General Conversations

When a user starts a normal, general-purpose chat with another user (e.g., from the main messages screen), omit the contextId and contextType:

```typescript
const conversation = await directMessagesService.createConversation({
  participantIds: ['manager_user_id']
});
// This will be the general chat, not tied to any quote
```

## Implementation Details

### Backend Intelligence

The backend will intelligently:
- Find or create quote-specific conversations when `contextId` and `contextType` are provided
- Find or create the single, ongoing general chat between participants when context is omitted
- Keep quote-specific discussions separate from general chats, even between the same participants

### Frontend Implementation

Quote-specific conversations are automatically created when:
- Sending quotes for approval via the "Send and Chat" functionality
- The system needs to discuss a specific quote with managers or colleagues

General conversations are created when:
- Starting new chats from the main messages interface
- Creating group conversations without specific business context

## Benefits

- **Separation of Concerns**: Quote-specific discussions remain separate from general chats
- **Context Preservation**: Business object context is maintained throughout the conversation
- **Smart Discovery**: Backend can find existing contextual conversations appropriately
- **Backwards Compatibility**: Existing general chat functionality remains unchanged