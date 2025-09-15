# Codebase Structure

## File Organization (from CLAUDE.md)

```
src/
  pages/               Route entries (.page.tsx), API routes under pages/api
  pages-components/    Page-specific, not reused
  components/          Reusable UI primitives (no domain logic)
  widgets/             Feature-level composed UI (uses components)
  layouts/             Page/app shells and structure
  providers/           Global contexts (theme, auth, i18n, SignalR)
  hooks/               Reusable behavior (state/effects, data hooks)
  store/               Recoil atoms/selectors (cross-page state)
  services/            IO: API clients, side effects (Axios, SignalR)
    api-service/       Endpoint definitions
    api-request.ts     Axios config & interceptors
  lib/                 Domain utilities/algorithms (pure)
  utils/               Small generic helpers
  interfaces/          Shared TS interfaces/types
  enums/               Shared enums
  languages/           i18n resources & setup
  icons/               SVG/icon components
  styles/              Global styles/tokens
  shared/              Cross-feature constants/assets
config.ts              App configuration
```

## Placement Rules
- **New route/page**: `src/pages/**.page.tsx` (+ items in `pages-components/` if page-specific)
- **Reusable UI**: `components/`
- **Feature UI composition**: `widgets/`
- **Global state**: `store/` (Recoil). Local view state stays in component
- **HTTP/side effects**: `services/` (never import UI from services)
- **Pure domain logic**: `lib/`. Small generic helpers → `utils/`
- **Contexts/providers**: `providers/`

## Import Aliases
- `@/` → `./src/` (always prefer alias)