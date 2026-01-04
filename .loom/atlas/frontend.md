# Frontend Architecture

## Tech Stack
-   **Framework**: Next.js 13.5.4 (App Router / Pages Router mixed - *Needs Verification*).
-   **Library**: React 18.
-   **Language**: TypeScript.
-   **State**: Recoil.
-   **Styling**: MUI v5 (`@mui/material`), `@emotion/react`, `@emotion/styled`, `styled-components`.

## Directory Structure (`src/widgets/frontdesk/providers/chatwoot`)
-   `components/`: UI Components (ConversationList, MessageViewer, etc.).
-   `hooks/`: Custom Hooks (Logic & State access).
-   `views/`: Page-level components (Dashboard, Inbox, Settings).
-   `utils/`: Helper functions.
-   `types/`: TypeScript interfaces.

## State Management Pattern
-   **Atoms**: Normalized state (e.g., `conversationsAtom`, `messagesAtom`).
-   **Selectors**: Derived state (e.g., `sortedConversationsSelector`).
-   **Optimistic Updates**: UI updates immediately, reverts on failure.

## Component Pattern
-   **Container/Presentational**: Separation of logic (hooks) and view (components).
-   **Composition**: Heavy use of component composition.
