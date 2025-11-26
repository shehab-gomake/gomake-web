# Automatic Context Loading Guide

## ✅ Yes, It's Automatic!

When you work with me (AI) in this workspace, I **automatically** load the relevant files based on:

1. **Which project you're in** (gomake-web, messaging-hub-v2, or chatwoot)
2. **What files you're viewing/editing**
3. **What you ask me to do**

## 🎯 How It Works

### Automatic Loading Triggers

#### 1. Project Detection
- When you open a file in `gomake-web` → I load `gomake-web/.cursor/ai-dev-acceleration.md`
- When you open a file in `messaging-hub-v2` → I load `messaging-hub-v2/.cursor/ai-dev-acceleration.md`
- When you open a file in `chatwoot` → I load `chatwoot/.cursor/ai-dev-acceleration.md`

#### 2. Context from .cursorrules
- `.cursorrules` files are **automatically loaded** by Cursor IDE
- They tell me about workspace context and which files to reference
- I read them first, then load acceleration files as needed

#### 3. Task-Based Loading
- If you ask about API → I load `api-reference.md`
- If you ask "how do I..." → I load `quick-decision-tree.md`
- If you need code → I load `code-snippets.ts`
- If creating new feature → I load `feature-template.tsx`

### What You Need to Do

**Nothing!** Just work normally:
- Open files
- Ask questions
- Request features
- I'll automatically load what's needed

## 📚 Files I Automatically Reference

### Always Loaded (via .cursorrules)
- `CLAUDE.md` - Project guidelines
- `.cursorrules` - Workspace context
- Related project context when needed

### Loaded on Demand
- `ai-dev-acceleration.md` - When working on features
- `api-reference.md` - When making API calls
- `quick-decision-tree.md` - When making decisions
- `code-snippets.ts` - When writing code
- `feature-template.tsx` - When creating features

## 🔄 Cross-Project Awareness

When you're in gomake-web but need chatwoot patterns:
- I automatically check chatwoot acceleration files
- I reference chatwoot frontend demo automatically
- I understand the connection flow automatically

## ✨ Example Workflow

**You:** "Add a new conversation filter"

**I automatically:**
1. ✅ Detect you're in gomake-web
2. ✅ Load `ai-dev-acceleration.md` (gomake-web patterns)
3. ✅ Load `api-reference.md` (check API endpoints)
4. ✅ Load `quick-decision-tree.md` (find filter pattern)
5. ✅ Load `code-snippets.ts` (get filter code)
6. ✅ Reference chatwoot patterns if needed
7. ✅ Provide working code

**You:** "Fix the proxy path transformation"

**I automatically:**
1. ✅ Detect you're in messaging-hub-v2
2. ✅ Load `ai-dev-acceleration.md` (proxy patterns)
3. ✅ Understand connection to gomake-web and chatwoot
4. ✅ Provide fix with context

## 🎯 What This Means for You

### You Don't Need To:
- ❌ Manually tell me which files to read
- ❌ Specify which project you're in
- ❌ Provide context about the workspace
- ❌ Remember file locations

### You Just:
- ✅ Work normally
- ✅ Ask questions
- ✅ Request features
- ✅ I handle the rest automatically!

## 📋 Current Setup Status

✅ **gomake-web**: Full acceleration files loaded automatically
✅ **messaging-hub-v2**: Acceleration file ready (auto-loaded)
✅ **chatwoot**: Acceleration file ready (auto-loaded)
✅ **Cross-references**: Automatic between projects
✅ **.cursorrules**: Configured for auto-loading

## 🚀 Result

**You work. I load. Everything is automatic.**

Just start coding or asking questions - I'll have all the context I need!

