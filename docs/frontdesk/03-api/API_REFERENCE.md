# API Reference

This document provides a detailed overview of the API endpoints and WebSocket events for the Messaging Hub application. All endpoints require a valid JWT token sent in the `Authorization: Bearer <token>` header.

## API Endpoints

### Health & Profile

*Controller: `app.controller.ts`*

---

#### `GET /health`

*   **Description:** Checks the health of the application and its critical services (database, Redis).
*   **Usage:** Used for monitoring and health checks.
*   **Parameters:** None.
*   **Response (200 OK):**
    ```json
    {
      "status": "ok" | "degraded",
      "timestamp": "string (ISO 8601)",
      "services": {
        "database": "ok" | "error",
        "redis": "ok" | "error"
      }
    }
    ```

---

#### `GET /profile`

*   **Description:** Retrieves the profile of the currently authenticated user.
*   **Usage:** Used to get user information after login.
*   **Parameters:** None.
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "user": {
          "id": "string",
          "email": "string",
          "name": "string",
          "printHouseId": "string",
          "employeeId": "string",
          "roleId": "string"
        }
      }
    }
    ```

### Authentication & OAuth

*Controller: `auth.controller.ts`*

---

#### `GET /auth/oauth/google`

*   **Description:** Initiates the Google OAuth2 authentication process to link an email account.
*   **Response (200 OK):**
    ```json
    {
      "url": "string",
      "state": "string",
      "provider": "google"
    }
    ```

---

#### `GET /auth/oauth/google/callback`

*   **Description:** Handles the callback from Google after successful authentication. Exchanges the code for a token and connects the account.
*   **Query Parameters:**
    *   `code`: `string` - The authorization code from Google.
    *   `state`: `string` - The state parameter for CSRF protection.
*   **Response:** Redirects to `/auth/oauth/success` or `/auth/oauth/failure`.

---

#### `GET /auth/oauth/outlook`

*   **Description:** Initiates the Microsoft Outlook OAuth2 authentication process.
*   **Response (200 OK):**
    ```json
    {
      "url": "string",
      "state": "string",
      "provider": "microsoft"
    }
    ```

---

#### `GET /auth/oauth/outlook/callback`

*   **Description:** Handles the callback from Microsoft after successful authentication.
*   **Query Parameters:**
    *   `code`: `string` - The authorization code from Microsoft.
    *   `state`: `string` - The state parameter for CSRF protection.
*   **Response:** Redirects to `/auth/oauth/success` or `/auth/oauth/failure`.

### Channels

*Controller: `channels.controller.ts`*

---

#### `POST /channels`

*   **Description:** Creates a new channel.
*   **Request Body:** `CreateChannelDto`
    ```json
    {
      "name": "string",
      "description": "string (optional)",
      "isPublic": "boolean (optional)"
    }
    ```
*   **Response (201 Created):** The created channel object.

---

#### `GET /channels`

*   **Description:** Retrieves all channels for the user's organization.
*   **Response (200 OK):** An array of channel objects.

---

#### `GET /channels/:id`

*   **Description:** Retrieves a single channel by its ID.
*   **Path Parameters:**
    *   `id`: `string` - The ID of the channel.
*   **Response (200 OK):** The channel object.

---

#### `GET /channels/:id/members`

*   **Description:** Lists the members of a channel.
*   **Path Parameters:**
    *   `id`: `string` - The ID of the channel.
*   **Response (200 OK):** An array of user objects.

---

#### `POST /channels/:id/join`

*   **Description:** Joins the current user to a channel.
*   **Path Parameters:**
    *   `id`: `string` - The ID of the channel.
*   **Response (200 OK):** A confirmation message.

---

#### `POST /channels/:id/leave`

*   **Description:** Removes the current user from a channel.
*   **Path Parameters:**
    *   `id`: `string` - The ID of the channel.
*   **Response (200 OK):** A confirmation message.

---

#### `POST /channels/:id/messages`

*   **Description:** Sends a message to a channel.
*   **Path Parameters:**
    *   `id`: `string` - The ID of the channel.
*   **Request Body:** `CreateMessageDto`
    ```json
    {
      "content": "string",
      "parentId": "string (UUID, optional)",
      "metadata": "object (optional)"
    }
    ```
*   **Response (201 Created):** The created message object.

### Direct Messages (DMs)

*Controller: `direct-messages.controller.ts`*

---

#### `POST /dms`

*   **Description:** Creates a new direct message conversation.
*   **Request Body:** `CreateConversationDto`
    ```json
    {
      "participantIds": ["string (UUID)"],
      "name": "string (optional)",
      "contextId": "string (optional)",
      "contextType": "string (optional)"
    }
    ```
*   **Response (201 Created):** The created conversation object.

---

#### `GET /dms`

*   **Description:** Lists all DM conversations for the current user.
*   **Query Parameters:** `ListConversationsDto`
    *   `includeArchived`: `boolean` (optional)
    *   `limit`: `number` (optional)
    *   `offset`: `number` (optional)
*   **Response (200 OK):** An array of conversation objects.

---

#### `GET /dms/:id`

*   **Description:** Retrieves a single DM conversation.
*   **Path Parameters:**
    *   `id`: `string` - The ID of the conversation.
*   **Response (200 OK):** The conversation object.

---

#### `GET /dms/:id/messages`

*   **Description:** Lists messages in a conversation.
*   **Path Parameters:**
    *   `id`: `string` - The ID of the conversation.
*   **Query Parameters:** `ListMessagesDto`
    *   `before`: `string` (optional, message ID for cursor pagination)
    *   `after`: `string` (optional, message ID for cursor pagination)
    *   `limit`: `number` (optional, min: 1)
*   **Response (200 OK):** An array of message objects.

---

#### `POST /dms/:id/messages`

*   **Description:** Sends a message to a conversation.
*   **Path Parameters:**
    *   `id`: `string` - The ID of the conversation.
*   **Request Body:** `SendDirectMessageDto`
    ```json
    {
      "content": "string",
      "metadata": "object (optional)",
      "tempId": "string (optional)"
    }
    ```
*   **Response (201 Created):** The created message object.

---

#### `POST /dms/:id/read`

*   **Description:** Marks a conversation as read.
*   **Path Parameters:**
    *   `id`: `string` - The ID of the conversation.
*   **Request Body:** `MarkReadDto`
    ```json
    {
      "lastReadMessageId": "string (optional)",
      "lastReadAt": "string (ISO 8601, optional)"
    }
    ```
*   **Response (200 OK):** A confirmation message.

---

#### `POST /dms/:id/archive` / `POST /dms/:id/unarchive`

*   **Description:** Archives or unarchives a conversation for the current user.
*   **Response (200 OK):** The updated conversation member object.

---

#### `POST /dms/:id/favorite` / `POST /dms/:id/unfavorite`

*   **Description:** Favorites or unfavorites a conversation for the current user.
*   **Response (200 OK):** The updated conversation member object.

---

#### `POST /dms/:id/leave`

*   **Description:** The current user leaves a conversation.
*   **Response (200 OK):** A confirmation message.

---

#### `POST /dms/:id/add-members`

*   **Description:** Adds members to a conversation.
*   **Request Body:** `AddMembersDto`
    ```json
    {
      "participantIds": ["string (UUID)"]
    }
    ```
*   **Response (200 OK):** The updated conversation object.

### Email Integration

*Controller: `email.controller.ts`*

---

#### `GET /email/accounts`

*   **Description:** Lists all connected email accounts for the current user.
*   **Response (200 OK):** An array of email account objects.

---

#### `GET /email/accounts/:accountId/profile`

*   **Description:** Retrieves the profile for a specific email account.
*   **Response (200 OK):** The account profile object.

---

#### `GET /email/accounts/:accountId/labels`

*   **Description:** Retrieves the labels (e.g., folders) for an email account.
*   **Response (200 OK):** An array of label objects.

---

#### `GET /email/accounts/:accountId/messages`

*   **Description:** Lists messages (conversations) for an email account.
*   **Query Parameters:** `ListParams`
    *   `limit`: `number` (optional)
    *   `pageToken`: `string` (optional)
    *   `query`: `string` (optional, e.g., "from:boss@example.com")
*   **Response (200 OK):** A paginated list of message objects.

---

#### `GET /email/accounts/:accountId/conversations/:conversationId`

*   **Description:** Retrieves the details of a single email conversation.
*   **Response (200 OK):** The conversation detail object.

---

#### `POST /email/accounts/:accountId/send`

*   **Description:** Sends an email from a connected account.
*   **Request Body:** `SendEmailDto`
    ```json
    {
      "to": ["string (email)"],
      "cc": ["string (email, optional)"],
      "bcc": ["string (email, optional)"],
      "subject": "string (optional)",
      "text": "string",
      "html": "string (optional)",
      "replyToMessageId": "string (optional)",
      "threadId": "string (optional)"
    }
    ```
*   **Response (200 OK):** The sent email object.

---

#### `DELETE /email/accounts/:accountId`

*   **Description:** Disconnects an email account.
*   **Response (200 OK):** `{ "success": true, "message": "..." }`

### Messages

*Controller: `messages.controller.ts`*

---

#### `GET /messages`

*   **Description:** Retrieves messages, optionally filtered by channel.
*   **Query Parameters:**
    *   `channelId`: `string` (optional)
    *   `limit`: `string` (optional, parsed as number)
    *   `offset`: `string` (optional, parsed as number)
*   **Response (200 OK):** An array of message objects.

---

#### `GET /messages/:id`

*   **Description:** Retrieves a single message by its ID.
*   **Response (200 OK):** The message object.

---

#### `PATCH /messages/:id`

*   **Description:** Updates a message.
*   **Request Body:** `UpdateMessageDto`
    ```json
    {
      "content": "string (optional)",
      "metadata": "object (optional)",
      "status": "string (enum, optional)",
      "errorMessage": "string (optional)"
    }
    ```
*   **Response (200 OK):** The updated message object.

---

#### `DELETE /messages/:id`

*   **Description:** Deletes a message.
*   **Response (200 OK):** A confirmation message.

### Users

*Controller: `users.controller.ts`*

---

#### `GET /users/search`

*   **Description:** Searches for users within the same organization.
*   **Query Parameters:** `SearchUsersDto`
    *   `q`: `string` (optional, search query)
    *   `limit`: `number` (optional, default: 10, max: 50)
    *   `offset`: `number` (optional, default: 0)
    *   `onlineOnly`: `boolean` (optional, default: false)
*   **Response (200 OK):** `UserSearchResult` object.

## WebSocket Events

The WebSocket gateway is available at the `/messaging` namespace.

*This section remains largely the same as the previous analysis, as the gateway's public-facing contract was already well-defined in the code. The detailed analysis confirmed the payloads and events.*

---

### Connection

*   **Event:** `connection`
*   **Description:** A client connects and authenticates with a JWT. The server joins the client to `org:<printHouseId>` and `user:<userId>` rooms and updates their presence to "online".

---

### Channel Messaging

*   **`sendMessage` (Client → Server):** `{ channelId, content, parentId?, tempId? }`
*   **`newMessage` (Server → Client):** Broadcasts the new message to the channel room.
*   **`messageConfirmed` (Server → Client):** Confirms message receipt to the sender.
*   **`joinChannel` / `leaveChannel` (Client → Server):** `{ channelId }`
*   **`typingStart` / `typingStop` (Client → Server):** `{ channelId }`
*   **`userTyping` (Server → Client):** Broadcasts typing status.

---

### Direct Messaging (DM)

*   **`joinConversation` (Client → Server):** `{ conversationId }`
*   **`dm:sendMessage` (Client → Server):** `{ conversationId, content, tempId?, metadata? }`
*   **`dm:newMessage` (Server → Client):** Broadcasts the new message to the conversation room.
*   **`dm:messageConfirmed` (Server → Client):** Confirms message receipt to the sender.
*   **`dm:conversationUpdated` (Server → Client):** Notifies of updates like a new last message.
*   **`dm:typingStart` / `dm:typingStop` (Client → Server):** `{ conversationId }`
*   **`dm:userTyping` (Server → Client):** Broadcasts typing status.
*   **`dm:markAsRead` (Client → Server):** `{ conversationId, lastReadMessageId?, lastReadAt? }`
*   **`dm:messageRead` (Server → Client):** Broadcasts read receipt.

---

### Presence

*   **`getPresence` (Client → Server):** `{ userIds?: string[] }`
*   **`heartbeat` (Client → Server):** No payload.
*   **`updateStatus` (Client → Server):** `{ status: string }`
*   **`statusChanged` (Server → Client):** Broadcasts status change to the organization.
