---
name: chatwoot-new-conversation-creation
description: Use when implementing new conversation creation, compose new message UI, contact selection, inbox selection, or understanding the flow for starting conversations
---

# Chatwoot New Conversation Creation Flow

## When to Use This Skill

- Building "New Conversation" or "Compose" UI
- Implementing contact selection for new conversations
- Understanding inbox selection flow
- Creating conversations programmatically
- Building conversation creation wizards
- Understanding prerequisites for conversation creation

## Overview

Creating a new conversation involves:

1. **Select Contact**: Choose existing contact or create new one
2. **Select Inbox**: Choose which inbox/channel to use
3. **Compose Message**: Write initial message (optional)
4. **Create Conversation**: POST to API with payload
5. **Navigate**: Redirect to newly created conversation

**Key Features:**
- Contact search with create option
- Inbox filtering by channel type
- Optional initial message
- Automatic conversation opening
- Source ID tracking for external systems

## Prerequisites for Conversation Creation

A conversation requires:
- **Contact** (required) - Who you're talking to
- **Inbox** (required) - Which channel to use
- **Initial Message** (optional) - First message content
- **Source ID** (optional) - External system identifier

## Complete Flow Diagram

```
User Clicks "New Conversation"
    ↓
[Modal Opens] - NewConversationModal.vue
    ↓
Step 1: Select Contact
    ├─ Search existing contacts
    └─ Or create new contact
    ↓
Step 2: Select Inbox
    ├─ Show available inboxes
    └─ Filter by channel type
    ↓
Step 3: Compose Initial Message (Optional)
    ↓
[Submit] - Create conversation
    ↓
[API] - POST /api/v1/accounts/{id}/conversations
    ↓
[Response] - New conversation object
    ↓
[Vuex] - ADD_CONVERSATION
    ↓
[Navigate] - Open new conversation
```

## Step 1: New Conversation Modal Component

**Location:** `app/javascript/dashboard/components-next/NewConversation/NewConversationModal.vue:1`

```vue
<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ContactSearch from './ContactSearch.vue';
import InboxSelector from './InboxSelector.vue';

const store = useStore();
const router = useRouter();

const emit = defineEmits(['close']);

// Multi-step state
const currentStep = ref(1); // 1 = contact, 2 = inbox, 3 = message

// Form data
const selectedContact = ref(null);
const selectedInbox = ref(null);
const initialMessage = ref('');
const sourceId = ref('');

// Computed
const canProceed = computed(() => {
  if (currentStep.value === 1) return !!selectedContact.value;
  if (currentStep.value === 2) return !!selectedInbox.value;
  return true;
});

const isCreating = computed(() =>
  store.getters['conversations/getUIFlags'].isCreating
);

// Methods
const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const handleContactSelect = (contact) => {
  selectedContact.value = contact;
  nextStep();
};

const handleInboxSelect = (inbox) => {
  selectedInbox.value = inbox;
  nextStep();
};

const createConversation = async () => {
  try {
    const payload = {
      contact_id: selectedContact.value.id,
      inbox_id: selectedInbox.value.id,
      source_id: sourceId.value || undefined,
    };

    // Create conversation
    const conversation = await store.dispatch(
      'conversations/create',
      payload
    );

    // Send initial message if provided
    if (initialMessage.value.trim()) {
      await store.dispatch('conversations/sendMessageWithData', {
        conversation_id: conversation.id,
        content: initialMessage.value,
        message_type: 'outgoing',
        private: false,
      });
    }

    // Navigate to new conversation
    router.push({
      name: 'conversation',
      params: {
        accountId: store.getters.getCurrentAccountId,
        conversationId: conversation.id,
      },
    });

    emit('close');
  } catch (error) {
    console.error('Failed to create conversation:', error);
  }
};
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b">
        <h2 class="text-xl font-bold">New Conversation</h2>
        <button @click="emit('close')" class="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <!-- Progress Steps -->
      <div class="flex items-center justify-center gap-4 px-6 py-4 bg-gray-50 border-b">
        <div
          v-for="step in 3"
          :key="step"
          class="flex items-center gap-2"
        >
          <div
            :class="{
              'bg-blue-500 text-white': currentStep >= step,
              'bg-gray-300 text-gray-600': currentStep < step,
            }"
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
          >
            {{ step }}
          </div>
          <span
            :class="{
              'text-gray-900 font-medium': currentStep >= step,
              'text-gray-500': currentStep < step,
            }"
            class="text-sm"
          >
            {{ ['Contact', 'Inbox', 'Message'][step - 1] }}
          </span>
          <div
            v-if="step < 3"
            class="w-8 h-0.5 bg-gray-300"
          />
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 py-6 overflow-y-auto" style="max-height: 60vh">
        <!-- Step 1: Contact Selection -->
        <div v-if="currentStep === 1">
          <h3 class="text-lg font-medium mb-4">Select Contact</h3>
          <ContactSearch
            :selected-contact="selectedContact"
            @select="handleContactSelect"
          />
        </div>

        <!-- Step 2: Inbox Selection -->
        <div v-if="currentStep === 2">
          <h3 class="text-lg font-medium mb-4">Select Inbox</h3>
          <InboxSelector
            :selected-inbox="selectedInbox"
            @select="handleInboxSelect"
          />

          <!-- Optional Source ID -->
          <div class="mt-4">
            <label class="block text-sm font-medium mb-1">
              Source ID (Optional)
            </label>
            <input
              v-model="sourceId"
              type="text"
              placeholder="External system ID"
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <!-- Step 3: Initial Message -->
        <div v-if="currentStep === 3">
          <h3 class="text-lg font-medium mb-4">Initial Message (Optional)</h3>

          <!-- Summary -->
          <div class="mb-4 p-4 bg-gray-50 rounded-lg">
            <div class="text-sm text-gray-600 mb-1">Conversation with:</div>
            <div class="font-medium">{{ selectedContact.name }}</div>
            <div class="text-sm text-gray-600 mt-2">Via inbox:</div>
            <div class="font-medium">{{ selectedInbox.name }}</div>
          </div>

          <!-- Message Input -->
          <textarea
            v-model="initialMessage"
            placeholder="Type your message... (optional)"
            class="w-full px-4 py-3 border rounded-lg resize-none"
            rows="6"
          />
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
        <button
          v-if="currentStep > 1"
          @click="prevStep"
          class="px-6 py-2 border rounded-lg hover:bg-gray-100"
        >
          Back
        </button>

        <div class="flex gap-2 ml-auto">
          <button
            @click="emit('close')"
            class="px-6 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            v-if="currentStep < 3"
            @click="nextStep"
            :disabled="!canProceed"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Next
          </button>

          <button
            v-else
            @click="createConversation"
            :disabled="isCreating"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {{ isCreating ? 'Creating...' : 'Create Conversation' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
```

## Step 2: Contact Search Component

```vue
<script setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { debounce } from 'lodash';

const store = useStore();

const props = defineProps({
  selectedContact: Object,
});

const emit = defineEmits(['select']);

// State
const searchQuery = ref('');
const showCreateForm = ref(false);
const newContactData = ref({
  name: '',
  email: '',
  phone_number: '',
});

// Computed
const searchResults = computed(() =>
  store.getters['contacts/getContacts']
);

const isSearching = computed(() =>
  store.getters['contacts/getUIFlags'].isFetching
);

// Debounced search
const debouncedSearch = debounce((query) => {
  if (query.trim()) {
    store.dispatch('contacts/search', { q: query });
  } else {
    store.dispatch('contacts/get', { page: 1 });
  }
}, 300);

watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery);
});

// Methods
const selectContact = (contact) => {
  emit('select', contact);
};

const createNewContact = async () => {
  try {
    const contact = await store.dispatch('contacts/create', newContactData.value);
    emit('select', contact);
  } catch (error) {
    console.error('Failed to create contact:', error);
  }
};
</script>

<template>
  <div>
    <!-- Search Input -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search by name, email, or phone..."
      class="w-full px-4 py-2 border rounded-lg mb-4"
      autofocus
    />

    <!-- Search Results -->
    <div v-if="!showCreateForm" class="max-h-96 overflow-y-auto">
      <div v-if="isSearching" class="text-center py-4 text-gray-500">
        Searching...
      </div>

      <div
        v-else-if="searchResults.length === 0"
        class="text-center py-4"
      >
        <p class="text-gray-500 mb-2">No contacts found</p>
        <button
          @click="showCreateForm = true"
          class="text-blue-500 hover:text-blue-600"
        >
          Create new contact
        </button>
      </div>

      <div
        v-for="contact in searchResults"
        :key="contact.id"
        @click="selectContact(contact)"
        class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
      >
        <img
          :src="contact.avatar_url"
          :alt="contact.name"
          class="w-10 h-10 rounded-full"
        />
        <div>
          <div class="font-medium">{{ contact.name }}</div>
          <div class="text-sm text-gray-600">{{ contact.email }}</div>
        </div>
      </div>

      <button
        v-if="searchResults.length > 0"
        @click="showCreateForm = true"
        class="w-full py-2 text-blue-500 hover:bg-blue-50 rounded-lg mt-2"
      >
        + Create new contact
      </button>
    </div>

    <!-- Create Contact Form -->
    <div v-else class="space-y-3">
      <div>
        <label class="block text-sm font-medium mb-1">Name *</label>
        <input
          v-model="newContactData.name"
          type="text"
          class="w-full px-4 py-2 border rounded-lg"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Email</label>
        <input
          v-model="newContactData.email"
          type="email"
          class="w-full px-4 py-2 border rounded-lg"
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Phone</label>
        <input
          v-model="newContactData.phone_number"
          type="tel"
          class="w-full px-4 py-2 border rounded-lg"
          placeholder="+1234567890"
        />
      </div>

      <div class="flex gap-2">
        <button
          @click="showCreateForm = false"
          class="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Back to Search
        </button>
        <button
          @click="createNewContact"
          :disabled="!newContactData.name.trim()"
          class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Create & Select
        </button>
      </div>
    </div>
  </div>
</template>
```

## Step 3: Inbox Selector Component

```vue
<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
  selectedInbox: Object,
});

const emit = defineEmits(['select']);

// Get inboxes from store
const inboxes = computed(() =>
  store.getters['inboxes/getInboxes']
);

// Group inboxes by channel type
const groupedInboxes = computed(() => {
  return inboxes.value.reduce((acc, inbox) => {
    const type = inbox.channel_type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(inbox);
    return acc;
  }, {});
});

// Channel type labels
const channelTypeLabels = {
  'Channel::WebWidget': 'Website',
  'Channel::Email': 'Email',
  'Channel::Whatsapp': 'WhatsApp',
  'Channel::Telegram': 'Telegram',
  'Channel::Sms': 'SMS',
  'Channel::Api': 'API',
};

const selectInbox = (inbox) => {
  emit('select', inbox);
};
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="(inboxList, channelType) in groupedInboxes"
      :key="channelType"
    >
      <h4 class="text-sm font-medium text-gray-600 mb-2">
        {{ channelTypeLabels[channelType] || channelType }}
      </h4>

      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="inbox in inboxList"
          :key="inbox.id"
          @click="selectInbox(inbox)"
          :class="{
            'border-blue-500 bg-blue-50': selectedInbox?.id === inbox.id,
            'border-gray-300': selectedInbox?.id !== inbox.id,
          }"
          class="p-4 border-2 rounded-lg cursor-pointer hover:border-blue-300"
        >
          <div class="font-medium">{{ inbox.name }}</div>
          <div class="text-sm text-gray-600">{{ inbox.channel_type }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
```

## Step 4: Vuex Actions

**Location:** `app/javascript/dashboard/store/modules/conversations/actions.js:1`

```javascript
// app/javascript/dashboard/store/modules/conversations/actions.js
import * as types from '../../mutation-types';
import ConversationApi from 'dashboard/api/conversations';

export const actions = {
  // Create new conversation
  create: async ({ commit }, payload) => {
    commit(types.SET_CONVERSATION_UI_FLAG, { isCreating: true });

    try {
      const { data } = await ConversationApi.create(payload);

      // Add to store
      commit(types.ADD_CONVERSATION, data);

      // Set as active
      commit(types.SET_CURRENT_CHAT_WINDOW, data);

      return data;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw error;
    } finally {
      commit(types.SET_CONVERSATION_UI_FLAG, { isCreating: false });
    }
  },
};

export const mutations = {
  [types.ADD_CONVERSATION]: (state, conversation) => {
    // Add to beginning of list (most recent)
    state.allConversations.unshift(conversation);
  },

  [types.SET_CURRENT_CHAT_WINDOW]: (state, conversation) => {
    state.selectedChatId = conversation?.id || null;
  },

  [types.SET_CONVERSATION_UI_FLAG]: (state, flags) => {
    state.uiFlags = { ...state.uiFlags, ...flags };
  },
};
```

## Step 5: API Client

**Location:** `app/javascript/dashboard/api/conversations.js:1`

```javascript
// app/javascript/dashboard/api/conversations.js
import ApiClient from './ApiClient';

class ConversationApi extends ApiClient {
  constructor() {
    super('conversations', { accountScoped: true });
  }

  // POST /api/v1/accounts/{accountId}/conversations
  create(conversationData) {
    return axios.post(this.url, conversationData);
  }
}

export default new ConversationApi();
```

## API Request & Response

### Request

```http
POST /api/v1/accounts/1/conversations
Content-Type: application/json
Authorization: Bearer {token}

{
  "contact_id": 123,
  "inbox_id": 456,
  "source_id": "external_id_789"  // Optional
}
```

### Response

```json
{
  "id": 789,
  "status": "open",
  "contact_id": 123,
  "inbox_id": 456,
  "assignee_id": null,
  "team_id": null,
  "unread_count": 0,
  "last_activity_at": "2025-01-12T10:00:00Z",
  "created_at": "2025-01-12T10:00:00Z",
  "contact": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "avatar_url": "https://..."
  },
  "inbox": {
    "id": 456,
    "name": "Website Chat",
    "channel_type": "Channel::WebWidget"
  },
  "messages": [],
  "labels": []
}
```

## Complete Usage Example

```vue
<script setup>
import { ref } from 'vue';
import NewConversationModal from './NewConversationModal.vue';

const showModal = ref(false);

const openNewConversation = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<template>
  <div>
    <!-- Trigger Button -->
    <button
      @click="openNewConversation"
      class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    >
      + New Conversation
    </button>

    <!-- Modal -->
    <NewConversationModal
      v-if="showModal"
      @close="closeModal"
    />
  </div>
</template>
```

## Alternative: Quick Create (Single Step)

For simpler UX, combine all steps into one form:

```vue
<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const emit = defineEmits(['close']);

const contactId = ref(null);
const inboxId = ref(null);
const message = ref('');

const contacts = computed(() => store.getters['contacts/getContacts']);
const inboxes = computed(() => store.getters['inboxes/getInboxes']);

const createConversation = async () => {
  const conversation = await store.dispatch('conversations/create', {
    contact_id: contactId.value,
    inbox_id: inboxId.value,
  });

  if (message.value.trim()) {
    await store.dispatch('conversations/sendMessageWithData', {
      conversation_id: conversation.id,
      content: message.value,
    });
  }

  emit('close');
};
</script>

<template>
  <div class="p-6 space-y-4">
    <h2 class="text-xl font-bold">New Conversation</h2>

    <select v-model="contactId" class="w-full px-4 py-2 border rounded-lg">
      <option :value="null">Select Contact</option>
      <option v-for="contact in contacts" :key="contact.id" :value="contact.id">
        {{ contact.name }}
      </option>
    </select>

    <select v-model="inboxId" class="w-full px-4 py-2 border rounded-lg">
      <option :value="null">Select Inbox</option>
      <option v-for="inbox in inboxes" :key="inbox.id" :value="inbox.id">
        {{ inbox.name }}
      </option>
    </select>

    <textarea
      v-model="message"
      placeholder="Initial message (optional)"
      class="w-full px-4 py-2 border rounded-lg"
      rows="4"
    />

    <div class="flex gap-2">
      <button @click="emit('close')" class="flex-1 px-4 py-2 border rounded-lg">
        Cancel
      </button>
      <button
        @click="createConversation"
        :disabled="!contactId || !inboxId"
        class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        Create
      </button>
    </div>
  </div>
</template>
```

## Key Patterns Summary

| Pattern | Purpose | Implementation |
|---------|---------|----------------|
| **Multi-Step Form** | Better UX for complex flow | Step state with validation |
| **Contact Search** | Find or create contact | Debounced search + create form |
| **Inbox Grouping** | Organize by channel type | Group inboxes in selector |
| **Optional Message** | Immediate engagement | Send message after create |
| **Navigation** | Open new conversation | Router push after create |
| **Source ID** | External system tracking | Optional field in payload |

## Common Use Cases

### Use Case 1: Create with Existing Contact

```javascript
const conversation = await store.dispatch('conversations/create', {
  contact_id: 123,
  inbox_id: 456,
});
```

### Use Case 2: Create with New Contact

```javascript
// First, create contact
const contact = await store.dispatch('contacts/create', {
  name: 'John Doe',
  email: 'john@example.com',
});

// Then, create conversation
const conversation = await store.dispatch('conversations/create', {
  contact_id: contact.id,
  inbox_id: 456,
});
```

### Use Case 3: Create with Initial Message

```javascript
// Create conversation
const conversation = await store.dispatch('conversations/create', {
  contact_id: 123,
  inbox_id: 456,
});

// Send initial message
await store.dispatch('conversations/sendMessageWithData', {
  conversation_id: conversation.id,
  content: 'Hello! How can I help you today?',
  message_type: 'outgoing',
});
```

## Adapting to FrontDesk (React + Recoil)

```typescript
// hooks/use-create-conversation.ts
export const useCreateConversation = () => {
  const [conversations, setConversations] = useRecoilState(conversationsState);
  const navigate = useNavigate();

  const createConversation = async (
    contactId: number,
    inboxId: number,
    initialMessage?: string
  ) => {
    // Create conversation
    const conversation = await chatwootService.conversations.createConversation(
      accountId,
      { contact_id: contactId, inbox_id: inboxId }
    );

    // Add to state
    setConversations(prev => [conversation, ...prev]);

    // Send initial message if provided
    if (initialMessage?.trim()) {
      await chatwootService.messages.createMessage(
        accountId,
        conversation.id,
        { content: initialMessage, message_type: 'outgoing' }
      );
    }

    // Navigate to conversation
    navigate(`/conversations/${conversation.id}`);

    return conversation;
  };

  return { createConversation };
};
```

## References

- **Modal Component:** `app/javascript/dashboard/components-next/NewConversation/NewConversationModal.vue:1`
- **Vuex Actions:** `app/javascript/dashboard/store/modules/conversations/actions.js:1`
- **API Client:** `app/javascript/dashboard/api/conversations.js:1`
- **Contact Search:** Component example above
- **Inbox Selector:** Component example above
