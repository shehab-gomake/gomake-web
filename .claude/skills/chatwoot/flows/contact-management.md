---
name: chatwoot-contact-management
description: Use when implementing contact CRUD operations, contact search, contact profiles, custom attributes, contact merging, or contact list views
---

# Chatwoot Contact Management Flow

## When to Use This Skill

- Building contact list views
- Implementing contact search functionality
- Creating/updating/deleting contacts
- Managing contact custom attributes
- Implementing contact profiles
- Merging duplicate contacts
- Displaying contact conversation history

## Overview

Contact management in Chatwoot involves:

1. **CRUD Operations**: Create, Read, Update, Delete contacts
2. **Search**: Search contacts by name, email, phone
3. **Custom Attributes**: Store additional contact metadata
4. **Labels**: Tag contacts with labels
5. **Merge**: Combine duplicate contacts
6. **Conversation History**: View all conversations with a contact

**Key Features:**
- Full CRUD with validation
- Real-time search with debouncing
- Custom attributes (key-value pairs)
- Label assignment
- Duplicate detection and merging
- Contact avatar management

## Contact Data Structure

```javascript
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "phone_number": "+1234567890",
  "avatar_url": "https://...",
  "thumbnail": "https://...",
  "identifier": "user_123",  // External system ID
  "custom_attributes": {
    "company": "Acme Inc",
    "plan": "Enterprise",
    "signup_date": "2024-01-01"
  },
  "additional_attributes": {
    "country": "USA",
    "city": "New York",
    "social_profiles": {
      "twitter": "@johndoe",
      "linkedin": "johndoe"
    }
  },
  "contact_inboxes": [
    {
      "id": 456,
      "inbox_id": 1,
      "source_id": "ext_123"
    }
  ],
  "labels": ["VIP", "Premium"],
  "created_at": "2024-01-01T00:00:00Z",
  "last_activity_at": "2025-01-12T10:00:00Z"
}
```

## Vuex State Structure

**Location:** `app/javascript/dashboard/store/modules/contacts.js:1`

```javascript
const state = {
  records: [],           // All loaded contacts
  sortOrder: [],         // Sorted contact IDs
  selectedContactId: null,
  meta: {
    count: 0,
    current_page: 1,
  },
  uiFlags: {
    isFetching: false,
    isFetchingItem: false,
    isUpdating: false,
    isCreating: false,
    isDeleting: false,
  },
};

const getters = {
  getContacts: state => state.records,

  getContactById: state => id =>
    state.records.find(contact => contact.id === id),

  getSelectedContact: state =>
    state.records.find(c => c.id === state.selectedContactId),

  getUIFlags: state => state.uiFlags,

  getMeta: state => state.meta,
};
```

## Step 1: Contact List Component

**Location:** `app/javascript/dashboard/components/widgets/ContactList.vue:1`

```vue
<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { debounce } from 'lodash';
import ContactCard from './ContactCard.vue';

const store = useStore();

// State
const searchQuery = ref('');
const selectedLabel = ref('');
const sortBy = ref('name');

// Computed
const contacts = computed(() => store.getters['contacts/getContacts']);
const isLoading = computed(() => store.getters['contacts/getUIFlags'].isFetching);
const meta = computed(() => store.getters['contacts/getMeta']);

// Available labels
const labels = computed(() => store.getters['labels/getLabels']);

// Debounced search
const debouncedSearch = debounce((query) => {
  if (query.trim()) {
    store.dispatch('contacts/search', {
      q: query,
      sort: sortBy.value,
      label: selectedLabel.value,
    });
  } else {
    store.dispatch('contacts/get', {
      page: 1,
      sort: sortBy.value,
      label: selectedLabel.value,
    });
  }
}, 300);

// Watchers
watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery);
});

watch([sortBy, selectedLabel], () => {
  if (searchQuery.value) {
    debouncedSearch(searchQuery.value);
  } else {
    store.dispatch('contacts/get', {
      page: 1,
      sort: sortBy.value,
      label: selectedLabel.value,
    });
  }
});

// Methods
const handleContactClick = (contactId) => {
  store.dispatch('contacts/show', contactId);
};

const handleLoadMore = () => {
  const nextPage = meta.value.current_page + 1;
  store.dispatch('contacts/get', {
    page: nextPage,
    sort: sortBy.value,
    label: selectedLabel.value,
  });
};

// Lifecycle
onMounted(() => {
  store.dispatch('contacts/get', { page: 1, sort: sortBy.value });
});
</script>

<template>
  <div class="contact-list flex flex-col h-full">
    <!-- Search & Filters -->
    <div class="p-4 border-b bg-white">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search contacts..."
        class="w-full px-4 py-2 border rounded-lg"
      />

      <div class="flex gap-2 mt-2">
        <select
          v-model="sortBy"
          class="px-4 py-2 border rounded-lg"
        >
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="created_at">Created</option>
          <option value="last_activity_at">Last Activity</option>
        </select>

        <select
          v-model="selectedLabel"
          class="px-4 py-2 border rounded-lg"
        >
          <option value="">All Labels</option>
          <option
            v-for="label in labels"
            :key="label.id"
            :value="label.title"
          >
            {{ label.title }}
          </option>
        </select>
      </div>
    </div>

    <!-- Contact List -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="isLoading && contacts.length === 0" class="p-4">
        Loading contacts...
      </div>

      <div v-else-if="contacts.length === 0" class="p-4 text-center text-gray-500">
        No contacts found
      </div>

      <ContactCard
        v-for="contact in contacts"
        :key="contact.id"
        :contact="contact"
        @click="handleContactClick(contact.id)"
      />

      <button
        v-if="meta.current_page * 25 < meta.count"
        @click="handleLoadMore"
        class="w-full py-2 text-blue-500 hover:bg-blue-50"
      >
        Load More
      </button>
    </div>
  </div>
</template>
```

## Step 2: Vuex Actions

**Location:** `app/javascript/dashboard/store/modules/contacts.js:1`

```javascript
// app/javascript/dashboard/store/modules/contacts.js
import * as types from '../mutation-types';
import ContactAPI from 'dashboard/api/contacts';

export const actions = {
  // Get contacts with pagination and filters
  get: async ({ commit }, { page = 1, sort = 'name', label = '' }) => {
    commit(types.SET_CONTACT_UI_FLAG, { isFetching: true });

    try {
      const {
        data: {
          payload,
          meta,
        },
      } = await ContactAPI.get(page, sort, label);

      if (page === 1) {
        commit(types.SET_CONTACTS, payload);
      } else {
        commit(types.APPEND_CONTACTS, payload);
      }

      commit(types.SET_CONTACT_META, meta);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      commit(types.SET_CONTACT_UI_FLAG, { isFetching: false });
    }
  },

  // Search contacts
  search: async ({ commit }, { q, page = 1, sort = 'name', label = '' }) => {
    commit(types.SET_CONTACT_UI_FLAG, { isFetching: true });

    try {
      const {
        data: {
          payload,
          meta,
        },
      } = await ContactAPI.search(q, page, sort, label);

      commit(types.SET_CONTACTS, payload);
      commit(types.SET_CONTACT_META, meta);
    } catch (error) {
      console.error('Failed to search contacts:', error);
    } finally {
      commit(types.SET_CONTACT_UI_FLAG, { isFetching: false });
    }
  },

  // Get single contact
  show: async ({ commit }, contactId) => {
    commit(types.SET_CONTACT_UI_FLAG, { isFetchingItem: true });
    commit(types.SET_SELECTED_CONTACT, contactId);

    try {
      const { data } = await ContactAPI.show(contactId);
      commit(types.UPDATE_CONTACT, data);
    } catch (error) {
      console.error('Failed to fetch contact:', error);
    } finally {
      commit(types.SET_CONTACT_UI_FLAG, { isFetchingItem: false });
    }
  },

  // Create contact
  create: async ({ commit }, contactData) => {
    commit(types.SET_CONTACT_UI_FLAG, { isCreating: true });

    try {
      const { data } = await ContactAPI.create(contactData);
      commit(types.ADD_CONTACT, data);
      return data;
    } catch (error) {
      console.error('Failed to create contact:', error);
      throw error;
    } finally {
      commit(types.SET_CONTACT_UI_FLAG, { isCreating: false });
    }
  },

  // Update contact
  update: async ({ commit }, { id, ...contactData }) => {
    commit(types.SET_CONTACT_UI_FLAG, { isUpdating: true });

    try {
      const { data } = await ContactAPI.update(id, contactData);
      commit(types.UPDATE_CONTACT, data);
      return data;
    } catch (error) {
      console.error('Failed to update contact:', error);
      throw error;
    } finally {
      commit(types.SET_CONTACT_UI_FLAG, { isUpdating: false });
    }
  },

  // Delete contact
  delete: async ({ commit }, contactId) => {
    commit(types.SET_CONTACT_UI_FLAG, { isDeleting: true });

    try {
      await ContactAPI.delete(contactId);
      commit(types.DELETE_CONTACT, contactId);
    } catch (error) {
      console.error('Failed to delete contact:', error);
      throw error;
    } finally {
      commit(types.SET_CONTACT_UI_FLAG, { isDeleting: false });
    }
  },

  // Update custom attributes
  updateAttributes: async ({ commit, dispatch }, { id, customAttributes }) => {
    try {
      await ContactAPI.update(id, { custom_attributes: customAttributes });
      // Refetch to get updated data
      dispatch('show', id);
    } catch (error) {
      console.error('Failed to update attributes:', error);
      throw error;
    }
  },

  // Merge contacts
  merge: async ({ commit, dispatch }, { childId, parentId }) => {
    try {
      const { data } = await ContactAPI.merge(childId, parentId);

      // Remove child contact
      commit(types.DELETE_CONTACT, childId);

      // Update parent contact
      commit(types.UPDATE_CONTACT, data);

      return data;
    } catch (error) {
      console.error('Failed to merge contacts:', error);
      throw error;
    }
  },
};

export const mutations = {
  [types.SET_CONTACTS]: (state, contacts) => {
    state.records = contacts;
  },

  [types.APPEND_CONTACTS]: (state, contacts) => {
    state.records = [...state.records, ...contacts];
  },

  [types.ADD_CONTACT]: (state, contact) => {
    state.records.push(contact);
  },

  [types.UPDATE_CONTACT]: (state, updatedContact) => {
    const index = state.records.findIndex(c => c.id === updatedContact.id);
    if (index !== -1) {
      Vue.set(state.records, index, updatedContact);
    }
  },

  [types.DELETE_CONTACT]: (state, contactId) => {
    state.records = state.records.filter(c => c.id !== contactId);
  },

  [types.SET_SELECTED_CONTACT]: (state, contactId) => {
    state.selectedContactId = contactId;
  },

  [types.SET_CONTACT_META]: (state, meta) => {
    state.meta = meta;
  },

  [types.SET_CONTACT_UI_FLAG]: (state, flags) => {
    state.uiFlags = { ...state.uiFlags, ...flags };
  },
};
```

## Step 3: API Client

**Location:** `app/javascript/dashboard/api/contacts.js:1`

```javascript
// app/javascript/dashboard/api/contacts.js
import ApiClient from './ApiClient';

class ContactAPI extends ApiClient {
  constructor() {
    super('contacts', { accountScoped: true });
  }

  // GET /api/v1/accounts/{id}/contacts
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

  // GET /api/v1/accounts/{id}/contacts/search
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

  // GET /api/v1/accounts/{id}/contacts/{id}
  show(id) {
    return axios.get(`${this.url}/${id}`);
  }

  // POST /api/v1/accounts/{id}/contacts
  create(contactData) {
    return axios.post(this.url, contactData);
  }

  // PATCH /api/v1/accounts/{id}/contacts/{id}
  update(id, contactData) {
    return axios.patch(`${this.url}/${id}`, contactData);
  }

  // DELETE /api/v1/accounts/{id}/contacts/{id}
  delete(id) {
    return axios.delete(`${this.url}/${id}`);
  }

  // POST /api/v1/accounts/{id}/contacts/filter
  filter(page = 1, queryPayload = {}) {
    const params = {
      page,
      payload: queryPayload,
    };

    return axios.post(`${this.url}/filter`, params);
  }

  // POST /api/v1/accounts/{id}/contacts/{childId}/merge
  merge(childId, parentId) {
    return axios.post(`${this.url}/${childId}/merge`, {
      parent_id: parentId,
    });
  }

  // DELETE /api/v1/accounts/{id}/contacts/{id}/avatar
  deleteAvatar(id) {
    return axios.delete(`${this.url}/${id}/avatar`);
  }

  // GET /api/v1/accounts/{id}/contacts/{id}/conversations
  getConversations(id) {
    return axios.get(`${this.url}/${id}/conversations`);
  }
}

export default new ContactAPI();
```

## Step 4: Contact Form Component

```vue
<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
  contact: {
    type: Object,
    default: null,
  },
  mode: {
    type: String,
    default: 'create', // 'create' or 'edit'
  },
});

const emit = defineEmits(['success', 'cancel']);

// Form state
const formData = ref({
  name: props.contact?.name || '',
  email: props.contact?.email || '',
  phone_number: props.contact?.phone_number || '',
  identifier: props.contact?.identifier || '',
  custom_attributes: props.contact?.custom_attributes || {},
});

// Custom attributes (dynamic key-value pairs)
const customAttrs = ref(
  Object.entries(formData.value.custom_attributes).map(([key, value]) => ({
    key,
    value,
  }))
);

// Validation
const isValid = computed(() => {
  return formData.value.name.trim() || formData.value.email.trim();
});

const isLoading = computed(() => {
  const flags = store.getters['contacts/getUIFlags'];
  return props.mode === 'create' ? flags.isCreating : flags.isUpdating;
});

// Methods
const addCustomAttribute = () => {
  customAttrs.value.push({ key: '', value: '' });
};

const removeCustomAttribute = (index) => {
  customAttrs.value.splice(index, 1);
};

const handleSubmit = async () => {
  if (!isValid.value) return;

  // Build custom attributes object
  const customAttributes = {};
  customAttrs.value.forEach(({ key, value }) => {
    if (key.trim()) {
      customAttributes[key] = value;
    }
  });

  const data = {
    ...formData.value,
    custom_attributes: customAttributes,
  };

  try {
    if (props.mode === 'create') {
      await store.dispatch('contacts/create', data);
    } else {
      await store.dispatch('contacts/update', {
        id: props.contact.id,
        ...data,
      });
    }

    emit('success');
  } catch (error) {
    console.error('Failed to save contact:', error);
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 p-4">
    <h2 class="text-xl font-bold">
      {{ mode === 'create' ? 'New Contact' : 'Edit Contact' }}
    </h2>

    <!-- Name -->
    <div>
      <label class="block text-sm font-medium mb-1">Name *</label>
      <input
        v-model="formData.name"
        type="text"
        class="w-full px-4 py-2 border rounded-lg"
        placeholder="John Doe"
      />
    </div>

    <!-- Email -->
    <div>
      <label class="block text-sm font-medium mb-1">Email</label>
      <input
        v-model="formData.email"
        type="email"
        class="w-full px-4 py-2 border rounded-lg"
        placeholder="john@example.com"
      />
    </div>

    <!-- Phone -->
    <div>
      <label class="block text-sm font-medium mb-1">Phone</label>
      <input
        v-model="formData.phone_number"
        type="tel"
        class="w-full px-4 py-2 border rounded-lg"
        placeholder="+1234567890"
      />
    </div>

    <!-- Identifier -->
    <div>
      <label class="block text-sm font-medium mb-1">Identifier</label>
      <input
        v-model="formData.identifier"
        type="text"
        class="w-full px-4 py-2 border rounded-lg"
        placeholder="External ID"
      />
    </div>

    <!-- Custom Attributes -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="block text-sm font-medium">Custom Attributes</label>
        <button
          type="button"
          @click="addCustomAttribute"
          class="text-sm text-blue-500 hover:text-blue-600"
        >
          + Add Attribute
        </button>
      </div>

      <div
        v-for="(attr, index) in customAttrs"
        :key="index"
        class="flex gap-2 mb-2"
      >
        <input
          v-model="attr.key"
          type="text"
          placeholder="Key"
          class="flex-1 px-4 py-2 border rounded-lg"
        />
        <input
          v-model="attr.value"
          type="text"
          placeholder="Value"
          class="flex-1 px-4 py-2 border rounded-lg"
        />
        <button
          type="button"
          @click="removeCustomAttribute(index)"
          class="px-3 text-red-500 hover:text-red-600"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 justify-end">
      <button
        type="button"
        @click="emit('cancel')"
        class="px-6 py-2 border rounded-lg hover:bg-gray-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        :disabled="!isValid || isLoading"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {{ isLoading ? 'Saving...' : 'Save' }}
      </button>
    </div>
  </form>
</template>
```

## Step 5: Contact Profile Component

```vue
<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
  contactId: {
    type: Number,
    required: true,
  },
});

const contact = computed(() =>
  store.getters['contacts/getContactById'](props.contactId)
);

const conversations = computed(() =>
  store.getters['conversations/getConversationsByContactId'](props.contactId)
);
</script>

<template>
  <div v-if="contact" class="contact-profile flex flex-col gap-4 p-4">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <img
        :src="contact.avatar_url"
        :alt="contact.name"
        class="w-16 h-16 rounded-full"
      />

      <div>
        <h2 class="text-xl font-bold">{{ contact.name }}</h2>
        <p class="text-sm text-gray-600">{{ contact.email }}</p>
        <p class="text-sm text-gray-600">{{ contact.phone_number }}</p>
      </div>
    </div>

    <!-- Custom Attributes -->
    <div v-if="Object.keys(contact.custom_attributes || {}).length > 0">
      <h3 class="text-sm font-medium mb-2">Custom Attributes</h3>
      <div class="flex flex-col gap-1">
        <div
          v-for="(value, key) in contact.custom_attributes"
          :key="key"
          class="flex justify-between text-sm"
        >
          <span class="text-gray-600">{{ key }}:</span>
          <span class="font-medium">{{ value }}</span>
        </div>
      </div>
    </div>

    <!-- Labels -->
    <div v-if="contact.labels && contact.labels.length > 0">
      <h3 class="text-sm font-medium mb-2">Labels</h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="label in contact.labels"
          :key="label"
          class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
        >
          {{ label }}
        </span>
      </div>
    </div>

    <!-- Conversation History -->
    <div>
      <h3 class="text-sm font-medium mb-2">
        Conversations ({{ conversations.length }})
      </h3>
      <ConversationList :conversations="conversations" />
    </div>
  </div>
</template>
```

## Key Patterns Summary

| Pattern | Purpose | Implementation |
|---------|---------|----------------|
| **Debounced Search** | Prevent excessive API calls | Lodash debounce with 300ms delay |
| **Dynamic Attributes** | Flexible metadata | Key-value pair array in form |
| **Pagination** | Load contacts incrementally | Page-based with append |
| **Contact Merging** | Consolidate duplicates | Merge API with parent/child IDs |
| **Avatar Management** | Profile pictures | Upload with FormData, delete endpoint |
| **Conversation History** | Related conversations | Nested API call |

## Adapting to FrontDesk (React + Recoil)

```typescript
// hooks/use-contact-search.ts
export const useContactSearch = () => {
  const [contacts, setContacts] = useRecoilState(contactsState);
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.trim()) {
          const results = await chatwootService.contacts.searchContacts(
            accountId,
            query
          );
          setContacts(results);
        }
      }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  return { contacts, searchQuery, setSearchQuery };
};
```

## References

- **Vuex Module:** `app/javascript/dashboard/store/modules/contacts.js:1`
- **API Client:** `app/javascript/dashboard/api/contacts.js:1`
- **Contact List:** `app/javascript/dashboard/components/widgets/ContactList.vue:1`
- **Contact Form:** `app/javascript/dashboard/components/widgets/ContactForm.vue:1`
- **Contact Profile:** `app/javascript/dashboard/components/widgets/ContactProfile.vue:1`
