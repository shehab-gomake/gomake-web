---
name: chatwoot-core-architecture
description: Use when you need to understand Chatwoot's overall frontend structure, directory organization, tech stack, or codebase layout before implementing features
---

# Chatwoot Core Frontend Architecture

## When to Use This Skill

- Starting work on a new FrontDesk feature and need to understand Chatwoot's structure
- Navigating the Chatwoot codebase to find specific components or modules
- Understanding how Chatwoot organizes code by domain
- Learning the tech stack and architectural patterns before deep-diving into specific features

## Tech Stack Overview

**Chatwoot Frontend** is built with:
- **Vue 3** with Composition API (`<script setup>` syntax)
- **Vuex** for global state management (40+ modules)
- **Vue Router** for navigation
- **Axios** for HTTP requests
- **Vite** for bundling and dev server
- **Tailwind CSS** for styling (no custom CSS)
- **i18n** for internationalization

**Scale:**
- ~1,548 JavaScript/Vue files in dashboard
- 952 components (legacy structure)
- 349 components (modern `components-next/`)
- 45+ API client modules
- 40+ Vuex store modules

## Directory Structure

### Base Path
```
/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/
```

### Key Directories

```
dashboard/
├── api/                           # API client layer (45+ modules)
│   ├── ApiClient.js              # Base class for all API clients
│   ├── conversations.js          # Conversation API
│   ├── inbox/
│   │   ├── message.js            # Message operations
│   │   └── conversation.js       # Conversation operations
│   ├── contacts.js               # Contact API
│   ├── inboxes.js                # Inbox/channel API
│   └── [40+ domain-specific APIs]
│
├── store/                         # Vuex state management
│   ├── index.js                  # Main store with 40+ modules
│   └── modules/
│       ├── conversations/        # Conversation state
│       │   ├── index.js          # Module definition
│       │   ├── actions.js        # Async operations
│       │   ├── mutations.js      # State updates
│       │   └── getters.js        # Computed state
│       ├── contacts.js           # Contact state
│       ├── inboxes.js            # Inbox state
│       ├── agents.js             # Agent state
│       ├── labels.js             # Label state
│       └── [35+ other modules]
│
├── components/                    # UI components (LEGACY)
│   ├── widgets/
│   │   ├── conversation/         # 55+ conversation components
│   │   │   ├── ReplyBox.vue      # Message composer
│   │   │   ├── MessagesView.vue  # Message list
│   │   │   ├── ConversationCard.vue
│   │   │   └── [50+ components]
│   │   ├── Inboxes/
│   │   └── [other widget categories]
│   └── [952 total legacy components]
│
├── components-next/               # Modern component library (USE THIS!)
│   ├── Conversation/             # New conversation components
│   ├── whatsapp/                 # WhatsApp-specific
│   ├── content-templates/        # Template components
│   ├── NewConversation/          # New conversation flow
│   └── [349 modern components]
│
├── routes/                        # Vue Router configuration
│   ├── index.js                  # Main router setup
│   └── dashboard/
│       ├── conversation/         # Conversation routes
│       ├── settings/             # Settings routes
│       ├── contacts/             # Contact routes
│       └── [60+ route files]
│
├── composables/                   # Reusable composition functions
│   ├── useAccount.js
│   ├── useConversation.js
│   └── [shared logic hooks]
│
├── helper/                        # Utility functions
│   ├── commons.js
│   ├── URLHelper.js
│   └── [helper utilities]
│
└── i18n/                          # Internationalization
    └── locale/
        └── en/                    # English translations
            └── [translation files]
```

## Architectural Patterns

### 1. Account-Scoped Architecture

Everything in Chatwoot is scoped to an **Account** (organization/workspace):

```
URL Pattern: /app/accounts/{accountId}/conversations/123
API Pattern: /api/v1/accounts/{accountId}/conversations/123
```

**Implementation:**
- Account ID is extracted from the route
- All API calls are automatically account-scoped
- Store modules maintain account-specific state

### 2. Modular API Clients

Each domain has its own API client that extends `ApiClient`:

```
api/
├── ApiClient.js          # Base class with CRUD + account scoping
├── conversations.js      # extends ApiClient
├── contacts.js           # extends ApiClient
└── inboxes.js            # extends ApiClient
```

**Key file:** `app/javascript/dashboard/api/ApiClient.js:1`

### 3. Vuex Module Pattern

State is organized into domain-specific Vuex modules:

```
store/modules/
├── conversations/        # Conversation state + operations
├── contacts/             # Contact state + operations
├── inboxes/              # Inbox state + operations
└── [40+ modules]
```

Each module has:
- **state**: Data storage
- **mutations**: Synchronous state updates
- **actions**: Asynchronous operations (API calls)
- **getters**: Computed/derived state

**Key file:** `app/javascript/dashboard/store/index.js:1`

### 4. Component Organization

**Legacy Structure** (`components/`):
- Organized by feature/widget type
- Older components, some still in Options API
- Still actively used in production

**Modern Structure** (`components-next/`):
- New component architecture
- Exclusively uses Composition API with `<script setup>`
- Better separation of concerns
- **Use this for new features!**

### 5. Two-Way Component Communication

**Parent → Child:**
```vue
<!-- Props -->
<MessageBubble :message="message" :is-private="false" />
```

**Child → Parent:**
```vue
<!-- Events (camelCase) -->
<ReplyBox @sendMessage="handleSendMessage" />
```

### 6. Optimistic UI Updates

For async operations (like sending messages), Chatwoot uses optimistic updates:

1. Add message to UI immediately (status: "progress")
2. Make API call
3. On success: Update with real data (status: "sent")
4. On failure: Mark as failed (status: "failed")

**Pattern Location:** `app/javascript/dashboard/store/modules/conversations/actions.js:1`

## Component Lifecycle

Modern components use Composition API lifecycle hooks:

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
  // Component mounted
});

onUnmounted(() => {
  // Cleanup
});
</script>
```

## Key Design Principles

1. **Domain-Driven Organization** - Code organized by business domain (conversations, contacts, inboxes)
2. **Single Responsibility** - Each module/component has one clear purpose
3. **Account Scoping** - Everything is tenant-isolated at the account level
4. **Optimistic Updates** - UI updates immediately, syncs with backend asynchronously
5. **Composition API** - Modern Vue 3 patterns with `<script setup>`
6. **Tailwind Only** - No custom CSS, all styling via Tailwind utilities
7. **i18n First** - No bare strings, everything translated

## Common File Locations

### Finding Components
- **Message sending:** `app/javascript/dashboard/components/widgets/conversation/ReplyBox.vue:1`
- **Message display:** `app/javascript/dashboard/components/widgets/conversation/MessagesView.vue:1`
- **Conversation list:** `app/javascript/dashboard/components/widgets/conversation/ConversationCard.vue:1`

### Finding API Clients
- **Messages:** `app/javascript/dashboard/api/inbox/message.js:1`
- **Conversations:** `app/javascript/dashboard/api/conversations.js:1`
- **Contacts:** `app/javascript/dashboard/api/contacts.js:1`

### Finding State Management
- **Conversation state:** `app/javascript/dashboard/store/modules/conversations/index.js:1`
- **Contact state:** `app/javascript/dashboard/store/modules/contacts.js:1`
- **Inbox state:** `app/javascript/dashboard/store/modules/inboxes.js:1`

## Navigation Flow

Typical user flow through the app:

```
Login
  ↓
Account Selection (/app/accounts/{accountId})
  ↓
Dashboard
  ├── Conversations (/app/accounts/{accountId}/conversations)
  │   └── Conversation Detail (/app/accounts/{accountId}/conversations/{id})
  ├── Contacts (/app/accounts/{accountId}/contacts)
  └── Settings (/app/accounts/{accountId}/settings)
```

**Routes defined in:** `app/javascript/dashboard/routes/index.js:1`

## State Flow Pattern

Typical data flow in Chatwoot:

```
User Interaction (Component)
  ↓
Dispatch Vuex Action
  ↓
Call API Client
  ↓
Commit Mutation (Update State)
  ↓
Component Re-renders (Reactive)
```

Example:
```
ReplyBox.vue → dispatch('sendMessage') → MessageApi.create() → commit('ADD_MESSAGE')
```

## Key Patterns Summary

| Pattern | Purpose | Location |
|---------|---------|----------|
| **ApiClient** | Base class for API calls | `api/ApiClient.js` |
| **Vuex Module** | Domain state management | `store/modules/` |
| **Composition API** | Component logic | `components-next/` |
| **Optimistic Updates** | Better UX for async ops | `store/modules/conversations/actions.js` |
| **Account Scoping** | Multi-tenant isolation | Throughout codebase |
| **Event Emitting** | Child → Parent communication | All components |
| **Props Drilling** | Parent → Child communication | All components |

## Next Steps

After understanding the core architecture, explore:
- **API Patterns** - How API clients are structured (`api-patterns` skill)
- **State Management** - Deep dive into Vuex patterns (`state-management` skill)
- **Component Patterns** - Vue 3 Composition API usage (`component-patterns` skill)
- **Specific Flows** - End-to-end feature implementations (`flows/*` skills)

## References

- **Chatwoot Codebase:** `/Users/omarsabbah/Desktop/messaging/chatwoot/`
- **Frontend Root:** `app/javascript/dashboard/`
- **Modern Components:** `app/javascript/dashboard/components-next/`
- **Chatwoot Docs:** https://www.chatwoot.com/docs
