# Notifications Frontend API Integration Guide

This document describes what the frontend should read, send, when, and which endpoints/DTOs to use for Chatwoot notifications.

---

## Table of Contents

1. [REST API Endpoints](#rest-api-endpoints)
2. [Request/Response DTOs](#requestresponse-dtos)
3. [WebSocket Events](#websocket-events)
4. [When to Fetch/Update](#when-to-fetchupdate)
5. [Implementation Examples](#implementation-examples)

---

## REST API Endpoints

### Base URL
All endpoints are scoped to an account:
```
/api/v1/accounts/{account_id}/notifications
```

### Endpoint Summary

| Method | Endpoint | Purpose | When to Use |
|--------|----------|----------|-------------|
| `GET` | `/notifications` | List notifications | On page load, when opening notifications panel |
| `GET` | `/notifications/unread_count` | Get unread count | On app load, periodically, after actions |
| `POST` | `/notifications/read_all` | Mark all as read | User clicks "Mark all as read" |
| `POST` | `/notifications/read_all` | Mark notifications for conversation as read | User opens a conversation |
| `PATCH` | `/notifications/:id` | Mark single notification as read | User clicks on notification |
| `POST` | `/notifications/:id/unread` | Mark notification as unread | User marks notification unread |
| `DELETE` | `/notifications/:id` | Delete single notification | User deletes notification |
| `POST` | `/notifications/destroy_all` | Delete all notifications | User clears all notifications |
| `POST` | `/notifications/:id/snooze` | Snooze notification | User snoozes notification |

---

## Request/Response DTOs

### 1. GET `/notifications` - List Notifications

#### Request Query Parameters
```typescript
interface NotificationListParams {
  page?: number;              // Default: 1, pagination
  sort_order?: 'asc' | 'desc'; // Default: 'desc'
  includes?: ('read' | 'snoozed')[]; // Filter: include read/snoozed notifications
}
```

#### Example Request
```http
GET /api/v1/accounts/1/notifications?page=1&sort_order=desc&includes[]=read
```

#### Response Structure
```typescript
interface NotificationListResponse {
  data: {
    meta: {
      unread_count: number;    // Count of unread notifications
      count: number;            // Total count (including read)
      current_page: number;     // Current page number
    };
    payload: NotificationDTO[];  // Array of notifications
  };
}
```

#### NotificationDTO
```typescript
interface NotificationDTO {
  id: number;
  notification_type: NotificationType;
  push_message_title: string;   // Human-readable title
  push_message_body: string;    // Human-readable body/message
  primary_actor_type: string;    // Always "Conversation"
  primary_actor_id: number;      // Conversation ID
  primary_actor: {                // Full conversation object
    id: number;
    conversation_id: number;      // Display ID
    display_id: string;           // Human-readable ID (e.g., "#1234")
    inbox_id: number;
    status: string;
    meta: {
      assignee?: {
        id: number;
        name: string;
        thumbnail: string;
      };
    };
    // ... other conversation fields
  };
  secondary_actor?: {             // Optional: Message or User who triggered notification
    id: number;
    content?: string;
    message_type?: number;
    sender?: {
      id: number;
      name: string;
      thumbnail: string;
    };
    // ... other message/user fields
  };
  read_at: string | null;          // ISO datetime string or null
  user: {                          // User who receives notification
    id: number;
    name: string;
    email: string;
  };
  created_at: number;              // Unix timestamp
  last_activity_at: number;        // Unix timestamp
  snoozed_until: string | null;    // ISO datetime string or null
  meta: Record<string, any>;      // Additional metadata
  account_id: number;
}
```

#### Notification Types
```typescript
enum NotificationType {
  CONVERSATION_CREATION = 'conversation_creation',
  CONVERSATION_ASSIGNMENT = 'conversation_assignment',
  ASSIGNED_CONVERSATION_NEW_MESSAGE = 'assigned_conversation_new_message',
  CONVERSATION_MENTION = 'conversation_mention',
  PARTICIPATING_CONVERSATION_NEW_MESSAGE = 'participating_conversation_new_message',
  SLA_MISSED_FIRST_RESPONSE = 'sla_missed_first_response',
  SLA_MISSED_NEXT_RESPONSE = 'sla_missed_next_response',
  SLA_MISSED_RESOLUTION = 'sla_missed_resolution',
}
```

---

### 2. GET `/notifications/unread_count` - Get Unread Count

#### Request
```http
GET /api/v1/accounts/1/notifications/unread_count
```

#### Response
```typescript
interface UnreadCountResponse {
  unread_count: number;
}
```

---

### 3. POST `/notifications/read_all` - Mark All as Read

#### Request Body (Option 1: Mark all)
```typescript
// Empty body - marks all notifications as read
POST /api/v1/accounts/1/notifications/read_all
Body: {}
```

#### Request Body (Option 2: Mark for specific conversation)
```typescript
interface ReadAllRequest {
  primary_actor_type: 'Conversation';  // Must be "Conversation"
  primary_actor_id: number;             // Conversation ID
}
```

#### Example Request
```http
POST /api/v1/accounts/1/notifications/read_all
Content-Type: application/json

{
  "primary_actor_type": "Conversation",
  "primary_actor_id": 123
}
```

#### Response
```http
204 No Content
```

---

### 4. PATCH `/notifications/:id` - Mark Single as Read

#### Request
```http
PATCH /api/v1/accounts/1/notifications/42
```

#### Response
```typescript
// Returns updated NotificationDTO
NotificationDTO
```

---

### 5. POST `/notifications/:id/unread` - Mark as Unread

#### Request
```http
POST /api/v1/accounts/1/notifications/42/unread
```

#### Response
```typescript
// Returns updated NotificationDTO with read_at: null
NotificationDTO
```

---

### 6. DELETE `/notifications/:id` - Delete Notification

#### Request
```http
DELETE /api/v1/accounts/1/notifications/42
```

#### Response
```http
204 No Content
```

---

### 7. POST `/notifications/destroy_all` - Delete All

#### Request Body
```typescript
interface DestroyAllRequest {
  type: 'read' | 'all';  // Delete only read notifications or all
}
```

#### Example Request
```http
POST /api/v1/accounts/1/notifications/destroy_all
Content-Type: application/json

{
  "type": "read"  // or "all"
}
```

#### Response
```http
204 No Content
```

---

### 8. POST `/notifications/:id/snooze` - Snooze Notification

#### Request Body
```typescript
interface SnoozeRequest {
  snoozed_until: string | null;  // ISO datetime string or null to unsnooze
}
```

#### Example Request
```http
POST /api/v1/accounts/1/notifications/42/snooze
Content-Type: application/json

{
  "snoozed_until": "2024-12-25T10:00:00Z"  // or null to unsnooze
}
```

#### Response
```typescript
// Returns updated NotificationDTO
NotificationDTO
```

---

## WebSocket Events

The frontend **MUST** subscribe to ActionCable WebSocket events for real-time updates.

### Connection Setup

```javascript
// Connect to ActionCable with user's pubsub_token
const cable = ActionCable.createConsumer(websocketURL);
const subscription = cable.subscriptions.create(
  { channel: 'RoomChannel', pubsub_token: userPubsubToken },
  {
    received(data) {
      // Handle events
    }
  }
);
```

### Events to Listen For

#### 1. `notification.created`

**When:** A new notification is created for the user.

**Event Payload:**
```typescript
interface NotificationCreatedEvent {
  notification: NotificationDTO;  // Full notification object
  unread_count: number;            // Updated unread count
  count: number;                   // Total count
  account_id: number;
  performer?: {                    // Optional: User who performed action
    id: number;
    name: string;
    email: string;
  };
}
```

**Action:** Add notification to list, update unread count badge.

---

#### 2. `notification.updated`

**When:** An existing notification is updated (e.g., marked as read, snoozed).

**Event Payload:**
```typescript
interface NotificationUpdatedEvent {
  notification: NotificationDTO;  // Updated notification object
  unread_count: number;          // Updated unread count
  count: number;                 // Total count
  account_id: number;
}
```

**Action:** Update notification in list, update unread count badge.

---

#### 3. `notification.deleted`

**When:** A notification is deleted.

**Event Payload:**
```typescript
interface NotificationDeletedEvent {
  notification: {
    id: number;  // Only ID is sent
  };
  unread_count: number;  // Updated unread count
  count: number;         // Total count
  account_id: number;
}
```

**Action:** Remove notification from list, update unread count badge.

---

## When to Fetch/Update

### Initial Load

1. **On App Load:**
   - Fetch unread count: `GET /notifications/unread_count`
   - Fetch first page: `GET /notifications?page=1&sort_order=desc`
   - Subscribe to WebSocket events

2. **On Notifications Page Open:**
   - Fetch notifications: `GET /notifications?page=1&sort_order=desc&includes[]=read`
   - Include read notifications to show full history

### Real-time Updates

- **Always listen to WebSocket events** (`notification.created`, `notification.updated`, `notification.deleted`)
- Update UI immediately when events are received
- No need to refetch unless pagination is required

### User Actions

1. **User Clicks Notification:**
   - Mark as read: `PATCH /notifications/:id` or `POST /notifications/read_all` (with conversation)
   - Navigate to conversation

2. **User Clicks "Mark All as Read":**
   - Call: `POST /notifications/read_all`
   - Update local state immediately

3. **User Opens Conversation:**
   - Mark all notifications for that conversation as read: `POST /notifications/read_all` (with conversation ID)
   - Prevents duplicate notifications

4. **User Deletes Notification:**
   - Call: `DELETE /notifications/:id`
   - Update local state immediately

5. **User Snoozes Notification:**
   - Call: `POST /notifications/:id/snooze`
   - Update local state immediately

### Periodic Refresh

- **Optional:** Refresh unread count every 30-60 seconds if WebSocket connection is unreliable
- **Not recommended:** Polling for notifications if WebSocket is working

---

## Implementation Examples

### Example 1: Fetch Notifications on Page Load

```typescript
// Fetch initial notifications
async function loadNotifications() {
  try {
    // 1. Get unread count for badge
    const countResponse = await api.get('/notifications/unread_count');
    setUnreadCount(countResponse.data.unread_count);
    
    // 2. Get first page of notifications
    const notificationsResponse = await api.get('/notifications', {
      params: {
        page: 1,
        sort_order: 'desc'
      }
    });
    
    const { payload, meta } = notificationsResponse.data.data;
    setNotifications(payload);
    setMeta(meta);
    
  } catch (error) {
    console.error('Failed to load notifications:', error);
  }
}
```

### Example 2: Handle WebSocket Events

```typescript
// Setup WebSocket listener
function setupNotificationWebSocket() {
  cable.subscriptions.create(
    { channel: 'RoomChannel', pubsub_token: userPubsubToken },
    {
      received(data) {
        switch (data.event) {
          case 'notification.created':
            handleNotificationCreated(data);
            break;
          case 'notification.updated':
            handleNotificationUpdated(data);
            break;
          case 'notification.deleted':
            handleNotificationDeleted(data);
            break;
        }
      }
    }
  );
}

function handleNotificationCreated(data: NotificationCreatedEvent) {
  // Add notification to top of list
  setNotifications(prev => [data.notification, ...prev]);
  
  // Update unread count
  setUnreadCount(data.unread_count);
  
  // Show badge/indicator
  showNotificationBadge();
}

function handleNotificationUpdated(data: NotificationUpdatedEvent) {
  // Update notification in list
  setNotifications(prev => 
    prev.map(n => n.id === data.notification.id ? data.notification : n)
  );
  
  // Update unread count
  setUnreadCount(data.unread_count);
}

function handleNotificationDeleted(data: NotificationDeletedEvent) {
  // Remove notification from list
  setNotifications(prev => 
    prev.filter(n => n.id !== data.notification.id)
  );
  
  // Update unread count
  setUnreadCount(data.unread_count);
}
```

### Example 3: Mark Notification as Read

```typescript
async function markNotificationAsRead(notificationId: number) {
  try {
    // Optimistic update
    setNotifications(prev =>
      prev.map(n => 
        n.id === notificationId 
          ? { ...n, read_at: new Date().toISOString() }
          : n
      )
    );
    
    // API call
    await api.patch(`/notifications/${notificationId}`);
    
    // Update unread count
    setUnreadCount(prev => Math.max(0, prev - 1));
    
  } catch (error) {
    // Revert on error
    console.error('Failed to mark as read:', error);
    // Refetch notifications
  }
}
```

### Example 4: Open Conversation and Mark Related Notifications as Read

```typescript
async function openConversation(conversationId: number) {
  try {
    // Mark all notifications for this conversation as read
    await api.post('/notifications/read_all', {
      primary_actor_type: 'Conversation',
      primary_actor_id: conversationId
    });
    
    // Update local state
    setNotifications(prev =>
      prev.map(n => 
        n.primary_actor_id === conversationId && !n.read_at
          ? { ...n, read_at: new Date().toISOString() }
          : n
      )
    );
    
    // Navigate to conversation
    navigate(`/conversations/${conversationId}`);
    
  } catch (error) {
    console.error('Failed to mark conversation notifications as read:', error);
  }
}
```

### Example 5: Pagination

```typescript
async function loadMoreNotifications(page: number) {
  try {
    const response = await api.get('/notifications', {
      params: {
        page,
        sort_order: 'desc',
        includes: ['read']  // Include read notifications for pagination
      }
    });
    
    const { payload, meta } = response.data.data;
    
    // Append to existing notifications
    setNotifications(prev => [...prev, ...payload]);
    setMeta(meta);
    
    // Check if more pages available
    if (payload.length < 15) {
      setHasMore(false);
    }
    
  } catch (error) {
    console.error('Failed to load more notifications:', error);
  }
}
```

---

## Important Notes

1. **Pagination:** Each page returns 15 notifications (`RESULTS_PER_PAGE = 15`)
2. **Real-time:** Always use WebSocket events for real-time updates, not polling
3. **Optimistic Updates:** Update UI immediately, then sync with server
4. **Error Handling:** Always handle errors and revert optimistic updates on failure
5. **Account Scoping:** All endpoints are account-scoped (use `account_id` in URL)
6. **Authentication:** All requests require authentication token
7. **Primary Actor:** Currently only supports `Conversation` type
8. **Unread Count:** Updated via WebSocket events, but can be fetched separately

---

## Related Files

- **Backend Controller:** `app/controllers/api/v1/accounts/notifications_controller.rb`
- **Backend Model:** `app/models/notification.rb`
- **Backend Finder:** `app/finders/notification_finder.rb`
- **Backend Listener:** `app/listeners/action_cable_listener.rb`
- **Frontend API:** `app/javascript/dashboard/api/notifications.js`
- **Frontend Store:** `app/javascript/dashboard/store/modules/notifications/`
- **Frontend Component:** `app/javascript/dashboard/routes/dashboard/notifications/components/NotificationTable.vue`

