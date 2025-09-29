# CLAUDE.md — MCP Protocol for **FrontDesk** (Serena + Archon)

**persona:** Elite AI Software Engineer
**prime_directive:** Follow this protocol. All tasks use the 5-phase cycle.
**mode:** MCP-first. Prefer tool calls. Small, reversible edits. Validate after each change.

---

## MCP Tool Registry (authoritative)

**Serena (project & code)**

- `activate_project`
- `check_onboarding_performed`
- `list_memories` / `write_memory`
- `list_dir(path,depth?)`
- `get_symbols_overview(path)`
- `find_symbol(symbol,include_body:false|true)`
- `replace_symbol_body(symbol,code)`
- `insert_after_symbol(symbol,code)` / `insert_before_symbol(symbol,code)`
- `replace_regex(path,pattern,replacement,flags?)`
- `create_text_file(path,content)`
- `execute_shell_command(cmd,args,env?,cwd?,timeoutMs?)`
- `think_about_collected_information`
- `think_about_task_adherence`
- `think_about_whether_you_are_done`

**Archon (knowledge)**

- `list_knowledge_bases`
- `retrieve_knowledge(query,sources?,top_k?,style?)`

> **Guardrails:** Read → Plan → Edit (surgical) → Verify → Iterate. Never dump secrets. Prefer interface-level edits over sweeping refactors.

---

## Project Runbook (execute via Serena `execute_shell_command`)

```bash
# Dev / Build / Quality
npm run dev           # http://localhost:3004/frontdesk/inbox
npm run build
npm run lint
npm run test          # Jest + coverage
```

---

## FrontDesk Map (single source of truth)

**Feature:** Unified messaging hub (DMs, Email, WhatsApp) at `/frontdesk/inbox`.

**Structure**

```
src/widgets/frontdesk/
  frontdesk-widget.tsx               # entry + routing
  providers/
    internal/  # DMs (WebSocket)
    email/     # Gmail (OAuth)
    whatsapp/  # WhatsApp
    unified/   # Unified inbox (partial)
  components/  # shared UI
  hooks/       # custom React hooks
  controllers/ # business logic + navigation

src/store/frontdesk/
  atoms/       # Recoil atoms per provider
  selectors/   # derivations & aggregations

src/services/
  api-service/frontdesk/  # REST
  websocket/messaging-service.ts  # DMs client
```

**State & Events**

- Recoil for state; provider-scoped atoms (`frontdesk.{provider}.{data}`).
- WS lifecycle: `pending → sent → delivered → read`.
- Typing indicators, presence, optimistic updates (temp IDs), auto-reconnect.

**Provider Pattern**

1. `{provider}-provider-view.tsx`
2. `use-{provider}-provider.ts` (state + actions)
3. Provider components
4. REST in `src/services/api-service/frontdesk/`

**Known Issues**

1. Layout inconsistency across providers
2. Unified inbox partial (aggregation incomplete)
3. Some API endpoints are placeholders
4. Email OAuth needs backend coordination

---

## Phase 0 — Session Bootstrap (mandatory)

```json
{"type":"tool_use","name":"activate_project","input":{}}
{"type":"tool_use","name":"check_onboarding_performed","input":{}}
{"type":"tool_use","name":"list_memories","input":{}}
{"type":"tool_use","name":"list_knowledge_bases","input":{}}
```

---

## Phase 1 — Task Deconstruction & Context 🧠

**External context (Archon)**

```json
{
  "type": "tool_use",
  "name": "retrieve_knowledge",
  "input": { "query": "Best practices for unified inbox UX (threading, read states), React + Recoil patterns, WS reconnection." }
}
```

**Code mapping (Serena)**

```json
{"type":"tool_use","name":"list_dir","input":{"path":"src/widgets/frontdesk","depth":2}}
{"type":"tool_use","name":"get_symbols_overview","input":{"path":"src/widgets/frontdesk/providers/unified"}}
{"type":"tool_use","name":"find_symbol","input":{"symbol":"messagingService","include_body":false}}
```

**Synthesize (checkpoint)**

```json
{
  "type": "tool_use",
  "name": "think_about_collected_information",
  "input": { "notes": "Unify provider layouts; aggregate messages; ensure tenancy & optimistic updates remain correct." }
}
```

---

## Phase 2 — Plan & Strategy 🗺️

Persist a minimal, ordered tool plan:

```json
{
  "type": "tool_use",
  "name": "write_memory",
  "input": {
    "title": "Plan:<ticket>",
    "content": "1) Add unified aggregator selector; 2) Normalize message types; 3) Implement UnifiedInboxView; 4) Refactor provider layouts to shared shell; 5) Wire WS updates into aggregation; 6) Tests; 7) Lint/Build/Test; 8) Docs."
  }
}
```

---

## Phase 3 — Surgical Implementation 👨‍💻

**Canonical edit flow**

```json
{"type":"tool_use","name":"create_text_file",
 "input":{"path":"src/store/frontdesk/selectors/unified.selectors.ts",
  "content":"export const unifiedMessagesSelector=selector({key:'frontdesk.unified.messages',get:({get})=>{/* aggregate from email,dms,whatsapp atoms; sort by updatedAt */}});"}}
{"type":"tool_use","name":"insert_after_symbol",
 "input":{"symbol":"FrontdeskWidget",
  "code":"\n// mount unified inbox route\n<Route path=\"/frontdesk/inbox\" element={<UnifiedInboxView/>} />"}}
{"type":"tool_use","name":"create_text_file",
 "input":{"path":"src/widgets/frontdesk/providers/unified/unified-provider-view.tsx",
  "content":"export default function UnifiedInboxView(){/* read unifiedMessagesSelector; render list; route to detail */}"}}
{"type":"tool_use","name":"replace_regex",
 "input":{"path":"src/widgets/frontdesk/components/Layout.tsx",
  "pattern":"export default function .*{[\\s\\S]*}$",
  "replacement":"export default function FrontdeskShell({children}){/* shared nav/search/filters */ return <>{children}</>;}"}}
{"type":"tool_use","name":"replace_regex",
 "input":{"path":"src/widgets/frontdesk/providers/(internal|email|whatsapp)/.*-provider-view.tsx",
  "pattern":"<Fragment>\\s*[\\s\\S]*</Fragment>",
  "replacement":"<FrontdeskShell>{/* provider content */}</FrontdeskShell>",
  "flags":"gm"}}
```

**Consult Archon when unsure**

```json
{
  "type": "tool_use",
  "name": "retrieve_knowledge",
  "input": { "query": "Patterns for optimistic UI with Recoil + WebSocket; conflict resolution on ack vs. server state." }
}
```

**Adherence (checkpoint)**

```json
{
  "type": "tool_use",
  "name": "think_about_task_adherence",
  "input": {
    "checklist": [
      "Selectors pure/derived",
      "Atoms provider-scoped",
      "Optimistic IDs reconciled",
      "No cross-provider coupling in hooks"
    ]
  }
}
```

---

## Phase 4 — Verification & Iteration 🔁

```json
{"type":"tool_use","name":"execute_shell_command","input":{"cmd":"npm","args":["run","lint"]}}
{"type":"tool_use","name":"execute_shell_command","input":{"cmd":"npm","args":["run","build"]}}
{"type":"tool_use","name":"execute_shell_command","input":{"cmd":"npm","args":["run","test"]}}
```

- If failing, parse output; search & patch smallest surface:

```json
{
  "type": "tool_use",
  "name": "replace_symbol_body",
  "input": { "symbol": "UnifiedInboxView", "code": "/* minimal viable render + types fixed; unit tested */" }
}
```

- Re-run commands until green.

---

## Phase 5 — Finalization & Reporting ✅

```json
{"type":"tool_use","name":"think_about_whether_you_are_done",
 "input":{"criteria":["Unified inbox renders & updates","Layout shared","Optimistic flow stable","Tests pass"]}}
{"type":"tool_use","name":"write_memory",
 "input":{"title":"ChangeLog:<ticket>",
  "content":"Summary, UX rationale, atoms/selectors added, WS hookup, risks, rollback, tests."}}
```

---

## Change Recipes (copy/paste)

### A) Add a New Provider (e.g., Slack later)

1. Scaffold

```json
{"type":"tool_use","name":"create_text_file",
 "input":{"path":"src/widgets/frontdesk/providers/new/new-provider-view.tsx","content":"export default function NewProviderView(){return null;}"}}
{"type":"tool_use","name":"create_text_file",
 "input":{"path":"src/widgets/frontdesk/providers/new/use-new-provider.ts","content":"export function useNewProvider(){/* atoms+actions */}"}}
```

2. State + API + UI

```json
{"type":"tool_use","name":"create_text_file",
 "input":{"path":"src/store/frontdesk/atoms/new.atoms.ts","content":"/* atoms */"}}
{"type":"tool_use","name":"create_text_file",
 "input":{"path":"src/services/api-service/frontdesk/new.service.ts","content":"/* REST */"}}
```

3. Wire route + shell, tests, run Phase 4.

### B) Finish Unified Inbox Aggregation

- Add `unifiedMessagesSelector` (above), feed from provider atoms, sort by `updatedAt`, reconcile optimistic → server IDs, include read states.

### C) Normalize Message Types

- Define shared `Message` type; adapters per provider map upstream → shared shape; update selectors & views.

### D) Email OAuth Flow

- Add placeholder actions; coordinate backend redirect; surface interim UX with disabled actions; document env flags.

---

## Testing & Manual QA

- `npm run dev` then visit `/frontdesk/inbox`
- Validate: DMs, Email, WhatsApp
- WS: check Network → WS frames; confirm typing + presence
- Recoil DevTools: verify atoms/selector updates; no cross-provider leakage

---

## Style & Conventions

- Components: **PascalCase**; Hooks: **useCamelCase**; Utils: **kebab-case.utils.ts**
- Recoil atoms named + keyed: `frontdesk.{provider}.{slice}`; selectors pure, no side-effects
- Keep provider logic isolated; reuse **FrontdeskShell** for layout

---

## Agent Self-Check (pre-commit)

- [ ] Unified inbox selector pure & memoized
- [ ] Provider layouts use shared shell
- [ ] Optimistic messages reconcile with server ACKs
- [ ] WS reconnect/backoff handled (no dup listeners)
- [ ] Tests pass; coverage on selectors/hooks
- [ ] No hardcoded secrets; types strict; logs redacted

---

**End of protocol.**
