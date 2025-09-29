# Maintenance & Bugfix Guide

Use this flow when stabilizing existing FrontDesk functionality.

## 1. Reproduce & Isolate
- Capture reproduction steps, environment (browser, tenant, feature flags), and data prerequisites.
- Determine which provider or shared layer is failing. Start from the widget entry and follow the call path.
- Log key Recoil atoms/selectors in DevTools (enable via `localStorage.setItem('FRONTDESK_DEBUG', 'true')`).

## 2. Triage the Layer
| Symptom | Likely Layer | What to Inspect |
|---------|--------------|-----------------|
| UI rendering / layout drift | `src/widgets/frontdesk/providers/*` or `layouts/` | JSX structure, Material-UI props, responsive breakpoints |
| Stale or missing data | Recoil atoms/selectors | Default values, selector dependencies, effects |
| REST failures | `src/services/api-service/frontdesk/` | Endpoint path, payload shape, auth headers |
| Real-time desync | `messaging-service.ts` & provider hooks | Socket subscriptions, cleanup, optimistic updates |

## 3. Debugging Toolkit
- Insert temporary `console.debug` statements gated by the `FRONTDESK_DEBUG` flag.
- Check WebSocket rooms and events (see [direct-messages-frontend.md](../direct-messages-frontend.md)).
- Use `npm run lint` to catch obvious mistakes before running heavier tests.

## 4. Fix Safely
- Adjust code in the smallest responsible module. Example: prefer updating an atom selector over rewriting the provider hook.
- Keep provider boundaries clean—no cross-provider imports unless it was already shared.
- When touching shared components, audit all providers for regressions.
- Update relevant tests or add coverage to prevent regressions.

## 5. Communicate
- Document the root cause and resolution in commit/ticket notes.
- If you uncover systemic issues (layout mismatch, missing shared component), note them in the Improvement Plan or open a follow-up task.

Remember: a focused, well-explained patch beats a sprawling rewrite.
