# Repository Guidelines

## Project Structure & Module Organization
Code lives in `src`, with routable Next pages under `src/pages`. Shared UI and layout code sits in `src/components`, `src/pages-components`, `src/widgets`, and `src/layouts`, while providers and state live in `src/providers` and `src/store`. Utilities, services, enums, and shared assets use `src/utils`, `src/services`, `src/enums`, and `src/shared`; localization strings reside in `src/languages`. Static assets belong in `public/`, and project docs live in `docs/` and `frontdesk docs/`. Keep feature tests close to the code inside `__tests__` folders.

## Build, Test, and Development Commands
- `npm run dev` — Boot the Next.js dev server on port 3004.
- `npm run build` — Create the production bundle; run before releasing.
- `npm run start` — Serve the built app locally for smoke checks.
- `npm run lint` — Execute the shared ESLint rules; resolve warnings before commits.
- `npm run test` — Run Jest with coverage to mirror CI.
- `npm run test:ci` — Same suite in CI mode for pipelines.

## Coding Style & Naming Conventions
The project uses TypeScript with Next/ESLint defaults; stick to two-space indentation, semicolons, and single quotes within JSX props unless an API dictates otherwise. Use PascalCase for React components, prefix hooks with `use`, keep camelCase for functions and state, and kebab-case route folders. Leverage the `@/` path alias defined in `tsconfig.json`, co-locate component styles or reuse tokens from `src/styles`, and reuse helpers from `src/shared` before introducing new utilities.

## Testing Guidelines
Jest and React Testing Library cover unit and interaction tests; name files `*.test.ts` or `*.test.tsx` and place them in a nearby `__tests__` directory. Snapshot outputs live under `__snapshots__`; update them only when UI changes are intentional. Run `npm run test` before each PR and ensure coverage artifacts in `src/lcov-report` remain healthy.

## Commit & Pull Request Guidelines
History favors short, imperative summaries (e.g., `Add frontdesk provider hooks`), so follow that format and mention the scope touched. In PRs, provide a concise description, link any issue or ticket, record manual or automated tests, and attach screenshots or recordings for UI changes. Request review from the owning team and wait for green CI before merging.

## Environment & Configuration Tips
Use `.env.local` for secrets required by Next.js; never commit credentials. The provided `Dockerfile` and `compose.yaml` help mirror production—update port mappings or services there when adding dependencies. Route third-party keys through helpers in `src/config.ts` to keep environments aligned.
