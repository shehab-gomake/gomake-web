# UI/UX & Design System

## Framework
-   **Material UI (MUI) v5**: Core component library.
-   **Icons**: `@mui/icons-material`, `@heroicons/react`.

## Design Principles
-   **Unified Interface**: Consistent look and feel across all providers (Chatwoot, Email, Internal).
-   **Density**: Information-dense views for efficiency.
-   **Feedback**: Loading states, Toast notifications (`snackbar`).
-   **Strict Styling Directive**: All new components MUST use the unified style system defined in `src/widgets/frontdesk/design-system`. Avoid raw `styled-components` or ad-hoc MUI styles if a design system primitive exists.

## Key UI Components
-   `ChatwootConversationList`: Virtualized list for performance.
-   `ChatwootMessageViewer`: Chat interface with bubbles, attachments.
-   `ChatwootDashboard`: Analytics view.
