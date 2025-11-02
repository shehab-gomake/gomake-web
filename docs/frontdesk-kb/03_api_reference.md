# API Reference

Complete REST API and WebSocket event reference for FrontDesk services.

**Base URL**: Configured via `config.api_server` or `config.messaging_server`
**Authentication**: All endpoints require `Authorization: Bearer <JWT>` header
**Tenant Scoping**: Automatic via `printHouseId` extracted from JWT

---

## Table of Contents

1. [Direct Messages REST API](#1-direct-messages-rest-api)
2. [Tickets REST API](#2-tickets-rest-api)
3. [Notifications REST API](#3-notifications-rest-api)
4. [WebSocket Events](#4-websocket-events)

---

## 1. Direct Messages REST API

**Base Path**: `/api/dms`
**Service**: `directMessagesService`

### 1.1 Conversations

#### Create Conversation
```
POST /api/dms
```

**Request Body**:
```typescript
{
  participantIds: string[];  // Array of user IDs
  name?: string;             // Optional: for group conversations
}
```

**Response**:
```typescript
{
  conversation: Conversation;
  members: ConversationMember[];
}
```

**Example**:
```typescript
const { conversation, members } = await directMessagesService.createConversation({
  participantIds: ['user1', 'user2'],
  name: 'Project Team' // optional
});
```

---

#### List Conversations
```
GET /api/dms?limit=50&offset=0&includeArchived=false
```

**Query Parameters**:
- `limit` (number, optional): Max results, default 50
- `offset` (number, optional): Pagination offset, default 0
- `includeArchived` (boolean, optional): Include archived conversations, default false

**Response**:
```typescript
{
  conversations: Conversation[];
  hasMore: boolean;
  total: number;
}
```

---

#### Get Single Conversation
```
GET /api/dms/:conversationId
```

**Response**: `Conversation`

---

#### Archive/Unarchive Conversation
```
POST /api/dms/:conversationId/archive
POST /api/dms/:conversationId/unarchive
```

**Response**: `void`

---

#### Favorite/Unfavorite Conversation
```
POST /api/dms/:conversationId/favorite
POST /api/dms/:conversationId/unfavorite
```

**Response**: `void`

---

#### Leave Conversation (Group Only)
```
POST /api/dms/:conversationId/leave
```

**Response**: `void`

---

#### Add Members to Group
```
POST /api/dms/:conversationId/add-members
```

**Request Body**:
```typescript
{
  userIds: string[];
}
```

**Response**: `Conversation`

---

#### Get Conversation Members
```
GET /api/dms/:conversationId/members
```

**Response**: `ConversationMember[]`

---

### 1.2 Messages

#### List Messages (Paginated)
```
GET /api/dms/:conversationId/messages?before=msgId&after=msgId&limit=50
```

**Query Parameters**:
- `before` (string, optional): Load messages before this message ID
- `after` (string, optional): Load messages after this message ID
- `limit` (number, optional): Max results, default 50

**Response**:
```typescript
{
  messages: DMMessage[];
  hasMore: boolean;
  total: number;
}
```

---

#### Send Message (REST)
```
POST /api/dms/:conversationId/messages
```

**Request Body**:
```typescript
{
  content: string;
  metadata?: {
    type: 'text' | 'file' | 'image';
  };
}
```

**Response**: `DMMessage`

---

#### Mark Conversation as Read
```
POST /api/dms/:conversationId/read
```

**Request Body**:
```typescript
{
  messageId?: string;  // Optional: mark up to this message
}
```

**Response**: `void`

---

### 1.3 Search

#### Search Conversations
```
GET /api/dms/search?q=query
```

**Query Parameters**:
- `q` (string, required): Search query

**Response**: `Conversation[]`

---

#### Search All Messages (Global)
```
GET /api/dms/search?query=text&limit=20&offset=0&sortBy=relevance&useFullText=true&includeConversationInfo=true
```

**Query Parameters**:
- `query` (string, required): Search text
- `limit` (number, optional): Max results, default 20
- `offset` (number, optional): Pagination offset, default 0
- `sortBy` (string, optional): 'relevance' | 'date_desc' | 'date_asc', default 'relevance'
- `useFullText` (boolean, optional): Use PostgreSQL full-text search, default false
- `includeConversationInfo` (boolean, optional): Include conversation metadata, default false

**Response**:
```typescript
{
  results: Array<{
    id: string;
    conversationId: string;
    content: string;
    contentSnippet: string;
    createdAt: string;
    userId: string;
    isSystem: boolean;
    rank?: number;
    highlights?: Array<{ start: number; end: number; text: string }>;
    messagePosition?: {
      messageIndex: number;
      totalMessages: number;
      previousMessageId?: string;
      nextMessageId?: string;
    };
    user?: { name: string; firstName: string; lastName: string };
    conversation?: { id: string; name: string; type: string; participantCount: number };
  }>;
  total: number;
  hasMore: boolean;
}
```

---

#### Search Messages in Conversation
```
GET /api/dms/:conversationId/search?query=text&limit=20&sortBy=relevance
```

**Query Parameters**: Same as global search

**Response**: Similar to global search but scoped to conversation

---

### 1.4 User Discovery

#### Get User Suggestions
```
GET /api/users/search?q=name&limit=10&onlineOnly=false&department=Engineering&role=user
```

**Query Parameters**:
- `q` (string, optional): Search query
- `limit` (number, optional): Max results, default 10
- `onlineOnly` (boolean, optional): Only online users, default false
- `department` (string, optional): Filter by department
- `role` (string, optional): Filter by role

**Response**: `ConversationMember[]`

---

## 2. Tickets REST API

**Base Path**: `/api/tickets`
**Service**: `ticketsService`

### 2.1 Core Ticket Operations

#### List Tickets
```
GET /api/tickets?status=OPEN&priority=HIGH&tags=urgent&page=1&limit=20&sortBy=createdAt&sortOrder=desc
```

**Query Parameters**:
- `search` (string): Full-text search
- `status` (string): OPEN | IN_PROGRESS | RESOLVED | CLOSED
- `priority` (string): LOW | MEDIUM | HIGH | URGENT
- `assigneeId` (string): Filter by assigned agent
- `managerId` (string): Filter by manager
- `categoryId` (string): Filter by category
- `createdBy` (string): Filter by creator
- `customerEmail` (string): Filter by customer email
- `customerPhone` (string): Filter by customer phone
- `providerChannel` (string): Filter by provider channel ID
- `tags` (string[]): Filter by tags (can repeat parameter)
- `page` (number): Page number, default 1
- `limit` (number): Results per page, default 20
- `sortBy` (string): Field to sort by, default 'createdAt'
- `sortOrder` (string): 'asc' | 'desc', default 'desc'

**Response**:
```typescript
{
  tickets: TicketWithDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

#### Get Single Ticket
```
GET /api/tickets/:ticketId
```

**Response**: `TicketWithDetails`

---

#### Create Ticket from Conversation
```
POST /api/tickets/create-from-conversation
```

**Request Body**:
```typescript
{
  subject: string;
  content: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  categoryId?: string;
  providerChannelId: string;      // Required: which channel to use
  conversationId: string;          // Required: source conversation
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  assigneeId?: string;
  managerId?: string;
}
```

**Response**: `TicketWithDetails`

---

#### Reply to Ticket
```
POST /api/tickets/:ticketId/reply
```

**Request Body**:
```typescript
{
  content: string;
  conversationId: string;  // REQUIRED: which channel/conversation to reply on
}
```

**Response**:
```typescript
{
  ticket: TicketWithDetails;
  message: TicketMessage;
}
```

**Note**: `conversationId` is **REQUIRED** as tickets can span multiple channels (Email, WhatsApp, SMS).

---

#### Update Ticket (General Purpose)
```
PATCH /api/tickets/:ticketId
```

**Request Body** (all fields optional, only include what you want to update):
```typescript
{
  subject?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  categoryId?: string;
  assigneeId?: string;
  managerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}
```

**Response**:
```typescript
{
  ticket: TicketWithDetails;
  changes: {
    field: { old: any; new: any };
  };
}
```

---

#### Reopen Ticket (Manager/Admin)
```
POST /api/tickets/:ticketId/reopen
```

**Response**:
```typescript
{
  ticket: TicketWithDetails;
}
```

---

#### Merge Tickets (Manager/Admin)
```
POST /api/tickets/:sourceTicketId/merge
```

**Request Body**:
```typescript
{
  targetTicketId: string;
}
```

**Response**:
```typescript
{
  success: boolean;
  message: string;
}
```

---

### 2.2 Assignment & Workload

#### Assign Ticket
```
POST /api/tickets/:ticketId/assign
```

**Request Body**:
```typescript
{
  assigneeId: string;
}
```

**Response**:
```typescript
{
  ticket: TicketWithDetails;
  assignee: User;
}
```

---

#### Bulk Assign Tickets
```
POST /api/tickets/bulk-assign
```

**Request Body**:
```typescript
{
  ticketIds: string[];
  assigneeId: string;
}
```

**Response**:
```typescript
{
  success: boolean;
  assigned: number;
  failed: number;
  tickets: TicketWithDetails[];
}
```

---

#### Get Unassigned Tickets
```
GET /api/tickets/dashboard/unassigned?priority=HIGH&categoryId=cat123
```

**Query Parameters**:
- `priority` (string, optional): Filter by priority
- `categoryId` (string, optional): Filter by category

**Response**: `TicketWithDetails[]`

---

#### Get Agent Workload
```
GET /api/tickets/dashboard/workload
```

**Response**:
```typescript
AgentWorkload[] = Array<{
  userId: string;
  userName: string;
  openTickets: number;
  inProgressTickets: number;
  totalTickets: number;
  avgResolutionTime: number;  // in minutes
}>
```

---

### 2.3 Discovery & Insights

#### Get Related Tickets
```
GET /api/tickets/:ticketId/related
```

**Response**:
```typescript
RelatedTicket[] = Array<{
  id: string;
  subject: string;
  status: string;
  similarity: number;  // 0-1 score
  reason: string;      // Why it's related
}>
```

---

#### Get Ticket History
```
GET /api/tickets/:ticketId/history
```

**Response**:
```typescript
TicketHistoryEntry[] = Array<{
  id: string;
  ticketId: string;
  action: string;
  fieldName?: string;
  oldValue?: any;
  newValue?: any;
  userId: string;
  userName: string;
  createdAt: string;
}>
```

---

#### Get Customer Ticket History
```
GET /api/tickets/customer/:identifier
```

**Path Parameters**:
- `identifier`: Customer email or phone number

**Response**: `TicketWithDetails[]`

---

### 2.4 Providers & Channels

#### Get All Providers
```
GET /api/providers
```

**Response**:
```typescript
Provider[] = Array<{
  id: string;
  type: 'EMAIL' | 'WHATSAPP' | 'SMS' | 'TELEGRAM';
  name: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  config: Record<string, any>;
  printHouseId: string;
  createdAt: string;
}>
```

---

#### Get Single Provider
```
GET /api/providers/:providerId
```

**Response**: `Provider`

---

### 2.5 Tag Management

#### List All Tags
```
GET /api/tickets/tags?category=PRIORITY&search=urgent&page=1&limit=50
```

**Query Parameters**:
- `category` (string, optional): Filter by category
- `search` (string, optional): Search by name
- `page` (number, optional): Page number
- `limit` (number, optional): Results per page

**Response**:
```typescript
Tag[] = Array<{
  id: string;
  name: string;
  color?: string;
  category?: string;
  usageCount: number;
  printHouseId: string;
  createdAt: string;
}>
```

---

#### Get Popular Tags
```
GET /api/tickets/tags/popular?limit=10&category=PRIORITY
```

**Query Parameters**:
- `limit` (number, optional): Max results, default 10
- `category` (string, optional): Filter by category

**Response**: `Tag[]`

---

#### Suggest Tags (Autocomplete)
```
GET /api/tickets/tags/suggest?query=ur&limit=5&category=PRIORITY
```

**Query Parameters**:
- `query` (string, required): Partial tag name
- `limit` (number, optional): Max results, default 5
- `category` (string, optional): Filter by category

**Response**: `Tag[]`

---

#### Create Tag (Admin/Manager)
```
POST /api/tickets/tags
```

**Request Body**:
```typescript
{
  name: string;
  color?: string;
  category?: string;
}
```

**Response**: `Tag`

---

#### Update Tag (Admin/Manager)
```
PATCH /api/tickets/tags/:tagId
```

**Request Body**:
```typescript
{
  name?: string;
  color?: string;
  category?: string;
}
```

**Response**: `Tag`

---

#### Delete Tag (Admin/Manager)
```
DELETE /api/tickets/tags/:tagId
```

**Response**:
```typescript
{
  success: boolean;
  message: string;
}
```

---

#### Get Ticket Tags
```
GET /api/tickets/:ticketId/tags
```

**Response**: `Tag[]`

---

#### Add Tags to Ticket
```
POST /api/tickets/:ticketId/tags
```

**Request Body**:
```typescript
{
  tags: string[];  // Tag names (auto-creates if doesn't exist)
}
```

**Response**: `Tag[]` (all tags now on ticket)

---

#### Remove Tag from Ticket
```
DELETE /api/tickets/:ticketId/tags/:tagId
```

**Response**:
```typescript
{
  success: boolean;
  message: string;
}
```

---

### 2.6 Ticket View Tracking

#### Get Ticket View Status
```
GET /api/tickets/:ticketId/view-status
```

**Response**:
```typescript
{
  ticketId: string;
  userId: string;
  lastViewedAt?: string;
  hasUnread: boolean;
}
```

---

#### Mark Ticket as Read
```
PATCH /api/tickets/:ticketId/mark-read
```

**Response**:
```typescript
{
  success: boolean;
  message: string;
}
```

---

#### Get Unread Tickets Count
```
GET /api/tickets/unread-count
```

**Response**:
```typescript
{
  count: number;
}
```

---

## 3. Notifications REST API

**Base Path**: `/api/notifications`
**Service**: `notificationsService`

### 3.1 Notification Operations

#### Get Notifications
```
GET /api/notifications?type=TICKET_ASSIGNED&unreadOnly=true&page=1&limit=20
```

**Query Parameters**:
- `type` (string, optional): Filter by notification type
- `unreadOnly` (boolean, optional): Only unread notifications
- `page` (number, optional): Page number, default 1
- `limit` (number, optional): Results per page, default 20

**Response**:
```typescript
{
  data: BackendNotification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

---

#### Get Unread Count
```
GET /api/notifications/unread/count?type=TICKET_ASSIGNED
```

**Query Parameters**:
- `type` (string, optional): Count for specific type only

**Response**:
```typescript
{
  count: number;
  type?: string;
}
```

---

#### Mark as Read
```
POST /api/notifications/:notificationId/read
```

**Response**: `BackendNotification`

---

#### Mark All as Read
```
POST /api/notifications/mark-all-read?type=TICKET_ASSIGNED
```

**Query Parameters**:
- `type` (string, optional): Mark specific type only

**Response**:
```typescript
{
  count: number;
  message: string;
}
```

---

#### Dismiss Notification
```
POST /api/notifications/:notificationId/dismiss
```

**Response**: `BackendNotification`

---

#### Delete Notification
```
DELETE /api/notifications/:notificationId
```

**Response**:
```typescript
{
  success: boolean;
  message: string;
}
```

---

## 4. WebSocket Events

**Namespace**: `/messaging`
**Connection**: Socket.IO with JWT authentication

### 4.1 Connection

```typescript
import { io } from 'socket.io-client';
import config from '@/config';

const socket = io(`${config.messaging_server}/messaging`, {
  auth: { token: userJWT },
  transports: ['websocket', 'polling'],
  reconnection: true
});
```

---

### 4.2 Direct Messages Events

#### Emitted by Client

**dm:sendMessage**
```typescript
socket.emit('dm:sendMessage', {
  conversationId: string;
  content: string;
  tempId: string;  // For optimistic updates
  metadata?: { type: 'text' | 'file' | 'image' };
});
```

**dm:typingStart**
```typescript
socket.emit('dm:typingStart', {
  conversationId: string;
});
```

**dm:typingStop**
```typescript
socket.emit('dm:typingStop', {
  conversationId: string;
});
```

**dm:markAsRead**
```typescript
socket.emit('dm:markAsRead', {
  conversationId: string;
  messageId?: string;
});
```

**joinConversation**
```typescript
socket.emit('joinConversation', {
  conversationId: string;
}, (response) => {
  console.log(response.success);
});
```

**leaveConversation**
```typescript
socket.emit('leaveConversation', {
  conversationId: string;
}, (response) => {
  console.log(response.success);
});
```

---

#### Received by Client

**dm:newMessage**
```typescript
socket.on('dm:newMessage', (data: {
  message: DMMessage;
  conversation: Conversation;
}) => {
  // Handle new message
});
```

**dm:messageConfirmed**
```typescript
socket.on('dm:messageConfirmed', (data: {
  tempId: string;
  messageId: string;
  conversationId: string;
  message: DMMessage;
}) => {
  // Replace temp message with confirmed one
});
```

**dm:userTyping**
```typescript
socket.on('dm:userTyping', (data: {
  conversationId: string;
  userId: string;
  userEmail: string;
  userName: string;
  isTyping: boolean;
}) => {
  // Show/hide typing indicator
});
```

**dm:messageRead**
```typescript
socket.on('dm:messageRead', (data: {
  conversationId: string;
  messageId: string;
  userId: string;
  readAt: string;
}) => {
  // Update read receipts
});
```

**dm:unreadCountUpdated**
```typescript
socket.on('dm:unreadCountUpdated', (data: {
  conversationId: string;
  unreadCount: number;
}) => {
  // Update badge
});
```

**dm:conversationUpdated**
```typescript
socket.on('dm:conversationUpdated', (data: {
  conversation: Conversation;
  changes: Record<string, any>;
}) => {
  // Update conversation metadata
});
```

**dm:welcome**
```typescript
socket.on('dm:welcome', (data: {
  conversationIds: string[];
}) => {
  // Initial sync on connect
});
```

**presence:update**
```typescript
socket.on('presence:update', (data: {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: string;
}) => {
  // Update user presence
});
```

---

### 4.3 Ticket Events (20 Events)

All ticket events follow this pattern:
```typescript
socket.on('event.name', (payload: EventPayload) => {
  // Handle event
});
```

#### Core Ticket Events

**ticket.created**
```typescript
{
  ticket: TicketWithDetails;
  createdBy: User;
}
```

**ticket.updated**
```typescript
{
  ticket: TicketWithDetails;
  changes: {
    [field: string]: { old: any; new: any };
  };
  updatedBy: User;
}
```

**ticket.assigned**
```typescript
{
  ticket: TicketWithDetails;
  assignee: User;
  assignedBy: User;
}
```

**ticket.status.changed**
```typescript
{
  ticket: TicketWithDetails;
  oldStatus: string;
  newStatus: string;
  changedBy: User;
}
```

**ticket.reply.sent**
```typescript
{
  ticket: TicketWithDetails;
  message: TicketMessage;
  sentBy: User;
}
```

**ticket.reopened**
```typescript
{
  ticket: TicketWithDetails;
  reopenedBy: User;
}
```

**ticket.merged**
```typescript
{
  sourceTicket: TicketWithDetails;
  targetTicket: TicketWithDetails;
  mergedBy: User;
}
```

---

#### Bulk Operations

**tickets.bulkAssigned**
```typescript
{
  tickets: TicketWithDetails[];
  assigneeId: string;
  assignee: User;
  assignedBy: User;
}
```

---

#### Customer Communication

**ticket.message.received**
```typescript
{
  ticket: TicketWithDetails;
  message: TicketMessage;
  channel: 'EMAIL' | 'WHATSAPP' | 'SMS';
  provider: Provider;
}
```

**ticket.customer.updated**
```typescript
{
  ticket: TicketWithDetails;
  oldCustomer: CustomerInfo;
  newCustomer: CustomerInfo;
  updatedBy: User;
}
```

---

#### System Events

**sla.breached**
```typescript
{
  ticket: TicketWithDetails;
  slaType: 'FIRST_RESPONSE' | 'RESOLUTION';
  breachedAt: string;
  minutesLate: number;
}
```

**ticket.autoResponse**
```typescript
{
  ticket: TicketWithDetails;
  template: string;
  message: TicketMessage;
  sentAt: string;
}
```

**webhook.message.processed**
```typescript
{
  ticket: TicketWithDetails;
  provider: Provider;
  messageId: string;
  processedAt: string;
}
```

---

#### Message Delivery

**message.delivered**
```typescript
{
  ticketId: string;
  messageId: string;
  channel: 'EMAIL' | 'WHATSAPP' | 'SMS';
  deliveredAt: string;
  externalId?: string;
}
```

**message.delivery.failed**
```typescript
{
  ticketId: string;
  messageId: string;
  channel: 'EMAIL' | 'WHATSAPP' | 'SMS';
  error: string;
  failedAt: string;
}
```

---

#### Review Queue

**conversation.needs.review**
```typescript
{
  conversationId: string;
  provider: Provider;
  message: TicketMessage;
  customerInfo: CustomerInfo;
  timestamp: string;
}
```

---

#### Tag Events

**ticket.tags.added**
```typescript
{
  ticketId: string;
  ticket: TicketWithDetails;
  tags: Tag[];
  addedBy: User;
}
```

**ticket.tag.removed**
```typescript
{
  ticketId: string;
  ticket: TicketWithDetails;
  tagId: string;
  tagName: string;
  removedBy: User;
}
```

**tag.created**
```typescript
{
  tag: Tag;
  createdBy: User;
}
```

**tag.deleted**
```typescript
{
  tagId: string;
  tagName: string;
  deletedBy: User;
}
```

---

### 4.4 Notification Events

**notification:new**
```typescript
socket.on('notification:new', (notification: BackendNotification) => {
  // Handle new notification
});
```

**notification:read**
```typescript
socket.on('notification:read', (data: {
  id: string;
  readAt: string;
}) => {
  // Mark notification as read in UI
});
```

**notification:unreadCount**
```typescript
socket.on('notification:unreadCount', (data: {
  count: number;
  type?: string;
}) => {
  // Update badge count
});
```

---

## 5. Error Handling

### REST API Errors

All API errors follow this format:
```typescript
{
  success: false;
  error: string;
  message: string;
  statusCode: number;
  details?: any;
}
```

**Common Status Codes**:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing JWT)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

---

### WebSocket Errors

**Connection Errors**:
```typescript
socket.on('connect_error', (error: Error) => {
  console.error('Connection failed:', error.message);
});
```

**Authentication Errors**:
```typescript
socket.on('error', (error: { message: string }) => {
  if (error.message.includes('Authentication')) {
    // Token invalid/expired
  }
});
```

**Event Errors**:
```typescript
socket.emit('eventName', data, (response: { success: boolean; error?: string }) => {
  if (!response.success) {
    console.error('Event failed:', response.error);
  }
});
```

---

## 6. Rate Limiting

**REST API**: 100 requests per minute per user
**WebSocket**: No rate limiting on events, but message sending limited to 60/minute

**Rate Limit Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

---

## 7. Testing with cURL

### List Tickets
```bash
curl -X GET "http://localhost:3004/api/tickets?status=OPEN&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Ticket
```bash
curl -X POST "http://localhost:3004/api/tickets/create-from-conversation" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test Ticket",
    "content": "Test content",
    "priority": "MEDIUM",
    "providerChannelId": "provider_123",
    "conversationId": "conv_456",
    "customerEmail": "test@example.com"
  }'
```

### Get Notifications
```bash
curl -X GET "http://localhost:3004/api/notifications?unreadOnly=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 8. TypeScript Types

All request/response types are available in:
- **Tickets**: `/src/widgets/frontdesk/providers/tickets/types/`
- **Direct Messages**: `/src/widgets/frontdesk/providers/internal/types/`
- **Notifications**: `/src/services/frontdesk/api/notifications.service.ts`

Import example:
```typescript
import {
  TicketFilters,
  PaginatedTicketsResponse,
  TicketWithDetails
} from '@/widgets/frontdesk/providers/tickets/types';

import {
  Conversation,
  DMMessage,
  ConversationMember
} from '@/widgets/frontdesk/providers/internal/types';
```

---

## 9. Changelog

**2025-01-15**:
- Added comprehensive API documentation for all services
- Documented 20 ticket WebSocket events
- Added search endpoint documentation
- Added tag management endpoints
- Added ticket view tracking endpoints
- Documented all DM endpoints and events
