---
name: chatwoot-component-patterns
description: Use when building Vue 3 components, understanding Composition API with script setup, or learning how Chatwoot structures and organizes UI components
---

# Chatwoot Component Patterns

## When to Use This Skill

- Building new React components for FrontDesk
- Understanding Vue 3 Composition API to adapt patterns to React hooks
- Learning component structure and organization
- Understanding prop/event patterns for parent-child communication
- Structuring reusable UI components

## Overview

Chatwoot uses **Vue 3 Composition API** with modern patterns:
- **`<script setup>` syntax** - Concise component definition
- **Composables** - Reusable logic hooks
- **Props & Emits** - Type-safe component communication
- **Computed & Watchers** - Reactive derived state
- **Lifecycle Hooks** - Component lifecycle management
- **Tailwind CSS** - Utility-first styling (no custom CSS)

**Component Locations:**
- **Modern (use this!):** `app/javascript/dashboard/components-next/`
- **Legacy:** `app/javascript/dashboard/components/`

## Basic Component Structure

### Minimal Component

```vue
<!-- app/javascript/dashboard/components-next/HelloWorld.vue -->
<script setup>
import { ref } from 'vue';

const message = ref('Hello World');
</script>

<template>
  <div class="text-lg font-bold">
    {{ message }}
  </div>
</template>
```

### Component with Props & Emits

```vue
<script setup>
import { defineProps, defineEmits } from 'vue';

// Props definition with types
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  sender: {
    type: Object,
    required: true,
  },
});

// Events definition
const emit = defineEmits(['reply', 'delete', 'retry']);

// Event handlers
const handleReply = () => {
  emit('reply', props.message);
};

const handleDelete = () => {
  emit('delete', props.message.id);
};
</script>

<template>
  <div class="flex flex-col gap-2 p-4">
    <div class="text-sm">{{ props.sender.name }}</div>
    <div class="text-base">{{ props.message }}</div>

    <div class="flex gap-2">
      <button @click="handleReply" class="btn-primary">
        Reply
      </button>
      <button @click="handleDelete" class="btn-danger">
        Delete
      </button>
    </div>
  </div>
</template>
```

## Real-World Example: Message Bubble Component

**Location:** `app/javascript/dashboard/components-next/Conversation/MessageBubble.vue:1`

```vue
<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  isIncoming: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['reply', 'delete', 'retry']);

// Computed properties
const isOutgoing = computed(() => !props.isIncoming);

const messageStatus = computed(() => props.message.status);

const isMessageFailed = computed(() => messageStatus.value === 'failed');

const bubbleClass = computed(() => ({
  'bg-blue-500 text-white': isOutgoing.value,
  'bg-gray-200 text-gray-900': props.isIncoming,
  'opacity-50': isMessageFailed.value,
}));

const formattedTime = computed(() => {
  return new Date(props.message.created_at).toLocaleTimeString();
});

// Methods
const handleRetry = () => {
  if (isMessageFailed.value) {
    emit('retry', props.message.id);
  }
};
</script>

<template>
  <div
    class="flex"
    :class="{
      'justify-end': isOutgoing,
      'justify-start': isIncoming,
    }"
  >
    <div
      class="max-w-xl rounded-lg px-4 py-2"
      :class="bubbleClass"
    >
      <div class="text-base break-words">
        {{ message.content }}
      </div>

      <div class="flex items-center justify-between mt-1">
        <span class="text-xs opacity-70">
          {{ formattedTime }}
        </span>

        <button
          v-if="isMessageFailed"
          @click="handleRetry"
          class="text-xs underline"
        >
          Retry
        </button>
      </div>
    </div>
  </div>
</template>
```

## Pattern 1: Composition with Vuex Store

```vue
<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// State from Vuex
const conversations = computed(() =>
  store.getters['conversations/getAllConversations']
);

const isLoading = computed(() =>
  store.getters['conversations/getUIFlags'].isFetching
);

// Actions
const fetchConversations = () => {
  store.dispatch('conversations/fetchAllConversations');
};

const selectConversation = (conversationId) => {
  store.dispatch('conversations/setActiveChat', { id: conversationId });
};

// Lifecycle
onMounted(() => {
  fetchConversations();
});
</script>

<template>
  <div>
    <LoadingSpinner v-if="isLoading" />

    <div v-else class="flex flex-col gap-2">
      <ConversationCard
        v-for="conversation in conversations"
        :key="conversation.id"
        :conversation="conversation"
        @click="selectConversation(conversation.id)"
      />
    </div>
  </div>
</template>
```

## Pattern 2: Reusable Composables

Chatwoot uses **composables** (similar to React custom hooks) for shared logic.

**Location:** `app/javascript/dashboard/composables/useAccount.js:1`

```javascript
// app/javascript/dashboard/composables/useAccount.js
import { computed } from 'vue';
import { useStore } from 'vuex';

export const useAccount = () => {
  const store = useStore();

  const accountId = computed(() => {
    const path = window.location.pathname;
    const match = path.match(/\/accounts\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  });

  const currentAccount = computed(() =>
    store.getters['accounts/getAccount'](accountId.value)
  );

  return {
    accountId,
    currentAccount,
  };
};
```

**Usage in component:**
```vue
<script setup>
import { useAccount } from 'dashboard/composables/useAccount';

const { accountId, currentAccount } = useAccount();
</script>

<template>
  <div>
    <h1>Account: {{ currentAccount.name }}</h1>
    <p>ID: {{ accountId }}</p>
  </div>
</template>
```

## Pattern 3: Form Handling with v-model

```vue
<script setup>
import { ref } from 'vue';
import MessageApi from 'dashboard/api/inbox/message';

const props = defineProps({
  conversationId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['messageSent']);

// Form state
const message = ref('');
const isPrivate = ref(false);
const isSending = ref(false);

// Submit handler
const handleSubmit = async () => {
  if (!message.value.trim()) return;

  isSending.value = true;

  try {
    const response = await MessageApi.create({
      conversationId: props.conversationId,
      message: message.value,
      private: isPrivate.value,
    });

    emit('messageSent', response.data);

    // Reset form
    message.value = '';
    isPrivate.value = false;
  } catch (error) {
    console.error('Failed to send message:', error);
  } finally {
    isSending.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <textarea
      v-model="message"
      placeholder="Type your message..."
      class="border rounded p-2"
      rows="3"
    />

    <div class="flex items-center gap-2">
      <label class="flex items-center gap-1">
        <input v-model="isPrivate" type="checkbox" />
        <span>Private note</span>
      </label>
    </div>

    <button
      type="submit"
      :disabled="isSending || !message.trim()"
      class="btn-primary"
    >
      {{ isSending ? 'Sending...' : 'Send' }}
    </button>
  </form>
</template>
```

## Pattern 4: Computed & Watchers

```vue
<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  conversations: {
    type: Array,
    required: true,
  },
  filters: {
    type: Object,
    default: () => ({}),
  },
});

// Reactive state
const searchQuery = ref('');
const selectedStatus = ref('all');

// Computed properties
const filteredConversations = computed(() => {
  let result = props.conversations;

  // Filter by search
  if (searchQuery.value) {
    result = result.filter(c =>
      c.contact.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Filter by status
  if (selectedStatus.value !== 'all') {
    result = result.filter(c => c.status === selectedStatus.value);
  }

  return result;
});

const conversationCount = computed(() => filteredConversations.value.length);

// Watchers
watch(searchQuery, (newQuery) => {
  console.log('Search query changed:', newQuery);
  // Could trigger analytics, debounced API call, etc.
});

watch(
  () => props.conversations,
  (newConversations) => {
    console.log('Conversations updated:', newConversations.length);
  },
  { deep: true } // Deep watch for nested changes
);
</script>

<template>
  <div>
    <input
      v-model="searchQuery"
      placeholder="Search conversations..."
      class="border rounded px-4 py-2"
    />

    <select v-model="selectedStatus" class="border rounded px-4 py-2">
      <option value="all">All</option>
      <option value="open">Open</option>
      <option value="resolved">Resolved</option>
    </select>

    <div class="text-sm text-gray-600">
      {{ conversationCount }} conversations
    </div>

    <ConversationList :conversations="filteredConversations" />
  </div>
</template>
```

## Pattern 5: Lifecycle Hooks

```vue
<script setup>
import { ref, onMounted, onUnmounted, onBeforeMount, onUpdated } from 'vue';

const conversationId = ref(null);
let intervalId = null;

// Before mount - runs before component is rendered
onBeforeMount(() => {
  console.log('Component is about to mount');
  // Initialize data, validate props, etc.
});

// Mounted - component is in DOM
onMounted(() => {
  console.log('Component mounted');

  // Fetch initial data
  fetchConversation();

  // Set up polling
  intervalId = setInterval(() => {
    fetchConversation();
  }, 5000);

  // Set up event listeners
  window.addEventListener('focus', handleWindowFocus);
});

// Updated - component re-rendered
onUpdated(() => {
  console.log('Component updated');
  // Scroll to bottom after new messages, etc.
});

// Unmounted - cleanup
onUnmounted(() => {
  console.log('Component unmounting');

  // Clear polling
  if (intervalId) {
    clearInterval(intervalId);
  }

  // Remove event listeners
  window.removeEventListener('focus', handleWindowFocus);
});

const fetchConversation = () => {
  // Fetch logic
};

const handleWindowFocus = () => {
  // Refetch on window focus
  fetchConversation();
};
</script>
```

## Pattern 6: Conditional Rendering

```vue
<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: Object,
  isLoading: Boolean,
});

const hasAttachments = computed(() => props.message?.attachments?.length > 0);
const messageType = computed(() => props.message?.message_type);
</script>

<template>
  <div>
    <!-- v-if: Conditionally render element -->
    <LoadingSpinner v-if="isLoading" />

    <!-- v-else: Alternative render -->
    <div v-else class="message-container">
      <!-- v-show: Toggle visibility (element stays in DOM) -->
      <div v-show="hasAttachments" class="attachments">
        <AttachmentList :attachments="message.attachments" />
      </div>

      <!-- Multiple conditions with v-else-if -->
      <div v-if="messageType === 'incoming'" class="incoming-message">
        <IncomingMessage :message="message" />
      </div>
      <div v-else-if="messageType === 'outgoing'" class="outgoing-message">
        <OutgoingMessage :message="message" />
      </div>
      <div v-else class="activity-message">
        <ActivityMessage :message="message" />
      </div>
    </div>
  </div>
</template>
```

## Pattern 7: List Rendering with v-for

```vue
<script setup>
import { computed } from 'vue';

const props = defineProps({
  conversations: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['conversationClick']);

// Group conversations by status
const groupedConversations = computed(() => {
  return props.conversations.reduce((acc, conv) => {
    const status = conv.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(conv);
    return acc;
  }, {});
});
</script>

<template>
  <div>
    <!-- Simple list -->
    <div
      v-for="conversation in conversations"
      :key="conversation.id"
      @click="emit('conversationClick', conversation.id)"
      class="conversation-card"
    >
      {{ conversation.contact.name }}
    </div>

    <!-- Nested v-for with grouping -->
    <div
      v-for="(convList, status) in groupedConversations"
      :key="status"
      class="conversation-group"
    >
      <h3 class="text-lg font-bold">{{ status }}</h3>

      <div
        v-for="(conversation, index) in convList"
        :key="conversation.id"
        class="conversation-card"
      >
        <span class="text-gray-500">{{ index + 1 }}.</span>
        {{ conversation.contact.name }}
      </div>
    </div>

    <!-- v-for with range -->
    <div v-for="n in 10" :key="n" class="placeholder">
      Placeholder {{ n }}
    </div>
  </div>
</template>
```

## Pattern 8: Slots for Component Composition

```vue
<!-- ParentComponent.vue -->
<script setup>
import Card from './Card.vue';
</script>

<template>
  <Card>
    <!-- Default slot -->
    <template #default>
      <p>This is the main content</p>
    </template>

    <!-- Named slot: header -->
    <template #header>
      <h1>Card Title</h1>
    </template>

    <!-- Named slot: footer -->
    <template #footer>
      <button>Close</button>
    </template>
  </Card>
</template>

<!-- Card.vue (child component) -->
<script setup>
// No props needed for slots
</script>

<template>
  <div class="card">
    <div class="card-header">
      <slot name="header">
        <!-- Fallback content if no header slot provided -->
        <h2>Default Header</h2>
      </slot>
    </div>

    <div class="card-body">
      <slot>
        <!-- Default slot (no name) -->
        Default content
      </slot>
    </div>

    <div class="card-footer">
      <slot name="footer">
        Default footer
      </slot>
    </div>
  </div>
</template>
```

## Component Communication Patterns

### Parent → Child (Props)

```vue
<!-- Parent.vue -->
<template>
  <MessageBubble
    :message="message"
    :is-incoming="true"
    :sender="sender"
  />
</template>

<!-- Child.vue -->
<script setup>
const props = defineProps({
  message: Object,
  isIncoming: Boolean,
  sender: Object,
});
</script>
```

### Child → Parent (Events)

```vue
<!-- Child.vue -->
<script setup>
const emit = defineEmits(['messageSent', 'messageDeleted']);

const handleSend = () => {
  emit('messageSent', { content: 'Hello', timestamp: Date.now() });
};

const handleDelete = (id) => {
  emit('messageDeleted', id);
};
</script>

<template>
  <button @click="handleSend">Send</button>
  <button @click="handleDelete(123)">Delete</button>
</template>

<!-- Parent.vue -->
<template>
  <MessageComposer
    @message-sent="handleMessageSent"
    @message-deleted="handleMessageDeleted"
  />
</template>

<script setup>
const handleMessageSent = (message) => {
  console.log('Message sent:', message);
};

const handleMessageDeleted = (id) => {
  console.log('Message deleted:', id);
};
</script>
```

### Provide/Inject (Deep Nesting)

```vue
<!-- Ancestor.vue -->
<script setup>
import { provide, ref } from 'vue';

const currentUserId = ref(123);
provide('currentUserId', currentUserId);
</script>

<!-- Deeply Nested Descendant.vue -->
<script setup>
import { inject } from 'vue';

const currentUserId = inject('currentUserId');
</script>
```

## Key Patterns Summary

| Pattern | Vue 3 | React Equivalent |
|---------|-------|------------------|
| **Component Definition** | `<script setup>` | Function component |
| **Reactive State** | `ref()`, `reactive()` | `useState()` |
| **Computed Values** | `computed()` | `useMemo()` |
| **Side Effects** | `watch()` | `useEffect()` |
| **Lifecycle** | `onMounted()`, etc. | `useEffect()` |
| **Props** | `defineProps()` | Function params |
| **Events** | `defineEmits()` | Callback props |
| **Composables** | Custom composables | Custom hooks |
| **Context** | `provide/inject` | React Context |

## Tailwind Styling Pattern

Chatwoot exclusively uses Tailwind CSS (no custom CSS or scoped styles):

```vue
<template>
  <div class="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-gray-900">
      Title
    </h1>

    <p class="text-base text-gray-600">
      Description
    </p>

    <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Submit
    </button>
  </div>
</template>
```

**Refer to:** `tailwind.config.js:1` for color definitions

## Adapting to FrontDesk (React)

When implementing in FrontDesk with React:

| Vue Pattern | React Equivalent |
|-------------|------------------|
| `ref('hello')` | `useState('hello')` |
| `computed(() => x + y)` | `useMemo(() => x + y, [x, y])` |
| `watch(x, callback)` | `useEffect(() => callback(), [x])` |
| `onMounted(callback)` | `useEffect(() => callback(), [])` |
| `defineProps()` | Component props |
| `emit('event', data)` | `onEvent(data)` callback prop |
| `useStore()` | `useRecoilState()` |
| Custom composable | Custom hook |

## References

- **Modern Components:** `app/javascript/dashboard/components-next/`
- **Message Bubble:** `app/javascript/dashboard/components-next/Conversation/MessageBubble.vue:1`
- **Reply Box:** `app/javascript/dashboard/components/widgets/conversation/ReplyBox.vue:1`
- **Composables:** `app/javascript/dashboard/composables/`
- **Tailwind Config:** `tailwind.config.js:1`
