# Direct Messages (DM) — Frontend Integration Guide

This guide explains the newly added Direct Messages feature, how to use it from the frontend, and the recommended flow to unlock its full value.

## What we shipped
- A unified Conversations-based DM system for 1:1 and small group chats
- REST endpoints to manage conversations and messages
- WebSocket events/rooms for real-time messaging, typing, and read receipts
- Unread counts per conversation and robust pagination

The Email feature/module remains unchanged and separate.

## Requirements
- Auth: Use your existing JWT when calling REST and when opening the WebSocket
- WebSocket namespace: `messaging`
- Socket auth: `io(<API_BASE>/messaging, { auth: { token: <JWT> } })`
- All DM operations are scoped by tenant/org (multi-tenant safe)

## Data model (simplified)
- `Conversation`: { id, type: 'DM'|'GROUP_DM', participantCount, lastMessageAt, name?, isActive }
- `ConversationMember`: per-user settings: { isArchived, isFavorite, lastReadAt, lastReadMessageId, role }
- `Message`: { id, conversationId, userId, content, createdAt, isSystem?, editedAt?, deletedAt? }

## REST API
All endpoints require Authorization: `Bearer <JWT>`.

- Create or reopen conversation
  - POST `/dms`
  - Body: `{ participantIds: string[], name?: string }` (current user auto-included)
  - Returns: conversation with members

- List conversations
  - GET `/dms?limit&offset&includeArchived=false`
  - Returns: conversations (each includes `unreadCount`)

- Get conversation
  - GET `/dms/:id`

- List messages (paginated)
  - GET `/dms/:id/messages?before=<messageId>&after=<messageId>&limit=<n>`
  - Ordered by `(createdAt asc, id asc)`

- Send message (REST)
  - POST `/dms/:id/messages`
  - Body: `{ content: string, metadata?: object, tempId?: string }`

- Mark as read
  - POST `/dms/:id/read`
  - Body: `{ lastReadMessageId?: string, lastReadAt?: ISOString }`

- Preferences & membership
  - POST `/dms/:id/archive` | `/unarchive`
  - POST `/dms/:id/favorite` | `/unfavorite`
  - POST `/dms/:id/leave` (group only)
  - POST `/dms/:id/add-members` Body: `{ participantIds: string[] }` (creates a new conversation with union members)

### Example: Create or reopen a 1:1 conversation
```bash
curl -X POST \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"participantIds":["<otherUserId>"]}' \
  "$API_BASE/dms"
```

## WebSocket: rooms and events
Connect with JWT:
```javascript
import { io } from 'socket.io-client';

const socket = io(`${API_BASE}/messaging`, { auth: { token: jwt } });
```

Join a conversation room to receive its live updates:
```javascript
socket.emit('joinConversation', { conversationId });
```

### Sending messages (real-time)
- Emit: `dm:sendMessage`
  - Payload: `{ conversationId, content, tempId?, metadata? }`
- Acks/Broadcasts:
  - Sender gets `dm:messageConfirmed` with `{ conversationId, messageId, content, userId, timestamp, tempId, status: 'sent' }`
  - Other participants in the room get `dm:newMessage` with `{ conversationId, messageId, content, userId, timestamp, tempId? }`

```javascript
const tempId = crypto.randomUUID();
// 1) Optimistic UI
ui.addMessage({ id: tempId, conversationId, content, userId: me, pending: true });

// 2) Emit
socket.emit('dm:sendMessage', { conversationId, content, tempId });

// 3) Confirm/Replace temp
socket.on('dm:messageConfirmed', ({ conversationId, messageId, tempId }) => {
  ui.replaceTempWithReal(conversationId, tempId, messageId);
});

// 4) Receive from others
socket.on('dm:newMessage', (msg) => {
  ui.addMessage(msg);
});
```

### Typing indicators
- Emit: `dm:typingStart` | `dm:typingStop` with `{ conversationId }`
- Broadcast: `dm:userTyping` with `{ conversationId, userId, isTyping }`

### Read receipts
- REST: `POST /dms/:id/read`
- WS: Emit `dm:markAsRead` with `{ conversationId, lastReadMessageId?, lastReadAt? }`
- Broadcast: `dm:messageRead` with `{ conversationId, userId, lastReadMessageId?, lastReadAt }`

### Presence (optional but recommended)
- On connect/disconnect: `userOnline` / `userOffline` broadcast in org room
- Query presence: emit `getPresence` with `{ userIds?: string[] }` and handle `presence` response payload in the result

## Recommended UI flow
1) Entry
   - If opening a known conversation: `GET /dms/:id`, `GET /dms/:id/messages`, then `joinConversation` over WS
   - If starting new: `POST /dms` with target user(s), then navigate to returned id and join room

2) Loading messages
   - Initial page: `GET /dms/:id/messages?limit=50` (ascending order)
   - Scroll up to load older: supply `before=<oldestMessageIdOnScreen>`
   - For newer messages while connected, rely on `dm:newMessage` events

3) Sending
   - Optimistically add a temp message; emit `dm:sendMessage` with `tempId`
   - Replace temp on `dm:messageConfirmed`

4) Unread counts
   - Conversation list from `GET /dms` includes `unreadCount`
   - When the user views the conversation, issue `POST /dms/:id/read` (and/or `dm:markAsRead`)

5) Typing & presence
   - Emit `dm:typingStart`/`dm:typingStop` on editor focus/blur or keystroke throttle
   - Show badges using presence data (online/away/busy)

6) Group membership changes
   - Adding members creates a NEW conversation id; show a system message that history starts there
   - Leaving is only allowed for group DMs; 1:1 cannot be left

## Error handling & edge cases
- Server enforces membership per conversation; ensure to join room after access is granted
- Deleted messages (future) should render as “message removed” when `deletedAt != null`
- Pagination ties use `(createdAt, id)`; keep your message list stable with these keys
- Do not assume `messageId` order equals chronology without `createdAt`

## Minimal integration checklist
- Auth: JWT available to REST and WS
- Conversations list view wired to `GET /dms`
- Conversation detail view: messages list + composer
- WS lifecycle: connect on app load, `joinConversation` on thread open
- Send flow: optimistic tempId -> confirmed replacement
- Read receipts: REST and/or WS
- Typing indicators: optional but recommended
- Presence: optional but recommended

## FAQ
- Do I need to manage channels/providers?
  - No. The backend creates an internal PUSH provider and a per-conversation channel automatically.
- What happens if I add members to a 1:1?
  - A new group conversation is created; the previous 1:1 remains intact.
