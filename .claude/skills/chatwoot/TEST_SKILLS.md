# Testing Chatwoot Skills

This file contains test questions to verify that skills are working correctly.

## How to Test

1. Navigate to gomake-web project directory
2. Open Claude Code
3. Ask each question below
4. Verify the agent invokes the correct skill

---

## Test Questions

### Test 1: Message Sending Flow
**Ask:**
> "How does Chatwoot implement message sending with optimistic updates?"

**Expected Skill:** `flows/message-sending-flow.md`

**What to verify:**
- Agent explains ReplyBox component
- Mentions echo ID pattern
- Describes three states: progress → sent/failed
- Shows Vuex action with optimistic update

---

### Test 2: API Patterns
**Ask:**
> "How should I structure API clients for Chatwoot integration?"

**Expected Skill:** `api-patterns.md`

**What to verify:**
- Agent explains ApiClient base class
- Shows account-scoped URL construction
- Provides CRUD method examples
- Explains FormData vs JSON payloads

---

### Test 3: State Management
**Ask:**
> "Show me how Chatwoot manages state with Vuex"

**Expected Skill:** `state-management.md`

**What to verify:**
- Agent explains Vuex module structure
- Shows actions, mutations, getters pattern
- Describes optimistic update implementation
- Mentions 40+ modules

---

### Test 4: Component Patterns
**Ask:**
> "How does Chatwoot structure Vue 3 components?"

**Expected Skill:** `component-patterns.md`

**What to verify:**
- Agent explains Composition API with script setup
- Shows props/emits pattern
- Demonstrates computed and watch usage
- Mentions Tailwind-only styling

---

### Test 5: Conversation Filtering
**Ask:**
> "I need to implement conversation filtering by status and assignee"

**Expected Skill:** `flows/conversation-list-filtering.md`

**What to verify:**
- Agent explains filter state structure
- Shows server-side filtering pattern
- Describes pagination implementation
- Mentions infinite scroll

---

### Test 6: Contact Management
**Ask:**
> "How do I implement contact search with create option?"

**Expected Skill:** `flows/contact-management.md`

**What to verify:**
- Agent explains debounced search (300ms)
- Shows contact CRUD operations
- Describes custom attributes pattern
- Mentions contact merging

---

### Test 7: New Conversation
**Ask:**
> "I want to build a new conversation creation flow"

**Expected Skill:** `flows/new-conversation-creation.md`

**What to verify:**
- Agent explains multi-step wizard
- Shows contact selection component
- Describes inbox selector
- Mentions optional initial message

---

### Test 8: Core Architecture
**Ask:**
> "What is Chatwoot's frontend architecture?"

**Expected Skill:** `core-architecture.md`

**What to verify:**
- Agent explains directory structure
- Mentions Vue 3 + Vuex tech stack
- Describes 40+ Vuex modules
- References components-next/ for modern code

---

## Integration Tests

### Integration Test 1: Build Message Composer
**Ask:**
> "Using Chatwoot patterns, create a message composer component in React with file upload support"

**Expected:**
1. Agent invokes `flows/message-sending-flow.md`
2. Learns ReplyBox structure
3. Adapts to React with useState
4. Implements FormData for files
5. Creates optimistic update with Recoil

---

### Integration Test 2: Build Conversation List
**Ask:**
> "Implement a conversation list with filters for status, assignee, and labels"

**Expected:**
1. Agent invokes `flows/conversation-list-filtering.md`
2. Learns filter state structure
3. Adapts to Recoil atoms
4. Implements server-side filtering
5. Adds pagination support

---

### Integration Test 3: Build Contact Search
**Ask:**
> "Create a contact search component with debouncing and create new contact option"

**Expected:**
1. Agent invokes `flows/contact-management.md`
2. Learns debounced search pattern
3. Adapts to React with useMemo + debounce
4. Implements search API call
5. Adds create contact form

---

## Verification Checklist

After testing, verify:

- [ ] Skills are automatically invoked based on question context
- [ ] Agent references correct file paths in Chatwoot repo
- [ ] Code snippets are provided from the skills
- [ ] Agent adapts Vue/Vuex to React/Recoil when implementing
- [ ] Complete flows are explained step-by-step
- [ ] API endpoint patterns are accurate
- [ ] State management patterns are clear

---

## Troubleshooting

### If skills are NOT being invoked:

1. **Check location:** Skills must be in `.claude/skills/chatwoot/`
2. **Check YAML frontmatter:** Each skill must have `name` and `description`
3. **Check description:** Description should clearly indicate when to use the skill
4. **Try explicit reference:** Say "use the chatwoot-message-sending-flow skill"

### If skills are invoked but provide wrong info:

1. **Update skill content:** Edit the .md file with correct information
2. **Update description:** Make the `description` field more specific
3. **Check file paths:** Ensure references to Chatwoot files are accurate

---

## Success Criteria

✅ **Skills are working correctly when:**

1. Agent automatically invokes appropriate skill based on question
2. Agent provides code snippets from Chatwoot implementation
3. Agent references specific file paths (e.g., `app/javascript/dashboard/...`)
4. Agent explains patterns clearly with Vue/Vuex examples
5. Agent successfully adapts patterns to React/Recoil when asked
6. Agent knows when to use each skill based on context

🎉 If all tests pass, your skill set is fully functional!
