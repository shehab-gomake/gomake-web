---
name: chatwoot-state-management
description: Use when managing global state, implementing async operations with Vuex, or understanding how Chatwoot handles state updates and optimistic UI patterns
---

# Chatwoot State Management with Vuex

## When to Use This Skill

- Implementing global state management in FrontDesk
- Learning how to structure state for messaging features
- Understanding optimistic UI update patterns
- Managing async operations (API calls) in state layer
- Structuring store modules by domain
- Handling real-time updates and WebSocket data

## Overview

Chatwoot uses **Vuex** for global state management with a modular architecture:
- **40+ domain-specific modules** (conversations, contacts, inboxes, agents, etc.)
- **Namespaced modules** for isolation
- **Optimistic updates** for better UX
- **Action-based async operations** for API calls
- **Mutation-based state updates** for predictability

**Store Location:** `app/javascript/dashboard/store/index.js:1`

## Store Structure

```javascript
// app/javascript/dashboard/store/index.js
import { createStore } from 'vuex';

// Import modules
import conversations from './modules/conversations';
import contacts from './modules/contacts';
import inboxes from './modules/inboxes';
import agents from './modules/agents';
import labels from './modules/labels';
// ... 35+ more modules

export default createStore({
  modules: {
    conversations,
    contacts,
    inboxes,
    agents,
    labels,
    notifications,
    teams,
    // ... 40+ modules total
  },
});
```

## Module Pattern

Each Vuex module has up to 4 parts:

```
store/modules/conversations/
├── index.js       # Module definition + state
├── actions.js     # Async operations (API calls)
├── mutations.js   # Synchronous state updates
└── getters.js     # Computed/derived state
```

### Small Modules (Single File)

For simple state, everything in one file:

**Location:** `app/javascript/dashboard/store/modules/agents.js:1`

```javascript
// app/javascript/dashboard/store/modules/agents.js
import AgentAPI from 'dashboard/api/agents';

const state = {
  records: [],
  uiFlags: {
    isFetching: false,
  },
};

const getters = {
  getAgents: state => state.records,
  getUIFlags: state => state.uiFlags,
  getVerifiedAgents: state =>
    state.records.filter(record => record.confirmed),
};

const actions = {
  get: async ({ commit }) => {
    commit('setUIFlag', { isFetching: true });
    try {
      const response = await AgentAPI.get();
      commit('setAgents', response.data);
    } catch (error) {
      // Handle error
    } finally {
      commit('setUIFlag', { isFetching: false });
    }
  },

  update: async ({ commit }, { id, ...agentParams }) => {
    commit('setUIFlag', { isUpdating: true });
    try {
      const response = await AgentAPI.update(id, agentParams);
      commit('editAgent', response.data);
    } catch (error) {
      throw error;
    } finally {
      commit('setUIFlag', { isUpdating: false });
    }
  },
};

const mutations = {
  setAgents: (state, agents) => {
    state.records = agents;
  },

  editAgent: (state, updatedAgent) => {
    const index = state.records.findIndex(
      agent => agent.id === updatedAgent.id
    );
    if (index !== -1) {
      state.records[index] = updatedAgent;
    }
  },

  setUIFlag: (state, flag) => {
    state.uiFlags = { ...state.uiFlags, ...flag };
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
```

### Large Modules (Split Files)

For complex state, split into multiple files:

**Location:** `app/javascript/dashboard/store/modules/conversations/`

#### index.js - State Definition

```javascript
// app/javascript/dashboard/store/modules/conversations/index.js
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';

const state = {
  allConversations: [],
  selectedChatId: null,
  currentInbox: null,
  conversationMetadata: {},
  conversationFilters: {
    status: 'open',
    page: 1,
    assigneeType: 'me',
    labels: [],
  },
  uiFlags: {
    isFetching: false,
    isFetchingItem: false,
    isUpdating: false,
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
```

#### actions.js - Async Operations

**Location:** `app/javascript/dashboard/store/modules/conversations/actions.js:1`

```javascript
// app/javascript/dashboard/store/modules/conversations/actions.js
import * as types from '../../mutation-types';
import ConversationApi from 'dashboard/api/conversations';
import MessageApi from 'dashboard/api/inbox/message';

export const actions = {
  // Fetch all conversations with filters
  fetchAllConversations: async ({ commit, state }) => {
    commit(types.SET_LIST_LOADING_STATUS);
    try {
      const {
        data: {
          data: { meta, payload },
        },
      } = await ConversationApi.get(state.conversationFilters);

      commit(types.SET_ALL_CONVERSATION, payload);
      commit(types.SET_CONVERSATION_METADATA, meta);
      commit(types.CLEAR_LIST_LOADING_STATUS);
    } catch (error) {
      commit(types.CLEAR_LIST_LOADING_STATUS);
    }
  },

  // Fetch single conversation
  fetchConversation: async ({ commit }, conversationId) => {
    commit(types.SET_CONVERSATION_ITEM_LOADING_STATUS, true);
    try {
      const response = await ConversationApi.show(conversationId);
      commit(types.UPDATE_CONVERSATION, response.data);
    } catch (error) {
      // Handle error
    } finally {
      commit(types.SET_CONVERSATION_ITEM_LOADING_STATUS, false);
    }
  },

  // Send message with optimistic update
  sendMessageWithData: async ({ commit }, pendingMessage) => {
    const {
      conversation_id: conversationId,
      id: echoId,
    } = pendingMessage;

    // Optimistic update - add message immediately
    commit(types.ADD_MESSAGE, {
      ...pendingMessage,
      status: MESSAGE_STATUS.PROGRESS,
    });

    try {
      // Make API call
      const response = await MessageApi.create(pendingMessage);

      // Success - replace with real message
      commit(types.ADD_MESSAGE, {
        ...response.data,
        status: MESSAGE_STATUS.SENT,
        echo_id: echoId,
      });
    } catch (error) {
      // Failure - mark as failed
      commit(types.ADD_MESSAGE, {
        ...pendingMessage,
        id: echoId,
        status: MESSAGE_STATUS.FAILED,
      });
    }
  },

  // Update conversation status
  toggleStatus: async ({ commit }, { conversationId, status }) => {
    commit(types.UPDATE_CONVERSATION_STATUS_FLAG, {
      id: conversationId,
      status,
    });

    try {
      const response = await ConversationApi.toggleStatus(
        conversationId,
        status
      );
      commit(types.UPDATE_CONVERSATION, response.data);
    } catch (error) {
      // Rollback on error
      commit(types.UPDATE_CONVERSATION_STATUS_FLAG, {
        id: conversationId,
        status: error.previousStatus,
      });
    }
  },

  // Set active conversation
  setActiveChat: ({ commit }, data) => {
    commit(types.SET_CURRENT_CHAT_WINDOW, data);
  },

  // Update filters
  setConversationFilters: ({ commit, dispatch }, filters) => {
    commit(types.SET_CONVERSATION_FILTERS, filters);
    dispatch('fetchAllConversations');
  },
};
```

#### mutations.js - State Updates

**Location:** `app/javascript/dashboard/store/modules/conversations/mutations.js:1`

```javascript
// app/javascript/dashboard/store/modules/conversations/mutations.js
import * as types from '../../mutation-types';
import Vue from 'vue';

export const mutations = {
  [types.SET_ALL_CONVERSATION]: (state, conversations) => {
    state.allConversations = conversations;
  },

  [types.ADD_CONVERSATION]: (state, conversation) => {
    state.allConversations.push(conversation);
  },

  [types.UPDATE_CONVERSATION]: (state, conversation) => {
    const index = state.allConversations.findIndex(
      c => c.id === conversation.id
    );
    if (index !== -1) {
      // Use Vue.set for reactivity
      Vue.set(state.allConversations, index, {
        ...state.allConversations[index],
        ...conversation,
      });
    }
  },

  [types.ADD_MESSAGE]: (state, message) => {
    const conversation = state.allConversations.find(
      c => c.id === message.conversation_id
    );
    if (conversation) {
      const messageIndex = conversation.messages.findIndex(
        m => m.id === message.id || m.id === message.echo_id
      );

      if (messageIndex !== -1) {
        // Update existing message (replace optimistic with real)
        Vue.set(conversation.messages, messageIndex, message);
      } else {
        // Add new message
        conversation.messages.push(message);
      }

      // Update last activity time
      conversation.last_activity_at = message.created_at;
    }
  },

  [types.SET_CURRENT_CHAT_WINDOW]: (state, activeChat) => {
    state.selectedChatId = activeChat?.id || null;
  },

  [types.SET_CONVERSATION_FILTERS]: (state, filters) => {
    state.conversationFilters = { ...state.conversationFilters, ...filters };
  },

  [types.SET_LIST_LOADING_STATUS]: state => {
    state.uiFlags.isFetching = true;
  },

  [types.CLEAR_LIST_LOADING_STATUS]: state => {
    state.uiFlags.isFetching = false;
  },

  [types.UPDATE_CONVERSATION_STATUS_FLAG]: (state, { id, status }) => {
    const conversation = state.allConversations.find(c => c.id === id);
    if (conversation) {
      conversation.status = status;
    }
  },
};
```

#### getters.js - Computed State

**Location:** `app/javascript/dashboard/store/modules/conversations/getters.js:1`

```javascript
// app/javascript/dashboard/store/modules/conversations/getters.js
export const getters = {
  getAllConversations: state => state.allConversations,

  getSelectedChat: state => {
    const { selectedChatId, allConversations } = state;
    return allConversations.find(c => c.id === selectedChatId);
  },

  getConversationById: state => id => {
    return state.allConversations.find(c => c.id === id);
  },

  getUIFlags: state => state.uiFlags,

  getAppliedFilters: state => state.conversationFilters,

  // Derived state
  getUnreadCount: state => {
    return state.allConversations.filter(c => c.unread_count > 0).length;
  },

  getOpenConversations: state => {
    return state.allConversations.filter(c => c.status === 'open');
  },

  getMyConversations: (state, getters, rootState) => {
    const currentUserId = rootState.auth.currentUser.id;
    return state.allConversations.filter(
      c => c.assignee?.id === currentUserId
    );
  },
};
```

## Using Vuex in Components

### Composition API Pattern (Modern)

```vue
<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// Getters
const conversations = computed(() =>
  store.getters['conversations/getAllConversations']
);

const selectedChat = computed(() =>
  store.getters['conversations/getSelectedChat']
);

const isLoading = computed(() =>
  store.getters['conversations/getUIFlags'].isFetching
);

// Actions
const fetchConversations = () => {
  store.dispatch('conversations/fetchAllConversations');
};

const sendMessage = (message) => {
  store.dispatch('conversations/sendMessageWithData', {
    conversation_id: selectedChat.value.id,
    content: message,
    id: `echo-${Date.now()}`, // Echo ID for optimistic update
  });
};

const setFilters = (filters) => {
  store.dispatch('conversations/setConversationFilters', filters);
};

// Lifecycle
onMounted(() => {
  fetchConversations();
});
</script>

<template>
  <div>
    <LoadingSpinner v-if="isLoading" />
    <ConversationList v-else :conversations="conversations" />
  </div>
</template>
```

## Optimistic Update Pattern

Chatwoot's signature pattern for better UX:

```javascript
// 1. Immediately update UI (optimistic)
commit(types.ADD_MESSAGE, {
  ...pendingMessage,
  id: echoId,              // Temporary ID
  status: 'progress',      // Show as sending
  created_at: new Date(),
});

// 2. Make API call
try {
  const response = await MessageApi.create(pendingMessage);

  // 3. Success - replace with real data
  commit(types.ADD_MESSAGE, {
    ...response.data,
    echo_id: echoId,        // Link to optimistic message
    status: 'sent',
  });
} catch (error) {
  // 4. Failure - mark as failed
  commit(types.ADD_MESSAGE, {
    ...pendingMessage,
    id: echoId,
    status: 'failed',       // Show retry option
  });
}
```

**Mutation handler:**
```javascript
[types.ADD_MESSAGE]: (state, message) => {
  const conversation = findConversation(state, message.conversation_id);

  // Find existing message by ID or echo_id
  const existingIndex = conversation.messages.findIndex(
    m => m.id === message.id || m.id === message.echo_id
  );

  if (existingIndex !== -1) {
    // Replace optimistic message with real one
    Vue.set(conversation.messages, existingIndex, message);
  } else {
    // Add new optimistic message
    conversation.messages.push(message);
  }
};
```

## UI Flags Pattern

Track loading and operation states:

```javascript
const state = {
  uiFlags: {
    isFetching: false,      // Loading list
    isFetchingItem: false,  // Loading single item
    isCreating: false,      // Creating new item
    isUpdating: false,      // Updating item
    isDeleting: false,      // Deleting item
  },
};

// Set before async operation
commit('setUIFlag', { isFetching: true });

// Clear after completion
commit('setUIFlag', { isFetching: false });
```

**Usage in components:**
```vue
<template>
  <button :disabled="isUpdating" @click="updateConversation">
    {{ isUpdating ? 'Saving...' : 'Save' }}
  </button>
</template>
```

## Real-Time Update Pattern

Handle WebSocket messages:

```javascript
// Action called by WebSocket listener
addMessage: ({ commit }, message) => {
  commit(types.ADD_MESSAGE, message);
  commit(types.UPDATE_CONVERSATION_LAST_ACTIVITY, {
    id: message.conversation_id,
    timestamp: message.created_at,
  });
};

// ActionCable listener triggers this
cableConnector.subscribe('ConversationChannel', {
  received(data) {
    if (data.event === 'message.created') {
      store.dispatch('conversations/addMessage', data.message);
    }
  },
});
```

## Filter Management Pattern

Store filters separately and reuse:

```javascript
const state = {
  conversationFilters: {
    status: 'open',           // open, resolved, pending
    assigneeType: 'me',       // me, unassigned, all
    page: 1,
    inboxId: null,
    teamId: null,
    labels: [],
    conversationType: null,   // mention, participating
  },
};

// Update filters triggers refetch
actions: {
  setConversationFilters: ({ commit, dispatch }, filters) => {
    commit(types.SET_CONVERSATION_FILTERS, filters);
    dispatch('fetchAllConversations');  // Refetch with new filters
  },
};
```

## Pagination Pattern

```javascript
const state = {
  conversationMetadata: {
    count: 0,           // Total items
    current_page: 1,    // Current page
    all_count: 0,       // Total across all pages
  },
};

actions: {
  fetchAllConversations: async ({ commit, state }) => {
    const { data: { meta, payload } } = await ConversationApi.get(
      state.conversationFilters
    );

    commit(types.SET_ALL_CONVERSATION, payload);
    commit(types.SET_CONVERSATION_METADATA, meta);
  },

  loadMore: async ({ commit, state }) => {
    const nextPage = state.conversationMetadata.current_page + 1;
    commit(types.SET_CONVERSATION_FILTERS, { page: nextPage });

    const { data: { payload } } = await ConversationApi.get(
      state.conversationFilters
    );

    // Append to existing list
    commit(types.APPEND_CONVERSATIONS, payload);
  },
};
```

## Key Patterns Summary

| Pattern | Purpose | Example |
|---------|---------|---------|
| **Namespaced Modules** | Isolate domain state | `store.dispatch('conversations/fetch')` |
| **Actions for Async** | Handle API calls | `fetchAllConversations` |
| **Mutations for Sync** | Update state | `SET_ALL_CONVERSATION` |
| **Getters for Computed** | Derive state | `getUnreadCount` |
| **Optimistic Updates** | Better UX | Message sending |
| **UI Flags** | Loading states | `isFetching`, `isUpdating` |
| **Filter Management** | Reusable filters | `conversationFilters` |
| **Echo IDs** | Track optimistic updates | Temporary message IDs |

## Key Modules Reference

| Module | File Path | Purpose |
|--------|-----------|---------|
| **Conversations** | `store/modules/conversations/` | Conversation list, messages, filters |
| **Contacts** | `store/modules/contacts.js` | Contact management |
| **Inboxes** | `store/modules/inboxes.js` | Inbox/channel data |
| **Agents** | `store/modules/agents.js` | Agent list and details |
| **Labels** | `store/modules/labels.js` | Label management |
| **Notifications** | `store/modules/notifications.js` | Notification state |
| **Teams** | `store/modules/teams.js` | Team data |

## Adapting to FrontDesk (Recoil)

When implementing in FrontDesk with Recoil:

1. **Atoms replace state**: Each piece of state becomes an atom
2. **Selectors replace getters**: Derived state via selectors
3. **Custom hooks replace actions**: Async operations in hooks
4. **Keep optimistic updates**: Same pattern works with Recoil
5. **Keep UI flags pattern**: Track loading states in atoms

**Example Recoil equivalent:**
```typescript
// atoms/conversations.ts
export const conversationsState = atom<Conversation[]>({
  key: 'conversations',
  default: [],
});

export const conversationFiltersState = atom<ConversationFilters>({
  key: 'conversationFilters',
  default: { status: 'open', page: 1 },
});

// hooks/use-conversations.ts
export const useConversations = () => {
  const [conversations, setConversations] = useRecoilState(conversationsState);
  const [filters] = useRecoilState(conversationFiltersState);

  const fetchConversations = async () => {
    const data = await chatwootService.conversations.list(accountId, filters);
    setConversations(data);
  };

  return { conversations, fetchConversations };
};
```

## References

- **Store Root:** `app/javascript/dashboard/store/index.js:1`
- **Conversations Module:** `app/javascript/dashboard/store/modules/conversations/`
- **Actions:** `app/javascript/dashboard/store/modules/conversations/actions.js:1`
- **Mutations:** `app/javascript/dashboard/store/modules/conversations/mutations.js:1`
- **Getters:** `app/javascript/dashboard/store/modules/conversations/getters.js:1`
- **All Modules:** `app/javascript/dashboard/store/modules/`
