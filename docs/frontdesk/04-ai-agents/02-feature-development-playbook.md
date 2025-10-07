# New Feature Playbook

Follow this sequence whenever you add a capability (new provider view, shared component, unified inbox enhancement, etc.).

## Phase 0 – Intake & Alignment
- Clarify the problem statement and target audience. If unclear, push back before coding.
- Map the request to provider(s). Features almost always attach to one of: `internal (DM)`, `email`, `whatsapp`, or `unified`.
- Quickly skim existing docs: architecture, developer guide, and the provider-specific guides to avoid duplicating prior art.

## Phase 1 – Impact Analysis
1. Locate relevant files using `src/widgets/frontdesk/providers/<provider>/` and `src/store/frontdesk/`.
2. Identify shared components/hooks that can be reused (`src/widgets/frontdesk/components/`, `hooks/`). Favor extension over reinvention.
3. Decide whether layout changes belong in `ThreeColumnLayout` (global) or provider-level containers.
4. Validate data needs with `04-data-integrations.md` and existing services. Add API surface only when necessary.

## Phase 2 – Design & Plan
- Sketch the UI structure and state transitions. Keep the tri-pane layout in mind.
- Plan Recoil additions: atoms go under `src/store/frontdesk/atoms/`, selectors under `selectors/`, with namespaced keys like `frontdesk.provider.feature`.
- Draft API/WS interactions. Align payloads with existing interfaces under `src/interfaces/` or provider `types/` folders.
- Document the plan (even briefly) in ticket notes or `docs/frontdesk/ai-agents/` if it affects future work.

## Phase 3 – Implementation Steps
1. **Layout & Navigation**
   - Register new provider views in `frontdesk-widget.tsx` and update navigation sidebar.
   - For incremental features, wire new routes or panels into existing provider components.
2. **State**
   - Define atoms/selectors. Default state should be predictable and serializable.
   - Update provider hooks to orchestrate async work and state transitions.
3. **Services**
   - Extend existing API service classes under `src/services/frontdesk/api/`.
   - Real-time? Subscribe via `messaging-service.ts` and ensure cleanup in `useEffect` teardown.
4. **UI Components**
   - Reuse shared components when possible. If creating new ones, place them under `components/` with clear props and story-worthy defaults.
   - Keep styling consistent (Material-UI, theme tokens).
5. **Types & Contracts**
   - Define or update interfaces in provider `types/` folders or `src/interfaces/frontdesk/` if shared.

## Phase 4 – Documentation & Hand-off
- Update or cross-link existing docs when you introduce new behaviors.
- Mention architectural changes in `docs/frontdesk/FRONTDESK_ARCHITECTURE.md` or at least leave TODO markers for future doc pass.
- Leave breadcrumbs for QA: describe entry point, required feature flags, and risky areas.

## Guardrails for Junior Agents
- **Do not** bypass Recoil by using component-level state for shared data.
- **Do not** hardcode mocked data; rely on fixtures only inside tests.
- **Do not** mix provider concerns—keep DM logic out of Email, etc.
- Confirm you touched the minimal set of files and preserved TypeScript strictness level used in the module.

Tick every box here before you move on to the verification checklist.
