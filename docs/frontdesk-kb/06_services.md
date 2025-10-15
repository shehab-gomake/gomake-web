# Services Layer

The services layer is responsible for all communication with the backend, including REST API calls and WebSocket connections. It is located in `src/services/frontdesk/`.

## Import Pattern

All services are exported from a single unified import path for easy access:

```typescript
// Single import for all services
import {
  // REST API Services
  directMessagesService,
  ticketsService,
  notificationsService,

  // WebSocket Services
  messagingService,
  directMessagesWebSocketService,
  ticketSocketService,
  notificationsWebSocketService
} from '@/services/frontdesk';
```

---

## 1. REST API Services

**Location**: `src/services/frontdesk/api/`

All REST API services extend `MessagingHubHttpClient` which provides:
- Automatic JWT authentication via Bearer tokens
- Tenant scoping through `printHouseId` from JWT
- Error handling and response transformation
- Base HTTP methods: `get()`, `post()`, `patch()`, `delete()`

### 1.1 Direct Messages Service

**File**: `src/services/frontdesk/api/direct-messages.service.ts`

**Purpose**: Manages all REST API operations for direct messages and group conversations.

**Import**:
```typescript
import { directMessagesService } from '@/services/frontdesk';
```

**Key Methods**:

#### Conversation Management
- `createConversation(data: CreateConversationRequest)` - Create/reopen 1-on-1 or group conversation
- `listConversations(options?)` - Get all conversations with pagination
- `getConversation(conversationId)` - Get single conversation details
- `archiveConversation(conversationId)` - Archive a conversation
- `unarchiveConversation(conversationId)` - Unarchive a conversation
- `favoriteConversation(conversationId)` - Mark as favorite
- `unfavoriteConversation(conversationId)` - Unmark favorite
- `leaveConversation(conversationId)` - Leave group conversation
- `addMembers(conversationId, data)` - Add members to group
- `getConversationMembers(conversationId)` - Get all members

#### Message Management
- `listMessages(conversationId, options?)` - Get messages with pagination (before/after/limit)
- `sendMessage(conversationId, data)` - Send a message (REST fallback)
- `markAsRead(conversationId, data)` - Mark conversation as read
- `loadMessagesAroundTarget(conversationId, targetMessageId, options)` - Load context around a specific message

#### Search Operations
- `searchConversations(query)` - Search conversations by name/participants
- `searchAllMessages(query, options?)` - Global message search across all conversations
  - Supports full-text search, sorting, pagination, highlights
  - Returns message context and conversation info
- `searchMessagesInConversation(conversationId, query, options?)` - Search within specific conversation
  - Returns message position, highlights, and context

#### User Discovery
- `getUserSuggestions(query?, options?)` - Get user suggestions for new conversations
  - Supports filtering by department, role, online status

**Error Handling**:
- Returns proper TypeScript types for all responses
- Throws errors for missing required parameters
- Handles both wrapped (`{data: [...]}`) and unwrapped array responses

**Example Usage**:
```typescript
// Create a conversation
const { conversation, members } = await directMessagesService.createConversation({
  participantIds: ['user1', 'user2'],
  name: 'Project Discussion' // optional for groups
});

// Search messages globally
const results = await directMessagesService.searchAllMessages('urgent', {
  limit: 20,
  sortBy: 'relevance',
  useFullText: true
});

// Load messages with context
const { messages, hasMore } = await directMessagesService.listMessages(conversationId, {
  limit: 50,
  before: oldestMessageId
});
```

---

### 1.2 Tickets Service

**File**: `src/services/frontdesk/api/tickets.service.ts`

**Purpose**: Complete REST API for the ticketing system. Handles ticket lifecycle, assignments, tags, and provider channels.

**Import**:
```typescript
import { ticketsService } from '@/services/frontdesk';
```

**Key Methods**:

#### Core Ticket Lifecycle
- `listTickets(filters?: TicketFilters)` - List tickets with comprehensive filtering
  - Filters: status, priority, assignee, category, tags, search, dates, provider channel
  - Pagination: page, limit, sortBy, sortOrder
- `getTicketById(ticketId)` - Get single ticket with full details
- `createTicketFromConversation(data)` - Create ticket from any provider conversation
- `replyToTicket(ticketId, content, conversationId)` - Reply to ticket (conversationId REQUIRED)
- `updateTicket(ticketId, data)` - Update multiple ticket fields in one call
- `updateTicketStatus(ticketId, status)` - **DEPRECATED** - Use updateTicket() instead
- `updateTicketPriority(ticketId, priority)` - **DEPRECATED** - Use updateTicket() instead
- `reopenTicket(ticketId)` - Reopen a closed ticket (Manager/Admin)
- `mergeTickets(sourceId, targetTicketId)` - Merge two tickets (Manager/Admin)

#### Assignment & Work Management
- `assignTicket(ticketId, assigneeId)` - Assign ticket to agent
- `bulkAssignTickets(data)` - Bulk assign multiple tickets
- `getUnassignedTickets(options?)` - Get dashboard of unassigned tickets
  - Optional filters: priority, categoryId
- `getAgentWorkload()` - Get workload stats for all agents

#### Discovery & Insights
- `getRelatedTickets(ticketId)` - Find related tickets
- `getTicketHistory(ticketId)` - Get full ticket history/audit trail
- `getCustomerTicketHistory(identifier)` - Get all tickets for a customer (email/phone)

#### Providers & Channels
- `getProviders()` - Get all communication providers (Gmail, WhatsApp, SMS, etc.)
- `getProviderById(providerId)` - Get single provider details
- `getProviderChannels()` - **DEPRECATED** - Use getProviders() instead
- `getProviderChannelById(channelId)` - **DEPRECATED** - Use getProviderById() instead

#### Tag Management
- `listTags(query?)` - List all tags with filters (category, search, pagination)
- `getPopularTags(query?)` - Get most-used tags
- `suggestTags(query, limit?, category?)` - Autocomplete tag suggestions
- `createTag(data)` - Create new tag (Admin/Manager)
- `updateTag(tagId, data)` - Update tag (Admin/Manager)
- `deleteTag(tagId)` - Delete tag (Admin/Manager)
- `getTicketTags(ticketId)` - Get all tags for a ticket
- `addTagsToTicket(ticketId, tags)` - Add tags (auto-creates if needed)
- `removeTagFromTicket(ticketId, tagId)` - Remove tag from ticket

#### Ticket View Tracking
- `getTicketViewStatus(ticketId)` - Check if ticket has unread activity for current user
- `markTicketAsRead(ticketId)` - Mark ticket as read
- `getUnreadTicketsCount()` - Get count of tickets with unread activity

**Authentication**: All endpoints require `Authorization: Bearer <JWT>` header (handled automatically)

**Tenant Scoping**: All operations are automatically scoped to the user's `printHouseId` from JWT

**Example Usage**:
```typescript
// List tickets with filters
const response = await ticketsService.listTickets({
  status: 'OPEN',
  priority: 'HIGH',
  tags: ['urgent', 'billing'],
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc'
});

// Create ticket from conversation
const ticket = await ticketsService.createTicketFromConversation({
  subject: 'Order Issue',
  content: 'Customer needs help with order #12345',
  priority: 'MEDIUM',
  categoryId: 'cat_123',
  providerChannelId: 'gmail_account_1',
  conversationId: 'conv_456',
  customerEmail: 'customer@example.com'
});

// Reply to ticket (MUST include conversationId)
await ticketsService.replyToTicket(ticketId, 'Response message', conversationId);

// Update multiple fields at once
await ticketsService.updateTicket(ticketId, {
  status: 'IN_PROGRESS',
  priority: 'HIGH',
  assigneeId: 'agent_123',
  categoryId: 'cat_456'
});

// Tag operations
const tags = await ticketsService.suggestTags('ur', 5); // Autocomplete
await ticketsService.addTagsToTicket(ticketId, ['urgent', 'billing']);
```

---

### 1.3 Notifications Service

**File**: `src/services/frontdesk/api/notifications.service.ts`

**Purpose**: REST API for fetching and managing notifications.

**Import**:
```typescript
import { notificationsService } from '@/services/frontdesk';
```

**Key Methods**:

- `getNotifications(filters?: NotificationFilters)` - Get notifications with pagination
  - Filters: type, unreadOnly, page, limit
  - Returns: `{ data: BackendNotification[], pagination: {...} }`
- `getUnreadCount(type?: BackendNotificationType)` - Get count of unread notifications
- `markAsRead(notificationId)` - Mark single notification as read
- `markAllAsRead(type?)` - Mark all notifications as read (optionally filter by type)
  - Returns: `{ count: number }` - number of notifications marked
- `dismiss(notificationId)` - Dismiss notification without marking as read
- `deleteNotification(notificationId)` - Permanently delete notification

**Notification Types**:
- `TICKET_ASSIGNED` - Ticket assigned to user
- `TICKET_STATUS_CHANGED` - Ticket status updated
- `TICKET_REPLY_SENT` - New reply on ticket
- `DM_NEW_MESSAGE` - New direct message
- `MENTION` - User mentioned in message
- And more...

**Example Usage**:
```typescript
// Get unread notifications
const { data, pagination } = await notificationsService.getNotifications({
  unreadOnly: true,
  page: 1,
  limit: 20
});

// Get unread count
const count = await notificationsService.getUnreadCount();

// Mark all ticket notifications as read
const { count } = await notificationsService.markAllAsRead('TICKET_ASSIGNED');
```

---

### 1.4 FrontDesk Endpoints (Legacy)

**File**: `src/services/frontdesk/api/frontdesk-endpoints.ts`

**Purpose**: Legacy endpoint definitions using the old API pattern. **Being phased out** in favor of service classes above.

**Note**: New code should use `directMessagesService`, `ticketsService`, and `notificationsService` instead.

---

## 2. WebSocket Services

**Location**: `src/services/frontdesk/websocket/`

All WebSocket services connect to the `/messaging` namespace and use Socket.IO for real-time communication.

### 2.1 Messaging Socket Service (Core)

**File**: `src/services/frontdesk/websocket/messaging-socket.service.ts`

**Purpose**: Base WebSocket service that provides the foundation for all other real-time services.

**Import**:
```typescript
import { messagingService } from '@/services/frontdesk';
```

**Key Features**:
- Singleton pattern - one connection shared across app
- Automatic reconnection with exponential backoff
- Session tracking with persistent session IDs
- Heartbeat mechanism (30s interval)
- JWT authentication via `auth.token`
- Supports both WebSocket and polling transports

**Connection Methods**:
- `connect(authToken?)` - Connect to `/messaging` namespace
  - Returns: `Promise<Socket>`
  - Auto-extracts token from storage if not provided
- `disconnect()` - Close connection and cleanup
- `isConnected()` - Check connection status
- `getSocket()` - Get raw Socket.IO instance

**Message Operations**:
- `sendMessage(data: SendMessageData)` - Send message (fire-and-forget)
- `sendMessageWithConfirmation(data)` - Send with confirmation callback

**Channel Operations**:
- `joinChannel(data: JoinChannelData)` - Join a channel room
- `leaveChannel(data)` - Leave a channel room
- `createChannel(data)` - Create new channel
- `getChannels()` - List all channels
- `archiveConversation(channelId)` - Archive channel
- `unarchiveConversation(channelId)` - Unarchive channel
- `deleteConversation(channelId)` - Delete channel

**Presence & Typing**:
- `startTyping(data: TypingData)` - Emit typing start
- `stopTyping(data)` - Emit typing stop
- `updateStatus(data: UpdateStatusData)` - Update user status (online/away/busy/offline)
- `getPresence(data?)` - Get presence for users

**Read Receipts**:
- `markAsRead(data: MarkAsReadData)` - Mark message as read

**Event Listeners**:
- `onNewMessage(handler)` - Listen for new messages
- `onDirectMessage(handler)` - Listen for direct messages
- `onMessageConfirmed(handler)` - Listen for message confirmations
- `onUserTyping(handler)` - Listen for typing indicators
- `onUserOnline(handler)` - Listen for users coming online
- `onUserOffline(handler)` - Listen for users going offline
- `onStatusChanged(handler)` - Listen for status changes
- `onMessageRead(handler)` - Listen for read receipts
- `onConnect(handler)` - Connection established
- `onDisconnect(handler)` - Connection lost
- `onError(handler)` - Connection errors

**Cleanup**:
- `removeListener(event, handler?)` - Remove specific listener
- `removeAllListeners()` - Remove all listeners

**Example Usage**:
```typescript
// Connect
await messagingService.connect();

// Listen for messages
messagingService.onNewMessage((message) => {
  console.log('New message:', message);
});

// Send message
messagingService.sendMessage({
  conversationId: 'conv_123',
  content: 'Hello world',
  tempId: `temp_${Date.now()}`
});

// Typing indicators
messagingService.startTyping({ conversationId: 'conv_123' });
messagingService.stopTyping({ conversationId: 'conv_123' });

// Cleanup
messagingService.disconnect();
```

---

### 2.2 Direct Messages WebSocket Service

**File**: `src/services/frontdesk/websocket/direct-messages-websocket.service.ts`

**Purpose**: Dedicated WebSocket service for direct messages and group conversations real-time events.

**Import**:
```typescript
import { directMessagesWebSocketService } from '@/services/frontdesk';
```

**Connection**:
- `connect(authToken?)` - Connect to `/messaging` namespace
  - Uses persistent session ID stored in localStorage (`dm_session_id`)
  - Auto-reconnection with 10 attempts max
  - 30s heartbeat interval
- `disconnect()` - Close connection
- `isConnected()` - Check status
- `getSocket()` - Get raw socket

**Room Management**:
- `joinConversation(data: JoinConversationEvent)` - Join conversation room for live updates
  - Required to receive real-time events for that conversation
- `leaveConversation(data)` - Leave conversation room

**Message Operations**:
- `sendMessage(data: DMSendMessageEvent)` - Send message via WebSocket
  - Event: `dm:sendMessage`
  - Faster than REST for real-time chat

**Typing Indicators**:
- `startTyping(data: DMTypingEvent)` - Event: `dm:typingStart`
- `stopTyping(data: DMTypingEvent)` - Event: `dm:typingStop`

**Read Receipts**:
- `markAsRead(data: DMMarkAsReadEvent)` - Event: `dm:markAsRead`

**Presence**:
- `getPresence(userIds?)` - Get online/offline status for users

**Event Listeners**:
- `onNewMessage(handler)` - Event: `dm:newMessage` - New message received
- `onMessageConfirmed(handler)` - Event: `dm:messageConfirmed` - Message saved to DB
- `onUserTyping(handler)` - Event: `dm:userTyping` - User typing in conversation
- `onMessageRead(handler)` - Event: `dm:messageRead` - Message marked as read
- `onUnreadCountUpdated(handler)` - Event: `dm:unreadCountUpdated` - Unread count changed
- `onConversationUpdated(handler)` - Event: `dm:conversationUpdated` - Conversation metadata changed
- `onStatusChanged(handler)` - Event: `presence:update` - User status changed
- `onWelcome(handler)` - Event: `dm:welcome` - Initial sync on connect
- `onReconnect(handler)` - Reconnection successful
- `onConnect(handler)` - Connection established
- `onDisconnect(handler)` - Connection lost
- `onError(handler)` - Errors

**Debug Mode**:
- Set `NEXT_PUBLIC_DM_DEBUG=true` or `window.DM_DEBUG=true` for verbose logging

**Example Usage**:
```typescript
// Connect
await directMessagesWebSocketService.connect();

// Join conversation to receive live updates
await directMessagesWebSocketService.joinConversation({
  conversationId: 'conv_123'
});

// Listen for new messages
directMessagesWebSocketService.onNewMessage((event) => {
  console.log('New message:', event.message);
  // Update UI state
});

// Listen for message confirmations
directMessagesWebSocketService.onMessageConfirmed((event) => {
  console.log('Message saved:', event.messageId);
  // Replace tempId with real ID
});

// Send message
directMessagesWebSocketService.sendMessage({
  conversationId: 'conv_123',
  content: 'Hello!',
  tempId: `temp_${Date.now()}`
});

// Typing indicators
directMessagesWebSocketService.startTyping({ conversationId: 'conv_123' });

// Cleanup
await directMessagesWebSocketService.leaveConversation({ conversationId: 'conv_123' });
directMessagesWebSocketService.disconnect();
```

---

### 2.3 Ticket Socket Service

**File**: `src/services/frontdesk/websocket/ticket-socket.service.ts`

**Purpose**: Manages all 20 real-time ticket events via Socket.IO. Most complex WebSocket service in FrontDesk.

**Import**:
```typescript
import { ticketSocketService } from '@/services/frontdesk';
```

**Connection**:
- `connect(authToken)` - Connect via shared `messagingService`
  - Backend extracts `printHouseId` from JWT automatically
  - Joins organization room: `org:${printHouseId}`
- `disconnect()` - Cleanup listeners and disconnect
- `isConnected()` - Check connection status

**20 Ticket Events Supported**:

#### Core Ticket Events
1. **ticket.created** - New ticket created
   - Listener: `onTicketCreated(handler)`
   - Payload: Full ticket with details

2. **ticket.updated** - Ticket fields updated (NEW - catch-all event)
   - Listener: `onTicketUpdated(handler)`
   - Payload: `{ ticket, changes: {...} }` - Shows what changed

3. **ticket.assigned** - Ticket assigned to agent
   - Listener: `onTicketAssigned(handler)`
   - Payload: `{ ticket, assignee, assignedBy }`

4. **ticket.status.changed** - Status updated
   - Listener: `onTicketStatusChanged(handler)`
   - Payload: `{ ticket, oldStatus, newStatus, changedBy }`

5. **ticket.reply.sent** - Agent replied to ticket
   - Listener: `onTicketReplySent(handler)`
   - Payload: `{ ticket, message, sentBy }`

6. **ticket.reopened** - Closed ticket reopened
   - Listener: `onTicketReopened(handler)`
   - Payload: `{ ticket, reopenedBy }`

7. **ticket.merged** - Tickets merged
   - Listener: `onTicketMerged(handler)`
   - Payload: `{ sourceTicket, targetTicket, mergedBy }`

#### Bulk Operations
8. **tickets.bulkAssigned** - Multiple tickets assigned
   - Listener: `onTicketsBulkAssigned(handler)`
   - Payload: `{ tickets: [...], assigneeId, assignedBy }`

#### Customer Communication
9. **ticket.message.received** - Customer sent new message
   - Listener: `onTicketMessageReceived(handler)`
   - Payload: `{ ticket, message, channel: 'EMAIL'|'WHATSAPP'|'SMS' }`

10. **ticket.customer.updated** - Customer info changed
    - Listener: `onTicketCustomerUpdated(handler)`
    - Payload: `{ ticket, oldCustomer, newCustomer }`

#### System Events
11. **sla.breached** - SLA deadline breached
    - Listener: `onSLABreached(handler)`
    - Payload: `{ ticket, slaType, breachedAt }`

12. **ticket.autoResponse** - Auto-response sent to customer
    - Listener: `onTicketAutoResponse(handler)`
    - Payload: `{ ticket, template, sentAt }`

13. **webhook.message.processed** - Incoming webhook processed
    - Listener: `onWebhookMessageProcessed(handler)`
    - Payload: `{ ticket, provider, messageId }`

#### Message Delivery
14. **message.delivered** - Message delivered to customer
    - Listener: `onMessageDelivered(handler)`
    - Payload: `{ ticketId, messageId, channel, deliveredAt }`

15. **message.delivery.failed** - Message delivery failed
    - Listener: `onMessageDeliveryFailed(handler)`
    - Payload: `{ ticketId, messageId, channel, error }`

#### Review Queue
16. **conversation.needs.review** - Message received but no ticket exists
    - Listener: `onConversationNeedsReview(handler)`
    - Payload: `{ conversationId, provider, message }`

#### Tag Events
17. **ticket.tags.added** - Tags added to ticket
    - Listener: `onTicketTagsAdded(handler)`
    - Payload: `{ ticketId, tags: [...], addedBy }`

18. **ticket.tag.removed** - Tag removed from ticket
    - Listener: `onTicketTagRemoved(handler)`
    - Payload: `{ ticketId, tagId, removedBy }`

19. **tag.created** - New tag created globally
    - Listener: `onTagCreated(handler)`
    - Payload: `{ tag }`

20. **tag.deleted** - Tag deleted globally
    - Listener: `onTagDeleted(handler)`
    - Payload: `{ tagId }`

**Event Handler Pattern**:
All events use a pub/sub pattern with internal event emitter:
- Subscribe with `on*(handler)` methods
- Unsubscribe with `removeListener(eventName, handler)`
- Clear all with `removeAllListeners()`

**Tenant Isolation**:
Backend handles tenant isolation via Socket.IO rooms. Frontend receives only events for the user's organization.

**Example Usage**:
```typescript
// Connect
await ticketSocketService.connect(authToken);

// Listen for new tickets
ticketSocketService.onTicketCreated((payload) => {
  console.log('New ticket:', payload.ticket);
  // Add to ticket list
});

// Listen for status changes
ticketSocketService.onTicketStatusChanged((payload) => {
  console.log(`Ticket ${payload.ticket.id} status: ${payload.oldStatus} -> ${payload.newStatus}`);
  // Update UI
});

// Listen for customer messages
ticketSocketService.onTicketMessageReceived((payload) => {
  console.log(`New ${payload.channel} message on ticket ${payload.ticket.id}`);
  // Show notification
});

// Listen for SLA breaches
ticketSocketService.onSLABreached((payload) => {
  console.warn(`SLA breached for ticket ${payload.ticket.id}`);
  // Alert manager
});

// Cleanup specific listener
const handler = (payload) => { /* ... */ };
ticketSocketService.onTicketCreated(handler);
// Later...
ticketSocketService.removeListener('ticket.created', handler);

// Cleanup all listeners
ticketSocketService.disconnect();
```

---

### 2.4 Notifications WebSocket Service

**File**: `src/services/frontdesk/websocket/notifications-websocket.service.ts`

**Purpose**: Real-time notification updates.

**Import**:
```typescript
import { notificationsWebSocketService } from '@/services/frontdesk';
```

**Connection**:
- `connect()` - Connect to `/messaging` namespace
  - Auto-extracts JWT from storage
  - 5 reconnection attempts max
- `disconnect()` - Close connection
- `isConnected()` - Check status

**Events**:
1. **notification:new** - New notification created
   - Listener: `onNewNotification(handler)`
   - Payload: `BackendNotification`

2. **notification:read** - Notification marked as read
   - Listener: `onNotificationRead(handler)`
   - Payload: `{ id, readAt }`

3. **notification:unreadCount** - Unread count changed
   - Listener: `onUnreadCountChange(handler)`
   - Payload: `{ count, type? }`

**Connection Events**:
- `onConnectionChange(handler)` - Connection state changed
- `onError(handler)` - Errors

**Cleanup**:
- `clearHandlers()` - Remove all event handlers

**Example Usage**:
```typescript
// Connect
notificationsWebSocketService.connect();

// Listen for new notifications
notificationsWebSocketService.onNewNotification((notification) => {
  console.log('New notification:', notification);
  // Show toast/badge
});

// Listen for unread count
notificationsWebSocketService.onUnreadCountChange((data) => {
  console.log(`Unread notifications: ${data.count}`);
  // Update badge
});

// Cleanup
notificationsWebSocketService.disconnect();
```

---

## 3. Service Architecture Best Practices

### 3.1 Singleton Pattern
All services are exported as singletons to ensure single connection per service type:
```typescript
export const ticketsService = new TicketsService();
export const messagingService = new MessagingService();
```

### 3.2 Error Handling
Services throw errors for:
- Missing authentication tokens
- Missing required parameters
- Network failures
- API errors (4xx/5xx)

Always wrap service calls in try-catch:
```typescript
try {
  const tickets = await ticketsService.listTickets({ status: 'OPEN' });
} catch (error) {
  console.error('Failed to fetch tickets:', error);
  // Show error toast
}
```

### 3.3 TypeScript Types
All services are fully typed. Import types from service files or provider types:
```typescript
import { TicketFilters, PaginatedTicketsResponse } from '@/widgets/frontdesk/providers/tickets/types';
import { DMMessage, Conversation } from '@/widgets/frontdesk/providers/internal/types';
```

### 3.4 Authentication
REST services automatically include JWT from storage. WebSocket services require explicit token on connect:
```typescript
// REST - automatic
const tickets = await ticketsService.listTickets();

// WebSocket - provide token
await messagingService.connect(authToken);
```

### 3.5 Cleanup
Always disconnect WebSocket services when component unmounts:
```typescript
useEffect(() => {
  messagingService.connect();

  return () => {
    messagingService.disconnect();
  };
}, []);
```

---

## 4. Migration Notes

### Deprecated Patterns
- ❌ `frontdesk-endpoints.ts` functions (legacy API)
- ❌ `updateTicketStatus()` / `updateTicketPriority()` - Use `updateTicket()` instead
- ❌ `getProviderChannels()` - Use `getProviders()` instead

### Recommended Patterns
- ✅ Use service classes: `ticketsService.method()`
- ✅ Use `updateTicket()` for all updates
- ✅ Use `getProviders()` for channel info
- ✅ Import from `@/services/frontdesk` for all services
