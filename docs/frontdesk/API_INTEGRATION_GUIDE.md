# FrontDesk API Integration Guide

This guide provides detailed instructions for integrating with the Frontdesk REST APIs and WebSocket service.

## Table of Contents
1. [Authentication](#authentication)
2. [Email Provider API](#email-provider-api)
3. [Direct Messages API](#direct-messages-api)
4. [WebSocket Service](#websocket-service)

---

## 1. Authentication

All API endpoints and the WebSocket connection are protected. You must include a valid JWT in the `Authorization` header of every request.

**Example Header:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

For WebSocket connections, the token should be passed in the `auth` object during initialization.

---

## 2. Email Provider API

The Email Provider API allows connecting and managing email accounts.

### Connecting a New Email Account

This is a three-step OAuth2 flow.

**Step 1: Get the Google Authentication URL**
Request a unique authentication URL from the backend.

*   **Endpoint:** `GET /auth/oauth/google`
*   **Method:** `GET`
*   **Response:**
    ```json
    {
        "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&state=...",
        "state": "...",
        "provider": "gmail"
    }
    ```

**Step 2: Redirect User to Google**
Redirect the user to the `url` received from the backend.

**Step 3: Handle the Redirect Back**
Google redirects the user back to the backend, which handles the token exchange. The user is then redirected to a success or failure page. Your application does not need to handle the callback from Google directly.

### Interacting with Email Accounts

**List All Connected Accounts**
*   **Endpoint:** `GET /email/accounts`
*   **Method:** `GET`
*   **Response:** An array of account objects.

**Reading Messages (Conversations)**
*   **Endpoint:** `GET /email/accounts/:accountId/messages`
*   **Method:** `GET`
*   **URL Parameters:**
    *   `:accountId` (required): The ID of the email account.
*   **Query Parameters:** `limit`, `pageToken`, `query`.

**Sending an Email**
*   **Endpoint:** `POST /email/accounts/:accountId/send`
*   **Method:** `POST`
*   **URL Parameters:**
    *   `:accountId` (required): The ID of the email account to send from.
*   **Request Body:**
    ```json
    {
      "to": "recipient@example.com",
      "subject": "Hello from the API",
      "html": "<p>This is the <b>HTML</b> body of the email.</p>",
      "text": "This is the plain text body of the email."
    }
    ```

---

## 3. Direct Messages API

This information is sourced from the `direct-messages-frontend.md` guide.

*For a complete guide, please refer to `docs/frontdesk/direct-messages-frontend.md`.*

---

## 4. WebSocket Service

The WebSocket service provides real-time features like messaging, presence, and typing indicators.

### Connection Setup

```typescript
import { io, Socket } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000'; // Your server URL
const authToken = 'your-jwt-token-here';

const socket: Socket = io(`${SERVER_URL}/messaging`, {
  auth: {
    token: authToken
  },
  transports: ['websocket', 'polling']
});

socket.on('connect', () => console.log('Connected to messaging service'));
socket.on('disconnect', (reason) => console.log('Disconnected:', reason));
```

### Core Events

**Sending Messages**
*   **Event:** `sendMessage`
*   **Payload:**
    ```json
    {
      "channelId": "channel-123",
      "content": "Hello world!",
      "recipientId": "user-456" // Optional: for direct messages
    }
    ```

**Receiving Messages**
*   **Event:** `newMessage` / `directMessage`
*   **Payload:**
    ```json
    {
      "channelId": "channel-123",
      "content": "Hello world!",
      "userId": "user-123",
      "userName": "John Doe",
      "timestamp": "ISO_DATE_STRING"
    }
    ```

**Joining a Channel**
*   **Event:** `joinChannel`
*   **Payload:** `{ "channelId": "channel-123" }`

**Typing Indicators**
*   **Events:** `typingStart`, `typingStop`
*   **Payload:** `{ "channelId": "channel-123" }`
*   **Listen for:** `userTyping`

**Presence**
*   **Event to get presence:** `getPresence`
*   **Payload:** `{ "userIds": ["user-123"] }` (optional)
*   **Listen for:** `userOnline`, `userOffline`, `statusChanged`

**Read Receipts**
*   **Event:** `markAsRead`
*   **Payload:** `{ "messageId": "message-123" }`
*   **Listen for:** `messageRead`
