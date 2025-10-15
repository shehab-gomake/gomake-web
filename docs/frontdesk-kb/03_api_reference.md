# API Reference

This document provides a summary of the key REST API endpoints and WebSocket events for the FrontDesk feature.

## REST API

- **Authentication**: All endpoints require an `Authorization: Bearer <JWT>` header.

### Direct Messages
-   `GET /dms`: List conversations.
-   `POST /dms`: Create a new conversation.
-   `GET /dms/:id/messages`: Get messages for a specific conversation.
-   `POST /dms/:id/messages`: Send a message to a conversation.
-   `POST /dms/:id/read`: Mark a conversation as read.

### Tickets (V2)
-   `POST /tickets/create-from-conversation`: Create a ticket from any provider conversation.
-   `GET /tickets`: List tickets with filters.
-   `POST /tickets/:id/reply`: Reply to a ticket.
-   `PATCH /tickets/:id/status`: Update the status of a ticket.
-   `POST /tickets/:id/assign`: Assign a ticket to a user.

## WebSocket Events

- **Connection**: Connect to the `/messaging` namespace with the JWT in the `auth` object.
- **Rooms**: Join rooms (e.g., `joinConversation`, `joinChannel`) to receive targeted events.

### Direct Messages Events
-   **Emit**: `dm:sendMessage`, `dm:typingStart`, `dm:markAsRead`
-   **Listen**: `dm:messageConfirmed`, `dm:newMessage`, `dm:userTyping`, `dm:messageRead`

### Tickets Events
-   **Listen**: `ticket.created`, `ticket.assigned`, `ticket.status.changed`, `ticket.reply.sent`, `ticket.message.received`, `sla.breached`, and more (12+ events).
