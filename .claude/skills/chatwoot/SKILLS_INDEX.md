# Chatwoot Skills Quick Reference Index

## 🎯 Purpose
This index helps you quickly find the right skill for your task. Skills document Chatwoot's frontend patterns to help adapt them to FrontDesk.

## 📖 Skills by Task Type

### Understanding Chatwoot Architecture

| Task | Skill | File |
|------|-------|------|
| "How is Chatwoot organized?" | Core Architecture | `core-architecture.md` |
| "What tech stack does Chatwoot use?" | Core Architecture | `core-architecture.md` |
| "Where do I find X in Chatwoot?" | Core Architecture | `core-architecture.md` |
| "How are Chatwoot directories structured?" | Core Architecture | `core-architecture.md` |

### API Integration

| Task | Skill | File |
|------|-------|------|
| "How does Chatwoot make API calls?" | API Patterns | `api-patterns.md` |
| "How are URLs constructed?" | API Patterns | `api-patterns.md` |
| "What is account-scoped architecture?" | API Patterns | `api-patterns.md` |
| "How to handle FormData for uploads?" | API Patterns | `api-patterns.md` |
| "How to structure API clients?" | API Patterns | `api-patterns.md` |

### State Management

| Task | Skill | File |
|------|-------|------|
| "How does Chatwoot manage state?" | State Management | `state-management.md` |
| "What are Vuex patterns?" | State Management | `state-management.md` |
| "How to do optimistic updates?" | State Management | `state-management.md` |
| "How are actions/mutations organized?" | State Management | `state-management.md` |

### Component Development

| Task | Skill | File |
|------|-------|------|
| "How are Chatwoot components structured?" | Component Patterns | `component-patterns.md` |
| "What is Vue Composition API?" | Component Patterns | `component-patterns.md` |
| "How do components communicate?" | Component Patterns | `component-patterns.md` |
| "How to use lifecycle hooks?" | Component Patterns | `component-patterns.md` |

### Feature Implementation

#### Message Sending
| Task | Skill | File |
|------|-------|------|
| "How to implement message sending?" | Message Sending Flow | `flows/message-sending-flow.md` |
| "How to build message composer?" | Message Sending Flow | `flows/message-sending-flow.md` |
| "How to handle file attachments?" | Message Sending Flow | `flows/message-sending-flow.md` |
| "How to do optimistic message updates?" | Message Sending Flow | `flows/message-sending-flow.md` |

#### Conversation Management
| Task | Skill | File |
|------|-------|------|
| "How to list conversations?" | Conversation Filtering | `flows/conversation-list-filtering.md` |
| "How to filter conversations?" | Conversation Filtering | `flows/conversation-list-filtering.md` |
| "How to implement pagination?" | Conversation Filtering | `flows/conversation-list-filtering.md` |
| "How to search conversations?" | Conversation Filtering | `flows/conversation-list-filtering.md` |

#### Contact Management
| Task | Skill | File |
|------|-------|------|
| "How to manage contacts?" | Contact Management | `flows/contact-management.md` |
| "How to search contacts?" | Contact Management | `flows/contact-management.md` |
| "How to create/update contacts?" | Contact Management | `flows/contact-management.md` |
| "How to merge contacts?" | Contact Management | `flows/contact-management.md` |

#### New Conversations
| Task | Skill | File |
|------|-------|------|
| "How to create new conversation?" | New Conversation Creation | `flows/new-conversation-creation.md` |
| "How to build compose modal?" | New Conversation Creation | `flows/new-conversation-creation.md` |
| "How to select contact for conversation?" | New Conversation Creation | `flows/new-conversation-creation.md` |

## 🔍 Skills by Chatwoot File

If you're looking at a Chatwoot file and want to understand it:

### Components
| Chatwoot File | Relevant Skill |
|---------------|----------------|
| `ReplyBox.vue` | Message Sending Flow |
| `MessagesView.vue` | Message Sending Flow |
| `ConversationCard.vue` | Conversation Filtering |
| `ContactsView.vue` | Contact Management |
| `NewConversation.vue` | New Conversation Creation |

### API Clients
| Chatwoot File | Relevant Skill |
|---------------|----------------|
| `api/ApiClient.js` | API Patterns |
| `api/inbox/message.js` | API Patterns, Message Sending Flow |
| `api/conversations.js` | API Patterns, Conversation Filtering |
| `api/contacts.js` | API Patterns, Contact Management |

### State (Vuex)
| Chatwoot File | Relevant Skill |
|---------------|----------------|
| `store/modules/conversations/` | State Management, Conversation Filtering |
| `store/modules/contacts.js` | State Management, Contact Management |
| Any `store/modules/*/actions.js` | State Management |
| Any `store/modules/*/mutations.js` | State Management |

## 🎨 Skills by FrontDesk Feature

If you're building a FrontDesk feature:

### Building Message Features
```
Start with: flows/message-sending-flow.md
Then check: api-patterns.md (for API)
Then check: state-management.md (for state)
Then check: component-patterns.md (for UI)
```

### Building Conversation List
```
Start with: flows/conversation-list-filtering.md
Then check: api-patterns.md (for API)
Then check: state-management.md (for state)
Then check: component-patterns.md (for UI)
```

### Building Contact Features
```
Start with: flows/contact-management.md
Then check: api-patterns.md (for API)
Then check: state-management.md (for state)
Then check: component-patterns.md (for UI)
```

### Building Compose Modal
```
Start with: flows/new-conversation-creation.md
Then check: flows/contact-management.md (for contact selection)
Then check: api-patterns.md (for API)
Then check: component-patterns.md (for UI)
```

## 📋 Skills by Complexity

### Beginner Level
1. `core-architecture.md` - Start here to understand Chatwoot
2. `api-patterns.md` - Learn API structure
3. `component-patterns.md` - Learn component basics

### Intermediate Level
1. `state-management.md` - Understand Vuex patterns
2. `flows/contact-management.md` - Implement CRUD operations
3. `flows/conversation-list-filtering.md` - Implement list views

### Advanced Level
1. `flows/message-sending-flow.md` - Optimistic updates, file handling
2. `flows/new-conversation-creation.md` - Complex multi-step flows

## 🔄 Skill Reading Order

### For New Features (Recommended Order)
1. **Core Architecture** - Understand overall structure
2. **Relevant Flow Skill** - Understand feature flow
3. **API Patterns** - Understand API integration
4. **State Management** - Understand state handling
5. **Component Patterns** - Understand UI implementation

### For Quick Reference
Just read the relevant flow skill (e.g., `flows/message-sending-flow.md`)

### For Deep Understanding
Read all core skills first, then flow skills

## 🎯 Decision Tree

```
Need to implement feature?
  ↓
Does flow skill exist?
  ├─ Yes → Read flow skill → Implement
  └─ No → Break down into:
      ├─ API calls → Read api-patterns.md
      ├─ State management → Read state-management.md
      └─ UI components → Read component-patterns.md
```

## 📝 Usage Examples

### Example 1: "I need to send messages"
**Path**: 
1. Read `flows/message-sending-flow.md` → Complete flow
2. Check Chatwoot: `app/javascript/dashboard/components/widgets/conversation/ReplyBox.vue`
3. Adapt to React using pattern from skill

### Example 2: "I need to understand Chatwoot's API structure"
**Path**:
1. Read `api-patterns.md` → API patterns
2. Check Chatwoot: `app/javascript/dashboard/api/ApiClient.js`
3. Understand account-scoped URLs

### Example 3: "I need to build a conversation filter"
**Path**:
1. Read `flows/conversation-list-filtering.md` → Filter flow
2. Read `api-patterns.md` → Query parameters
3. Read `state-management.md` → Filter state
4. Check Chatwoot implementation
5. Adapt to React

## 🚀 Quick Lookup

| I want to... | Read this skill |
|-------------|----------------|
| Send a message | `flows/message-sending-flow.md` |
| List conversations | `flows/conversation-list-filtering.md` |
| Filter conversations | `flows/conversation-list-filtering.md` |
| Manage contacts | `flows/contact-management.md` |
| Create conversation | `flows/new-conversation-creation.md` |
| Make API call | `api-patterns.md` |
| Manage state | `state-management.md` |
| Build component | `component-patterns.md` |
| Understand structure | `core-architecture.md` |

## 📚 Related Documentation

- **Using Skills**: See `../.cursor/rules/chatwoot-skills-integration.mdc`
- **Chatwoot Provider Rules**: See `../.cursor/rules/frontdesk-chatwoot-provider.mdc`
- **Quick Patterns**: See `../.cursor/ai-dev-acceleration.md`
- **Complete Guide**: See `../.cursor/CURSOR_GUIDE.md`

---

**Last Updated**: 2025-01-12
**Purpose**: Quick index to find the right Chatwoot skill for your task





