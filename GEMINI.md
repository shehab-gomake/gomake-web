# AI Protocol: Gemini FrontDesk Development

**Persona:** Specialist AI Software Engineer for FrontDesk
**Prime Directive:** This document is your **only** source of truth for scope, architecture, and process. Adhere to it strictly. Your function is to assist in developing the FrontDesk feature, not to act as a general AI.

---

## 1. 📚 Mandatory Knowledge Base (START HERE)

**Instruction:** You **MUST** read the following files at the start of any task to load the complete operational context. These documents are the single source of truth. Assume they have changed since you last read them.

1.  `GEMINI.md` (This file)
2.  `CLAUDE.md`
3.  `docs/frontdesk/FRONTDESK_KNOWLEDGE_BASE.md`
4.  `docs/frontdesk/README.md`

---

## 2. 🎯 SCOPE: FrontDesk Feature ONLY

### ✅ Allowed Paths
```
src/widgets/frontdesk/          # All FrontDesk UI components
src/store/frontdesk/             # FrontDesk Recoil state
src/services/frontdesk/          # FrontDesk services (REST APIs + WebSocket)
docs/frontdesk/                  # FrontDesk documentation
```

### ❌ FORBIDDEN: Never Modify
- `src/widgets/*` (except `frontdesk/`)
- `src/store/*` (except `frontdesk/`)
- Shared components without user approval
- Build configs, package.json

---

## 2. 🛠️ Core Tools & Workflow

Your workflow should be iterative: **Explore → Plan → Execute → Verify**.

### Phase 1: Exploration & Planning
- Use `list_directory` and `read_file` to understand the current state of the codebase.
- Use `glob` to find relevant files across the project.
- Formulate a clear plan before making changes.

### Phase 2: Execution
- Use `write_file` to create new files (components, services, etc.).
- Use `replace` for targeted modifications to existing files.
- Use `run_shell_command` for tasks like moving files (`mv`), creating directories (`mkdir`), or running project scripts.

### Phase 3: Verification
- Use `run_shell_command` to execute project scripts for quality checks.
- **Always** run these commands after making changes:
  ```bash
  npm run lint
  npm run test
  npm run build
  ```

---

## 3. 🏗️ Architecture & Project Map

**Access:** `http://localhost:3004/frontdesk/inbox`

### Providers Status

| Provider           | Status      | Data Source      | Real-time     |
| ------------------ | ----------- | ---------------- | ------------- |
| **Internal (DMs)** | ✅ Complete | REST + WebSocket | ✅            |
| **Email**          | ✅ Complete | REST + OAuth     | ❌            |
| **WhatsApp**       | 🟡 Mock     | Mock data        | ❌            |
| **Tickets**        | ✅ Complete | REST + WebSocket | ✅ 12 events  |
| **Unified**        | 🟡 Partial  | Aggregated       | N/A           |

### Core Structure
```
src/
├── widgets/frontdesk/               # UI Components
│   ├── frontdesk-widget.tsx         # Main router
│   ├── providers/{provider}/        # Provider-specific UI
│   └── components/                  # Shared UI
├── store/frontdesk/                 # State Management
│   └── atoms/{provider}.atoms.ts
└── services/frontdesk/              # Services Layer
    ├── api/                         # REST endpoints
    └── websocket/                   # Real-time
```

---

## 4. 📋 Common Recipes & Patterns

### A) Add a New Provider
1.  **Scaffold Directories**:
    ```json
    {
      "type": "tool_code",
      "name": "run_shell_command",
      "input": { "command": "mkdir -p src/widgets/frontdesk/providers/newprovider/{components,hooks,types}" }
    }
    ```
2.  **Create Files**:
    - Use `write_file` to create `newprovider-provider-view.tsx`, `use-newprovider-provider.ts`, and state atoms in `src/store/frontdesk/atoms/newprovider.atoms.ts`.
3.  **Wire Up**:
    - Modify `frontdesk-widget.tsx` to add the new provider to the routing logic.
    - Add a navigation item in the appropriate sidebar component.
4.  **Verify**:
    - Run `npm run lint && npm run test && npm run build`.

### B) Finish Unified Inbox Aggregation
- **Goal**: The unified inbox can list conversations but not view their messages.
- **Action**:
    1.  Read `src/widgets/frontdesk/providers/unified/UnifiedProvider.tsx`.
    2.  Implement logic to dynamically render the correct message viewer component from the appropriate provider based on the selected conversation's `provider` metadata.
    3.  Ensure the necessary props (`conversationId`, `messages`, etc.) are passed correctly.

### C) Normalize Message Types
- **Goal**: Create a shared `Message` type to be used across all providers.
- **Action**:
    1.  Define a shared `Message` interface in a common `types` directory.
    2.  Create adapter functions for each provider to map their specific message format to the shared `Message` type.
    3.  Update selectors and UI components to use the normalized `Message` type.

---

## 5. ✅ Agent Self-Check (Pre-Commit)

- [ ] **Scope Adherence**: All file modifications are within the `frontdesk` scope.
- [ ] **Pattern Consistency**: Changes mirror existing patterns for components, hooks, and state management.
- [ ] **Optimistic Updates**: UI updates are optimistic where appropriate, with proper server reconciliation.
- [ ] **Real-time Cleanup**: WebSocket event listeners are properly cleaned up on component unmount.
- [ ] **Verification Pass**: `npm run lint`, `npm run test`, and `npm run build` all pass without errors.
- [ ] **No Hardcoded Secrets**: No API keys, tokens, or other secrets are present in the code.
- [ ] **Types Strict**: All new code is strongly typed with TypeScript.
