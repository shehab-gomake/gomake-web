# FrontDesk Chatwoot Workspace - Acceleration Files Index

This document maps acceleration files across all three projects in the workspace.

## 📁 Projects Overview

### 1. gomake-web (THIS PROJECT)
**Role:** FrontDesk Chatwoot provider frontend
**Acceleration Files Location:** `.cursor/`

### 2. messaging-hub-v2
**Role:** NestJS proxy between FrontDesk and Chatwoot
**Location:** `/Users/omarsabbah/Desktop/gomake-services/messaging-hub-v2`
**Acceleration Files:** `.cursor/ai-dev-acceleration.md`

### 3. chatwoot
**Role:** Backend API + Frontend reference
**Location:** `/Users/omarsabbah/Desktop/messaging/chatwoot`
**Acceleration Files:** `.cursor/ai-dev-acceleration.md`

## 🎯 When to Use Which File

### Working in gomake-web (FrontDesk)
→ Use files in **this** `.cursor/` directory:
- `ai-dev-acceleration.md` - Patterns for FrontDesk
- `api-reference.md` - API endpoints
- `quick-decision-tree.md` - Decision guide
- `code-snippets.ts` - Code library
- `feature-template.tsx` - Feature scaffold

### Working in messaging-hub-v2 (Proxy)
→ Use: `/Users/omarsabbah/Desktop/gomake-services/messaging-hub-v2/.cursor/ai-dev-acceleration.md`
- NestJS proxy patterns
- Path transformation
- Auto-provisioning logic

### Working in chatwoot (Backend)
→ Use: `/Users/omarsabbah/Desktop/messaging/chatwoot/.cursor/ai-dev-acceleration.md`
- Rails backend patterns
- Vue frontend patterns (reference for FrontDesk)

## 🔗 Cross-Project Reference

### When Building FrontDesk Feature

1. **Check Chatwoot Reference** (chatwoot project)
   - Frontend patterns: `chatwoot/app/javascript/dashboard/`
   - Acceleration: `chatwoot/.cursor/ai-dev-acceleration.md`

2. **Check Proxy Setup** (messaging-hub-v2 project)
   - Path mapping: `messaging-hub-v2/.cursor/ai-dev-acceleration.md`
   - Ensure endpoint is proxied correctly

3. **Implement in FrontDesk** (this project)
   - Use: `ai-dev-acceleration.md` (this file)
   - Use: `api-reference.md` for endpoints
   - Use: `code-snippets.ts` for code

## 📚 File Purpose Map

| Project | File | Purpose |
|---------|------|---------|
| gomake-web | `ai-dev-acceleration.md` | FrontDesk Chatwoot patterns |
| gomake-web | `api-reference.md` | API endpoint reference |
| gomake-web | `quick-decision-tree.md` | Decision workflows |
| gomake-web | `code-snippets.ts` | Copy-paste code |
| messaging-hub-v2 | `ai-dev-acceleration.md` | Proxy service patterns |
| chatwoot | `ai-dev-acceleration.md` | Backend + frontend patterns |

## 🚀 Quick Access

- **This Project (gomake-web)**: Use files in `.cursor/` directory
- **Proxy (messaging-hub-v2)**: Reference `/Users/omarsabbah/Desktop/gomake-services/messaging-hub-v2/.cursor/ai-dev-acceleration.md`
- **Backend (chatwoot)**: Reference `/Users/omarsabbah/Desktop/messaging/chatwoot/.cursor/ai-dev-acceleration.md`

---

**Note:** Each project has its own acceleration files tailored to its specific needs and patterns.

