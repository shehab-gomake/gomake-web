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

## 🎯 How AI Uses These Files

### When Starting a Task
1. AI reads `.cursorrules` → Gets workspace context
2. AI checks `ai-dev-acceleration.md` → Gets patterns
3. AI uses `api-reference.md` → Finds API methods
4. AI uses `quick-decision-tree.md` → Makes decisions
5. AI copies from `code-snippets.ts` → Gets working code

### When Creating New Features
1. AI uses `feature-template.tsx` → Gets scaffolding
2. AI references `code-snippets.ts` → Gets patterns
3. AI checks `api-reference.md` → Verifies API usage
4. AI follows `quick-decision-tree.md` → Makes choices

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

- `../CLAUDE.md` - Complete development guidelines
- `../docs/frontdesk/FRONTDESK_CHATWOOT_ARCHITECTURE.md` - Architecture guide
- `../docs/frontdesk/README.md` - Documentation index

## 🚀 Quick Access

- **Patterns**: `ai-dev-acceleration.md`
- **API Docs**: `api-reference.md`
- **Decisions**: `quick-decision-tree.md`
- **Code**: `code-snippets.ts`
- **Template**: `feature-template.tsx`

---

**Purpose**: Make AI development as fast as possible by providing instant access to patterns, references, and templates.

