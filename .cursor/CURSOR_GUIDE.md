# Complete Cursor AI Development Guide for FrontDesk Chatwoot

## 🎯 Purpose

This file provides a complete overview of how all Cursor AI development files work together to accelerate FrontDesk Chatwoot development.

## 📊 Documentation Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│          .cursorrules (Entry Point)                     │
│          - Workspace context                            │
│          - High-level principles                        │
│          - Points to all other resources                │
└─────────────────┬───────────────────────────────────────┘
                  │
      ┌───────────┴───────────┐
      │                       │
┌─────▼────────┐    ┌────────▼──────────┐
│ Quick        │    │ Architecture      │
│ Reference    │    │ Rules             │
│              │    │                   │
│ .cursor/     │    │ .cursor/rules/    │
│ - acceleration│    │ - frontdesk-     │
│ - api-ref    │    │   architecture   │
│ - decision   │    │ - chatwoot-      │
│ - snippets   │    │   provider       │
└──────────────┘    │ - skills-        │
                    │   integration    │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼──────────┐
                    │ Chatwoot Skills    │
                    │                    │
                    │ .claude/skills/    │
                    │   chatwoot/        │
                    │ - core-arch        │
                    │ - api-patterns     │
                    │ - flows/           │
                    └────────────────────┘
```

## 🗺️ File Map

### Level 1: Entry Point
**File**: `.cursorrules`
- **Purpose**: Main entry point for Cursor AI
- **Contains**: Workspace context, project overview, operating principles
- **Links to**: All other documentation

### Level 2: Quick Reference (Speed)
**Directory**: `.cursor/`

| File | Purpose | When to Use |
|------|---------|-------------|
| `ai-dev-acceleration.md` | Copy-paste patterns, quick start | Need working code fast |
| `api-reference.md` | Complete API endpoint reference | Looking for API method |
| `quick-decision-tree.md` | Decision-making workflows | "I want to..." questions |
| `code-snippets.ts` | Copy-ready code examples | Need code template |
| `feature-template.tsx` | Feature scaffolding template | Creating new feature |

### Level 3: Architecture Rules (Structure)
**Directory**: `.cursor/rules/`

| File | Purpose | When to Use |
|------|---------|-------------|
| `frontdesk-architecture.mdc` | Core FrontDesk patterns | Understanding overall architecture |
| `frontdesk-chatwoot-provider.mdc` | Chatwoot-specific rules | Building Chatwoot features |
| `chatwoot-skills-integration.mdc` | How to use Chatwoot skills | Adapting Chatwoot patterns |

### Level 4: Reference Implementation (Blueprint)
**Directory**: `.claude/skills/chatwoot/`

| Category | Files | When to Use |
|----------|-------|-------------|
| **Core** | `core-architecture.md`, `api-patterns.md`, `state-management.md`, `component-patterns.md` | Understanding how Chatwoot works |
| **Flows** | `flows/message-sending-flow.md`, `flows/conversation-list-filtering.md`, etc. | Implementing specific features |

### Level 5: External Reference (Source of Truth)
**Location**: `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/`
- **Purpose**: Live Chatwoot frontend demo (Vue 3 + Vuex)
- **Use**: Reference actual implementation before building features

## 🔄 Development Workflows

### Workflow 1: Quick Feature Implementation
**Use when**: You know what to build and need it fast

```
1. Check `.cursor/ai-dev-acceleration.md` → Get pattern
2. Check `.cursor/api-reference.md` → Find API endpoint
3. Copy from `.cursor/code-snippets.ts` → Get working code
4. Implement following pattern → Ship feature
```

**Example**: Adding a button to send a message
- Pattern in `ai-dev-acceleration.md` shows how
- API in `api-reference.md` shows `createMessage()`
- Snippet in `code-snippets.ts` shows complete implementation

### Workflow 2: Architecture-First Implementation
**Use when**: Building complex features, need to understand structure

```
1. Read `.cursor/rules/frontdesk-architecture.mdc` → Understand core patterns
2. Read `.cursor/rules/frontdesk-chatwoot-provider.mdc` → Get Chatwoot rules
3. Check `.cursor/ai-dev-acceleration.md` → Get quick patterns
4. Implement following architecture → Build feature
```

**Example**: Building a new conversation list view
- Architecture shows provider structure
- Chatwoot rules show account-scoping pattern
- Quick patterns show hook implementation

### Workflow 3: Chatwoot Adaptation (Most Comprehensive)
**Use when**: Implementing a feature that exists in Chatwoot

```
1. Read `.cursor/rules/chatwoot-skills-integration.mdc` → Learn adaptation workflow
2. Find relevant skill in `.claude/skills/chatwoot/` → Understand Chatwoot pattern
3. Check Chatwoot demo files directly → See implementation
4. Create adaptation blueprint → Map Vue/Vuex to React/Recoil
5. Follow `.cursor/rules/frontdesk-chatwoot-provider.mdc` → Implement with rules
6. Use `.cursor/code-snippets.ts` → Fill in code patterns
```

**Example**: Implementing message sending with optimistic updates
- Skill `flows/message-sending-flow.md` explains Chatwoot's approach
- Check `app/javascript/dashboard/components/widgets/conversation/ReplyBox.vue`
- Map: `ReplyBox.vue` → `MessageComposer.tsx`
- Map: Vuex action → `useChatwootMessages()` hook
- Implement using FrontDesk patterns

## 🎨 Decision Tree: Which File to Use?

### Question: "I need to add an API call"
1. **Check**: `.cursor/api-reference.md` → Does method exist?
   - **Yes**: Use it directly
   - **No**: Check `.claude/skills/chatwoot/api-patterns.md` → See Chatwoot pattern

### Question: "I need to build a component"
1. **Check**: `.cursor/code-snippets.ts` → Is there a similar pattern?
   - **Yes**: Copy and modify
   - **No**: Check `.claude/skills/chatwoot/component-patterns.md` → See Chatwoot approach

### Question: "I need to understand architecture"
1. **Read**: `.cursor/rules/frontdesk-architecture.mdc` → Core patterns
2. **Read**: `.cursor/rules/frontdesk-chatwoot-provider.mdc` → Chatwoot specifics

### Question: "How does Chatwoot do X?"
1. **Read**: `.claude/skills/chatwoot/` → Find relevant skill
2. **Check**: Chatwoot demo → See actual implementation
3. **Read**: `.cursor/rules/chatwoot-skills-integration.mdc` → Learn how to adapt

### Question: "I'm stuck, what do I do?"
1. **Check**: `.cursor/quick-decision-tree.md` → Common problems
2. **Check**: `.cursor/rules/frontdesk-chatwoot-provider.mdc` → Common pitfalls section
3. **Reference**: Chatwoot demo → See working implementation

## 📋 AI Agent Instructions

### On Task Start
```typescript
// Pseudo-code for AI behavior
async function startTask(userRequest: string) {
  // 1. Load workspace context
  const context = await readFile('.cursorrules');
  
  // 2. Determine task type
  const taskType = classifyTask(userRequest);
  
  // 3. Load appropriate documentation
  if (taskType === 'quick-fix') {
    // Use quick reference
    const patterns = await readFile('.cursor/ai-dev-acceleration.md');
    const api = await readFile('.cursor/api-reference.md');
    return implement(patterns, api);
  }
  
  if (taskType === 'new-feature') {
    // Use architecture + patterns
    const arch = await readFile('.cursor/rules/frontdesk-architecture.mdc');
    const chatwoot = await readFile('.cursor/rules/frontdesk-chatwoot-provider.mdc');
    const patterns = await readFile('.cursor/ai-dev-acceleration.md');
    return implement(arch, chatwoot, patterns);
  }
  
  if (taskType === 'adapt-chatwoot') {
    // Use full adaptation workflow
    const integration = await readFile('.cursor/rules/chatwoot-skills-integration.mdc');
    const skill = await findRelevantSkill(userRequest);
    const chatwootDemo = await checkChatwootFiles();
    return adaptAndImplement(integration, skill, chatwootDemo);
  }
}
```

### Pattern Priority
1. **Always check `.cursorrules` first** - Get workspace context
2. **For speed**: Use `.cursor/ai-dev-acceleration.md` + `api-reference.md`
3. **For structure**: Use `.cursor/rules/` directory
4. **For reference**: Use `.claude/skills/chatwoot/` + Chatwoot demo

### Error Handling
If stuck or unclear:
1. Check `.cursor/quick-decision-tree.md` for common issues
2. Check rule files for "Common Pitfalls" sections
3. Reference Chatwoot demo for working implementation
4. Ask user for clarification

## 🔑 Key Principles

### 1. Account Scoping (Critical for Chatwoot)
- **ALL Chatwoot operations need `accountId`** (except profile)
- Check `accountId` exists before API calls
- Use `chatwootSelectedAccountAtom` from Recoil

### 2. Service Layer (Critical for Architecture)
- **ALWAYS use** `@/services/frontdesk`, NOT OpenAPI client
- Import pattern: `import { chatwootService } from '@/services/frontdesk';`

### 3. Chatwoot Reference (Critical for Features)
- **BEFORE building**: Check Chatwoot demo
- **Location**: `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/`
- **Purpose**: See how Chatwoot does it, then adapt

### 4. State Management (Critical for Data)
- Use **Recoil atoms** for shared state
- Use **useState** for local UI state only
- Naming: `frontdesk.{provider}.{data}`

### 5. Performance (Critical for UX)
- **ALWAYS** use `useMemo` for derived state
- **ALWAYS** use `useCallback` for event handlers
- Use `createFilterKey()` for stable filter keys

## 📊 File Usage Statistics

**Most Used Files** (in typical development flow):
1. `.cursorrules` - Every task (entry point)
2. `.cursor/ai-dev-acceleration.md` - 80% of tasks (quick patterns)
3. `.cursor/api-reference.md` - 70% of tasks (API lookup)
4. `.cursor/rules/frontdesk-chatwoot-provider.mdc` - 60% of tasks (Chatwoot rules)
5. `.cursor/code-snippets.ts` - 50% of tasks (code templates)

**Deep Dive Files** (for complex features):
1. `.cursor/rules/chatwoot-skills-integration.mdc` - Adaptation workflow
2. `.claude/skills/chatwoot/` - Reference implementations
3. Chatwoot demo - Source of truth

## 🚀 Quick Start Examples

### Example 1: Add API Endpoint
```bash
# Files to check
1. .cursor/api-reference.md → See if exists
2. .cursor/code-snippets.ts → Copy service pattern
3. .cursor/rules/frontdesk-chatwoot-provider.mdc → Verify rules
```

### Example 2: Build New Component
```bash
# Files to check
1. .cursor/ai-dev-acceleration.md → Component pattern
2. .cursor/code-snippets.ts → Component template
3. .claude/skills/chatwoot/component-patterns.md → Chatwoot reference
4. Chatwoot demo → See actual implementation
```

### Example 3: Implement Complex Feature
```bash
# Files to check (in order)
1. .cursorrules → Understand context
2. .cursor/rules/chatwoot-skills-integration.mdc → Learn workflow
3. .claude/skills/chatwoot/flows/{feature}.md → Find flow
4. Chatwoot demo → See implementation
5. .cursor/rules/frontdesk-chatwoot-provider.mdc → Follow rules
6. .cursor/ai-dev-acceleration.md → Use patterns
7. .cursor/code-snippets.ts → Fill in code
```

## ✅ Pre-Implementation Checklist

Before writing code, verify:
- [ ] Read `.cursorrules` for workspace context
- [ ] Checked appropriate rule file in `.cursor/rules/`
- [ ] Checked `.cursor/ai-dev-acceleration.md` for patterns
- [ ] Checked `.cursor/api-reference.md` for API methods
- [ ] Checked `.claude/skills/chatwoot/` if adapting Chatwoot
- [ ] Checked Chatwoot demo for reference implementation
- [ ] Understand accountId requirement
- [ ] Know which service to use
- [ ] Have adaptation blueprint (if adapting)

## 📞 Getting Help

### "Where do I find X?"
Check `.cursor/quick-decision-tree.md` → "Where to find things" section

### "How do I do X?"
Check `.cursor/ai-dev-acceleration.md` → Quick patterns section

### "Why is my code failing?"
Check `.cursor/rules/frontdesk-chatwoot-provider.mdc` → Common pitfalls section

### "How does Chatwoot do X?"
Check `.claude/skills/chatwoot/` → Find relevant skill → Check Chatwoot demo

## 🎓 Learning Path

### For New AI Agents
1. Read `.cursorrules` - Get workspace overview
2. Read `.cursor/README.md` - Understand file organization
3. Read this file (`CURSOR_GUIDE.md`) - Understand complete system
4. Read `.cursor/rules/frontdesk-architecture.mdc` - Understand core patterns
5. Read `.cursor/rules/frontdesk-chatwoot-provider.mdc` - Understand Chatwoot rules
6. Start implementing - Use quick reference files

### For Experienced Agents
Jump directly to:
- `.cursor/ai-dev-acceleration.md` - Quick patterns
- `.cursor/api-reference.md` - API lookup
- `.cursor/code-snippets.ts` - Code templates

## 🔄 File Update Protocol

### When to Update Files

| File Type | Update When | Update Frequency |
|-----------|-------------|------------------|
| `.cursorrules` | Workspace context changes | Rarely (major changes) |
| `rules/*.mdc` | Architecture changes | Occasionally (patterns evolve) |
| `ai-dev-acceleration.md` | New patterns discovered | Frequently (as we learn) |
| `api-reference.md` | API endpoints added | Frequently (API evolves) |
| `code-snippets.ts` | Better patterns found | Frequently (patterns improve) |
| `.claude/skills/chatwoot/` | Chatwoot patterns change | Rarely (Chatwoot stable) |

---

**Last Updated**: 2025-01-12
**Version**: 1.0
**Purpose**: Complete guide to Cursor AI development files for FrontDesk Chatwoot

