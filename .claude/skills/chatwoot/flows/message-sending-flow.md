---
name: chatwoot-message-sending-flow
description: Use when implementing message sending, message composer UI, optimistic updates, or understanding the complete end-to-end flow for sending messages in Chatwoot
---

# Chatwoot Message Sending Flow

## When to Use This Skill

- Implementing message composer/reply box UI
- Building message sending functionality
- Understanding optimistic UI updates for better UX
- Learning how to handle message failures and retries
- Implementing file attachment uploads with messages
- Understanding the complete flow from UI → State → API

## Overview

The message sending flow in Chatwoot is a **4-step process**:

1. **UI Layer**: User types message in ReplyBox component
2. **State Layer**: Vuex action with optimistic update
3. **API Layer**: POST request to create message
4. **Update Layer**: Replace optimistic message with real data or mark as failed

**Key Features:**
- Optimistic updates (instant UI feedback)
- File attachment support (FormData)
- Failed message handling with retry
- Private notes support
- Real-time status updates (progress → sent → failed)

## Complete Flow Diagram

```
User Types Message
    ↓
[ReplyBox.vue] - handleSendMessage()
    ↓
Generate Echo ID (temporary ID)
    ↓
[Vuex Action] - sendMessageWithData()
    ↓
[Mutation] - ADD_MESSAGE (status: progress) ← Optimistic Update
    ↓
[MessageApi] - create() → POST /api/v1/accounts/{id}/conversations/{id}/messages
    ↓
Success?
├─ Yes → [Mutation] - ADD_MESSAGE (status: sent, with real data)
└─ No  → [Mutation] - ADD_MESSAGE (status: failed)
```

## Step 1: UI Layer - ReplyBox Component

**Location:** `app/javascript/dashboard/components/widgets/conversation/ReplyBox.vue:1`

### Component Structure

```vue
<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { v4 as uuidv4 } from 'uuid';

const store = useStore();

// Props
const props = defineProps({
  conversationId: {
    type: Number,
    required: true,
  },
  inboxId: {
    type: Number,
    required: true,
  },
});

// State
const message = ref('');
const isPrivate = ref(false);
const attachments = ref([]);
const isSending = ref(false);

// Computed
const canSendMessage = computed(() => {
  return message.value.trim() || attachments.value.length > 0;
});

// Methods
const handleSendMessage = async () => {
  if (!canSendMessage.value || isSending.value) return;

  isSending.value = true;

  // Generate temporary ID for optimistic update
  const echoId = uuidv4();

  // Build pending message object
  const pendingMessage = {
    id: echoId,
    echo_id: echoId,
    conversation_id: props.conversationId,
    content: message.value,
    message_type: 'outgoing',
    private: isPrivate.value,
    sender: currentUser.value,
    created_at: new Date().toISOString(),
    status: 'progress',
    attachments: attachments.value,
  };

  try {
    // Dispatch Vuex action
    await store.dispatch('conversations/sendMessageWithData', pendingMessage);

    // Clear form on success
    message.value = '';
    attachments.value = [];
    isPrivate.value = false;
  } catch (error) {
    console.error('Failed to send message:', error);
  } finally {
    isSending.value = false;
  }
};

const handleFileSelect = (files) => {
  attachments.value = [...files];
};

const removeAttachment = (index) => {
  attachments.value.splice(index, 1);
};
</script>

<template>
  <div class="reply-box flex flex-col gap-4 p-4 bg-white border-t">
    <!-- File Attachments Preview -->
    <div v-if="attachments.length > 0" class="flex gap-2">
      <div
        v-for="(file, index) in attachments"
        :key="index"
        class="flex items-center gap-2 bg-gray-100 rounded px-3 py-2"
      >
        <span class="text-sm">{{ file.name }}</span>
        <button @click="removeAttachment(index)" class="text-red-500">
          ×
        </button>
      </div>
    </div>

    <!-- Message Input -->
    <textarea
      v-model="message"
      placeholder="Type your message..."
      class="border rounded-lg p-3 resize-none"
      rows="3"
      @keydown.meta.enter="handleSendMessage"
      @keydown.ctrl.enter="handleSendMessage"
    />

    <!-- Actions -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <!-- File Upload -->
        <label class="cursor-pointer text-blue-500 hover:text-blue-600">
          <input
            type="file"
            multiple
            class="hidden"
            @change="handleFileSelect($event.target.files)"
          />
          <span>📎 Attach</span>
        </label>

        <!-- Private Note Toggle -->
        <label class="flex items-center gap-2 cursor-pointer">
          <input v-model="isPrivate" type="checkbox" />
          <span class="text-sm">Private note</span>
        </label>
      </div>

      <!-- Send Button -->
      <button
        @click="handleSendMessage"
        :disabled="!canSendMessage || isSending"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isSending ? 'Sending...' : 'Send' }}
      </button>
    </div>
  </div>
</template>
```

### Key Patterns

1. **Echo ID Generation**: Use UUID for temporary message tracking
2. **Optimistic Object**: Build complete message object before API call
3. **Form Validation**: Check if message or attachments exist
4. **Keyboard Shortcuts**: Cmd/Ctrl + Enter to send
5. **Disabled State**: Prevent multiple sends while in progress

## Step 2: State Layer - Vuex Action

**Location:** `app/javascript/dashboard/store/modules/conversations/actions.js:1`

### Action Implementation

```javascript
// app/javascript/dashboard/store/modules/conversations/actions.js
import * as types from '../../mutation-types';
import MessageApi from 'dashboard/api/inbox/message';

export const actions = {
  sendMessageWithData: async ({ commit }, pendingMessage) => {
    const {
      conversation_id: conversationId,
      id: echoId,
      content,
      private: isPrivate,
      attachments,
    } = pendingMessage;

    // Step 1: Optimistic update - Add message immediately
    commit(types.ADD_MESSAGE, {
      ...pendingMessage,
      status: MESSAGE_STATUS.PROGRESS, // 'progress'
    });

    try {
      // Step 2: Make API call
      const response = await MessageApi.create({
        conversationId,
        message: content,
        private: isPrivate,
        files: attachments,
      });

      // Step 3: Success - Replace optimistic message with real data
      commit(types.ADD_MESSAGE, {
        ...response.data,
        status: MESSAGE_STATUS.SENT, // 'sent'
        echo_id: echoId, // Link to optimistic message
      });

      return response.data;
    } catch (error) {
      // Step 4: Failure - Mark message as failed
      commit(types.ADD_MESSAGE, {
        ...pendingMessage,
        id: echoId,
        status: MESSAGE_STATUS.FAILED, // 'failed'
        error: error.message,
      });

      throw error;
    }
  },

  // Retry failed message
  retryMessage: async ({ commit }, message) => {
    const { conversation_id, id } = message;

    // Update status to progress
    commit(types.UPDATE_MESSAGE_STATUS, {
      conversationId: conversation_id,
      messageId: id,
      status: MESSAGE_STATUS.PROGRESS,
    });

    try {
      // Use retry endpoint
      const response = await MessageApi.retry(conversation_id, id);

      commit(types.ADD_MESSAGE, {
        ...response.data,
        status: MESSAGE_STATUS.SENT,
      });
    } catch (error) {
      commit(types.UPDATE_MESSAGE_STATUS, {
        conversationId: conversation_id,
        messageId: id,
        status: MESSAGE_STATUS.FAILED,
      });
    }
  },
};

// Message status constants
const MESSAGE_STATUS = {
  PROGRESS: 'progress',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed',
};
```

### Mutation Implementation

**Location:** `app/javascript/dashboard/store/modules/conversations/mutations.js:1`

```javascript
// app/javascript/dashboard/store/modules/conversations/mutations.js
import * as types from '../../mutation-types';
import Vue from 'vue';

export const mutations = {
  [types.ADD_MESSAGE]: (state, message) => {
    const { conversation_id, id, echo_id } = message;

    // Find conversation
    const conversation = state.allConversations.find(
      c => c.id === conversation_id
    );

    if (!conversation) return;

    // Initialize messages array if doesn't exist
    if (!conversation.messages) {
      Vue.set(conversation, 'messages', []);
    }

    // Find existing message by ID or echo_id
    const messageIndex = conversation.messages.findIndex(
      m => m.id === id || m.id === echo_id || m.echo_id === echo_id
    );

    if (messageIndex !== -1) {
      // Replace existing message (optimistic → real or failed)
      Vue.set(conversation.messages, messageIndex, message);
    } else {
      // Add new message
      conversation.messages.push(message);
    }

    // Update conversation's last activity
    conversation.last_activity_at = message.created_at;

    // Sort messages by timestamp
    conversation.messages.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
  },

  [types.UPDATE_MESSAGE_STATUS]: (state, { conversationId, messageId, status }) => {
    const conversation = state.allConversations.find(c => c.id === conversationId);

    if (!conversation) return;

    const message = conversation.messages.find(m => m.id === messageId);

    if (message) {
      message.status = status;
    }
  },
};
```

### Key Patterns

1. **Three-State Updates**: progress → sent/failed
2. **Echo ID Matching**: Find optimistic message by echo_id
3. **Replace vs Add**: Replace if exists, add if new
4. **Timestamp Sorting**: Keep messages chronologically ordered
5. **Last Activity Update**: Update conversation timestamp

## Step 3: API Layer - MessageApi

**Location:** `app/javascript/dashboard/api/inbox/message.js:1`

### API Client Implementation

```javascript
// app/javascript/dashboard/api/inbox/message.js
import ApiClient from '../ApiClient';

// Helper to build payload
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

    // Append each file
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

    // POST /api/v1/accounts/{accountId}/conversations/{conversationId}/messages
    return axios.post(`${this.url}/${conversationId}/messages`, payload);
  }

  retry(conversationId, messageId) {
    // POST /api/v1/accounts/{accountId}/conversations/{conversationId}/messages/{messageId}/retry
    return axios.post(
      `${this.url}/${conversationId}/messages/${messageId}/retry`
    );
  }

  delete(conversationId, messageId) {
    // DELETE /api/v1/accounts/{accountId}/conversations/{conversationId}/messages/{messageId}
    return axios.delete(`${this.url}/${conversationId}/messages/${messageId}`);
  }
}

export default new MessageApi();
```

### API Endpoint

```
POST /api/v1/accounts/{accountId}/conversations/{conversationId}/messages

Headers:
  Content-Type: application/json (or multipart/form-data for files)
  Authorization: Bearer {token}

Body (JSON):
{
  "content": "Hello, how can I help?",
  "private": false,
  "content_attributes": {},
  "template_params": {}
}

Body (FormData with files):
  content: "See attachment"
  private: false
  attachments[]: [File]
  attachments[]: [File]

Response:
{
  "id": 456,
  "content": "Hello, how can I help?",
  "message_type": "outgoing",
  "content_type": "text",
  "status": "sent",
  "created_at": "2025-01-12T10:30:00Z",
  "conversation_id": 123,
  "sender": {
    "id": 1,
    "name": "Agent Name",
    "email": "agent@example.com"
  },
  "attachments": []
}
```

### Key Patterns

1. **Conditional Payload**: FormData for files, JSON for text
2. **Array Append**: Use `attachments[]` for multiple files
3. **Account-Scoped URL**: Automatically includes account ID
4. **Nested Resource**: Messages under conversations path

## Step 4: Display Layer - Message List

**Location:** `app/javascript/dashboard/components/widgets/conversation/MessagesView.vue:1`

### Message Display Component

```vue
<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import MessageBubble from 'dashboard/components-next/Conversation/MessageBubble.vue';

const store = useStore();

const props = defineProps({
  conversationId: {
    type: Number,
    required: true,
  },
});

// Get conversation with messages
const conversation = computed(() =>
  store.getters['conversations/getConversationById'](props.conversationId)
);

const messages = computed(() => conversation.value?.messages || []);

// Retry failed message
const handleRetry = (messageId) => {
  const message = messages.value.find(m => m.id === messageId);
  if (message) {
    store.dispatch('conversations/retryMessage', message);
  }
};
</script>

<template>
  <div class="messages-view flex flex-col gap-2 p-4">
    <MessageBubble
      v-for="message in messages"
      :key="message.id"
      :message="message"
      :is-incoming="message.message_type === 'incoming'"
      @retry="handleRetry"
    />
  </div>
</template>
```

### Message Bubble with Status

```vue
<!-- MessageBubble.vue -->
<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: Object,
  isIncoming: Boolean,
});

const emit = defineEmits(['retry']);

const messageStatus = computed(() => props.message.status);
const isProgress = computed(() => messageStatus.value === 'progress');
const isFailed = computed(() => messageStatus.value === 'failed');

const statusIcon = computed(() => {
  if (isFailed.value) return '❌';
  if (isProgress.value) return '⏳';
  return '✓';
});

const bubbleClass = computed(() => ({
  'bg-blue-500 text-white': !props.isIncoming,
  'bg-gray-200 text-gray-900': props.isIncoming,
  'opacity-50': isProgress.value || isFailed.value,
}));
</script>

<template>
  <div
    class="message-bubble max-w-xl rounded-lg px-4 py-2"
    :class="bubbleClass"
  >
    <div class="text-base">{{ message.content }}</div>

    <div class="flex items-center justify-between mt-1">
      <span class="text-xs opacity-70">
        {{ new Date(message.created_at).toLocaleTimeString() }}
        {{ statusIcon }}
      </span>

      <button
        v-if="isFailed"
        @click="emit('retry', message.id)"
        class="text-xs underline"
      >
        Retry
      </button>
    </div>
  </div>
</template>
```

## Complete Flow Example

### Scenario: User sends "Hello!" with an image

```javascript
// 1. User clicks Send button
handleSendMessage()

// 2. Generate echo ID
const echoId = 'echo-12345-67890';

// 3. Build optimistic message
const pendingMessage = {
  id: echoId,
  echo_id: echoId,
  conversation_id: 123,
  content: 'Hello!',
  message_type: 'outgoing',
  private: false,
  sender: { id: 1, name: 'Agent' },
  created_at: '2025-01-12T10:30:00Z',
  status: 'progress',
  attachments: [imageFile],
};

// 4. Dispatch action
await store.dispatch('conversations/sendMessageWithData', pendingMessage);

// 5. Mutation adds optimistic message to UI
commit(types.ADD_MESSAGE, { ...pendingMessage, status: 'progress' });
// UI shows message with ⏳ icon

// 6. API call with FormData
const formData = new FormData();
formData.append('content', 'Hello!');
formData.append('private', false);
formData.append('attachments[]', imageFile);

axios.post('/api/v1/accounts/1/conversations/123/messages', formData);

// 7a. Success - Replace with real message
commit(types.ADD_MESSAGE, {
  id: 456,
  echo_id: echoId,
  conversation_id: 123,
  content: 'Hello!',
  message_type: 'outgoing',
  status: 'sent',
  created_at: '2025-01-12T10:30:05Z',
  attachments: [{ id: 789, url: 'https://...' }],
  sender: { id: 1, name: 'Agent' },
});
// UI updates to show ✓ icon

// 7b. Failure - Mark as failed
commit(types.ADD_MESSAGE, {
  ...pendingMessage,
  id: echoId,
  status: 'failed',
});
// UI shows ❌ icon with Retry button
```

## Key Patterns Summary

| Pattern | Purpose | Implementation |
|---------|---------|----------------|
| **Echo ID** | Track optimistic updates | UUID generated in component |
| **Optimistic Update** | Instant UI feedback | Add message before API call |
| **Three States** | Visual status feedback | progress → sent/failed |
| **FormData** | File uploads | Conditional payload builder |
| **Retry Logic** | Recover from failures | Special retry endpoint |
| **Message Matching** | Replace optimistic | Match by ID or echo_id |
| **Timestamp Sorting** | Chronological order | Sort after each add |

## Common Pitfalls

1. **Duplicate Messages**: Always match by echo_id before adding
2. **Lost Optimistic Updates**: Ensure echo_id is passed to API response
3. **Unsorted Messages**: Sort messages after adding
4. **FormData vs JSON**: Use FormData only when files exist
5. **Status Icon Confusion**: Clear visual distinction between states

## Adapting to FrontDesk (React + Recoil)

```typescript
// hooks/use-send-message.ts
export const useSendMessage = () => {
  const [messages, setMessages] = useRecoilState(messagesState);

  const sendMessage = async (conversationId: number, content: string) => {
    const echoId = uuidv4();

    // Optimistic update
    const optimisticMessage = {
      id: echoId,
      conversation_id: conversationId,
      content,
      status: 'progress',
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const realMessage = await chatwootService.messages.createMessage(
        accountId,
        conversationId,
        { content, message_type: 'outgoing' }
      );

      // Replace optimistic with real
      setMessages(prev =>
        prev.map(m => (m.id === echoId ? realMessage : m))
      );
    } catch (error) {
      // Mark as failed
      setMessages(prev =>
        prev.map(m =>
          m.id === echoId ? { ...m, status: 'failed' } : m
        )
      );
    }
  };

  return { sendMessage };
};
```

## References

- **ReplyBox Component:** `app/javascript/dashboard/components/widgets/conversation/ReplyBox.vue:1`
- **Vuex Actions:** `app/javascript/dashboard/store/modules/conversations/actions.js:1`
- **Vuex Mutations:** `app/javascript/dashboard/store/modules/conversations/mutations.js:1`
- **MessageApi:** `app/javascript/dashboard/api/inbox/message.js:1`
- **Message Display:** `app/javascript/dashboard/components/widgets/conversation/MessagesView.vue:1`
