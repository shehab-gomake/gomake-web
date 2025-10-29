# FrontDesk API Migration Plan: From Legacy to OpenAPI

This document outlines the comprehensive, A-to-Z plan for migrating the FrontDesk Direct Messages feature from the legacy API implementation to the new, OpenAPI-generated TypeScript client (`@/chatwoot`).

The core principle of this migration is a **staged, top-down replacement**. We will replace the data source first, then adapt the application's state, and finally update the UI. This ensures a methodical process with clear verification at each stage.

---

## Phase 1: Foundational Setup - The New Service Layer

**Goal:** Establish a single, reusable, and configured entry point for the new API.

1.  **Create the API Service File:**
    *   Create a new file: `src/services/frontdesk/api/chatwoot.service.ts`.
    *   This file will be responsible for initializing the generated API client with the correct configuration (base path, authentication, etc.).

2.  **Instantiate and Export the Client:**
    *   Inside the new file, import `Configuration` and the necessary API classes (e.g., `ConversationsApi`, `MessagesApi`, `ContactsApi`) from the `@/chatwoot` generated client.
    *   Create and export a singleton instance of the API client. This ensures the entire application uses one configured client.

    ```typescript
    // src/services/frontdesk/api/chatwoot.service.ts
    import { Configuration, ConversationsApi, MessagesApi } from '@/chatwoot';

    const config = new Configuration({
      basePath: process.env.NEXT_PUBLIC_CHATWOOT_API_URL,
      // ... other configurations like apiKey
    });

    export const chatwootConversationsApi = new ConversationsApi(config);
    export const chatwootMessagesApi = new MessagesApi(config);
    // ... export other API clients as needed
    ```

---

## Phase 2: Logic & State Migration - The `useDirectMessages` Hook

**Goal:** Gut the core data-fetching hook (`use-direct-messages.ts`) and rewire it to use the new `chatwoot` service. We will use temporary "adapter" functions to avoid breaking the entire UI at once.

1.  **Import the New Service:**
    *   In `src/widgets/frontdesk/providers/internal/hooks/use-direct-messages.ts`, import the new `chatwootConversationsApi` and other clients.

2.  **Create Temporary Data Mappers:**
    *   Inside the hook file, create temporary adapter functions to map the new API DTOs to the old types the application currently expects. This is the most critical step for an incremental migration.

    ```typescript
    // Temporary mappers inside use-direct-messages.ts
    import { Conversation as ChatwootConversation } from '@/chatwoot';
    import { Conversation as OldConversation } from '../types/direct-messages.types';

    const mapToOldConversation = (newConv: ChatwootConversation): OldConversation => ({
      id: newConv.id.toString(),
      type: 'DM', // Adjust as needed
      participantCount: newConv.meta?.assignee ? 2 : 1, // Example logic
      lastMessageAt: newConv.last_activity_at ? new Date(newConv.last_activity_at * 1000).toISOString() : undefined,
      name: newConv.meta?.sender?.name,
      isActive: newConv.status !== 'resolved',
      unreadCount: newConv.unread_count,
      members: [], // Populate this if needed
    });
    ```

3.  **Replace Data Fetching Logic (Method by Method):**
    *   **`loadConversations`**:
        *   Replace the `directMessagesService.listConversations()` call with `chatwootConversationsApi.conversationList()`.
        *   Use the `mapToOldConversation` adapter on the response data before calling `setConversations`.
    *   **`loadMessageHistory`**:
        *   Replace `directMessagesService.listMessages()` with `chatwootMessagesApi.listAllMessages()`.
        *   Create and use a `mapToOldMessage` adapter for the message data.
    *   **`createConversation`**:
        *   Replace `directMessagesService.createConversation()` with `chatwootConversationsApi.newConversation()`.
        *   Adapt the request payload and map the response.
    *   **Continue for all methods**: Repeat this "replace and map" process for `archiveConversation`, `favoriteConversation`, `addMembers`, `searchAllMessages`, etc.

---

## Phase 3: Full State & UI Modernization

**Goal:** Remove the temporary adapters and make the entire application natively use the new Chatwoot DTOs.

1.  **Update Recoil State:**
    *   Go to the atom definitions (`src/store/direct-messages/index.ts` or similar).
    *   Change the type definitions to use the DTOs from `@/chatwoot`.
    *   Example: `export const dmConversationsState = atom<Conversation[]>({ ... });` becomes `export const dmConversationsState = atom<ChatwootConversation[]>({ ... });`.
    *   Update all related atoms (`dmMessagesState`, etc.).

2.  **Update Recoil Selectors:**
    *   All selectors that depend on these atoms will now have TypeScript errors.
    *   Update the logic inside these selectors to work with the new DTO field names (e.g., `conversation.last_activity_at` instead of `conversation.lastMessageAt`).

3.  **Remove Adapters from Hook:**
    *   Go back to `use-direct-messages.ts` and delete the `mapToOld...` functions.
    *   The API calls should now directly pass the new DTOs to the Recoil state setters (`setConversations`, `setMessages`).

4.  **Update UI Components:**
    *   The UI will now be broken as components receive props with the new data shapes.
    *   Go through each component in `src/widgets/frontdesk/providers/internal/components/` (`ConversationListItem`, `MessageList`, `MessageBubble`, etc.).
    *   Update the props and internal rendering logic to use the new field names (e.g., `message.content_attributes` instead of `message.metadata`).

---

## Phase 4: Real-time & WebSocket Migration

**Goal:** Replace the legacy WebSocket service with the new real-time implementation.

1.  **Analyze New WebSocket Requirements:**
    *   Determine the connection endpoint, authentication method, and event structure for the new backend. This may not be part of the OpenAPI spec and might require separate documentation.

2.  **Update Connection Logic:**
    *   In `use-direct-messages.ts`, find the `connect` function.
    *   Replace the call to `directMessagesWebSocketService.connect()` with the new connection logic (e.g., using `socket.io-client` or a similar library).

3.  **Update Event Handlers:**
    *   The event names (`dm:newMessage`, `presence:update`) and their data payloads will be different.
    *   Update the event handlers (`handleNewMessage`, `handleStatusChanged`, etc.) to subscribe to the new events and correctly parse their new data structures.
    *   Ensure the logic inside these handlers correctly updates the Recoil state, which now holds the new Chatwoot DTOs.

4.  **Update Emitting Logic:**
    *   Update functions like `sendMessage` and `startTyping` to emit the correct events (`chatwootWebSocket.emit(...)`) with the new, expected payloads.

---

## Phase 5: Cleanup and Final Verification

**Goal:** Remove all legacy code and ensure the application is stable and correct.

1.  **Delete Obsolete Files:**
    *   Safely delete the following files, as they have been fully replaced:
        *   `src/services/frontdesk/api/direct-messages.service.ts`
        *   `src/services/frontdesk/websocket/direct-messages-websocket.service.ts`
        *   `src/widgets/frontdesk/providers/internal/types/direct-messages.types.ts`

2.  **Run Full Project Verification:**
    *   **Linting:** Run `npm run lint -- --fix` to ensure code style consistency.
    *   **Testing:** Run `npm run test`. This is a critical step. You will need to update mocks for the old `directMessagesService` to now mock the `chatwoot` API clients. Assertions will also need to be updated to check for the new data structures.
    *   **Build:** Run `npm run build` to catch any final TypeScript errors and ensure the project is production-ready.

3.  **Manual Testing:**
    *   Thoroughly test the Direct Messages feature in the browser, checking all functionalities: sending/receiving messages, creating conversations, searching, presence indicators, etc.
