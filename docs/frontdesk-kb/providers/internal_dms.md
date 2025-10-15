# Internal (Direct Messages) Provider

The Internal provider, also known as Direct Messages (DMs), is a real-time chat feature for internal communication. It has a sophisticated, multi-hook architecture designed for maintainability and performance.

-   **Status**: ✅ **Fully Integrated**
-   **Key Files**:
    -   `hooks/use-internal-provider.ts` (Orchestrator)
    -   `hooks/use-conversations.ts` (Logic)
    -   `hooks/use-messages.ts` (Logic)
    -   `direct-messages-provider-view.tsx` (UI)

## 1. Architecture: Orchestrator and Focused Hooks

The business logic for the DM provider is broken down into a series of small, focused hooks, each with a single responsibility. A main "orchestrator" hook, `useInternalProvider`, then composes these smaller hooks to provide a clean, unified interface to the UI.

This pattern avoids a single, monolithic hook and makes the code easier to test, debug, and maintain.

### The Orchestrator (`useInternalProvider.ts`)

This hook is the single entry point for the UI. It imports all the focused hooks and returns a curated set of state and functions.

### Focused Hooks:

-   **`useConnectionManager.ts`**: Manages the WebSocket connection lifecycle, status, and error handling.
-   **`useConversations.ts`**: Manages the list of conversations, including fetching, creating, selecting, archiving, and favoriting.
-   **`useMessages.ts`**: Manages the messages for the active conversation, including fetching history (with pagination), sending new messages (with optimistic updates), and handling real-time message events.
-   **`usePresence.ts`**: Manages user presence (online status) and typing indicators.
-   **`useDrafts.ts`**: Manages message drafts for each conversation.
-   **`useConversationSearch.ts`**: Handles the logic for both global and in-conversation search.
-   **`useParticipants.ts`**: Manages fetching user suggestions for creating new conversations.

## 2. The `DirectMessagesProviderView` Component

This is the main UI component for the DM provider. It renders a three-pane layout:

1.  **Left Pane (`ConversationSidebar`)**: Displays the list of conversations, managed by `use-conversations.ts`.
2.  **Center Pane (`Panel`)**: Displays the active conversation's header, message list, and message input. This is primarily managed by `use-messages.ts`.
3.  **Right Pane (`UserPresence`)**: Displays a list of online users, managed by `use-presence.ts`.

The view is a "dumb" component that primarily consumes the state and functions provided by the `useInternalProvider` hook.

## 3. Key Features & Implementation

-   **Real-time Communication**: All real-time functionality is handled via WebSockets. The `useConnectionManager` hook establishes the connection, and other hooks like `useMessages` and `usePresence` listen for specific events.
-   **Optimistic Updates**: When a user sends a message, it is added to the UI instantly with a temporary ID. The `useMessages` hook then handles the `dm:messageConfirmed` WebSocket event to replace the temporary message with the permanent one from the server. This makes the UI feel fast and responsive.
-   **Code Splitting**: The focused hook architecture allows for potential code splitting, where less critical logic (like conversation search) could be loaded on demand.