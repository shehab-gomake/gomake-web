# Services Layer

The services layer is responsible for all communication with the backend, including REST API calls and WebSocket connections. It is located in `src/services/frontdesk/`.

## 1. REST APIs

-   **Location**: `src/services/frontdesk/api/`
-   **Description**: This directory contains service classes that encapsulate all REST API calls for the FrontDesk feature.
-   **Key Services**:
    -   `direct-messages.service.ts`: Handles API calls for the Internal (DM) provider.
    -   `tickets.service.ts`: Handles API calls for the Tickets provider.
    -   `notifications.service.ts`: Handles fetching and managing notifications.

## 2. WebSockets

-   **Location**: `src/services/frontdesk/websocket/`
-   **Description**: This directory contains services that manage the WebSocket connections for real-time communication.
-   **Key Services**:
    -   `messaging-socket.service.ts`: The core WebSocket service that other services build upon.
    -   `direct-messages-websocket.service.ts`: Handles real-time events for the Internal (DM) provider.
    -   `ticket-socket.service.ts`: Handles real-time events for the Tickets provider.
    -   `notifications-websocket.service.ts`: Handles real-time notifications.
