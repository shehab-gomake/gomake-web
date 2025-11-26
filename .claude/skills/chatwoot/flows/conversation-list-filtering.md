---
name: chatwoot-conversation-list-filtering
description: Use when implementing conversation lists, inbox views, conversation filtering by status/assignee/labels, pagination, or real-time conversation updates
---

# Chatwoot Conversation List & Filtering Flow

## When to Use This Skill

- Building inbox/conversation list views
- Implementing conversation filters (status, assignee, labels, team)
- Adding pagination or infinite scroll
- Understanding how conversations are fetched and displayed
- Implementing real-time conversation updates
- Building conversation search functionality

## Overview

The conversation list flow involves:

1. **Fetching**: Load conversations with filters and pagination
2. **Filtering**: Filter by status, assignee, inbox, team, labels
3. **Sorting**: Sort by last activity time (most recent first)
4. **Pagination**: Load more conversations on scroll
5. **Real-time Updates**: Update list when new messages arrive

**Key Features:**
- Multi-criteria filtering
- Server-side filtering (not client-side)
- Pagination with metadata
- Real-time conversation updates via WebSocket
- Optimistic updates for status changes

## Complete Flow Diagram

```
User Selects Filters
    ↓
[Component] - Update filter state
    ↓
[Vuex Action] - setConversationFilters()
    ↓
[Vuex Action] - fetchAllConversations()
    ↓
[ConversationApi] - get() with filters
    ↓
POST /api/v1/accounts/{id}/conversations/filter
    ↓
[Response] - { meta, payload }
    ↓
[Mutation] - SET_ALL_CONVERSATION + SET_METADATA
    ↓
[Component] - Render conversation list
```

## Filter State Structure

**Location:** `app/javascript/dashboard/store/modules/conversations/index.js:1`

```javascript
const state = {
  allConversations: [],
  conversationMetadata: {
    count: 0,         // Items on current page
    current_page: 1,  // Current page number
    all_count: 0,     // Total items across all pages
  },
  conversationFilters: {
    // Status filter
    status: 'open',           // 'open', 'resolved', 'pending', 'snoozed', 'all'

    // Assignment filter
    assigneeType: 'me',       // 'me', 'unassigned', 'all', or specific agent ID

    // Inbox filter
    inboxId: null,            // null = all inboxes, or specific inbox ID

    // Team filter
    teamId: null,             // null = all teams, or specific team ID

    // Labels filter
    labels: [],               // Array of label IDs

    // Conversation type
    conversationType: null,   // 'mention', 'participating', null

    // Pagination
    page: 1,

    // Sort (optional)
    sortBy: 'last_activity_at',
  },
  uiFlags: {
    isFetching: false,
    isFetchingItem: false,
  },
};
```

## Step 1: Filter Component

**Location:** `app/javascript/dashboard/components/widgets/conversation/ConversationFilter.vue:1`

```vue
<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// Current filters from store
const currentFilters = computed(() =>
  store.getters['conversations/getAppliedFilters']
);

// Available filter options
const statusOptions = [
  { label: 'Open', value: 'open' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Pending', value: 'pending' },
  { label: 'All', value: 'all' },
];

const assigneeOptions = computed(() => [
  { label: 'Mine', value: 'me' },
  { label: 'Unassigned', value: 'unassigned' },
  { label: 'All', value: 'all' },
]);

// Get inboxes and labels from store
const inboxes = computed(() => store.getters['inboxes/getInboxes']);
const labels = computed(() => store.getters['labels/getLabels']);
const teams = computed(() => store.getters['teams/getTeams']);

// Update filters
const updateFilter = (key, value) => {
  store.dispatch('conversations/setConversationFilters', {
    ...currentFilters.value,
    [key]: value,
    page: 1, // Reset to first page when filter changes
  });
};

const updateStatus = (status) => updateFilter('status', status);
const updateAssignee = (assignee) => updateFilter('assigneeType', assignee);
const updateInbox = (inboxId) => updateFilter('inboxId', inboxId);
const updateTeam = (teamId) => updateFilter('teamId', teamId);
const updateLabels = (labelIds) => updateFilter('labels', labelIds);
</script>

<template>
  <div class="conversation-filters flex flex-col gap-4 p-4 bg-white border-b">
    <!-- Status Filter -->
    <div class="filter-group">
      <label class="text-sm font-medium text-gray-700 mb-2">Status</label>
      <div class="flex gap-2">
        <button
          v-for="option in statusOptions"
          :key="option.value"
          @click="updateStatus(option.value)"
          :class="{
            'bg-blue-500 text-white': currentFilters.status === option.value,
            'bg-gray-100 text-gray-700': currentFilters.status !== option.value,
          }"
          class="px-4 py-2 rounded-lg text-sm"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- Assignee Filter -->
    <div class="filter-group">
      <label class="text-sm font-medium text-gray-700 mb-2">Assignee</label>
      <select
        :value="currentFilters.assigneeType"
        @change="updateAssignee($event.target.value)"
        class="border rounded-lg px-4 py-2"
      >
        <option
          v-for="option in assigneeOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <!-- Inbox Filter -->
    <div class="filter-group">
      <label class="text-sm font-medium text-gray-700 mb-2">Inbox</label>
      <select
        :value="currentFilters.inboxId"
        @change="updateInbox($event.target.value ? parseInt($event.target.value) : null)"
        class="border rounded-lg px-4 py-2"
      >
        <option :value="null">All Inboxes</option>
        <option
          v-for="inbox in inboxes"
          :key="inbox.id"
          :value="inbox.id"
        >
          {{ inbox.name }}
        </option>
      </select>
    </div>

    <!-- Label Filter (Multi-select) -->
    <div class="filter-group">
      <label class="text-sm font-medium text-gray-700 mb-2">Labels</label>
      <div class="flex flex-wrap gap-2">
        <label
          v-for="label in labels"
          :key="label.id"
          class="flex items-center gap-1 px-3 py-1 rounded-full text-sm cursor-pointer"
          :class="{
            'bg-blue-500 text-white': currentFilters.labels.includes(label.id),
            'bg-gray-100 text-gray-700': !currentFilters.labels.includes(label.id),
          }"
        >
          <input
            type="checkbox"
            :checked="currentFilters.labels.includes(label.id)"
            @change="toggleLabel(label.id)"
            class="hidden"
          />
          {{ label.title }}
        </label>
      </div>
    </div>
  </div>
</template>
```

## Step 2: Vuex Actions

**Location:** `app/javascript/dashboard/store/modules/conversations/actions.js:1`

```javascript
// app/javascript/dashboard/store/modules/conversations/actions.js
import * as types from '../../mutation-types';
import ConversationApi from 'dashboard/api/conversations';

export const actions = {
  // Set filters and trigger refetch
  setConversationFilters: ({ commit, dispatch }, filters) => {
    commit(types.SET_CONVERSATION_FILTERS, filters);
    dispatch('fetchAllConversations');
  },

  // Fetch conversations with current filters
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

      return payload;
    } catch (error) {
      commit(types.CLEAR_LIST_LOADING_STATUS);
      throw error;
    }
  },

  // Load more (pagination)
  loadMoreConversations: async ({ commit, state }) => {
    const { current_page, all_count, count } = state.conversationMetadata;
    const hasMore = current_page * count < all_count;

    if (!hasMore || state.uiFlags.isFetching) return;

    const nextPage = current_page + 1;

    // Update filters with next page
    commit(types.SET_CONVERSATION_FILTERS, {
      ...state.conversationFilters,
      page: nextPage,
    });

    try {
      const {
        data: {
          data: { meta, payload },
        },
      } = await ConversationApi.get(state.conversationFilters);

      // Append to existing conversations
      commit(types.APPEND_CONVERSATIONS, payload);
      commit(types.SET_CONVERSATION_METADATA, meta);
    } catch (error) {
      console.error('Failed to load more:', error);
    }
  },

  // Update conversation status (optimistic)
  toggleStatus: async ({ commit }, { conversationId, status }) => {
    // Optimistic update
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
      const previousStatus = error.config?.previousStatus;
      if (previousStatus) {
        commit(types.UPDATE_CONVERSATION_STATUS_FLAG, {
          id: conversationId,
          status: previousStatus,
        });
      }
      throw error;
    }
  },
};
```

## Step 3: Vuex Mutations

**Location:** `app/javascript/dashboard/store/modules/conversations/mutations.js:1`

```javascript
// app/javascript/dashboard/store/modules/conversations/mutations.js
import * as types from '../../mutation-types';

export const mutations = {
  [types.SET_ALL_CONVERSATION]: (state, conversations) => {
    state.allConversations = conversations;
  },

  [types.APPEND_CONVERSATIONS]: (state, conversations) => {
    state.allConversations = [...state.allConversations, ...conversations];
  },

  [types.SET_CONVERSATION_METADATA]: (state, metadata) => {
    state.conversationMetadata = metadata;
  },

  [types.SET_CONVERSATION_FILTERS]: (state, filters) => {
    state.conversationFilters = { ...state.conversationFilters, ...filters };
  },

  [types.UPDATE_CONVERSATION]: (state, updatedConversation) => {
    const index = state.allConversations.findIndex(
      c => c.id === updatedConversation.id
    );

    if (index !== -1) {
      Vue.set(state.allConversations, index, {
        ...state.allConversations[index],
        ...updatedConversation,
      });
    } else {
      // New conversation - add to top
      state.allConversations.unshift(updatedConversation);
    }

    // Re-sort by last activity
    state.allConversations.sort(
      (a, b) =>
        new Date(b.last_activity_at) - new Date(a.last_activity_at)
    );
  },

  [types.UPDATE_CONVERSATION_STATUS_FLAG]: (state, { id, status }) => {
    const conversation = state.allConversations.find(c => c.id === id);
    if (conversation) {
      conversation.status = status;
    }
  },

  [types.SET_LIST_LOADING_STATUS]: (state) => {
    state.uiFlags.isFetching = true;
  },

  [types.CLEAR_LIST_LOADING_STATUS]: (state) => {
    state.uiFlags.isFetching = false;
  },
};
```

## Step 4: API Client

**Location:** `app/javascript/dashboard/api/conversations.js:1`

```javascript
// app/javascript/dashboard/api/conversations.js
import ApiClient from './ApiClient';

class ConversationApi extends ApiClient {
  constructor() {
    super('conversations', { accountScoped: true });
  }

  get(filters) {
    // Build query parameters
    const params = {
      status: filters.status,
      assignee_type: filters.assigneeType,
      page: filters.page || 1,
    };

    if (filters.inboxId) {
      params.inbox_id = filters.inboxId;
    }

    if (filters.teamId) {
      params.team_id = filters.teamId;
    }

    if (filters.labels && filters.labels.length > 0) {
      params.labels = filters.labels;
    }

    if (filters.conversationType) {
      params.conversation_type = filters.conversationType;
    }

    // GET /api/v1/accounts/{accountId}/conversations?status=open&assignee_type=me&page=1
    return axios.get(this.url, { params });
  }

  toggleStatus(conversationId, status) {
    // POST /api/v1/accounts/{accountId}/conversations/{id}/toggle_status
    return axios.post(`${this.url}/${conversationId}/toggle_status`, {
      status,
    });
  }

  assignAgent(conversationId, agentId) {
    // POST /api/v1/accounts/{accountId}/conversations/{id}/assignments
    return axios.post(`${this.url}/${conversationId}/assignments`, {
      assignee_id: agentId,
    });
  }

  assignTeam(conversationId, teamId) {
    // POST /api/v1/accounts/{accountId}/conversations/{id}/assignments
    return axios.post(`${this.url}/${conversationId}/assignments`, {
      team_id: teamId,
    });
  }

  updateLabels(conversationId, labels) {
    // POST /api/v1/accounts/{accountId}/conversations/{id}/labels
    return axios.post(`${this.url}/${conversationId}/labels`, { labels });
  }
}

export default new ConversationApi();
```

## Step 5: Conversation List Component

**Location:** `app/javascript/dashboard/components/widgets/conversation/ConversationList.vue:1`

```vue
<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import ConversationCard from './ConversationCard.vue';

const store = useStore();

// State from Vuex
const conversations = computed(() =>
  store.getters['conversations/getAllConversations']
);

const metadata = computed(() =>
  store.getters['conversations/getConversationMetadata']
);

const isLoading = computed(() =>
  store.getters['conversations/getUIFlags'].isFetching
);

const currentFilters = computed(() =>
  store.getters['conversations/getAppliedFilters']
);

// Infinite scroll
const listContainer = ref(null);

const hasMore = computed(() => {
  const { current_page, all_count, count } = metadata.value;
  return current_page * count < all_count;
});

const handleScroll = () => {
  if (!listContainer.value || !hasMore.value || isLoading.value) return;

  const { scrollTop, scrollHeight, clientHeight } = listContainer.value;
  const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

  if (isNearBottom) {
    store.dispatch('conversations/loadMoreConversations');
  }
};

// Lifecycle
onMounted(() => {
  store.dispatch('conversations/fetchAllConversations');
});

// Refetch when filters change
watch(currentFilters, () => {
  // Filters already trigger refetch in setConversationFilters action
  // This watcher is just for side effects (analytics, etc.)
  console.log('Filters changed:', currentFilters.value);
});
</script>

<template>
  <div
    ref="listContainer"
    @scroll="handleScroll"
    class="conversation-list flex flex-col overflow-y-auto h-full"
  >
    <!-- Empty State -->
    <div
      v-if="!isLoading && conversations.length === 0"
      class="flex flex-col items-center justify-center h-full text-gray-500"
    >
      <p class="text-lg">No conversations found</p>
      <p class="text-sm">Try adjusting your filters</p>
    </div>

    <!-- Conversation Cards -->
    <ConversationCard
      v-for="conversation in conversations"
      :key="conversation.id"
      :conversation="conversation"
    />

    <!-- Loading Indicator -->
    <div
      v-if="isLoading"
      class="flex items-center justify-center py-4"
    >
      <span class="text-gray-500">Loading...</span>
    </div>

    <!-- Load More Indicator -->
    <div
      v-if="hasMore && !isLoading"
      class="text-center py-4 text-sm text-gray-500"
    >
      Scroll to load more
    </div>
  </div>
</template>
```

## Step 6: Conversation Card Component

```vue
<script setup>
import { computed } from 'vue';

const props = defineProps({
  conversation: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['click']);

// Computed
const lastMessage = computed(() => {
  const messages = props.conversation.messages || [];
  return messages[messages.length - 1];
});

const unreadCount = computed(() => props.conversation.unread_count || 0);

const hasUnread = computed(() => unreadCount.value > 0);

const formattedTime = computed(() => {
  const date = new Date(props.conversation.last_activity_at);
  const now = new Date();
  const diffHours = (now - date) / (1000 * 60 * 60);

  if (diffHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString();
  }
});

const statusColor = computed(() => {
  const colors = {
    open: 'bg-green-100 text-green-800',
    resolved: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    snoozed: 'bg-blue-100 text-blue-800',
  };
  return colors[props.conversation.status] || '';
});
</script>

<template>
  <div
    @click="emit('click', conversation.id)"
    class="conversation-card flex items-start gap-4 p-4 border-b hover:bg-gray-50 cursor-pointer"
    :class="{ 'bg-blue-50': hasUnread }"
  >
    <!-- Avatar -->
    <div class="flex-shrink-0">
      <img
        :src="conversation.contact.avatar_url"
        :alt="conversation.contact.name"
        class="w-12 h-12 rounded-full"
      />
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between mb-1">
        <h3 class="text-sm font-medium text-gray-900 truncate">
          {{ conversation.contact.name }}
        </h3>

        <span class="text-xs text-gray-500">
          {{ formattedTime }}
        </span>
      </div>

      <p class="text-sm text-gray-600 truncate">
        {{ lastMessage?.content || 'No messages' }}
      </p>

      <div class="flex items-center gap-2 mt-2">
        <!-- Status Badge -->
        <span
          :class="statusColor"
          class="px-2 py-0.5 text-xs font-medium rounded-full"
        >
          {{ conversation.status }}
        </span>

        <!-- Unread Badge -->
        <span
          v-if="hasUnread"
          class="px-2 py-0.5 text-xs font-medium bg-blue-500 text-white rounded-full"
        >
          {{ unreadCount }}
        </span>

        <!-- Labels -->
        <span
          v-for="label in conversation.labels"
          :key="label.id"
          class="px-2 py-0.5 text-xs rounded-full"
          :style="{ backgroundColor: label.color, color: '#fff' }"
        >
          {{ label.title }}
        </span>
      </div>
    </div>
  </div>
</template>
```

## API Response Format

```json
{
  "data": {
    "meta": {
      "count": 25,           // Items on this page
      "current_page": 1,     // Current page number
      "all_count": 150       // Total items across all pages
    },
    "payload": [
      {
        "id": 123,
        "status": "open",
        "inbox_id": 1,
        "contact_id": 456,
        "assignee_id": 789,
        "team_id": null,
        "unread_count": 3,
        "last_activity_at": "2025-01-12T10:30:00Z",
        "contact": {
          "id": 456,
          "name": "John Doe",
          "email": "john@example.com",
          "avatar_url": "https://..."
        },
        "assignee": {
          "id": 789,
          "name": "Agent Name"
        },
        "labels": [
          { "id": 1, "title": "VIP", "color": "#FF0000" }
        ],
        "messages": [
          {
            "id": 999,
            "content": "Last message content",
            "created_at": "2025-01-12T10:30:00Z"
          }
        ]
      }
    ]
  }
}
```

## Real-Time Updates with WebSocket

```javascript
// app/javascript/dashboard/store/modules/conversations/actions.js

// Called by ActionCable listener
updateConversationFromSocket: ({ commit }, conversation) => {
  commit(types.UPDATE_CONVERSATION, conversation);
},

// ActionCable subscription
import cable from 'dashboard/helper/actionCable';

cable.subscriptions.create('ConversationChannel', {
  received(data) {
    if (data.event === 'message.created') {
      // Update conversation in list
      store.dispatch('conversations/updateConversationFromSocket', data.conversation);
    }
  },
});
```

## Key Patterns Summary

| Pattern | Purpose | Implementation |
|---------|---------|----------------|
| **Server-side Filtering** | Efficient large datasets | Send filters as query params |
| **Filter State** | Persistent filter config | Store filters in Vuex |
| **Pagination Metadata** | Know when to load more | count, current_page, all_count |
| **Infinite Scroll** | Better UX | Detect scroll position, load more |
| **Optimistic Status** | Instant UI feedback | Update before API call |
| **Real-time Updates** | Live conversation list | WebSocket updates via ActionCable |
| **Sorting** | Chronological order | Sort by last_activity_at DESC |

## Common Filter Combinations

```javascript
// My open conversations
{ status: 'open', assigneeType: 'me', page: 1 }

// Unassigned conversations in specific inbox
{ status: 'open', assigneeType: 'unassigned', inboxId: 5, page: 1 }

// Resolved conversations with label
{ status: 'resolved', assigneeType: 'all', labels: [1, 2], page: 1 }

// Team conversations
{ status: 'open', assigneeType: 'all', teamId: 3, page: 1 }

// All conversations (no filters)
{ status: 'all', assigneeType: 'all', page: 1 }
```

## Adapting to FrontDesk (React + Recoil)

```typescript
// atoms/conversation-filters.ts
export const conversationFiltersState = atom<ConversationFilters>({
  key: 'conversationFilters',
  default: {
    status: 'open',
    assigneeType: 'me',
    page: 1,
  },
});

// hooks/use-conversations.ts
export const useConversations = () => {
  const [filters, setFilters] = useRecoilState(conversationFiltersState);
  const [conversations, setConversations] = useRecoilState(conversationsState);

  const fetchConversations = async () => {
    const response = await chatwootService.conversations.listConversations(
      accountId,
      filters
    );

    setConversations(response.payload);
  };

  const updateFilters = (newFilters: Partial<ConversationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  useEffect(() => {
    fetchConversations();
  }, [filters]);

  return { conversations, filters, updateFilters };
};
```

## References

- **Vuex Module:** `app/javascript/dashboard/store/modules/conversations/`
- **API Client:** `app/javascript/dashboard/api/conversations.js:1`
- **Filter Component:** `app/javascript/dashboard/components/widgets/conversation/ConversationFilter.vue:1`
- **List Component:** `app/javascript/dashboard/components/widgets/conversation/ConversationList.vue:1`
- **Card Component:** `app/javascript/dashboard/components/widgets/conversation/ConversationCard.vue:1`
