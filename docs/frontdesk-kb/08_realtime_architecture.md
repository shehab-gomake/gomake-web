# Real-time Architecture (WebSockets)

The FrontDesk feature relies heavily on WebSockets for its real-time capabilities. This document provides a comprehensive guide to the WebSocket architecture, connection management, and event handling.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Core Architecture](#2-core-architecture)
3. [Connection Management](#3-connection-management)
4. [Service Hierarchy](#4-service-hierarchy)
5. [Event Flow](#5-event-flow)
6. [State Integration](#6-state-integration)
7. [Error Handling & Reconnection](#7-error-handling--reconnection)
8. [Best Practices](#8-best-practices)

---

## 1. Overview

### WebSocket Stack

**Technology**: Socket.IO (WebSocket + polling fallback)
**Namespace**: `/messaging` (shared by all services)
**Authentication**: JWT bearer token in connection handshake
**Transport**: WebSocket (primary), HTTP long-polling (fallback)

### Service Architecture

```
┌─────────────────────────────────────────────┐
│        Application Components               │
│  (React, Recoil State, Provider Hooks)      │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         WebSocket Services Layer            │
├─────────────────────────────────────────────┤
│  - directMessagesWebSocketService           │
│  - ticketSocketService                      │
│  - notificationsWebSocketService            │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│      Core Messaging Service (Singleton)     │
│       messagingService (Socket.IO)          │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│          Backend Socket.IO Server           │
│            Namespace: /messaging            │
│         Rooms: org:${printHouseId}          │
└─────────────────────────────────────────────┘
```

---

## 2. Core Architecture

### 2.1 Core Service (`messaging-socket.service.ts`)

**Location**: `src/services/frontdesk/websocket/messaging-socket.service.ts`

**Purpose**: Foundation WebSocket service providing base connection, authentication, and common utilities.

**Key Features**:
- Singleton pattern (one connection per app instance)
- Automatic reconnection with exponential backoff
- Persistent session tracking via localStorage
- Heartbeat mechanism (30s intervals)
- JWT authentication
- Connection pooling for multiple services

**Architecture Pattern**:
```typescript
class MessagingService {
  private socket: Socket | null = null;

  // Session persistence
  private generateSessionId(): string {
    return localStorage.getItem('messaging_session_id') || createNew();
  }

  // Connection with retry logic
  connect(authToken?: string): Promise<Socket> {
    return new Promise((resolve, reject) => {
      this.socket = io(`${serverUrl}/messaging`, {
        auth: {
          token: authToken,
          sessionId: this.generateSessionId()
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000
      });

      // Event registration...
    });
  }
}
```

---

### 2.2 Feature-Specific Services

#### Direct Messages WebSocket Service

**File**: `src/services/frontdesk/websocket/direct-messages-websocket.service.ts`

**Purpose**: Dedicated service for DM real-time events with separate session management.

**Why Separate from Core?**:
- Independent lifecycle management
- DM-specific event handling
- Separate session tracking (`dm_session_id`)
- Debug mode support

**Events Handled**: 10 DM-specific events
- `dm:newMessage` - New message received
- `dm:messageConfirmed` - Message saved to DB
- `dm:userTyping` - Typing indicators
- `dm:messageRead` - Read receipts
- `dm:unreadCountUpdated` - Badge counts
- `dm:conversationUpdated` - Metadata changes
- `dm:welcome` - Initial sync
- `presence:update` - User online/offline
- Connection events

**Debug Mode**:
```typescript
// Enable verbose logging
process.env.NEXT_PUBLIC_DM_DEBUG = 'true';
// or at runtime
window.DM_DEBUG = true;
```

---

#### Ticket Socket Service

**File**: `src/services/frontdesk/websocket/ticket-socket.service.ts`

**Purpose**: Most complex WebSocket service - handles **20 real-time ticket events**.

**Architecture**: Reuses `messagingService` connection (efficient connection pooling)

**Events Handled**: 20 ticket events categorized as:

**Core Events (7)**:
1. `ticket.created` - New ticket
2. `ticket.updated` - General update (catch-all)
3. `ticket.assigned` - Assignment
4. `ticket.status.changed` - Status update
5. `ticket.reply.sent` - Agent reply
6. `ticket.reopened` - Reopened ticket
7. `ticket.merged` - Merge operation

**Bulk Operations (1)**:
8. `tickets.bulkAssigned` - Bulk assignments

**Customer Communication (2)**:
9. `ticket.message.received` - Customer message
10. `ticket.customer.updated` - Customer info change

**System Events (3)**:
11. `sla.breached` - SLA violation
12. `ticket.autoResponse` - Auto-reply sent
13. `webhook.message.processed` - Webhook processed

**Delivery Events (2)**:
14. `message.delivered` - Delivery confirmation
15. `message.delivery.failed` - Delivery error

**Review Queue (1)**:
16. `conversation.needs.review` - Unassigned conversation

**Tag Events (4)**:
17. `ticket.tags.added` - Tags added
18. `ticket.tag.removed` - Tag removed
19. `tag.created` - New tag globally
20. `tag.deleted` - Tag deleted globally

**Event Pattern**:
```typescript
// Internal pub/sub pattern
private eventHandlers: Map<string, Set<Handler>> = new Map();

// Subscribe
onTicketCreated(handler: TicketCreatedHandler): void {
  this.on(TICKET_EVENTS.CREATED, handler);
}

// Emit to subscribers
private handleTicketCreated(payload: TicketCreatedPayload): void {
  console.log('[TicketSocket] ticket.created:', payload);
  this.emit(TICKET_EVENTS.CREATED, payload);
}
```

---

#### Notifications WebSocket Service

**File**: `src/services/frontdesk/websocket/notifications-websocket.service.ts`

**Purpose**: Real-time notification delivery and badge updates.

**Events Handled**: 3 notification events
- `notification:new` - New notification created
- `notification:read` - Notification marked read
- `notification:unreadCount` - Badge count changed

**Architecture**: Independent connection with simpler lifecycle (5 reconnection attempts max).

---

## 3. Connection Management

### 3.1 Connection Lifecycle

```typescript
// 1. Establish connection
await directMessagesWebSocketService.connect(authToken);

// 2. Join specific rooms (if needed)
await directMessagesWebSocketService.joinConversation({
  conversationId: 'conv_123'
});

// 3. Register event listeners
directMessagesWebSocketService.onNewMessage((event) => {
  // Handle message
});

// 4. Send events
directMessagesWebSocketService.sendMessage({
  conversationId: 'conv_123',
  content: 'Hello',
  tempId: `temp_${Date.now()}`
});

// 5. Cleanup on unmount
await directMessagesWebSocketService.leaveConversation({
  conversationId: 'conv_123'
});
directMessagesWebSocketService.disconnect();
```

---

### 3.2 Session Management

**Purpose**: Prevent duplicate connections and maintain state across reconnects.

**Implementation**:
```typescript
private generateSessionId(): string {
  const existingSessionId = localStorage.getItem('dm_session_id');
  if (existingSessionId) {
    return existingSessionId;
  }

  const sessionId = `dm_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('dm_session_id', sessionId);
  return sessionId;
}
```

**Sent to Backend**:
```typescript
io(`${serverUrl}/messaging`, {
  auth: {
    token: jwtToken,
    sessionId: this.generateSessionId()  // Persistent ID
  }
});
```

**Backend Usage**: Server can track connections per session, prevent duplicates, and restore state.

---

### 3.3 Heartbeat Mechanism

**Purpose**: Keep connection alive and detect disconnections early.

**Implementation**:
```typescript
private startHeartbeat(): void {
  this.clearHeartbeat();

  this.heartbeatInterval = setInterval(() => {
    if (this.socket?.connected) {
      this.socket.emit('heartbeat');
    } else {
      this.clearHeartbeat();
    }
  }, 30000);  // 30 seconds
}
```

**Best Practice**: Always clear heartbeat on disconnect to prevent memory leaks.

---

### 3.4 Room Management (Socket.IO Rooms)

**Concept**: Users join specific "rooms" to receive targeted events.

**DM Room Example**:
```typescript
// Join conversation room to receive events for that conversation
socket.emit('joinConversation', { conversationId }, (response) => {
  if (response.success) {
    console.log('Joined conversation room');
  }
});

// Now receive events for this conversation only
socket.on('dm:newMessage', (data) => {
  // Only messages for joined conversations
});
```

**Ticket Room Example**:
Backend automatically joins users to organization room: `org:${printHouseId}`
- All ticket events scoped to organization
- No manual room joining required

---

## 4. Service Hierarchy

### 4.1 Connection Sharing

**Ticket Socket Service**: Reuses `messagingService` connection
```typescript
async connect(authToken: string): Promise<void> {
  // Use existing messaging service connection
  await messagingService.connect(authToken);
  this.socket = messagingService.getSocket();

  if (!this.socket) {
    throw new Error('Failed to connect to messaging service');
  }

  this.registerAllEvents();
}
```

**Benefits**:
- Single WebSocket connection (efficient)
- Shared authentication
- Consistent connection state
- Reduced server load

---

### 4.2 Independent Connections

**Direct Messages & Notifications**: Maintain separate connections

**Why?**:
- Independent lifecycle management
- Different reconnection strategies
- Service isolation (DM failure doesn't affect tickets)
- Separate session tracking

**Trade-off**: More connections but better isolation and reliability.

---

## 5. Event Flow

### 5.1 Outgoing Events (Client → Server)

**Pattern**:
```typescript
// Fire-and-forget (no confirmation)
directMessagesWebSocketService.sendMessage({
  conversationId: 'conv_123',
  content: 'Hello',
  tempId: 'temp_123'  // For optimistic UI updates
});

// With confirmation callback
socket.emit('eventName', payload, (response) => {
  if (response.success) {
    console.log('Event acknowledged');
  } else {
    console.error('Event failed:', response.error);
  }
});
```

**Optimistic Updates**:
1. Update UI immediately with `tempId`
2. Send event to server
3. Replace temp data with confirmed data on `dm:messageConfirmed`

---

### 5.2 Incoming Events (Server → Client)

**Direct Event Listeners**:
```typescript
socket.on('dm:newMessage', (data) => {
  // Handle event directly
  setMessages(prev => [...prev, data.message]);
});
```

**Pub/Sub Pattern (Ticket Service)**:
```typescript
// Service internal
socket.on('ticket.created', this.handleTicketCreated.bind(this));

private handleTicketCreated(payload) {
  this.emit('ticket.created', payload);  // Notify subscribers
}

// Public API
onTicketCreated(handler) {
  this.on('ticket.created', handler);
}

// Usage in hook
ticketSocketService.onTicketCreated((payload) => {
  setTickets(prev => [...prev, payload.ticket]);
});
```

**Benefits**: Decouples Socket.IO from business logic, allows multiple subscribers.

---

## 6. State Integration

### 6.1 React Hook Integration

**Pattern**: Provider hooks manage WebSocket lifecycle and sync with Recoil state.

**Example**: `use-tickets-provider.ts`
```typescript
export const useTicketsProvider = () => {
  const [tickets, setTickets] = useRecoilState(ticketsAtom);

  useEffect(() => {
    const initializeSocket = async () => {
      await ticketSocketService.connect(authToken);

      // Register event listeners
      ticketSocketService.onTicketCreated((payload) => {
        setTickets(prev => [payload.ticket, ...prev]);
      });

      ticketSocketService.onTicketUpdated((payload) => {
        setTickets(prev => prev.map(t =>
          t.id === payload.ticket.id ? payload.ticket : t
        ));
      });

      // ... more events
    };

    initializeSocket();

    return () => {
      ticketSocketService.disconnect();
    };
  }, [authToken]);

  return { tickets };
};
```

---

### 6.2 Recoil State Updates

**Pattern**: Event handlers update Recoil atoms, triggering reactive UI updates.

**Example**: DM state updates
```typescript
// Atom definition
const internalMessagesAtom = atom<Record<string, DMMessage[]>>({
  key: 'frontdesk.internal.messages',
  default: {}
});

// Event handler in hook
directMessagesWebSocketService.onNewMessage((event) => {
  setMessages(prev => ({
    ...prev,
    [event.message.conversationId]: [
      ...(prev[event.message.conversationId] || []),
      event.message
    ]
  }));
});

// Component auto-updates
const messages = useRecoilValue(internalMessagesAtom);
```

**Benefits**: Reactive, type-safe, and decoupled from WebSocket logic.

---

## 7. Error Handling & Reconnection

### 7.1 Connection Errors

**Types of Errors**:
- Authentication failure (invalid/expired JWT)
- Network timeout
- Server unavailable (ECONNREFUSED)

**Handling Pattern**:
```typescript
socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);

  if (error.message.includes('Authentication')) {
    // Clear session and redirect to login
    localStorage.removeItem('dm_session_id');
    redirectToLogin();
  } else if (error.message.includes('timeout')) {
    // Retry automatically (handled by Socket.IO)
    console.warn('Connection timeout - retrying...');
  } else if (error.message.includes('ECONNREFUSED')) {
    // Server down - show error banner
    showErrorBanner('Unable to connect to server');
  }
});
```

---

### 7.2 Automatic Reconnection

**Configuration**:
```typescript
io(`${serverUrl}/messaging`, {
  reconnection: true,              // Enable auto-reconnect
  reconnectionAttempts: 10,        // Max attempts
  reconnectionDelay: 1000,         // Initial delay (ms)
  reconnectionDelayMax: 5000       // Max delay (exponential backoff)
});
```

**Exponential Backoff**:
- Attempt 1: 1s delay
- Attempt 2: 2s delay
- Attempt 3: 4s delay
- Attempt 4: 5s delay (max)
- Attempt 5+: 5s delay (max)

**Events**:
```typescript
socket.on('reconnect', (attemptNumber) => {
  console.log(`Reconnected after ${attemptNumber} attempts`);
  // Re-sync state if needed
  fetchMissedMessages();
});

socket.on('reconnect_attempt', (attemptNumber) => {
  console.log(`Reconnection attempt ${attemptNumber}`);
});

socket.on('reconnect_failed', () => {
  console.error('Failed to reconnect after max attempts');
  showPersistentError('Unable to reconnect');
});
```

---

### 7.3 Event-Level Errors

**Pattern**: Some events support acknowledgment callbacks with error handling.

**Example**:
```typescript
socket.emit('dm:markAsRead', { conversationId, messageId }, (response) => {
  if (!response.success) {
    console.error('Mark as read failed:', response.error);
    // Revert optimistic UI update
    setUnreadCount(prev => prev + 1);
  }
});
```

---

## 8. Best Practices

### 8.1 Connection Management

**✅ DO**:
- Always disconnect on component unmount
- Use singleton services to prevent duplicate connections
- Clear all event listeners on disconnect
- Handle connection errors gracefully

**❌ DON'T**:
- Create multiple connections to the same namespace
- Forget to remove event listeners (memory leaks)
- Ignore reconnection events (may need state re-sync)
- Use socket.id for persistent tracking (ephemeral)

---

### 8.2 Event Handling

**✅ DO**:
- Use optimistic updates for better UX
- Reconcile optimistic updates with server confirmation
- Log all events for debugging (in dev mode)
- Type all event payloads with TypeScript

**❌ DON'T**:
- Block UI waiting for event confirmation
- Trust client-side data (always validate server response)
- Skip error handling in event listeners
- Use generic event names (namespace them: `dm:*`, `ticket.*`)

---

### 8.3 State Synchronization

**✅ DO**:
- Use Recoil atoms as single source of truth
- Update state atomically (all-or-nothing)
- Handle race conditions (use message IDs, not timestamps)
- Re-sync state on reconnection if needed

**❌ DON'T**:
- Store state in both local component and Recoil (duplicates)
- Mutate state directly (use immutable updates)
- Rely on event order (events may arrive out of order)
- Skip deduplication (same event may fire twice on reconnect)

---

### 8.4 Performance Optimization

**✅ DO**:
- Join/leave rooms to limit event scope
- Use pagination for large datasets
- Debounce high-frequency events (typing indicators)
- Batch state updates when possible

**❌ DON'T**:
- Subscribe to global events without filtering
- Update state on every keystroke (use debounce)
- Re-render entire lists on single item update
- Keep all historical messages in memory (paginate)

---

### 8.5 Debugging

**Enable Debug Mode**:
```typescript
// DM Service
window.DM_DEBUG = true;
// or
NEXT_PUBLIC_DM_DEBUG=true npm run dev
```

**Useful Debugging**:
```typescript
// Log all events
socket.onAny((eventName, ...args) => {
  console.log(`[Socket] ${eventName}`, args);
});

// Track connection state
socket.on('connect', () => console.log('Connected:', socket.id));
socket.on('disconnect', (reason) => console.log('Disconnected:', reason));
```

---

## 9. Architecture Decisions

### Why Socket.IO vs Native WebSocket?

**Reasons**:
- Automatic reconnection with backoff
- Fallback to HTTP long-polling (firewall-friendly)
- Built-in room/namespace support
- Acknowledgment callbacks
- Binary data support
- Cross-browser compatibility

---

### Why Multiple Services vs Single Service?

**Decision**: Hybrid approach
- **Shared connection**: `ticketSocketService` reuses `messagingService`
- **Independent connections**: `directMessagesWebSocketService`, `notificationsWebSocketService`

**Rationale**:
- Balance between efficiency (fewer connections) and isolation (fault tolerance)
- DM requires separate lifecycle (can disconnect independently)
- Tickets and DMs can share connection (both always needed)
- Notifications lightweight (minimal overhead for separate connection)

---

### Why Pub/Sub Pattern for Tickets?

**Decision**: Internal event emitter pattern

**Reasons**:
- Multiple subscribers per event (hook + notification handler)
- Decouples Socket.IO from business logic
- Easier testing (mock event emitters)
- Cleaner API (typed handler functions)

---

## 10. Monitoring & Observability

### Connection Health Metrics

**Track**:
- Connection state (connected/disconnected)
- Reconnection attempts
- Average latency (heartbeat RTT)
- Event throughput (events/sec)
- Error rate

**Implementation**:
```typescript
class MetricsCollector {
  private metrics = {
    connected: false,
    reconnectAttempts: 0,
    eventsReceived: 0,
    errors: 0
  };

  trackConnection(socket: Socket) {
    socket.on('connect', () => {
      this.metrics.connected = true;
      this.metrics.reconnectAttempts = 0;
    });

    socket.on('disconnect', () => {
      this.metrics.connected = false;
    });

    socket.on('reconnect_attempt', () => {
      this.metrics.reconnectAttempts++;
    });

    socket.onAny(() => {
      this.metrics.eventsReceived++;
    });
  }
}
```

---

## 11. Security Considerations

### Authentication

**JWT in Handshake**:
```typescript
io(`${serverUrl}/messaging`, {
  auth: { token: jwtToken }
});
```

**Backend Validation**:
- Verify JWT signature
- Check expiration
- Extract `printHouseId` for tenant isolation
- Join user to organization room

---

### Authorization

**Room-Based Isolation**:
- Backend broadcasts to `org:${printHouseId}` room
- Users only join rooms for their organization
- Frontend never receives events for other tenants

**Event Filtering** (backend):
- Ticket events: Only for user's organization
- DM events: Only for conversations user is member of
- Notification events: Only for target user

---

## 12. Future Improvements

**Potential Enhancements**:
1. **Connection State Recovery**: Persist event queue for reconnection
2. **Message Queue**: Offline message sending with retry
3. **Event Compression**: Reduce bandwidth for high-traffic events
4. **Priority Queues**: Critical events (SLA breach) prioritized over others
5. **Load Balancing**: Socket.IO sticky sessions with Redis adapter
6. **Metrics Dashboard**: Real-time connection health monitoring
