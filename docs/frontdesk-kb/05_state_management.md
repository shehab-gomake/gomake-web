# State Management (Recoil)

FrontDesk uses [Recoil](https://recoiljs.org/) for all state management. This document provides an overview of the state structure.

## Core Principles

-   **Scoped by Provider**: All state is scoped by provider to ensure separation of concerns.
-   **Atoms for Raw State**: Recoil atoms are used to store the raw, source-of-truth state.
-   **Selectors for Derived State**: Recoil selectors are used for derived data, filtering, and aggregation.

## File Structure

-   **Atoms**: All atoms are located in `src/store/frontdesk/atoms/`. They are organized into files by provider (e.g., `email.atoms.ts`, `tickets.atoms.ts`).
-   **Selectors**: All selectors are located in `src/store/frontdesk/selectors/`.

## Key Atoms

-   `frontdesk.internal.conversations`: Stores the list of Direct Message conversations.
-   `frontdesk.internal.activeConversationId`: The ID of the currently selected DM conversation.
-   `frontdesk.email.accounts`: A list of connected email accounts.
-   `frontdesk.email.conversations`: The email conversations for the selected account.
-   `frontdesk.tickets.list`: The list of support tickets.
-   `frontdesk.tickets.selectedId`: The ID of the currently selected ticket.
-   `frontdesk.unified.conversations`: The aggregated list of conversations for the Unified Inbox.
-   `frontdesk.navigation.selectedChannel`: The currently selected channel in the navigation sidebar.

## Access Pattern

-   **Reading State**: Components should read state using the `useRecoilValue` hook.
-   **Updating State**: Business logic for updating state should be encapsulated within the provider hooks (e.g., `use-email-provider.ts`). Components should call functions from these hooks rather than using `useSetRecoilState` directly. This ensures that all state updates follow a consistent and predictable pattern.
