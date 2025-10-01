# Frontend Guide: Conversations (001)

This guide explains the UI additions for conversations and how to consume the backend (REST + WebSocket) for the new Conversation feature. Keep `CONVERSATIONS_ENABLED=false` until cutover; then enable and switch to `conversationId` everywhere.

## What to build in the UI

- Conversations sidebar
  - Sections: Direct Messages, Groups
  - Each item joins `conversation:${id}` room on select
  - Show last message preview, updatedAt
- Start Direct Conversation
  - User search -> pick a teammate -> create or open existing DIRECT
- Create Group
  - Modal: name, optional description/avatar, participants[] -> create
- Message composer
  - When a conversation is active, send with `conversationId`
  - Typing indicator and read receipts (same events as channels today)
- Conversation header
  - Name, member count (temp: creator only until participants lands)
  - Soft-delete/archive actions (UI only for now)

## REST Endpoints (temporary, for 001)

Messages
- GET `/messages?conversationId={id}` — list messages in a conversation (desc)
- GET `/messages/conversation/{id}` — same as above (path form)

Conversations (service exists; minimal controller is coming in 003). For now use WS to start, or wire HTTP when available:
- POST `/conversations/start-direct` — body `{ targetUserId }` → returns Conversation
- POST `/conversations/create-group` — body `{ name, description?, avatarUrl?, participantIds[] }` → returns Conversation
- GET `/conversations/{id}` — fetch by id

Note: If these routes are not yet exposed, the team can temporarily call a backend utility or stub; the database/service is ready.

## WebSocket API (namespace: `messaging`)

Auth
- Connect with `auth.token` or `Authorization: Bearer <token>`

Rooms
- Organization: `org:${printHouseId}`
- User direct: `user:${userId}`
- Conversation: `conversation:${conversationId}`

Events (client → server)
- `joinConversation`  payload `{ conversationId }`
- `leaveConversation` payload `{ conversationId }`
- `sendMessage`       payload:
  ```json
  {
    "conversationId": "uuid",
    "content": "hello world",
    "tempId": "client-tmp-123",
    "metadata": { "client": "web" }
  }
  ```
  - Still accepts `channelId` for legacy; prefer `conversationId` when flag on.

Events (server → client)
- `newMessage`        payload includes `messageId`, `content`, `userId`, `timestamp`, `conversationId?`
- `messageConfirmed`  echo with `tempId`, `status: 'sent'`
- Presence/typing/read: unchanged from current channel-based flows

## UI Flows

Start Direct
1) Open user search and pick target user
2) Call `POST /conversations/start-direct` with `{ targetUserId }`
3) Navigate to conversation view; `joinConversation`
4) Fetch messages: `GET /messages?conversationId=...`

Create Group
1) Open modal, enter `name`, add participants
2) Call `POST /conversations/create-group`
3) Navigate + `joinConversation`
4) Send messages via WS with `conversationId`

Conversation View
- Mount: `joinConversation`
- Load: GET messages
- Send: WS `sendMessage` with `conversationId`
- Unmount: `leaveConversation`

## Data contracts (selected)

Message (subset)
```json
{
  "id": "uuid",
  "printHouseId": "uuid",
  "conversationId": "uuid",
  "userId": "creator-uuid",
  "content": "text",
  "createdAt": "ISO",
  "provider": { "type": "PUSH" }
}
```

Conversation (subset)
```json
{
  "id": "uuid",
  "type": "DIRECT|GROUP",
  "name": "General",
  "createdBy": "user-uuid",
  "lastMessageId": "uuid" | null,
  "updatedAt": "ISO"
}
```

## Feature flag behavior
- When `CONVERSATIONS_ENABLED=false`:
  - UI can keep channel list as-is
  - Allow conversation views behind an experiment switch
- When `CONVERSATIONS_ENABLED=true`:
  - Primary path uses `conversationId` for send/fetch
  - Continue emitting to `org:${printHouseId}` and `conversation:${id}` rooms

## Error handling
- WS: display toast on `WsException` during `sendMessage`
- HTTP: 404 if conversation not found, 401 if token invalid
- Retry `joinConversation` on reconnect

## Migration note (backfill)
- Legacy internal “channels” migrated to GROUP conversations; messages backfilled with `conversationId`. Frontend should prefer loading by conversation.
