# Frontend Developer Guide: Ticketing System

## Overview

This document provides frontend developers with everything needed to implement the ticketing system UI, including API endpoints, data flows, suggested layouts, and integration patterns.

## Table of Contents

1. [API Endpoints](#api-endpoints)
2. [Data Models](#data-models)
3. [WebSocket Events](#websocket-events)
4. [User Flows](#user-flows)
5. [Suggested Layouts](#suggested-layouts)
6. [State Management](#state-management)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

---

## API Endpoints

### Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer <jwt_token>
```

### Core Ticket Operations

#### List Tickets
```
GET /api/tickets
```

**Query Parameters:**
- `status` - Filter by ticket status (OPEN, PENDING, IN_PROGRESS, RESOLVED, CLOSED, REOPENED)
- `priority` - Filter by priority (LOW, MEDIUM, HIGH, URGENT)
- `assigneeId` - Filter by assigned agent ID
- `managerId` - Filter by manager ID
- `categoryId` - Filter by category ID
- `customerEmail` - Filter by customer email
- `customerPhone` - Filter by customer phone
- `tags` - Array of tags to filter by
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort direction (asc/desc, default: desc)

**Response:**
```json
{
  "tickets": [
    {
      "id": "ticket-uuid",
      "ticketNumber": 1001,
      "status": "OPEN",
      "priority": "MEDIUM",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "customerPhone": "+1234567890",
      "assignee": {
        "id": "user-uuid",
        "name": "Agent Smith",
        "email": "agent@company.com"
      },
      "manager": {
        "id": "manager-uuid",
        "name": "Manager Jones",
        "email": "manager@company.com"
      },
      "category": {
        "id": "category-uuid",
        "name": "Technical Support",
        "priority": "MEDIUM"
      },
      "conversation": {
        "id": "conv-uuid",
        "name": "Ticket #1001",
        "lastMessageAt": "2024-01-15T10:30:00Z",
        "messages": [
          {
            "id": "msg-uuid",
            "content": "Last message preview...",
            "createdAt": "2024-01-15T10:30:00Z",
            "direction": "INBOUND"
          }
        ]
      },
      "sla": {
        "firstResponseDue": "2024-01-15T14:00:00Z",
        "resolutionDue": "2024-01-17T10:00:00Z",
        "firstResponseAt": null,
        "resolvedAt": null,
        "breached": false
      },
      "tags": ["bug", "urgent"],
      "createdAt": "2024-01-15T10:00:00Z",
      "firstResponseAt": null,
      "resolvedAt": null,
      "closedAt": null,
      "reopenCount": 0
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Assign Ticket
```
POST /api/tickets/:id/assign
```

**Request Body:**
```json
{
  "assigneeId": "agent-user-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ticket assigned successfully"
}
```

#### Reply to Ticket
```
POST /api/tickets/:id/reply
```

**Request Body:**
```json
{
  "content": "Thank you for contacting us. We're looking into your issue..."
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "msg-uuid"
}
```

#### Update Ticket Status
```
PATCH /api/tickets/:id/status
```

**Request Body:**
```json
{
  "status": "RESOLVED"
}
```

#### Update Ticket Priority
```
PATCH /api/tickets/:id/priority
```

**Request Body:**
```json
{
  "priority": "HIGH"
}
```

#### Merge Tickets
```
POST /api/tickets/:sourceId/merge
```

**Request Body:**
```json
{
  "targetTicketId": "target-ticket-uuid"
}
```

#### Reopen Ticket (Manager Only)
```
POST /api/tickets/:id/reopen
```

### Manager Dashboard Endpoints

#### Get Unassigned Tickets
```
GET /api/tickets/dashboard/unassigned?priority=HIGH&categoryId=category-uuid
```

**Response:**
```json
[
  {
    "id": "ticket-uuid",
    "ticketNumber": 1002,
    "status": "OPEN",
    "priority": "HIGH",
    "customerName": "Jane Smith",
    "category": {
      "name": "Billing",
      "priority": "HIGH"
    },
    "conversation": {
      "name": "Urgent billing issue",
      "messages": [
        {
          "content": "I was charged twice for my order...",
          "createdAt": "2024-01-15T11:00:00Z"
        }
      ]
    },
    "sla": {
      "firstResponseDue": "2024-01-15T13:00:00Z",
      "breached": false
    },
    "createdAt": "2024-01-15T11:00:00Z"
  }
]
```

#### Get Agent Workload
```
GET /api/tickets/dashboard/workload
```

**Response:**
```json
[
  {
    "agent": {
      "id": "agent-uuid",
      "name": "Agent Smith",
      "email": "agent1@company.com"
    },
    "openTickets": 5,
    "totalTickets": 23,
    "avgResponseTimeHours": null
  }
]
```

#### Bulk Assign Tickets
```
POST /api/tickets/bulk-assign
```

**Request Body:**
```json
{
  "ticketIds": ["ticket-1", "ticket-2", "ticket-3"],
  "assigneeId": "agent-uuid"
}
```

### Customer-Related Endpoints

#### Get Customer Tickets
```
GET /api/tickets/customer/:identifier
```

Where `:identifier` can be email or phone number.

---

## Data Models

### Ticket Status Flow
```
OPEN → IN_PROGRESS → RESOLVED → CLOSED
  ↓         ↓           ↓
PENDING   PENDING   REOPENED → IN_PROGRESS
```

### Priority Levels
- `LOW` - Non-urgent issues
- `MEDIUM` - Standard priority (default)
- `HIGH` - Important issues
- `URGENT` - Critical issues requiring immediate attention

### User Roles
- `USER` - Regular agents who handle tickets
- `MANAGER` - Can assign tickets, bulk operations, reopen closed tickets
- `ADMIN` - Full access to all operations

---

## WebSocket Events

Connect to `/messaging` endpoint with JWT token.

### Ticket Events

#### New Ticket Created
```json
{
  "event": "ticket.created",
  "data": {
    "ticket": { /* full ticket object */ },
    "channel": "EMAIL",
    "customerIdentifier": "customer@example.com"
  }
}
```

#### Ticket Assigned
```json
{
  "event": "ticket.assigned",
  "data": {
    "ticketId": "ticket-uuid",
    "assigneeId": "agent-uuid",
    "managerId": "manager-uuid"
  }
}
```

#### Ticket Status Changed
```json
{
  "event": "ticket.status.changed",
  "data": {
    "ticketId": "ticket-uuid",
    "oldStatus": "OPEN",
    "newStatus": "IN_PROGRESS"
  }
}
```

#### New Reply Sent
```json
{
  "event": "ticket.reply.sent",
  "data": {
    "ticketId": "ticket-uuid",
    "userId": "agent-uuid",
    "content": "Reply content",
    "isFirstResponse": true
  }
}
```

#### SLA Breach Alert
```json
{
  "event": "sla.breached",
  "data": {
    "ticketId": "ticket-uuid",
    "type": "first_response", // or "resolution"
    "breachedAt": "2024-01-15T14:30:00Z"
  }
}
```

---

## User Flows

### 1. Agent Workflow

#### Daily Ticket Management
1. **Login** → Dashboard shows assigned tickets
2. **View Ticket List** → Filter by status/priority
3. **Open Ticket** → View conversation history
4. **Reply to Customer** → Send response via original channel
5. **Update Status** → Mark as resolved when complete

#### Typical Agent Actions
- View assigned tickets (`GET /api/tickets?assigneeId=current-user`)
- Reply to customers (`POST /api/tickets/:id/reply`)
- Update ticket status (`PATCH /api/tickets/:id/status`)
- View customer history (`GET /api/tickets/customer/:email`)

### 2. Manager Workflow

#### Daily Operations
1. **View Unassigned Queue** → (`GET /api/tickets/dashboard/unassigned`)
2. **Check Agent Workload** → (`GET /api/tickets/dashboard/workload`)
3. **Assign Tickets** → Distribute work evenly
4. **Monitor SLA Breaches** → Handle escalations
5. **Review Performance** → Track response times

#### Bulk Operations
- Assign multiple tickets (`POST /api/tickets/bulk-assign`)
- Change priority for urgent issues (`PATCH /api/tickets/:id/priority`)
- Reopen closed tickets if needed (`POST /api/tickets/:id/reopen`)

### 3. Customer Journey (Backend Automated)

1. **Customer sends email** → System creates ticket automatically
2. **Agent replies** → Customer receives response via same channel
3. **Customer responds** → Message added to existing ticket
4. **Ticket resolved** → Customer can still reply (auto-reopens)
5. **Ticket closed** → No new messages accepted

---

## Suggested Layouts

### 1. Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Header: Logo | Notifications | User Menu                    │
├─────────────────────────────────────────────────────────────┤
│ Sidebar Navigation                   │ Main Content Area     │
│ • Dashboard                         │                       │
│ • My Tickets                        │   ┌─────────────────┐  │
│ • All Tickets                       │   │ Stats Cards     │  │
│ • Unassigned (Manager)              │   │ • Open: 12      │  │
│ • Categories                        │   │ • Pending: 5    │  │
│ • Reports (Manager)                 │   │ • Overdue: 3    │  │
│                                     │   └─────────────────┘  │
│                                     │                       │
│                                     │   ┌─────────────────┐  │
│                                     │   │ Recent Activity │  │
│                                     │   │ • New tickets   │  │
│                                     │   │ • Responses     │  │
│                                     │   │ • Assignments   │  │
│                                     │   └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2. Ticket List Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Filters & Search                                           │
│ [Status ▼] [Priority ▼] [Agent ▼] [Search...........] [🔍] │
├─────────────────────────────────────────────────────────────┤
│ Ticket List                                                │
│ ┌─────┬────────────┬──────────┬─────────┬─────────┬───────┐ │
│ │ #   │ Customer   │ Subject  │ Status  │ Agent   │ SLA   │ │
│ ├─────┼────────────┼──────────┼─────────┼─────────┼───────┤ │
│ │1001 │ John Doe   │ Bug in..│ 🔴 OPEN │ Smith   │ ⚠️ 2h │ │
│ │1002 │ Jane Smith │ Billing..│ 🟡 PEND │ Jones   │ ✅ OK │ │
│ │1003 │ Bob Wilson │ Feature..│ 🟢 RESV │ Smith   │ ✅ OK │ │
│ └─────┴────────────┴──────────┴─────────┴─────────┴───────┘ │
│                                                            │
│ Pagination: [← Prev] [1] [2] [3] [Next →]                  │
└─────────────────────────────────────────────────────────────┘
```

### 3. Ticket Detail Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Ticket Header                                              │
│ Ticket #1001 • Priority: HIGH • Status: OPEN              │
│ Customer: john@example.com • Agent: Smith • SLA: ⚠️ 2h      │
├─────────────────────────────────────────────────────────────┤
│ Ticket Details (Left)           │ Actions Panel (Right)     │
│                                │                           │
│ ┌─────────────────────────────┐ │ ┌─────────────────────────┐ │
│ │ Conversation History       │ │ │ Quick Actions           │ │
│ │                           │ │ │ [Reply]   [Assign]      │ │
│ │ 📧 John (10:00 AM)        │ │ │ [Resolve] [Close]       │ │
│ │ "I'm having issues with..." │ │ │                         │ │
│ │                           │ │ │ Status: [OPEN ▼]        │ │
│ │ 👤 Agent Smith (10:30 AM) │ │ │ Priority: [HIGH ▼]      │ │
│ │ "Thanks for contacting..." │ │ │ Category: [Tech ▼]      │ │
│ │                           │ │ │                         │ │
│ │ 📧 John (11:00 AM)        │ │ │ SLA Information         │ │
│ │ "The issue persists..."   │ │ │ Response Due: 2h ⚠️      │ │
│ │                           │ │ │ Resolution Due: 2d ✅    │ │
│ └─────────────────────────────┘ │ │                         │ │
│                                │ │ History                  │ │
│ ┌─────────────────────────────┐ │ │ • Created by System     │ │
│ │ Reply Box                  │ │ │ • Assigned to Smith     │ │
│ │ [Rich Text Editor......... │ │ │ • Priority changed      │ │
│ │ ........................]  │ │ └─────────────────────────┘ │
│ │                           │ │                           │
│ │ [Send Reply] [Save Draft]  │ │                           │
│ └─────────────────────────────┘ │                           │
└─────────────────────────────────────────────────────────────┘
```

### 4. Manager Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Manager Dashboard                                          │
├─────────────────────────────────────────────────────────────┤
│ Key Metrics                                                │
│ ┌─────────┬─────────┬─────────┬─────────┬─────────────────┐ │
│ │ Open    │ Overdue │ Today   │ Avg     │ SLA Compliance  │ │
│ │ 23      │ 5 ⚠️     │ 12 new  │ 2.5h    │ 87% 📈          │ │
│ └─────────┴─────────┴─────────┴─────────┴─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Unassigned Tickets (Left)       │ Agent Workload (Right)   │
│                                │                           │
│ ┌─────────────────────────────┐ │ ┌─────────────────────────┐ │
│ │ High Priority (3)          │ │ │ Agent Performance       │ │
│ │ • #1045 Billing Issue     │ │ │                         │ │
│ │ • #1046 System Down       │ │ │ Smith    [██████   ] 6  │ │
│ │ • #1047 Data Loss         │ │ │ Jones    [████     ] 4  │ │
│ │                           │ │ │ Wilson   [██████████] 8  │ │
│ │ Medium Priority (8)        │ │ │ Davis    [███      ] 3  │ │
│ │ • #1043 Feature Request   │ │ │                         │ │
│ │ • #1044 Login Issues      │ │ │ [Bulk Assign] [Balance] │ │
│ │ • ...                     │ │ │                         │ │
│ │                           │ │ └─────────────────────────┘ │
│ │ [Assign Selected]         │ │                           │ │
│ └─────────────────────────────┘ │                           │
└─────────────────────────────────────────────────────────────┘
```

---

## State Management

### Recommended State Structure

```typescript
interface TicketState {
  // Current tickets view
  tickets: Ticket[]
  loading: boolean
  filters: TicketFilters
  pagination: PaginationInfo

  // Selected ticket details
  selectedTicket: Ticket | null
  ticketMessages: Message[]
  ticketLoading: boolean

  // Real-time updates
  notifications: Notification[]
  unreadCount: number

  // Manager dashboard
  unassignedTickets: Ticket[]
  agentWorkload: AgentWorkload[]
  dashboardMetrics: DashboardMetrics
}

interface TicketFilters {
  status?: TicketStatus[]
  priority?: TicketPriority[]
  assigneeId?: string
  search?: string
  dateRange?: [Date, Date]
}
```

### Key Actions

```typescript
// Ticket listing
fetchTickets(filters: TicketFilters)
updateFilters(filters: Partial<TicketFilters>)
refreshTickets()

// Ticket operations
assignTicket(ticketId: string, assigneeId: string)
replyToTicket(ticketId: string, content: string)
updateTicketStatus(ticketId: string, status: TicketStatus)
updateTicketPriority(ticketId: string, priority: TicketPriority)

// Real-time updates
handleWebSocketEvent(event: WebSocketEvent)
markNotificationRead(notificationId: string)

// Manager operations
fetchUnassignedTickets()
bulkAssignTickets(ticketIds: string[], assigneeId: string)
fetchAgentWorkload()
```

---

## Error Handling

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "assigneeId",
      "message": "Assignee not found in organization"
    }
  ],
  "correlationId": "req-12345"
}
```

### Common Error Scenarios

1. **403 Forbidden** - User lacks permission (e.g., non-manager trying to assign)
2. **404 Not Found** - Ticket not found or belongs to different organization
3. **400 Bad Request** - Invalid data (status transitions, malformed IDs)
4. **409 Conflict** - Ticket state conflict (e.g., already assigned)
5. **429 Too Many Requests** - Rate limiting on ticket creation

### Error Handling Best Practices

```typescript
// Example error handling
try {
  await assignTicket(ticketId, agentId)
  showSuccess('Ticket assigned successfully')
} catch (error) {
  if (error.status === 403) {
    showError('You do not have permission to assign tickets')
  } else if (error.status === 404) {
    showError('Ticket not found')
  } else {
    showError('Failed to assign ticket. Please try again.')
  }
}
```

---

## Best Practices

### 1. Real-time Updates
- Subscribe to WebSocket events for live updates
- Update local state when receiving ticket events
- Show notifications for important events (assignments, SLA breaches)
- Handle connection loss gracefully with retry logic

### 2. Performance Optimization
- Implement virtual scrolling for large ticket lists
- Cache ticket data with appropriate TTL
- Debounce search and filter inputs
- Use pagination instead of infinite scroll for better UX

### 3. User Experience
- Show loading states for all async operations
- Provide clear visual indicators for SLA status
- Use consistent icons and colors for ticket states
- Implement keyboard shortcuts for power users

### 4. Accessibility
- Use semantic HTML and ARIA labels
- Ensure proper color contrast for status indicators
- Support keyboard navigation
- Provide screen reader friendly descriptions

### 5. Mobile Responsiveness
- Design mobile-first for ticket lists
- Use collapsible sections on small screens
- Implement swipe actions for quick operations
- Optimize touch targets for mobile devices

### 6. Security
- Validate all user inputs on frontend
- Don't expose sensitive customer data unnecessarily
- Implement proper session timeout handling
- Use secure communication (HTTPS/WSS)

---

## Implementation Checklist

### Phase 1: Basic Functionality
- [ ] Authentication setup
- [ ] Ticket list view with basic filters
- [ ] Ticket detail view with conversation
- [ ] Reply functionality
- [ ] Status updates

### Phase 2: Advanced Features
- [ ] WebSocket integration for real-time updates
- [ ] Manager dashboard with unassigned queue
- [ ] Bulk operations
- [ ] SLA monitoring and alerts
- [ ] Advanced filtering and search

### Phase 3: Polish & Optimization
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Accessibility improvements
- [ ] Error handling refinement
- [ ] User experience enhancements

---

## Support & Documentation

For technical questions or API clarifications:
- Backend API documentation available at `/api/docs` (when Swagger is enabled)
- WebSocket event documentation in main codebase
- Database schema reference in `prisma/schema.prisma`

For UI/UX guidance:
- Follow existing design system patterns
- Maintain consistency with current messaging interface
- Consider user workflow efficiency over feature completeness