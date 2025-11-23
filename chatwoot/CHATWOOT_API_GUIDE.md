# Chatwoot API Client Documentation

This document provides a guide on how to use the auto-generated Chatwoot API client located in the `@/chatwoot` directory.

## Overview

The Chatwoot API client is generated using OpenAPI Generator. It provides a set of classes and types to interact with the Chatwoot API.

### Key Files

-   `api.ts`: Contains all the API classes for different resources (e.g., `ConversationsApi`, `ContactsApi`).
-   `configuration.ts`: The `Configuration` class used to configure the API client, including authentication.
-   `base.ts`: Base API class and utility functions.
-   `common.ts`: Common utility functions for handling requests.
-   `index.ts`: Exports all the necessary modules.
-   `docs/`: Contains markdown documentation for each API endpoint and model.

## Configuration and Initialization

To use the API client, you need to create an instance of the `Configuration` class and then instantiate the desired API class.

### Example: Initializing the `ConversationsApi`

```typescript
import { Configuration, ConversationsApi } from '@/chatwoot';

const config = new Configuration({
  apiKey: 'YOUR_API_KEY', // Or a function that returns the key
  basePath: 'https://your-chatwoot-instance.com',
});

const conversationsApi = new ConversationsApi(config);
```

## Authentication

The API client supports API key authentication. The `apiKey` can be a string or a function that returns the API key.

## API Classes

The `api.ts` file exports several classes, each corresponding to a set of related API endpoints. Some of the key classes are:

-   `ConversationsApi`: For managing conversations.
-   `ContactsApi`: For managing contacts.
-   `MessagesApi`: For creating and listing messages in a conversation.
-   `InboxesApi`: For managing inboxes.
-   `AgentsApi`: For managing agents.

Each method in these classes corresponds to an API endpoint. The method names are descriptive of the action they perform (e.g., `listAllMessages`, `createANewMessageInAConversation`).

## Models

All the data structures (request and response bodies) are defined as interfaces in `api.ts`. For example, the `Conversation` model is defined as:

```typescript
export interface Conversation {
    'id'?: number;
    'messages'?: Array<Message>;
    'account_id'?: number;
    // ... and other properties
}
```

You can find detailed documentation for each model in the `docs/` directory (e.g., `docs/Conversation.md`).

## Common Operations

### Fetching Conversations

To fetch a list of conversations, you can use the `conversationList` method of the `ConversationsApi`.

```typescript
import { ConversationsApi, Configuration } from '@/chatwoot';

const config = new Configuration({ apiKey: 'YOUR_API_KEY' });
const conversationsApi = new ConversationsApi(config);

async function getConversations(accountId: number) {
  try {
    const response = await conversationsApi.conversationList(accountId);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
```

### Creating a Message in a Conversation

To create a new message, use the `createANewMessageInAConversation` method of the `MessagesApi`.

```typescript
import { MessagesApi, Configuration, ConversationMessageCreatePayload } from '@/chatwoot';

const config = new Configuration({ apiKey: 'YOUR_API_KEY' });
const messagesApi = new MessagesApi(config);

async function createMessage(accountId: number, conversationId: number, message: ConversationMessageCreatePayload) {
  try {
    const response = await messagesApi.createANewMessageInAConversation(accountId, conversationId, message);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

const newMessage: ConversationMessageCreatePayload = {
  content: 'Hello, world!',
  message_type: 'outgoing',
};

createMessage(1, 123, newMessage);
```

## Further Reading

For detailed information on each API endpoint and model, refer to the markdown files in the `docs/` directory. These files are generated from the OpenAPI specification and provide comprehensive details on parameters, request bodies, and response schemas.
