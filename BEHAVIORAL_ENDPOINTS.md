# Chatwoot Behavioral Endpoints Guide

This document provides a comprehensive list of all behavioral endpoints that the frontend sends when users perform actions in Chatwoot. These endpoints track user interactions, update statuses, and synchronize state across the application.

---

## Table of Contents

1. [Conversation Endpoints](#conversation-endpoints)
2. [Message Endpoints](#message-endpoints)
3. [Notification Endpoints](#notification-endpoints)
4. [Typing Indicators](#typing-indicators)
5. [When These Endpoints Are Called](#when-these-endpoints-are-called)

---

## Conversation Endpoints

### Read/Unread Status

#### 1. Mark Conversation as Read
**Endpoint:** `POST /api/accounts/{account_id}/conversations/{conversation_id}/update_last_seen`  
**When:** 
- User opens/clicks on a conversation
- User views the conversation thread
- Automatically triggered when conversation becomes active

**Request Body:** Empty (`{}`)  
**Response:** Updates `agent_last_seen_at` timestamp

**Frontend Implementation:**
```javascript
// app/javascript/dashboard/api/inbox/conversation.js
markMessageRead({ id }) {
  return axios.post(`${this.url}/${id}/update_last_seen`);
}
```

---

#### 2. Mark Conversation as Unread
**Endpoint:** `POST /api/accounts/{account_id}/conversations/{conversation_id}/unread`  
**When:** 
- User right-clicks conversation → "Mark as unread"
- User wants to revisit a conversation later

**Request Body:** Empty (`{}`)  
**Response:** Sets `agent_last_seen_at` to timestamp before last incoming message

**Frontend Implementation:**
```javascript
// app/javascript/dashboard/api/inbox/conversation.js
markMessagesUnread({ id }) {
  return axios.post(`${this.url}/${id}/unread`);
}
```

---

### Status Management

#### 3. Toggle Conversation Status
**Endpoint:** `POST /api/accounts/{account_id}/conversations/{conversation_id}/toggle_status`  
**When:**
- User changes status via context menu (Open → Resolved, Resolved → Open, etc.)
- User marks conversation as "Pending"
- User snoozes conversation
- Bot hands off conversation (pending → open)

**Request Body:**
```json
{
  "status": "resolved" | "open" | "pending" | "snoozed",
  "snoozed_until": null | "ISO8601 datetime string"
}
```

**Frontend Implementation:**
```javascript
// app/javascript/dashboard/api/inbox/conversation.js
toggleStatus({ conversationId, status, snoozedUntil = null }) {
  return axios.post(`${this.url}/${conversationId}/toggle_status`, {
    status,
    snoozed_until: snoozedUntil,
  });
}
```

---

### Priority Management

#### 4. Toggle Priority
**Endpoint:** `POST /api/accounts/{account_id}/conversations/{conversation_id}/toggle_priority`  
**When:**
- User sets priority via context menu (Urgent, High, Medium, Low, None)

**Request Body:**
```json
{
  "priority": "urgent" | "high" | "medium" | "low" | null
}
```

**Frontend Implementation:**
```javascript
// app/javascript/dashboard/api/inbox/conversation.js
togglePriority({ conversationId, priority }) {
  return axios.post(`${this.url}/${conversationId}/toggle_priority`, {
    priority,
  });
}
```

---

### Mute/Unmute

#### 5. Mute Conversation
**Endpoint:** `POST /api/accounts/{account_id}/conversations/{conversation_id}/mute`  
**When:**
- User mutes a conversation to stop receiving notifications

**Request Body:** Empty (`{}`)  
**Response:** Sets conversation status to "resolved" and marks as muted

**Frontend Implementation:**
```javascript
// app/javascript/dashboard/api/inbox/conversation.js
mute(conversationId) {
  return axios.post(`${this.url}/${conversationId}/mute`);
}
```

---

#### 6. Unmute Conversation
**Endpoint:** `POST /api/accounts/{account_id}/conversations/{conversation_id}/unmute`  
**When:**
- User unmutes a previously muted conversation

**Request Body:** Empty (`{}`)

**Frontend Implementation:**
```javascript
// app/javascript/dashboard/api/inbox/conversation.js
unmute(conversationId) {
  return axios.post(`${this.url}/${conversationId}/unmute`);
}
```

---

### Assignment

#### 7. Assign Agent
**Endpoint:** `POST /api/accounts/{account_id}/conversations/{conversation_id}/assignments?assignee_id={agent_id}`  
**When:**
- User assigns conversation to an agent via context menu
- User reassigns conversation to different agent
- User unassigns (sets `assignee_id` to `null`)

**Query Parameters:**
- `assignee_id`: Agent ID (or omit/use `null` to unassign)

**Request Body:** Empty (`{}`)

**Frontend Implementation:**
```javascript
// app/javascript/dashboard/api/inbox/conversation.js
assignAgent({ conversationId, agentId }) {
  return axios.post(
    `${this.url}/${conversationId}/assignments?assignee_id=${agentId}`,
    {}
  );
}
```

---

#### 8. Assign Team
**Endpoint:** `POST /api/accounts/{account_id}/conversations/{conversation_id}/assignments`  
**When:**
- User assigns conversation to a team via context menu

**Request Body:**
```json
{
  "team_id": 123
}
```

**Frontend Implementation:**
```javascript
// app/javascript/dashboard/api/inbox/conversation.js
assignTeam({ conversationId, teamId }) {
  const params = { team_id: teamId };
  return axios.post(`${this.url}/${conversationId}/assignments`, params);
}
```

---

### Labels

#### 9. Assign Labels
**Endpoint:** `POST /api/accounts/{account_id}/conversations/{conversation_id}/labels`  
**When:**
- User adds/removes labels via context menu

**Request Body:**
```json
{
  "labels": ["label1", "label2", "label3"]
}
```

**Note:** This endpoint **overwrites** existing labels. To add a label without removing others, fetch current labels first, add the new one, and send the complete list.

---

### Custom Attributes

#### 10. Update Custom Attributes
**Endpoint:** `POST /api/accounts/{account_id}/conversations/{conversation_id}/custom_attributes`  
**When:**
- User updates custom attributes/metadata on conversation

**Request Body:**
```json
{
  "custom_attributes": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

**Frontend Implementation:**
```javascript
// app/javascript/dashboard/api/inbox/conversation.js
updateCustomAttributes({ conversationId, customAttributes }) {
  return axios.post(`${this.url}/${conversationId}/custom_attributes`, {
    custom_attributes: customAttributes,
  });
}
```

---

### Participants

#### 11. Update Participants
**Endpoint:** `PATCH /api/accounts/{account_id}/conversations/{conversation_id}/participants`  
**When:**
- User adds/removes participants from conversation

**Request Body:**
```json
{
  "user_ids": [1, 2, 3]
}
```

**Frontend Implementation:**
```javascript
// app/javascript/dashboard/api/inbox/conversation.js
updateParticipants({ conversationId, userIds }) {
  return axios.patch(`${this.url}/${conversationId}/participants`, {
    user_ids: userIds,
  });
}
```

---

### Other Conversation Actions

#### 12. Send Email Transcript
**Endpoint:** `POST /api/accounts/{account_id}/conversations/{conversation_id}/transcript`  
**When:**
- User requests conversation transcript via email

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Frontend Implementation:**
```javascript
// app/javascript/dashboard/api/inbox/conversation.js
sendEmailTranscript({ conversationId, email }) {
  return axios.post(`${this.url}/${conversationId}/transcript`, { email });
}
```

---

#### 13. Delete Conversation
**Endpoint:** `DELETE /api/accounts/{account_id}/conversations/{conversation_id}`  
**When:**
- User deletes conversation (triggers background job)

**Frontend Implementation:**
```javascript
// app/javascript/dashboard/api/inbox/conversation.js
delete(conversationId) {
  return axios.delete(`${this.url}/${conversationId}`);
}
```

---

## Message Endpoints

### Message Actions

#### 14. Translate Message
**Endpoint:** `POST /api/accounts/{account_id}/conversations/{conversation_id}/messages/{message_id}/translate`  
**When:**
- User clicks "Translate" on a message

**Request Body:**
```json
{
  "target_language": "en"
}
```

---

#### 15. Retry Failed Message
**Endpoint:** `POST /api/accounts/{account_id}/conversations/{conversation_id}/messages/{message_id}/retry`  
**When:**
- User retries sending a failed message

**Request Body:** Empty (`{}`)

---

#### 16. Update Message
**Endpoint:** `PUT /api/accounts/{account_id}/conversations/{conversation_id}/messages/{message_id}`  
**When:**
- User edits a message

**Request Body:**
```json
{
  "content": "Updated message content"
}
```

---

#### 17. Delete Message
**Endpoint:** `DELETE /api/accounts/{account_id}/conversations/{conversation_id}/messages/{message_id}`  
**When:**
- User deletes a message

---

## Notification Endpoints

### Read/Unread Notifications

#### 18. Mark Notification as Read
**Endpoint:** `POST /api/accounts/{account_id}/notifications/read_all`  
**When:**
- User opens a conversation (marks all notifications for that conversation as read)
- User clicks on a notification

**Request Body:**
```json
{
  "primary_actor_type": "Conversation",
  "primary_actor_id": 123
}
```

**Frontend Implementation:**
```javascript
// app/javascript/dashboard/api/notifications.js
read(primaryActorType, primaryActorId) {
  return axios.post(`${this.url}/read_all`, {
    primary_actor_type: primaryActorType,
    primary_actor_id: primaryActorId,
  });
}
```

---

#### 19. Mark All Notifications as Read
**Endpoint:** `POST /api/accounts/{account_id}/notifications/read_all`  
**When:**
- User clicks "Mark all as read" button

**Request Body:** Empty (`{}`)

**Frontend Implementation:**
```javascript
// app/javascript/dashboard/api/notifications.js
readAll() {
  return axios.post(`${this.url}/read_all`);
}
```

---

#### 20. Mark Notification as Unread
**Endpoint:** `POST /api/accounts/{account_id}/notifications/{notification_id}/unread`  
**When:**
- User marks a single notification as unread

**Request Body:** Empty (`{}`)

**Frontend Implementation:**
```javascript
// app/javascript/dashboard/api/notifications.js
unRead(id) {
  return axios.post(`${this.url}/${id}/unread`);
}
```

---

### Notification Management

#### 21. Delete Notification
**Endpoint:** `DELETE /api/accounts/{account_id}/notifications/{notification_id}`  
**When:**
- User deletes a notification

**Frontend Implementation:**
```javascript
// app/javascript/dashboard/api/notifications.js
delete(id) {
  return axios.delete(`${this.url}/${id}`);
}
```

---

#### 22. Delete All Notifications
**Endpoint:** `POST /api/accounts/{account_id}/notifications/destroy_all`  
**When:**
- User deletes all read notifications or all notifications

**Request Body:**
```json
{
  "type": "read" | "all"
}
```

**Frontend Implementation:**
```javascript
// app/javascript/dashboard/api/notifications.js
deleteAll({ type = 'all' }) {
  return axios.post(`${this.url}/destroy_all`, {
    type,
  });
}
```

---

#### 23. Snooze Notification
**Endpoint:** `POST /api/accounts/{account_id}/notifications/{notification_id}/snooze`  
**When:**
- User snoozes a notification

**Request Body:**
```json
{
  "snoozed_until": "ISO8601 datetime string"
}
```

**Frontend Implementation:**
```javascript
// app/javascript/dashboard/api/notifications.js
snooze({ id, snoozedUntil = null }) {
  return axios.post(`${this.url}/${id}/snooze`, {
    snoozed_until: snoozedUntil,
  });
}
```

---

## Typing Indicators

### Typing Status

#### 24. Toggle Typing Status
**Endpoint:** `POST /api/accounts/{account_id}/conversations/{conversation_id}/toggle_typing_status`  
**When:**
- User starts typing in message input (triggers typing indicator)
- User stops typing (after 3 seconds of inactivity or when input is cleared)

**Request Body:**
```json
{
  "typing_status": "on" | "off",
  "is_private": false
}
```

**Frontend Implementation:**
```javascript
// app/javascript/dashboard/api/inbox/conversation.js
toggleTyping({ conversationId, status, isPrivate }) {
  return axios.post(`${this.url}/${conversationId}/toggle_typing_status`, {
    typing_status: status,
    is_private: isPrivate,
  });
}
```

**Behavior:**
- Typing indicator automatically turns off after **30 seconds** if not manually stopped
- Frontend typically manages typing state with **3-second debounce** before sending "off" status

---

## Draft Messages

### Draft Management

#### 25. Save Draft Message
**Endpoint:** `PUT /api/accounts/{account_id}/conversations/{conversation_id}/draft_messages`  
**When:**
- User types in message input (auto-saves periodically)
- User switches conversations (saves current draft)

**Request Body:**
```json
{
  "content": "Draft message content"
}
```

---

#### 26. Get Draft Message
**Endpoint:** `GET /api/accounts/{account_id}/conversations/{conversation_id}/draft_messages`  
**When:**
- User opens a conversation (loads any saved draft)

---

#### 27. Delete Draft Message
**Endpoint:** `DELETE /api/accounts/{account_id}/conversations/{conversation_id}/draft_messages`  
**When:**
- User sends a message (deletes draft after successful send)

---

## Frontend Responsibility vs Backend Automation

### ⚠️ **Important Architectural Note**

**YES, these endpoints are the FRONTEND's responsibility to call.** The backend does NOT automatically handle most of these behaviors.

### Why Frontend Responsibility?

1. **User Intent Tracking**: The frontend knows when the user actually views/interacts with content
2. **Multi-tab Coordination**: Different tabs/browsers need to coordinate read status
3. **Explicit User Actions**: Status changes, assignments, etc. are explicit user decisions
4. **Offline Handling**: Frontend can queue these calls when offline

### What Backend Does Automatically

✅ **Backend Automatically Handles:**
- WebSocket broadcasting of changes (after frontend calls endpoint)
- Message status updates when `update_last_seen` is called
- Event dispatching for listeners (automation rules, webhooks, etc.)
- Database persistence of changes

❌ **Backend Does NOT Automatically Handle:**
- Marking conversations as read when WebSocket receives messages
- Auto-updating `last_seen` when conversation is viewed
- Typing indicators (frontend must send these)
- Draft saving (frontend must manage)

### Potential Issues with This Approach

⚠️ **If frontend forgets to call these endpoints:**
- Conversations stay marked as unread
- Read receipts don't update
- Notification counts stay incorrect
- Other users don't see typing indicators

⚠️ **Common Pitfalls:**
- Network failures can cause inconsistencies
- Multiple tabs need coordination
- Race conditions if called too frequently
- Missing calls in edge cases (tab switching, visibility changes)

---

## When These Endpoints Are Called

### User Interaction Triggers

| Action | Endpoint(s) Called | Timing | Frontend Location |
|--------|-------------------|--------|------------------|
| **Open Conversation** | `update_last_seen`, `read_all` (notifications) | Immediately on click | `MessagesView.vue` → `makeMessagesRead()` |
| **View Conversation** | `update_last_seen` | When conversation becomes active | `setActiveChat()` → `syncActiveConversationMessages()` |
| **Type in Input** | `toggle_typing_status` (on) | After first character typed | `BaseMessageInput.tsx` → `handleInputChange()` |
| **Stop Typing** | `toggle_typing_status` (off) | After 3 seconds inactivity | `BaseMessageInput.tsx` → auto cleanup |
| **Send Message** | `POST /messages`, `DELETE /draft_messages` | On send click | Message send handler |
| **Right-click → Mark as Read** | `update_last_seen` | On menu selection | Context menu handler |
| **Right-click → Mark as Unread** | `unread` | On menu selection | Context menu handler |
| **Right-click → Resolve** | `toggle_status` (status: "resolved") | On menu selection | Context menu handler |
| **Right-click → Reopen** | `toggle_status` (status: "open") | On menu selection | Context menu handler |
| **Right-click → Snooze** | `toggle_status` (status: "snoozed") | On menu selection | Context menu handler |
| **Right-click → Priority** | `toggle_priority` | On menu selection | Context menu handler |
| **Right-click → Assign Agent** | `assignments` (assignee_id) | On menu selection | Context menu handler |
| **Right-click → Assign Team** | `assignments` (team_id) | On menu selection | Context menu handler |
| **Right-click → Add Label** | `labels` | On menu selection | Context menu handler |
| **Click Notification** | `read_all` (with conversation) | On notification click | Notification click handler |
| **Mark All Notifications Read** | `read_all` (empty body) | On button click | Notification actions |
| **Edit Message** | `PUT /messages/{id}` | On save edit | Message edit handler |
| **Delete Message** | `DELETE /messages/{id}` | On delete confirmation | Message delete handler |
| **Translate Message** | `POST /messages/{id}/translate` | On translate click | Message action handler |
| **Retry Failed Message** | `POST /messages/{id}/retry` | On retry click | Message retry handler |

---

## Automatic/Background Triggers

### Frontend Automatic Behavior

1. **Conversation Read Status**
   - `update_last_seen` is called automatically by frontend when:
     - Conversation becomes active (selected) - `setActiveChat()` → `syncActiveConversationMessages()` → `markMessagesRead()`
     - User scrolls through messages - `MessagesView.vue` → `makeMessagesRead()`
     - After syncing new messages - `syncActiveConversationMessages()` line 164

2. **Typing Indicators**
   - Frontend automatically sends "off" after 3 seconds of no input
   - Backend automatically clears after 30 seconds timeout (safety net)
   - Cleared when input is empty

3. **Draft Saving**
   - Frontend auto-saves on blur or periodic intervals
   - Saves when switching conversations
   - Must be explicitly called by frontend

### Backend Automatic Behavior

1. **WebSocket Broadcasting**
   - After frontend calls endpoint, backend broadcasts change to all subscribers
   - Example: `toggle_status` → broadcasts `conversation.status_changed` event

2. **Event Dispatching**
   - Backend dispatches events for listeners (automation rules, webhooks)
   - Example: `CONVERSATION_UPDATED`, `CONVERSATION_RESOLVED` events

3. **Message Status Updates**
   - When `update_last_seen` is called, backend triggers `UpdateMessageStatusJob`
   - Marks outgoing messages as "read" or "delivered"

---

## Implementation Notes

### Debouncing & Throttling

- **Typing Indicators**: 3-second debounce before sending "off" status
- **Draft Messages**: Auto-save with debounce to avoid excessive API calls
- **Read Status**: May be throttled to avoid rapid-fire updates

### Error Handling

Most endpoints return `head :ok` (204 No Content) on success, or JSON with updated data. Frontend handles errors silently in many cases (see action implementations).

### WebSocket Integration

Some actions trigger WebSocket broadcasts:
- Typing status changes → Broadcast to other participants
- Conversation status changes → Broadcast to team/inbox
- Message read status → Broadcast read receipts

---

## Related Documentation

- [Context Menu API Documentation](./docs/CONTEXT_MENU_API_DOCUMENTATION.md)
- [Notifications Frontend API Guide](./docs/NOTIFICATIONS_FRONTEND_API_GUIDE.md)
- Conversation Controller: `app/controllers/api/v1/accounts/conversations_controller.rb`
- Notifications Controller: `app/controllers/api/v1/accounts/notifications_controller.rb`

