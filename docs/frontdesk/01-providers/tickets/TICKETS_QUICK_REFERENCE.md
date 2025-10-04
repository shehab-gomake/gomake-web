# Tickets Backend Integration - Quick Reference

**🚀 Quick access guide for developers working with the Tickets system**

---

## 📦 Essential Imports

```typescript
// Hook
import { useTicketsProvider } from '@/widgets/frontdesk/providers/tickets/hooks/use-tickets-provider';

// Types
import {
  TicketWithDetails,
  TicketStatus,
  TicketPriority,
  TicketFilters
} from '@/widgets/frontdesk/providers/tickets/types';

// Transformers
import {
  apiStatusToUi,
  apiPriorityToUi,
  transformApiTicketToUi
} from '@/widgets/frontdesk/providers/tickets/types/transformers';
```

---

## 🎯 Common Use Cases

### 1. Display Tickets List

```typescript
const tickets = useTicketsProvider();

<TicketListPanel
  tickets={tickets.filteredTickets}
  isLoading={tickets.isLoading}
  error={tickets.error}
  // ... other props
/>
```

### 2. Create Ticket from Conversation

```typescript
const newTicket = await tickets.createTicketFromConversation({
  conversationId: 'conv-123',
  priority: 'HIGH',
  categoryId: 'cat-456' // optional
});
```

### 3. Reply to Ticket

```typescript
await tickets.replyToTicket(ticketId, 'Your message here');
```

### 4. Update Ticket Status

```typescript
await tickets.updateTicketStatus(ticketId, 'RESOLVED');
```

### 5. Assign Ticket (Manager)

```typescript
await tickets.assignTicket(ticketId, assigneeId);
```

### 6. Bulk Operations (Manager)

```typescript
await tickets.bulkAssignTickets([id1, id2, id3], assigneeId);
```

### 7. Get Related Tickets

```typescript
await tickets.fetchRelatedTickets(ticketId);
const related = tickets.relatedTickets;
```

---

## 🔄 Status Mapping

### Backend → UI

```typescript
'OPEN'        → 'To Do'
'IN_PROGRESS' → 'In Progress'
'PENDING'     → 'In Progress'
'RESOLVED'    → 'Done'
'CLOSED'      → 'Done'
'REOPENED'    → 'To Do'
```

### UI → Backend

```typescript
'To Do'       → 'OPEN'
'In Progress' → 'IN_PROGRESS'
'Done'        → 'RESOLVED'
'Blocked'     → 'PENDING'
'Cancelled'   → 'CLOSED'
```

Use transformers:
```typescript
apiStatusToUi('OPEN')      // → 'To Do'
uiStatusToApi('To Do')     // → 'OPEN'
```

---

## 🎨 Priority Mapping

```typescript
'LOW'    → 'Low'
'MEDIUM' → 'Medium'
'HIGH'   → 'High'
'URGENT' → 'Urgent'
```

Use transformers:
```typescript
apiPriorityToUi('HIGH')    // → 'High'
uiPriorityToApi('High')    // → 'HIGH'
```

---

## 📡 WebSocket Events (12 Total)

| Event | Payload | Auto-handled |
|-------|---------|--------------|
| `ticket.created` | `{ ticket }` | ✅ Added to list |
| `ticket.assigned` | `{ ticketId, ticket }` | ✅ Updated in list |
| `ticket.status.changed` | `{ ticketId, ticket }` | ✅ Updated in list |
| `ticket.reply.sent` | `{ messageId }` | ✅ Refreshes ticket |
| `ticket.reopened` | `{ ticketId, ticket }` | ✅ Updated in list |
| `ticket.merged` | `{ sourceTicketId }` | ✅ Removed from list |
| `tickets.bulkAssigned` | `{ ticketIds }` | ✅ List refreshed |
| `ticket.message.received` | `{ ticketId }` | ✅ Message appended |
| `ticket.customer.updated` | `{ ticketId, customerId }` | ✅ Info updated |
| `sla.breached` | `{ ticketId, type }` | ✅ SLA updated |
| `ticket.autoResponse` | `{ ticketId }` | ✅ Logged |
| `webhook.message.processed` | `{ status }` | ✅ Logged |

**All events are handled automatically by the hook!**

---

## 🗂️ Type Definitions

### TicketWithDetails (Backend Format)

```typescript
interface TicketWithDetails {
  id: string;
  conversationId: string;
  printHouseId: string;
  ticketNumber: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'PENDING' | 'RESOLVED' | 'CLOSED' | 'REOPENED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerName?: string | null;
  customerId?: string | null;
  assigneeId?: string | null;
  managerId?: string | null;
  tags: string[];
  firstResponseAt?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;

  assignee?: { id: string; name: string; email: string } | null;
  manager?: { id: string; name: string; email: string } | null;
  category?: { id: string; name: string; priority: string } | null;

  conversation: {
    id: string;
    name: string;
    messages: Array<{
      id: string;
      content: string;
      direction: 'INBOUND' | 'OUTBOUND';
      channel?: 'EMAIL' | 'WHATSAPP' | 'SMS';
      createdAt: string;
    }>;
  };

  sla?: {
    firstResponseDue: string;
    resolutionDue: string;
    breached: boolean;
    breachedAt?: string | null;
  } | null;
}
```

### TicketFilters

```typescript
interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string;
  managerId?: string;
  categoryId?: string;
  customerEmail?: string;
  customerPhone?: string;
  tags?: string[];
  page?: number;      // default 1
  limit?: number;     // default 20, max 100
  sortBy?: 'createdAt' | 'lastMessageAt' | 'priority' | 'ticketNumber' | 'status';
  sortOrder?: 'asc' | 'desc';
}
```

---

## 🛠️ API Endpoints

### Core Operations

```typescript
GET    /api/tickets                        # List (with filters)
GET    /api/tickets/:id                    # Get single
POST   /api/tickets/create-from-conversation  # Create
POST   /api/tickets/:id/reply               # Reply
PATCH  /api/tickets/:id/status              # Update status
PATCH  /api/tickets/:id/priority            # Update priority
```

### Assignment (Manager/Admin)

```typescript
POST   /api/tickets/:id/assign              # Assign
POST   /api/tickets/bulk-assign              # Bulk assign
POST   /api/tickets/:id/reopen              # Reopen
POST   /api/tickets/:sourceId/merge         # Merge
```

### Discovery

```typescript
GET    /api/tickets/:id/related             # Related tickets
GET    /api/tickets/:id/history             # Ticket history
GET    /api/tickets/customer/:identifier    # Customer history
```

### Dashboard (Manager/Admin)

```typescript
GET    /api/tickets/dashboard/unassigned    # Unassigned tickets
GET    /api/tickets/dashboard/workload      # Agent workload
```

---

## 🎭 Channel Helpers

```typescript
import { getChannelIcon, getChannelColor } from '../types/transformers';

getChannelIcon('EMAIL')      // → '📧'
getChannelIcon('WHATSAPP')   // → '💬'
getChannelIcon('SMS')        // → '📱'

getChannelColor('EMAIL')     // → '#2563eb'
getChannelColor('WHATSAPP')  // → '#25d366'
getChannelColor('SMS')       // → '#8b5cf6'
```

---

## ⚡ Performance Tips

### 1. Pagination
```typescript
// Use pagination for large datasets
tickets.fetchTickets({
  page: 1,
  limit: 20  // Don't exceed 100
});
```

### 2. Filters
```typescript
// Server-side filtering
tickets.setFilters({
  status: 'OPEN',
  priority: 'HIGH',
  assigneeId: userId
});
```

### 3. Optimistic Updates
```typescript
// Most actions are optimistic
await tickets.replyToTicket(id, content);
// UI updates immediately, WebSocket confirms
```

---

## 🐛 Debugging

### Check Connection

```typescript
console.log('Connected:', tickets.isConnected);
console.log('Loading:', tickets.isLoading);
console.log('Error:', tickets.error);
```

### Inspect State

```typescript
console.log('All Tickets:', tickets.allTickets);
console.log('Filtered:', tickets.filteredTickets);
console.log('Selected:', tickets.selectedTicket);
console.log('Filters:', tickets.filters);
```

### WebSocket Debug

```typescript
// Enable debug in browser console
localStorage.setItem('FRONTDESK_DEBUG', 'true');

// Check WebSocket logs
// See browser console for event logs
```

### API Debug

```typescript
// Check network tab in DevTools
// Filter by: /api/tickets

// Inspect request headers
// Should have: Authorization: Bearer <token>
```

---

## 🔒 Role-based Access

### Permissions Matrix

| Action | USER | MANAGER | ADMIN |
|--------|------|---------|-------|
| View tickets | ✅ | ✅ | ✅ |
| Create ticket | ✅ | ✅ | ✅ |
| Reply to ticket | ✅ | ✅ | ✅ |
| Update status | ✅ | ✅ | ✅ |
| Update priority | ❌ | ✅ | ✅ |
| Assign ticket | ❌ | ✅ | ✅ |
| Bulk assign | ❌ | ✅ | ✅ |
| Reopen ticket | ❌ | ✅ | ✅ |
| Merge tickets | ❌ | ✅ | ✅ |

### Check Role in UI

```typescript
const userRole = useRecoilValue(userRoleAtom);

{userRole === 'MANAGER' || userRole === 'ADMIN' ? (
  <Button onClick={handleAssign}>Assign Ticket</Button>
) : null}
```

---

## 📍 File Locations

### Key Files

```
Hook
├── src/widgets/frontdesk/providers/tickets/hooks/use-tickets-provider.ts

API Service
├── src/services/frontdesk/api/tickets.service.ts

WebSocket
├── src/services/frontdesk/websocket/ticket-socket.service.ts

Types
├── src/widgets/frontdesk/providers/tickets/types/api.types.ts
├── src/widgets/frontdesk/providers/tickets/types/websocket.types.ts
├── src/widgets/frontdesk/providers/tickets/types/transformers.ts

State
├── src/store/frontdesk/atoms/tickets.atoms.ts

Components
├── src/widgets/frontdesk/providers/tickets/components/ticket-list-panel.tsx
├── src/widgets/frontdesk/providers/tickets/components/ticket-list-item.tsx
├── src/widgets/frontdesk/providers/tickets/components/ticket-detail-view.tsx
```

### Documentation

```
Backend Docs
├── /Users/omarsabbah/Desktop/Messaging-Hub/docs/developer/ticketing/frontend-ticketing/

Frontend Docs
├── docs/frontdesk/TICKETS_BACKEND_INTEGRATION.md  (Complete guide)
├── docs/frontdesk/TICKETS_QUICK_REFERENCE.md      (This file)
├── docs/frontdesk/FRONTDESK_ARCHITECTURE.md
├── docs/frontdesk/DEVELOPER_GUIDE.md
```

---

## 🚨 Common Errors & Solutions

### Error: "No authentication token"
**Solution:** Ensure user is logged in and `getUserToken()` returns a valid JWT

### Error: "Socket not connected"
**Solution:** Check `NEXT_PUBLIC_MESSAGING_SERVER` env variable

### Error: "403 Forbidden"
**Solution:** User lacks required role (MANAGER/ADMIN) for the action

### Error: "404 Not Found"
**Solution:** Ticket doesn't exist or belongs to different tenant

### Error: "Ticket not updating in UI"
**Solution:** Check WebSocket connection, verify `printHouseId` matching

---

## ✅ Integration Checklist

- [ ] Hook imported and used: `useTicketsProvider()`
- [ ] Loading states displayed: `tickets.isLoading`
- [ ] Error states handled: `tickets.error`
- [ ] WebSocket connected: `tickets.isConnected`
- [ ] Backend types used: `TicketWithDetails`
- [ ] Transformers applied: `apiStatusToUi()`, `apiPriorityToUi()`
- [ ] Callbacks wired: `onReply`, `onStatusChange`
- [ ] Role-based UI implemented
- [ ] Multi-channel badges displayed
- [ ] SLA warnings shown

---

**Last Updated:** 2025-10-01
**For detailed documentation, see:** [TICKETS_BACKEND_INTEGRATION.md](./TICKETS_BACKEND_INTEGRATION.md)
