# Chatwoot Skills for FrontDesk Development

This directory contains specialized skills that teach Claude Code agents how Chatwoot implements messaging features. These skills document Chatwoot's **frontend patterns** (Vue 3 + Vuex) to help you adapt them to FrontDesk's React + Recoil architecture.

## Purpose

When building FrontDesk Chatwoot provider features, these skills help the agent:
- Understand how Chatwoot's UI works under the hood
- Learn proven patterns for messaging workflows
- Reference specific components and code patterns
- Adapt Vue/Vuex patterns to React/Recoil independently

## Available Skills

### Core Architecture

| Skill | Description | When to Use |
|-------|-------------|-------------|
| `core-architecture` | Overall Chatwoot frontend structure, directory organization, tech stack | Understanding the codebase layout before implementing any feature |
| `api-patterns` | API client patterns, account-scoped URLs, CRUD operations | Implementing API calls or creating new service methods |
| `state-management` | Vuex store patterns, actions, mutations, optimistic updates | Managing global state or implementing async operations |
| `component-patterns` | Vue 3 Composition API, script setup, component organization | Building new components or refactoring existing ones |

### Feature Flows

| Skill | Description | When to Use |
|-------|-------------|-------------|
| `flows/message-sending-flow` | Complete message sending flow from UI to API | Implementing message composer, send functionality, or optimistic updates |
| `flows/conversation-list-filtering` | Conversation fetching, filtering, pagination, real-time updates | Building inbox views, conversation lists, or filter controls |
| `flows/contact-management` | Contact CRUD operations, search, merge, custom attributes | Implementing contact views, contact search, or contact operations |
| `flows/new-conversation-creation` | Creating a new conversation from scratch | Building "New Conversation" or "Compose" UI flows |

## How to Use These Skills

### Automatic Invocation

Skills are automatically invoked by Claude Code when your request matches the skill's description. Simply describe what you want to build:

```
"I need to implement message sending in FrontDesk"
→ Agent automatically invokes: flows/message-sending-flow
```

### Manual Invocation

You can explicitly reference a skill:

```
"Using the Chatwoot message sending flow, implement optimistic updates for FrontDesk"
```

### Reading the Skills

Each skill follows this structure:
1. **When to Use** - Scenarios where this skill is relevant
2. **Chatwoot Implementation** - How Chatwoot does it (Vue/Vuex)
3. **Key Files** - Exact file paths in Chatwoot repo
4. **Code Snippets** - Key patterns with code examples
5. **Key Patterns** - Summary of important concepts

## Reference Paths

### Chatwoot Codebase
- **Base**: `/Users/omarsabbah/Desktop/messaging/chatwoot/`
- **Frontend**: `app/javascript/dashboard/`
  - Components: `components/` (legacy) and `components-next/` (modern)
  - API Clients: `api/`
  - State: `store/modules/`
  - Routes: `routes/`

### FrontDesk Codebase
- **Base**: `/Users/omarsabbah/Desktop/gomake-services/gomake-web/`
- **Provider**: `src/widgets/frontdesk/providers/chatwoot/`
- **Services**: `src/services/frontdesk/api/chatwoot/`

## Skill Philosophy

These skills document **pure Chatwoot patterns** without React/Recoil adaptation guidance. This approach:
- Keeps skills focused and maintainable
- Allows the agent to understand the source implementation deeply
- Enables flexible adaptation to different architectures
- Reduces skill maintenance overhead

The agent will:
1. Learn the Chatwoot pattern (Vue/Vuex)
2. Understand the underlying logic and flow
3. Adapt it to FrontDesk architecture (React/Recoil) independently

## Examples

### Example 1: Implementing Message Sending

**Your request:**
> "I need to implement the message sending feature with optimistic updates"

**Agent process:**
1. Invokes `flows/message-sending-flow` skill
2. Learns Chatwoot's ReplyBox component structure
3. Understands the Vuex action with optimistic updates
4. Studies the MessageApi client pattern
5. Adapts the pattern to FrontDesk:
   - ReplyBox (Vue) → MessageComposer (React)
   - Vuex action → Recoil atom + custom hook
   - MessageApi → chatwootService.messages.createMessage

### Example 2: Building Conversation Filters

**Your request:**
> "Add conversation filtering by status and assignee"

**Agent process:**
1. Invokes `flows/conversation-list-filtering` skill
2. Learns Chatwoot's filter component structure
3. Understands the Vuex conversation module's filter logic
4. Studies the ConversationApi with query parameters
5. Implements FrontDesk equivalent with React + Recoil

## Contributing

When adding new skills:
1. Follow the existing skill template structure
2. Focus on frontend patterns only (no backend Rails code)
3. Include code snippets + file references (not full files)
4. Use clear, descriptive YAML frontmatter
5. Test that the skill description triggers appropriate invocation

## Related Documentation

- `docs/frontdesk/FRONTDESK_CHATWOOT_ARCHITECTURE.md` - FrontDesk architecture
- `CLAUDE.md` - Project-specific Claude Code guidance
- Chatwoot docs: https://www.chatwoot.com/docs

---

**Last Updated**: 2025-01-12
**Chatwoot Version Reference**: Rails 7.1 + Vue 3
