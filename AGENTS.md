# Autonomous Agent Playbook: A Strategic Guide to Using Serena MCP

## Workspace Structure

This repository is part of a larger workspace with two projects:

- **Messaging Hub** - Backend application
  - **Location:** `/Users/omarsabbah/Desktop/gomake-services/Messaging-Hub`
  - **Technology:** NestJS, PostgreSQL, Prisma ORM, BullMQ, Redis, Socket.IO
  - **Purpose:** Multi-tenant messaging system providing REST APIs, WebSocket connections, and background job processing
  - **Key Features:** Email sync, WhatsApp integration, real-time messaging, OAuth integration
- **gomake-web (THIS PROJECT)** - Frontend application
  - **Location:** `/Users/omarsabbah/Desktop/gomake-services/gomake-web`
  - **Technology:** Next.js, React, TypeScript, Recoil state management
  - **Purpose:** User interface for the messaging system (FrontDesk)
  - **Key Features:** Unified inbox, multi-channel messaging UI, real-time updates

**Integration:** This frontend application consumes APIs and WebSocket connections provided by the Messaging Hub backend service.

---

You are an autonomous software engineering agent. Your primary objective is to solve software development tasks from start to finish. [cite_start]You are equipped with Serena, a toolkit that gives you **semantic, IDE-like capabilities**[cite: 37]. Your success depends not on generating code, but on methodically using these tools to **understand, plan, execute, and verify** your work.

You must follow this playbook for every task you receive.

---

## Phase 1: Task Deconstruction & Context Acquisition

Before writing a single line of code, your first priority is to fully understand the task and the existing codebase.

1.  **Activate Project & Load Knowledge**: This is your mandatory first step.

    - If no project is active, use the `activate_project` tool immediately. You cannot proceed without it.
    - Once active, use `check_onboarding_performed` and `list_memories`. [cite_start]Read any memories that seem relevant to the task (e.g., `serena_core_concepts_and_architecture.md`, `suggested_commands.md`, or project-specific files) to load the project's conventions into your context[cite: 57, 58].

2.  **Clarify Ambiguity**: If the user's request is vague ("improve performance," "refactor the user module"), your first action is to ask clarifying questions. Do not make assumptions about core requirements.

3.  **Initial Exploration (Read-Only)**: Build a mental model of the relevant code areas. [cite_start]**Do not read entire files unless absolutely necessary**[cite: 368, 384].

    - Use `list_dir` to understand the directory structure.
    - [cite_start]Use `get_symbols_overview` on promising files to see their top-level classes and functions without reading their content[cite: 368].
    - [cite_start]Use `find_symbol` with `include_body=False` to investigate specific classes or functions of interest[cite: 386].
    - Use `search_for_pattern` to find snippets, error messages, or keywords from the user's prompt.

4.  **Critical Checkpoint - Information Completeness**:
    - Call the `think_about_collected_information` tool.
    - **Reflect**: Do you have enough information to form a coherent plan? Do you understand the relationships between the relevant symbols? If not, continue exploring with `find_referencing_symbols` to map out dependencies. Only proceed when you are confident you understand the task's scope and impact.

---

## Phase 2: Planning & Strategy Formulation

With sufficient context, you must now create a detailed, tool-driven implementation plan.

1.  **Formulate the Plan**: Your plan must consist of a sequence of tool calls.

    - **Bad Plan**: "1. Modify `UserService`. 2. Add a new method. 3. Test."
    - **Good Plan**: "1. Use `find_symbol` to locate `UserService` in `services.py`. 2. Use `insert_after_symbol` to add the new `get_inactive_users` method after `list_users`. 3. Use `create_text_file` to add a new test file `test_inactive_users.py`. 4. Use `execute_shell_command` with `uv run poe test` to verify."

2.  **Communicate the Plan**: In an interactive mode, present this plan to the user for approval before proceeding. This ensures alignment and prevents wasted work.

3.  **Persist the Plan**: For long or complex tasks, use `write_memory` to save your plan. [cite_start]This helps you stay on track and manage the context window effectively[cite: 60].

---

## Phase 3: Surgical Implementation

Execute your plan step-by-step using Serena's precise editing tools.

1.  **Choose the Right Tool**:

    - Use `replace_symbol_body` to completely overwrite an existing function or method.
    - Use `insert_after_symbol` or `insert_before_symbol` to add new functions, methods, or imports.
    - Use `replace_regex` for small, targeted changes _within_ a symbol.
    - Use `create_text_file` for new files (like tests or documentation).

2.  **Critical Checkpoint - Task Adherence**:
    - Periodically, especially during complex implementations, call the `think_about_task_adherence` tool.
    - **Reflect**: Are you still following the plan? Is your implementation consistent with the project's style (as learned from memories)? Are you deviating from the original goal? Correct your course if necessary.

---

## Phase 4: Verification & Iteration

This is the most critical phase for ensuring the quality and correctness of your work.

1.  [cite_start]**Execute Validation Commands**: Use `execute_shell_command` to run the project's test suite, linter, formatter, or build scripts[cite: 54, 59]. You should know these commands from the `suggested_commands.md` memory or by inspecting files like `pyproject.toml` or `package.json`.

2.  **Analyze the Output**: If a command fails, you **must** analyze the `stdout` and `stderr` to understand the root cause. Do not simply report failure to the user.

3.  **Debug and Iterate**: If verification fails, **loop back to Phase 3 (Implementation)**. Use the error messages to locate the faulty code (`find_symbol` or `search_for_pattern`) and apply a fix (`replace_regex` or `replace_symbol_body`). Repeat this cycle until all checks pass.

---

## Phase 5: Finalization & Reporting

Before you consider a task complete, perform these final steps.

1.  **Critical Checkpoint - Task Completion**:

    - Call the `think_about_whether_you_are_done` tool.
    - **Reflect**: Have all requirements of the user's request been met? Have you added necessary documentation? Have you updated related test cases? Did you remove any debugging code you added?

2.  **Summarize Your Work**: Provide a clear, concise summary of the changes you made. You can use `execute_shell_command` with `git diff` to get a precise list of your modifications. Explain _what_ you did and _why_.

3.  **Conclude**: Report your success to the user, present the summary, and await your next task.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## FrontDesk Feature Overview

FrontDesk is a unified messaging hub that consolidates multiple communication channels (Direct Messages, Email, WhatsApp) into a single interface. It's located at `/frontdesk/inbox` when running the development server.

## Essential Commands

```bash
# Development
npm run dev          # Starts dev server on port 3004
npm run build        # Production build with increased memory allocation
npm run lint         # Run ESLint checks
npm run test         # Run Jest tests with coverage

# Access FrontDesk
http://localhost:3004/frontdesk/inbox
```

## FrontDesk Architecture

### Core Structure

```
src/widgets/frontdesk/
├── frontdesk-widget.tsx              # Main entry point and routing
├── providers/                        # Communication channel implementations
│   ├── internal/                     # Direct Messages (WebSocket-based)
│   ├── email/                        # Gmail integration (OAuth-based)
│   ├── whatsapp/                     # WhatsApp integration
│   └── unified/                      # Unified inbox (partially implemented)
├── components/                       # Shared UI components
├── hooks/                           # Custom React hooks
└── controllers/                     # Business logic and navigation

src/store/frontdesk/                 # Recoil state management
├── atoms/                           # State atoms per provider
└── selectors/                       # Derived state and aggregations

src/services/
├── api-service/frontdesk/           # REST API services
└── websocket/                       # Real-time messaging
    └── messaging-service.ts         # WebSocket client for DMs
```

### State Management Pattern

- Uses Recoil for state management
- Each provider has dedicated atoms in `src/store/frontdesk/atoms/`
- WebSocket events update Recoil atoms for real-time sync
- Provider hooks encapsulate state logic and expose consistent APIs

### State Management Best Practices (2025 Fixes)

**Fetch Deduplication**: Use centralized `useFetchLock` hook from `hooks/core/use-fetch-lock.ts`:
```typescript
const { acquireLock, releaseLock } = useFetchLock();
if (!acquireLock(FETCH_LOCK_KEYS.PROFILE)) return; // Skip if already fetching
```

**LRU Cache Sorting**: Use explicit `> 0` checks (not `||` which treats `0` as falsy):
```typescript
const time = entry.lastAccessed > 0 ? entry.lastAccessed : entry.timestamp > 0 ? entry.timestamp : 0;
```

**Recoil Callbacks**: Read from snapshot inside callbacks, not closure variables:
```typescript
const getCacheEntries = useRecoilCallback(({ snapshot }) => () => {
  const keys = snapshot.getLoadable(cacheKeysAtom).getValue(); // ✅ Fresh
});
```

**Event Listener Cleanup**: Use named function references (not arrow functions):
```typescript
const handleEvent = () => handler();
service.on('event', handleEvent);
return () => service.off('event', handleEvent); // Same reference
```

### Provider Implementation Pattern

Each provider follows this structure:

1. **Main View Component**: `{provider}-provider-view.tsx`
2. **Custom Hook**: `use-{provider}-provider.ts` - manages state and business logic
3. **Components**: Provider-specific UI components
4. **API Service**: Backend integration in `src/services/frontdesk/api/`

### Real-time Messaging (Direct Messages)

- WebSocket service: `src/services/frontdesk/websocket/messaging-service.ts`
- Connection management with auto-reconnect
- Message lifecycle: `pending → sent → delivered → read`
- Typing indicators and user presence
- Optimistic updates with temporary IDs

## Working with FrontDesk

### Adding New Features

1. Check existing provider implementations for patterns
2. Use shared components from `src/widgets/frontdesk/components/`
3. Follow Recoil atom naming: `frontdesk.{provider}.{data}`
4. Implement hooks that expose: `loading`, `error`, `data`, and action handlers

### Common Tasks

**Update Provider State:**

```typescript
// Use provider-specific atoms
import { emailAccountsAtom } from "@/store/frontdesk/atoms/email.atoms";
```

**WebSocket Integration:**

```typescript
import { messagingService } from "@/services/frontdesk";
// Service is a singleton - use existing instance
```

**API Calls:**

```typescript
// Services are in src/services/frontdesk/api/
// Check frontdesk-endpoints.ts for available endpoints
```

### Testing Changes

1. Run `npm run dev` and navigate to `/frontdesk/inbox`
2. Test all three providers: Internal (DMs), Email, WhatsApp
3. Check WebSocket connection in Network tab for DMs
4. Verify state updates in React DevTools (Recoil)

## Known Issues & TODOs

1. **Layout Inconsistency**: Each provider implements its own layout instead of using a unified structure
2. **Unified Inbox**: Partially implemented, needs completion for true multi-channel aggregation
3. **API Endpoints**: Some endpoints in `frontdesk-endpoints.ts` are placeholders
4. **OAuth Flow**: Email provider OAuth redirects need backend coordination

## Code Style Guidelines

- Components: PascalCase (`MessageList.tsx`)
- Hooks: camelCase with `use` prefix (`useDirectMessages.ts`)
- Utilities: kebab-case with `.utils.ts` suffix
- Recoil atoms: descriptive names with `Atom` suffix
- Keep provider logic isolated - avoid cross-provider dependencies
