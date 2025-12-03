# .cursor - AI Development Acceleration

Quick reference files for FrontDesk Chatwoot development.

## 📁 Files

| File                                  | Purpose                      | Use When           |
| ------------------------------------- | ---------------------------- | ------------------ |
| `ai-dev-acceleration.md`              | Patterns, imports, templates | Starting any task  |
| `api-reference.md`                    | API endpoints                | Need API method    |
| `quick-decision-tree.md`              | "I want to..." workflows     | Making decisions   |
| `code-snippets.ts`                    | Copy-paste code              | Need working code  |
| `feature-template.tsx`                | New feature scaffold         | Creating feature   |
| `FRONTDESK_CHATWOOT_COMPLETE_FLOW.md` | DTOs, URL transforms         | API implementation |

## 📐 Rules (`rules/`)

| Rule                              | Purpose                 |
| --------------------------------- | ----------------------- |
| `frontdesk-architecture.mdc`      | Core FrontDesk patterns |
| `frontdesk-chatwoot-provider.mdc` | Chatwoot-specific rules |
| `chatwoot-skills-integration.mdc` | Vue → React adaptation  |
| `ui-consistency.mdc`              | Design system usage     |
| `production-ready-code.mdc`       | Code quality standards  |

## 🚀 Quick Start

```typescript
// Service import
import { chatwootService } from "@/services/frontdesk";

// All endpoints need accountId (except profile)
const data = await chatwootService.conversations.listConversations(accountId, filters);
```

## 🎯 Key Rules

1. **URL Pattern**: Use `/api/accounts/{resource}` (proxy adds `/v1/` and `accountId`)
2. **Always check `accountId`** before API calls
3. **Use Recoil atoms** for shared state
4. **Reference Chatwoot demo** before building UI: `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/`

## 📚 Related Docs

- `../CLAUDE.md` - Complete project guidelines
- `../docs/frontdesk/FRONTDESK_CHATWOOT_ARCHITECTURE.md` - Architecture guide
- `messaging-hub-v2/CLAUDE.md` - Proxy service docs
