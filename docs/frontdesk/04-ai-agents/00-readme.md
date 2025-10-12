# FrontDesk AI Agent Hub

Welcome, AI engineer. This folder equips you to plan, implement, and validate FrontDesk work with minimal guesswork. Load these guides in order when you pick up a task.

## How to Use This Hub
1. Start with `01-orientation.md` to internalize the architecture, directory layout, and current pain points.
2. Choose the execution track:
   - New capability or provider work → `02-feature-development-playbook.md`
   - Fixes, refactors, or stability tasks → `03-maintenance-bugfixing-guide.md`
3. Keep `04-data-integrations.md` open while coding to avoid breaking contracts.
4. Finish with the applicable checklist in `05-verification-checklists.md`.

## Ground Rules for Any Task
- Work **only** inside the FrontDesk surface unless the ticket explicitly expands scope.
- Mirror existing patterns; do not invent new folder structures.
- Prefer shared components/hooks when possible. If you must create a new one, document it here.
- Cross-reference the source docs in `docs/frontdesk/` for deep dives:
  - [Architecture](../00-core/FRONTDESK_ARCHITECTURE.md)
  - [Developer Guide](../00-core/DEVELOPER_GUIDE.md)
  - [DM Frontend Guide](../01-providers/direct-messages/direct-messages-frontend.md)
  - [Knowledge Base](../FRONTDESK_KNOWLEDGE_BASE.md)
  - [Improvement Plan (archived)](../../archive/frontdesk%20docs/FRONTDESK_IMPROVEMENT_PLAN.md)

## Quick System Facts
- Framework: Next.js (Pages Router) + TypeScript
- State: Recoil atoms/selectors under `src/store/frontdesk/`
- UI: Material-UI first; check shared components in `src/widgets/frontdesk/components/`
- Real-time: Socket.IO client via `src/services/frontdesk/websocket/messaging-socket.service.ts`

## Suggested Commands
Use the project workflow in `docs/frontdesk` and the wider repo memories:
```bash
npm run dev          # launch FrontDesk locally on http://localhost:3004/frontdesk/inbox
npm run lint         # static checks
npm run test         # Jest suite (add --watch while iterating)
```

Make sure to update this hub whenever architecture changes ship.
