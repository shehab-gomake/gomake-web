# FrontDesk Chatwoot Workspace Knowledge Base

This file contains permanent workspace knowledge for faster development. Always reference this when working in this workspace.

## 🎯 Quick Reference

### Project Locations
- **gomake-web**: `/Users/omarsabbah/Desktop/gomake-services/gomake-web`
- **messaging-hub-v2**: `/Users/omarsabbah/Desktop/gomake-services/messaging-hub-v2`
- **chatwoot**: `/Users/omarsabbah/Desktop/messaging/chatwoot`

### Key Documentation Files
- `CLAUDE.md` - Development guidelines
- `docs/frontdesk/FRONTDESK_CHATWOOT_ARCHITECTURE.md` - Complete architecture
- `docs/frontdesk/README.md` - Documentation index

### Chatwoot Reference Paths
- Frontend Demo: `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/`
- API Client: `chatwoot/app/javascript/dashboard/api/ApiClient.js`
- Components: `chatwoot/app/javascript/dashboard/components/widgets/`
- State Management: `chatwoot/app/javascript/dashboard/store/modules/`

## 🔗 Connection Flow

```
FrontDesk Chatwoot Provider (gomake-web)
    ↓ JWT Bearer Token → /api/conversations
messaging-hub-v2 (NestJS Proxy)
    ↓ Validates JWT + Auto-provisions + Transforms path
    ↓ /api/v1/accounts/{accountId}/conversations
Chatwoot Backend (Rails API)
```

## 📚 Development Patterns

### When Implementing Chatwoot Features
1. Check Chatwoot frontend demo at `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/`
2. Reference API patterns from `chatwoot/app/javascript/dashboard/api/`
3. Review component structure in `chatwoot/app/javascript/dashboard/components/widgets/`
4. Understand state management from `chatwoot/app/javascript/dashboard/store/modules/`

### Service Usage
```typescript
import { chatwootService } from '@/services/frontdesk';

// All operations require accountId (except profile)
const conversations = await chatwootService.conversations.listConversations(
  accountId,
  { status: ['open'], page: 1 }
);
```

### Key Directories
- FrontDesk Chatwoot: `src/widgets/frontdesk/providers/chatwoot/`
- Chatwoot Services: `src/services/frontdesk/api/chatwoot/`
- State Atoms: `src/store/frontdesk/atoms/chatwoot.atoms.ts`

## 🚀 Quick Start Checklist

When starting a new FrontDesk Chatwoot task:
1. ✅ Read `CLAUDE.md` for scope and guidelines
2. ✅ Read `docs/frontdesk/FRONTDESK_CHATWOOT_ARCHITECTURE.md` for architecture
3. ✅ Check Chatwoot frontend demo for UI patterns
4. ✅ Review existing provider implementation for patterns
5. ✅ Use `chatwootService` from `@/services/frontdesk`

