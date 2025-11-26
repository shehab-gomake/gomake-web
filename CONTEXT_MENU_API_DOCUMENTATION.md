# Chatwoot Context Menu API Documentation

This document describes the right-click context menus available in Chatwoot for conversations and messages, including all menu items and their corresponding API endpoints.

## Table of Contents

1. [Conversation Context Menu](#conversation-context-menu)
2. [Message Context Menu](#message-context-menu)
3. [API Endpoints Reference](#api-endpoints-reference)

---

## Conversation Context Menu

When you right-click on a conversation card in the conversation list, the following menu appears:

### Menu Items

#### 1. **Mark as Read / Mark as Unread**
- **Display Logic**: Shows "Mark as unread" if conversation has no unread messages; shows "Mark as read" if it has unread messages
- **Icon**: `mail` (read) / `mail-unread` (unread)
- **Action**: Toggles the read/unread status of the conversation
- **API Endpoint**: 
  - **Mark as Read**: `POST /api/accounts/conversations/{conversation_id}/update_last_seen`
  - **Mark as Unread**: `POST /api/accounts/conversations/{conversation_id}/unread`

#### 2. **Status Actions** (Separator)
- **Resolved**: Changes conversation status to "resolved"
  - **Icon**: `checkmark`
  - **Shown**: Only if conversation status is not already "resolved"
- **Reopen**: Changes conversation status to "open"
  - **Icon**: `arrow-redo`
  - **Shown**: Only if conversation status is not "open"
- **Pending**: Changes conversation status to "pending"
  - **Icon**: `book-clock`
  - **Shown**: Only if conversation status is not "pending"
- **API Endpoint**: `POST /api/accounts/conversations/{conversation_id}/toggle_status`
  - **Request Body**:
    ```json
    {
      "status": "resolved" | "open" | "pending" | "snoozed",
      "snoozed_until": null | "ISO8601 datetime string"
    }
    ```

#### 3. **Snooze**
- **Icon**: `snooze`
- **Display Logic**: Only shown when conversation status is "open"
- **Action**: Opens a snooze dialog (via command palette) to set a snooze time
- **API Endpoint**: `POST /api/accounts/conversations/{conversation_id}/toggle_status`
  - **Request Body**:
    ```json
    {
      "status": "snoozed",
      "snoozed_until": "ISO8601 datetime string"
    }
    ```

#### 4. **Priority** (Submenu)
- **Icon**: `warning`
- **Options**:
  - **None**: Removes priority (sets to `null`)
  - **Urgent**: Sets priority to "urgent"
  - **High**: Sets priority to "high"
  - **Medium**: Sets priority to "medium"
  - **Low**: Sets priority to "low"
- **Display Logic**: Current priority is excluded from the options list
- **API Endpoint**: `POST /api/accounts/conversations/{conversation_id}/toggle_priority`
  - **Request Body**:
    ```json
    {
      "priority": "urgent" | "high" | "medium" | "low" | null
    }
    ```

#### 5. **Assign Label** (Submenu)
- **Icon**: `tag`
- **Display Logic**: Shows all available labels for the account
- **Action**: Clicking a label adds it to the conversation (overwrites existing labels)
- **API Endpoint**: `POST /api/accounts/conversations/{conversation_id}/labels`
  - **Request Body**:
    ```json
    {
      "labels": ["label1", "label2", "label3"]
    }
    ```
  - **Note**: This endpoint **overwrites** existing labels. To add a label without removing others, you need to fetch current labels first, add the new one, and send the complete list.

#### 6. **Assign Agent** (Submenu)
- **Icon**: `person-add`
- **Display Logic**: Shows all assignable agents for the conversation's inbox
- **Options**: 
  - **None**: Unassigns agent (sets `assignee_id` to `null`)
  - **Agent List**: Shows all agents available for the inbox, sorted by availability status
- **API Endpoint**: `POST /api/accounts/conversations/{conversation_id}/assignments?assignee_id={agent_id}`
  - **Query Parameters**:
    - `assignee_id`: The agent ID (or omit/use `null` to unassign)
  - **Request Body**: Empty object `{}`

#### 7. **Assign Team** (Submenu)
- **Icon**: `people-team-add`
- **Display Logic**: Shows all teams in the account
- **Action**: Assigns the conversation to a team
- **API Endpoint**: `POST /api/accounts/conversations/{conversation_id}/assignments`
  - **Request Body**:
    ```json
    {
      "team_id": 123
    }
    ```
  - **Note**: Send `team_id: null` or omit to unassign team

#### 8. **Open in New Tab**
- **Icon**: `open`
- **Action**: Opens the conversation in a new browser tab
- **No API Call**: Pure client-side action
- **URL Format**: `{hostURL}/app/accounts/conversations/{conversation_id}`

#### 9. **Copy Conversation Link**
- **Icon**: `copy`
- **Action**: Copies the conversation URL to clipboard
- **No API Call**: Pure client-side action
- **URL Format**: `{hostURL}/app/accounts/conversations/{conversation_id}`

#### 10. **Delete Conversation** (Admin Only)
- **Icon**: `delete`
- **Display Logic**: Only visible to admin users (`isAdmin` check)
- **Action**: Deletes the conversation (soft delete via background job)
- **API Endpoint**: `DELETE /api/accounts/conversations/{conversation_id}`
  - **Note**: This triggers a background job (`DeleteObjectJob`) to handle deletion

---

## Message Context Menu

When you right-click on a message within a conversation, the following menu appears:

### Menu Items

#### 1. **Reply To**
- **Icon**: `arrow-reply`
- **Display Logic**: Only shown for:
  - Non-private messages
  - Messages from inboxes that support reply-to (`inboxSupportsReplyTo.outgoing`)
  - Messages that are not failed or processing
- **Action**: Sets the message as reply target and focuses the reply input
- **No API Call**: Stores reply target in localStorage, emits event to toggle reply UI

#### 2. **Copy**
- **Icon**: `clipboard`
- **Display Logic**: Only shown if message has text content
- **Action**: Copies the plain text content of the message to clipboard
- **No API Call**: Pure client-side action

#### 3. **Translate**
- **Icon**: `translate`
- **Display Logic**: Only shown if:
  - Message is not failed or processing
  - Message is not deleted
  - Message has text content
- **Action**: Translates the message to the account's default locale
- **API Endpoint**: `POST /api/accounts/conversations/{conversation_id}/messages/{message_id}/translate`
  - **Request Body**:
    ```json
    {
      "target_language": "en" | "es" | "fr" | ... (locale code)
    }
    ```
  - **Response**: 
    ```json
    {
      "content": "Translated message content"
    }
    ```

#### 4. **Copy Permalink**
- **Icon**: `link`
- **Display Logic**: Shown for all messages except failed/processing ones
- **Action**: Copies a direct link to the specific message
- **No API Call**: Pure client-side action
- **URL Format**: `{hostURL}/app/accounts/conversations/{conversation_id}?messageId={message_id}`

#### 5. **Create a Canned Response**
- **Icon**: `comment-add`
- **Display Logic**: Only shown for:
  - Outgoing messages
  - Messages with text content
  - Messages that are not deleted
- **Action**: Opens a modal to create a canned response from the message content
- **No API Call**: Opens modal, API call happens when user saves the canned response

#### 6. **Delete**
- **Icon**: `delete`
- **Display Logic**: Only shown if:
  - Message has text or attachments
  - Message is not failed or processing
  - Message is not already deleted
- **Action**: Shows confirmation modal, then deletes the message
- **API Endpoint**: `DELETE /api/accounts/conversations/{conversation_id}/messages/{message_id}`
  - **Note**: This soft-deletes the message by updating its content to "[deleted]" and removing attachments

---

## API Endpoints Reference

### Base URL Pattern
All endpoints follow this pattern:
```
/api/accounts/conversations/{conversation_id}/...
```

### Authentication
All endpoints require authentication via:
- User API key (header: `api_access_token`)
- Session cookie (for browser-based requests)

### Endpoint Details

#### Conversation Status
```
POST /api/accounts/conversations/{conversation_id}/toggle_status
```
**Request Body:**
```json
{
  "status": "open" | "resolved" | "pending" | "snoozed",
  "snoozed_until": null | "2024-12-31T23:59:59Z"  // ISO8601 format, required for snoozed status
}
```
**Response:** `200 OK` (empty body)

#### Conversation Priority
```
POST /api/accounts/conversations/{conversation_id}/toggle_priority
```
**Request Body:**
```json
{
  "priority": "urgent" | "high" | "medium" | "low" | null
}
```
**Response:** `200 OK` (empty body)

#### Mark as Read
```
POST /api/accounts/conversations/{conversation_id}/update_last_seen
```
**Request Body:** None (empty)
**Response:** `200 OK` (empty body)

#### Mark as Unread
```
POST /api/accounts/conversations/{conversation_id}/unread
```
**Request Body:** None (empty)
**Response:** `200 OK` (empty body)

#### Assign Agent
```
POST /api/accounts/conversations/{conversation_id}/assignments?assignee_id={agent_id}
```
**Query Parameters:**
- `assignee_id`: Agent ID (number) or omit/null to unassign
**Request Body:** Empty object `{}`
**Response:** `200 OK` with agent object or `null`

#### Assign Team
```
POST /api/accounts/conversations/{conversation_id}/assignments
```
**Request Body:**
```json
{
  "team_id": 123  // number or null to unassign
}
```
**Response:** `200 OK` with team object or `null`

#### Add/Update Labels
```
POST /api/accounts/conversations/{conversation_id}/labels
```
**Request Body:**
```json
{
  "labels": ["support", "billing", "urgent"]  // Array of label names (strings)
}
```
**Important:** This endpoint **overwrites** existing labels. To add a label without removing others:
1. Get current labels: `GET /api/accounts/conversations/{conversation_id}/labels`
2. Append new label to the array
3. Send complete array via POST

**Response:** `200 OK` with labels object:
```json
{
  "labels": ["support", "billing", "urgent"]
}
```

#### Delete Conversation
```
DELETE /api/accounts/conversations/{conversation_id}
```
**Request Body:** None
**Response:** `200 OK` (empty body)
**Note:** Triggers background job for deletion

#### Translate Message
```
POST /api/accounts/conversations/{conversation_id}/messages/{message_id}/translate
```
**Request Body:**
```json
{
  "target_language": "en"  // ISO 639-1 language code
}
```
**Response:** `200 OK`
```json
{
  "content": "Translated message content"
}
```

#### Delete Message
```
DELETE /api/accounts/conversations/{conversation_id}/messages/{message_id}
```
**Request Body:** None
**Response:** `200 OK` (empty body)
**Note:** Soft-deletes the message (updates content to "[deleted]" and removes attachments)

---

## Frontend Implementation Notes

### Conditional Display Logic

The context menus use conditional logic to show/hide options based on:

1. **Conversation Status**: Options that would set the same status are hidden
2. **Message State**: Failed/processing/deleted messages have limited options
3. **User Permissions**: Delete conversation requires admin role
4. **Inbox Capabilities**: Some options depend on inbox type (e.g., reply-to support)
5. **Content Type**: Options requiring text content are hidden for media-only messages

### Event Flow

1. User right-clicks → `@contextmenu` event handler
2. Component checks if context menu should be shown (skips if text selected, or element has `skip-context-menu` class)
3. Menu position calculated from mouse coordinates (`pageX`, `pageY`)
4. Menu rendered with enabled options based on conditional logic
5. User clicks menu item → emits event or dispatches Vuex action
6. Vuex action calls API service
7. API service makes HTTP request
8. Response triggers state update and UI refresh

### State Management

- **Vuex Store**: `app/javascript/dashboard/store/modules/conversations/actions.js`
- **API Service**: `app/javascript/dashboard/api/inbox/conversation.js`
- **Components**: 
  - Conversation menu: `app/javascript/dashboard/components/widgets/conversation/contextMenu/Index.vue`
  - Message menu: `app/javascript/dashboard/modules/conversations/components/MessageContextMenu.vue`

---

## Error Handling

All endpoints return standard HTTP status codes:
- `200 OK`: Success
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Conversation/message not found
- `422 Unprocessable Entity`: Validation error

Error responses follow this format:
```json
{
  "error": "Error message description"
}
```

---

## Testing Endpoints

You can test these endpoints using:
- **Postman/Insomnia**: Use account-scoped URL with API key
- **Browser DevTools**: Monitor network requests when using context menu
- **cURL**: 
  ```bash
  curl -X POST "https://your-instance.com/api/accounts/1/conversations/123/toggle_status" \
    -H "api_access_token: your-api-key" \
    -H "Content-Type: application/json" \
    -d '{"status": "resolved"}'
  ```

---

## Version Information

- **Documentation Version**: 1.0
- **Chatwoot Version**: Based on current codebase
- **Last Updated**: 2024

---

## Additional Resources

- [Chatwoot API Documentation](https://www.chatwoot.com/docs/product/api-reference)
- [Swagger/OpenAPI Specs](swagger/swagger.json)
- [Vuex Store Implementation](app/javascript/dashboard/store/modules/conversations/)

