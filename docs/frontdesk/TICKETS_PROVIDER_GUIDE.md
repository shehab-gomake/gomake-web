# Tickets Provider - Developer Guide

## Overview

The Tickets provider is a support ticket management system integrated into FrontDesk. It consolidates customer support requests from multiple channels (Direct Messages, Email, WhatsApp) into a unified ticketing interface.

## Features

- **Multi-channel Support**: Tickets can originate from DMs, Emails, or WhatsApp messages
- **Status Management**: Track tickets through lifecycle (Open, In Progress, Resolved, Closed)
- **Priority System**: Assign priority levels (Low, Medium, High, Urgent)
- **Assignment**: Assign tickets to team members
- **Communication History**: View all communications related to a ticket
- **Search & Filter**: Find tickets by status, assignee, priority, or search query
- **Multi-select**: Batch operations on multiple tickets

## Architecture

### File Structure

```
src/widgets/frontdesk/providers/tickets/
├── components/
│   ├── ticket-list-item.tsx          # Individual ticket in list
│   ├── ticket-list-panel.tsx         # Left panel with ticket list
│   └── ticket-detail-view.tsx        # Right panel with ticket details
├── hooks/
│   ├── use-tickets-provider.ts       # Main provider hook
│   └── index.ts
├── types/
│   ├── ticket.types.ts               # Ticket type definitions
│   ├── communication.types.ts        # Communication channel types
│   └── index.ts
├── mock-data/
│   └── tickets.mock.ts               # Development mock data
└── index.ts
```

### State Management

Located in `src/store/frontdesk/atoms/tickets.atoms.ts`:

**Atoms:**
- `ticketsAtom` - All tickets data
- `selectedTicketIdAtom` - Currently selected ticket ID
- `selectedTicketViewAtom` - Current view filter (all, open, in-progress, etc.)
- `ticketSearchQueryAtom` - Search query string
- `selectedTicketIdsAtom` - Multi-selected ticket IDs
- `openTicketTabsAtom` - Open ticket tabs for multi-ticket view

**Selectors:**
- `filteredTicketsSelector` - Tickets filtered by view and search
- `selectedTicketSelector` - Currently selected ticket object
- `ticketCountsSelector` - Counts per view (open, closed, etc.)

## Types

### Ticket

```typescript
interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  sourceChannel: CommunicationChannel;
  sourceId: string;  // Original message/email/conversation ID
  customerId: string;
  customerName: string;
  customerEmail?: string;
  assigneeId?: string;
  assigneeName?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  communications: TicketCommunication[];
}
```

### TicketStatus

```typescript
type TicketStatus =
  | 'open'
  | 'in-progress'
  | 'waiting-on-customer'
  | 'waiting-on-internal'
  | 'resolved'
  | 'closed';
```

### TicketPriority

```typescript
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
```

### CommunicationChannel

```typescript
type CommunicationChannel = 'dm' | 'email' | 'whatsapp';
```

### TicketCommunication

```typescript
interface TicketCommunication {
  id: string;
  ticketId: string;
  channel: CommunicationChannel;
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  subject?: string;
  body: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
```

## Hook API: useTicketsProvider

```typescript
import { useTicketsProvider } from '@/widgets/frontdesk/providers/tickets';

function MyComponent() {
  const {
    // View state
    selectedView,
    setSelectedView,

    // Tickets
    allTickets,
    filteredTickets,
    ticketCounts,

    // Selection
    selectedTicketId,
    setSelectedTicketId,
    selectedTicket,

    // Multi-selection
    selectedTicketIds,
    setSelectedTicketIds,
    toggleTicketSelection,
    clearSelection,

    // Search
    searchQuery,
    setSearchQuery,

    // Tabs
    openTabs,
    setOpenTabs,
    openTab,
    closeTab
  } = useTicketsProvider();
}
```

## Usage Examples

### Filtering Tickets by View

```typescript
const { setSelectedView, filteredTickets } = useTicketsProvider();

// Show only open tickets
setSelectedView('open');

// Show all tickets
setSelectedView(null);
```

### Selecting a Ticket

```typescript
const { setSelectedTicketId, selectedTicket } = useTicketsProvider();

// Select ticket
setSelectedTicketId('ticket-123');

// Get selected ticket details
console.log(selectedTicket);
```

### Searching Tickets

```typescript
const { setSearchQuery, filteredTickets } = useTicketsProvider();

// Search by keyword
setSearchQuery('payment issue');

// Results are automatically filtered
console.log(filteredTickets);
```

### Multi-Select Operations

```typescript
const {
  selectedTicketIds,
  toggleTicketSelection,
  clearSelection
} = useTicketsProvider();

// Toggle ticket selection
toggleTicketSelection('ticket-123');

// Clear all selections
clearSelection();

// Batch operation example
const bulkAssign = (assigneeId: string) => {
  selectedTicketIds.forEach(ticketId => {
    // Assign ticket to user
    api.assignTicket(ticketId, assigneeId);
  });
  clearSelection();
};
```

## Components

### TicketListPanel

Left panel component showing filtered ticket list.

```typescript
<TicketListPanel
  tickets={filteredTickets}
  selectedTicketId={selectedTicketId}
  onSelectTicket={setSelectedTicketId}
  searchQuery={searchQuery}
  onSearch={setSearchQuery}
  selectedView={selectedView}
  onViewChange={setSelectedView}
  counts={ticketCounts}
/>
```

### TicketDetailView

Right panel component showing ticket details and communications.

```typescript
<TicketDetailView
  ticket={selectedTicket}
  onClose={() => setSelectedTicketId(null)}
  onStatusChange={handleStatusChange}
  onPriorityChange={handlePriorityChange}
  onAssign={handleAssign}
/>
```

## API Integration

### Current Status: Mock Data

The Tickets provider currently uses mock data for development. Real API integration is pending.

### Expected API Endpoints

```typescript
// Fetch tickets
GET /api/tickets
Query params: status, priority, assigneeId, search, limit, offset

// Get single ticket
GET /api/tickets/:ticketId

// Create ticket
POST /api/tickets
Body: { subject, description, priority, sourceChannel, sourceId, customerId }

// Update ticket
PATCH /api/tickets/:ticketId
Body: { status, priority, assigneeId, tags }

// Add communication
POST /api/tickets/:ticketId/communications
Body: { channel, direction, from, to, body }

// Assign ticket
POST /api/tickets/:ticketId/assign
Body: { assigneeId }

// Close ticket
POST /api/tickets/:ticketId/close
```

### Future API Service Structure

```typescript
// src/services/frontdesk/api/tickets.service.ts
export class TicketsService {
  async getTickets(filters?: TicketFilters): Promise<Ticket[]> {
    // Implementation
  }

  async getTicket(ticketId: string): Promise<Ticket> {
    // Implementation
  }

  async createTicket(data: CreateTicketDto): Promise<Ticket> {
    // Implementation
  }

  async updateTicket(ticketId: string, data: UpdateTicketDto): Promise<Ticket> {
    // Implementation
  }

  async assignTicket(ticketId: string, assigneeId: string): Promise<Ticket> {
    // Implementation
  }

  async closeTicket(ticketId: string): Promise<Ticket> {
    // Implementation
  }

  async addCommunication(
    ticketId: string,
    communication: CreateCommunicationDto
  ): Promise<TicketCommunication> {
    // Implementation
  }
}
```

## Integration with Other Providers

### Creating Tickets from Messages

**From Direct Messages:**
```typescript
// When user clicks "Create Ticket" on a conversation
const createTicketFromDM = async (conversation: Conversation) => {
  await api.createTicket({
    subject: `Support request from ${conversation.name}`,
    description: conversation.lastMessage.content,
    sourceChannel: 'dm',
    sourceId: conversation.id,
    customerId: conversation.otherParticipant.id,
    priority: 'medium'
  });
};
```

**From Email:**
```typescript
const createTicketFromEmail = async (email: EmailMessage) => {
  await api.createTicket({
    subject: email.subject,
    description: email.body,
    sourceChannel: 'email',
    sourceId: email.id,
    customerId: email.from.id,
    priority: 'medium'
  });
};
```

### Linking Tickets to Conversations

Display ticket status badge in conversation lists:

```typescript
<ConversationListItem
  conversation={conversation}
  badge={conversation.hasOpenTicket && <TicketBadge />}
/>
```

## Mock Data

Located in `src/widgets/frontdesk/providers/tickets/mock-data/tickets.mock.ts`:

```typescript
export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'ticket-1',
    subject: 'Payment processing issue',
    description: 'Customer unable to complete checkout',
    status: 'open',
    priority: 'high',
    sourceChannel: 'email',
    sourceId: 'email-123',
    customerId: 'user-1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    tags: ['payment', 'urgent'],
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
    communications: [
      // Initial email
    ]
  },
  // ... more tickets
];
```

## Testing

### Unit Tests

```typescript
import { renderHook, act } from '@testing-library/react';
import { useTicketsProvider } from './use-tickets-provider';

describe('useTicketsProvider', () => {
  it('should filter tickets by view', () => {
    const { result } = renderHook(() => useTicketsProvider());

    act(() => {
      result.current.setSelectedView('open');
    });

    const openTickets = result.current.filteredTickets;
    expect(openTickets.every(t => t.status === 'open')).toBe(true);
  });

  it('should search tickets', () => {
    const { result } = renderHook(() => useTicketsProvider());

    act(() => {
      result.current.setSearchQuery('payment');
    });

    const results = result.current.filteredTickets;
    expect(results.every(t =>
      t.subject.includes('payment') ||
      t.description.includes('payment')
    )).toBe(true);
  });
});
```

## Roadmap

### Phase 1: Foundation (Current)
- ✅ Basic ticket data structure
- ✅ Mock data for development
- ✅ List and detail views
- ✅ Status and priority management
- ✅ Search and filtering

### Phase 2: API Integration
- ⏳ Connect to real backend API
- ⏳ CRUD operations
- ⏳ Real-time updates via WebSocket
- ⏳ Pagination and lazy loading

### Phase 3: Advanced Features
- ⏳ Ticket automation rules
- ⏳ SLA tracking
- ⏳ Canned responses
- ⏳ File attachments
- ⏳ Customer portal view

### Phase 4: Analytics
- ⏳ Response time metrics
- ⏳ Agent performance tracking
- ⏳ Ticket trend analysis
- ⏳ Customer satisfaction scores

## Best Practices

1. **Always use the hook**: Don't access atoms directly, use `useTicketsProvider()`
2. **Batch updates**: Use multi-select for bulk operations
3. **Optimistic updates**: Update UI before API response for better UX
4. **Error handling**: Always handle API errors gracefully
5. **Loading states**: Show skeletons/spinners during data fetches

## Troubleshooting

### Tickets not updating
- Check if the atom is properly initialized
- Verify Recoil DevTools for atom state
- Ensure hook is called within RecoilRoot

### Search not working
- Verify search query is trimmed
- Check if selector is properly computing filtered results
- Test with mock data first

### Performance issues with large ticket lists
- Implement pagination
- Use virtualized lists (react-window)
- Debounce search input
- Lazy load ticket details
