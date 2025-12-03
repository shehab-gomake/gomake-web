# AI Protocol: FrontDesk Chatwoot

**Role:** FrontDesk Chatwoot Development Only
**Access:** `http://localhost:3004/frontdesk?channel=chatwoot&view=dashboard`

---

## ⚠️ CRITICAL: Chatwoot Provider ONLY

```
✅ ACTIVE:     src/widgets/frontdesk/providers/chatwoot/
❌ DEPRECATED: internal/, email/, tickets/, whatsapp/, unified/
```

**Do NOT modify deprecated providers.**

---

## 🎯 Scope

### ✅ Allowed Paths

```
src/widgets/frontdesk/     # UI components
src/store/frontdesk/       # Recoil state
src/services/frontdesk/    # REST APIs
docs/frontdesk/            # Documentation
```

### ❌ Forbidden

- `src/widgets/*` (except frontdesk/)
- `src/store/*` (except frontdesk/)
- Shared components (ask first)
- Build configs, package.json

### 🚨 Rules

1. Never create `.md` files unless requested
2. Never edit shared components without approval
3. Only modify atoms with `frontdesk.*` keys
4. Ask before adding npm dependencies

---

## 🏢 Workspace

| Project               | Location                                                     | Purpose   |
| --------------------- | ------------------------------------------------------------ | --------- |
| **gomake-web** (THIS) | `/Users/omarsabbah/Desktop/gomake-services/gomake-web`       | Frontend  |
| **messaging-hub-v2**  | `/Users/omarsabbah/Desktop/gomake-services/messaging-hub-v2` | Proxy     |
| **chatwoot**          | `/Users/omarsabbah/Desktop/messaging/chatwoot`               | Reference |

### Flow

```
gomake-web → JWT → messaging-hub-v2 → Chatwoot Backend
```

---

## 📚 Required Reading

| Priority | Document                                                                                |
| -------- | --------------------------------------------------------------------------------------- |
| 🔴       | `.cursor/FRONTDESK_CHATWOOT_COMPLETE_FLOW.md` - DTOs & URLs                             |
| 🔴       | `docs/frontdesk/FRONTDESK_CHATWOOT_ARCHITECTURE.md`                                     |
| 🟡       | `messaging-hub-v2/CLAUDE.md` - Proxy docs                                               |
| 🟡       | Chatwoot demo: `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/` |

---

## 🎯 Domain Mapping

| GoMake     | Chatwoot      |
| ---------- | ------------- |
| PrintHouse | Account (1:1) |
| Admin      | Administrator |
| Employee   | Agent         |
| Customer   | Contact       |

---

## 🔀 URL Pattern

```
gomake-web:      /api/accounts/{resource}
                 ↓ (proxy transforms)
messaging-hub:   /api/v1/accounts/{accountId}/{resource}
```

**Exception:** `/api/accounts/profile` → `/api/v1/profile`

**Rules:**

- ❌ Never include `/v1/` in gomake-web URLs
- ❌ Never include `{accountId}` in URLs
- ✅ Proxy injects both automatically

---

## 🏗️ Structure

```
providers/chatwoot/
├── chatwoot-provider-view.tsx    # Router
├── views/                        # 9 views
├── components/                   # 40+ components
├── hooks/                        # 30+ hooks
├── config/                       # Channel features
├── contexts/                     # React contexts
└── utils/                        # Helpers

services/frontdesk/api/chatwoot/
├── services/                     # 13 API services
└── types/                        # TypeScript types

store/frontdesk/atoms/
└── chatwoot.atoms.ts             # 20 Recoil atoms
```

---

## 🌐 Service Usage

```typescript
import { chatwootService } from "@/services/frontdesk";

// Profile (no accountId)
const user = await chatwootService.profile.getProfile();

// All other endpoints require accountId
const convos = await chatwootService.conversations.listConversations(accountId, filters);
const msg = await chatwootService.messages.createMessage(accountId, convId, { content: "Hi" });
```

**Services:** profile, conversations, messages, inboxes, notifications, contacts, agents, teams, labels, oauth

---

## ⚡ Key Patterns

### Always Check accountId

```typescript
if (!accountId) return;
const data = await chatwootService.conversations.listConversations(accountId);
```

### Extract Payload

```typescript
import { extractPayload } from "@/widgets/frontdesk/providers/chatwoot/utils/api-response-utils";
const conversations = extractPayload(response);
```

### Stable Filter Keys

```typescript
const filterKey = useMemo(() => createFilterKey(filters), [filters]);
```

### Fetch Deduplication

```typescript
import { useFetchLock, FETCH_LOCK_KEYS } from "./core/use-fetch-lock";
if (!acquireLock(FETCH_LOCK_KEYS.CONVERSATIONS)) return;
```

### Performance

```typescript
const filtered = useMemo(() => data.filter((x) => x.status === filter), [data, filter]);
const handleClick = useCallback(() => {
  /* ... */
}, [deps]);
```

---

## 🚨 Common Mistakes

| ❌ Wrong                     | ✅ Correct                 |
| ---------------------------- | -------------------------- |
| `/api/v1/accounts/...`       | `/api/accounts/...`        |
| `accountId` in URL           | Proxy injects it           |
| `response.data`              | `extractPayload(response)` |
| `useState` for shared data   | Recoil atoms               |
| Arrow functions in listeners | Named function refs        |

---

## 🛠️ Commands

```bash
npm run dev      # localhost:3004
npm run build    # Production build
npm run lint     # ESLint
```

---

## 📁 Quick Reference

| Need           | Location                                                                 |
| -------------- | ------------------------------------------------------------------------ |
| Quick patterns | `.cursor/ai-dev-acceleration.md`                                         |
| API endpoints  | `.cursor/api-reference.md`                                               |
| Decision tree  | `.cursor/quick-decision-tree.md`                                         |
| Code snippets  | `.cursor/code-snippets.ts`                                               |
| Architecture   | `.cursor/rules/`                                                         |
| Chatwoot ref   | `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/` |
