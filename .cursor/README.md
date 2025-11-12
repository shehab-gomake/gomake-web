# Cursor AI Development Acceleration Files

This directory contains files specifically designed to accelerate AI-powered development for FrontDesk Chatwoot.

## 📚 File Guide

### 🚀 Start Here
1. **`ai-dev-acceleration.md`** - **READ THIS FIRST**
   - Quick start patterns
   - Copy-paste code templates
   - Common patterns and best practices
   - Performance tips

### 📖 Reference Files
2. **`api-reference.md`** - Complete API endpoint reference
   - All available service methods
   - Request/response patterns
   - Type definitions
   - Error handling

3. **`quick-decision-tree.md`** - Decision-making guide
   - "I want to..." workflows
   - Common task patterns
   - Debugging steps
   - Where to find things

4. **`code-snippets.ts`** - Copy-paste code library
   - Service usage patterns
   - Hook patterns
   - Component patterns
   - Utility patterns

5. **`feature-template.tsx`** - New feature template
   - Complete feature scaffolding
   - Step-by-step checklist
   - File structure guide

6. **`workspace-knowledge.md`** - Workspace overview
   - Project locations
   - Key documentation
   - Quick reference

### 📐 Architecture Rules (`rules/` directory)
7. **`rules/frontdesk-architecture.mdc`** - Core FrontDesk architecture patterns
   - Three-layer architecture
   - Provider pattern
   - State management rules
   - Service layer rules

8. **`rules/frontdesk-chatwoot-provider.mdc`** - Chatwoot-specific development rules
   - Account-scoped architecture
   - Service layer usage
   - Component patterns
   - Performance optimization

9. **`rules/chatwoot-skills-integration.mdc`** - How to use Chatwoot skills
   - Adaptation workflow
   - Vue → React translation
   - Pattern mappings
   - Common mistakes to avoid

## 🎯 How AI Uses These Files

### When Starting a Task
1. AI reads `.cursorrules` → Gets workspace context
2. AI checks `rules/` directory → Gets architectural patterns
3. AI checks `ai-dev-acceleration.md` → Gets quick patterns
4. AI uses `api-reference.md` → Finds API methods
5. AI uses `quick-decision-tree.md` → Makes decisions
6. AI copies from `code-snippets.ts` → Gets working code

### When Creating New Features
1. AI checks `rules/frontdesk-architecture.mdc` → Understands core patterns
2. AI checks `rules/frontdesk-chatwoot-provider.mdc` → Gets Chatwoot-specific rules
3. AI checks `.claude/skills/chatwoot/` → References Chatwoot implementation
4. AI uses `feature-template.tsx` → Gets scaffolding
5. AI references `code-snippets.ts` → Gets patterns
6. AI checks `api-reference.md` → Verifies API usage
7. AI follows `quick-decision-tree.md` → Makes choices

### When Adapting Chatwoot Patterns
1. AI reads `rules/chatwoot-skills-integration.mdc` → Learns adaptation workflow
2. AI reads relevant `.claude/skills/chatwoot/` file → Understands Chatwoot pattern
3. AI creates adaptation blueprint → Maps Vue/Vuex to React/Recoil
4. AI implements following FrontDesk conventions → Uses our patterns
5. AI verifies against Chatwoot demo → Checks `/Users/omarsabbah/Desktop/messaging/chatwoot/`

## 📋 Usage Workflow

### For Adding New API Endpoint
```
1. Check api-reference.md for existing endpoints
2. Copy pattern from code-snippets.ts
3. Add to service following template
4. Update types
5. Test with accountId check
```

### For Adding New Component
```
1. Check Chatwoot reference (workspace-knowledge.md)
2. Use feature-template.tsx for structure
3. Copy component pattern from code-snippets.ts
4. Create hook using hook pattern
5. Add to view
```

### For Debugging
```
1. Check quick-decision-tree.md debugging section
2. Verify accountId exists
3. Check API endpoint in api-reference.md
4. Verify response extraction pattern
```

## 🔑 Key Principles

1. **Always check accountId** - All endpoints except profile need it
2. **Use Recoil atoms** - For shared state, not local state
3. **Reference Chatwoot** - Check frontend demo before building UI
4. **Use utilities** - extractPayload(), createFilterKey(), etc.
5. **Follow patterns** - Don't reinvent, use existing patterns

## 📁 Related Documentation

### Root Documentation
- `../CLAUDE.md` - Complete development guidelines (mandatory read)
- `../GEMINI.md` - Gemini-specific development guidelines
- `../docs/frontdesk/FRONTDESK_CHATWOOT_ARCHITECTURE.md` - Architecture guide
- `../docs/frontdesk/README.md` - Documentation index

### Skills Documentation
- `../.claude/skills/chatwoot/README.md` - Chatwoot skills overview
- `../.claude/skills/chatwoot/core-architecture.md` - Chatwoot frontend structure
- `../.claude/skills/chatwoot/api-patterns.md` - API client patterns
- `../.claude/skills/chatwoot/flows/` - Feature implementation flows

### External References
- **Chatwoot Demo**: `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/`
- **Proxy Service**: `/Users/omarsabbah/Desktop/gomake-services/messaging-hub-v2/CLAUDE.md`

## 🚀 Quick Access

### For Quick Patterns
- **Patterns**: `ai-dev-acceleration.md`
- **API Docs**: `api-reference.md`
- **Decisions**: `quick-decision-tree.md`
- **Code**: `code-snippets.ts`
- **Template**: `feature-template.tsx`

### For Architecture
- **Core Architecture**: `rules/frontdesk-architecture.mdc`
- **Chatwoot Rules**: `rules/frontdesk-chatwoot-provider.mdc`
- **Skills Integration**: `rules/chatwoot-skills-integration.mdc`

### For Chatwoot Reference
- **Skills Directory**: `../.claude/skills/chatwoot/`
- **Chatwoot Demo**: `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/`

---

**Purpose**: Make AI development as fast as possible by providing instant access to patterns, references, and templates.

