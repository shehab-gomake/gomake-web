# Real-time Architecture (WebSockets)

The FrontDesk feature relies heavily on WebSockets for its real-time capabilities. This document provides an overview of the WebSocket architecture.

## 1. Core Service (`messaging-socket.service.ts`)

-   **Location**: `src/services/frontdesk/websocket/messaging-socket.service.ts`
-   **Description**: This is the foundational WebSocket service. It is a singleton that manages the main socket connection, authentication, and provides a base for other, more specific WebSocket services.

## 2. Feature-Specific Services

Building on the core service, there are feature-specific services that handle the logic for different parts of the FrontDesk feature.

-   **`direct-messages-websocket.service.ts`**: Manages all real-time events for the Internal (DM) provider, such as sending and receiving messages, typing indicators, and presence updates.
-   **`ticket-socket.service.ts`**: Manages the **19+ real-time events** for the Tickets provider. This is the most complex real-time service, handling everything from `ticket.created` to `message.delivered`.
-   **`notifications-websocket.service.ts`**: A dedicated service for handling real-time notifications across the entire FrontDesk feature.

## 3. Connection and Authentication

-   The connection is established by the main provider hooks (e.g., `use-tickets-provider.ts`).
-   Authentication is handled by passing the user's JWT to the `connect` method of the socket service. The backend uses this token to associate the connection with the user.

## 4. Event Handling

-   **Listening for Events**: The provider hooks are responsible for registering listeners for incoming WebSocket events (e.g., `ticketSocketService.onTicketCreated(...)`).
-   **Updating State**: When an event is received, the handler updates the central Recoil state. This automatically triggers a re-render in any components that are subscribed to that piece of state, ensuring the UI is always up-to-date.
-   **Emitting Events**: To send data to the server (e.g., sending a message), the hooks call methods on the socket services (e.g., `directMessagesWebSocketService.sendMessage(...)`).
