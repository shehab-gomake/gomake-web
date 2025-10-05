# Verification Checklists

Run these before handing work off for review. Adapt as needed per ticket.

## A. New Feature / Enhancement
- [ ] Local build runs: `npm run dev` (ensure feature loads without console errors).
- [ ] Lint clean: `npm run lint`.
- [ ] Tests passing: `npm run test` (add focused tests where logic changed).
- [ ] Provider navigation: new entry appears and routes correctly.
- [ ] Recoil state: atoms/selectors initialized with safe defaults; DevTools shows expected values.
- [ ] REST calls: verify happy path via Network tab/Postman using documented endpoints.
- [ ] WebSocket flows (if applicable): send, confirm, and receive events behave per provider contract.
- [ ] Accessibility basics: keyboard navigation, focus states, aria labels on interactive controls.
- [ ] Docs updated: cross-links added/updated in FrontDesk docs.

## B. Bugfix / Maintenance Patch
- [ ] Reproduction validated pre-fix and post-fix.
- [ ] Regression scan across related providers (search for shared component usage).
- [ ] Added tests guard the regressed behavior (unit, integration, or e2e as available).
- [ ] Logging cleaned up—no stray debug statements.
- [ ] `git diff` limited to intentional files; no unrelated formatting churn.
- [ ] Notes recorded in ticket (root cause + fix summary).

## C. Release Prep (if part of milestone)
- [ ] Changelog entry or release note stub.
- [ ] Feature flags toggled and documented.
- [ ] Screenshots or short Loom for UX validation, when applicable.

Failing any item means you are not done—loop back until everything checks out.
