# Tickets Provider

## Overview

The Tickets Provider is the most comprehensive and feature-rich provider in FrontDesk. It implements a complete support ticketing system with multi-channel communication, real-time updates, role-based permissions, and advanced lifecycle management.

**Status:** ✅ Fully Integrated
**Complexity:** High (30 files, ~6000 lines of code)
**Real-time:** Yes (20 WebSocket events)
**Backend Integration:** Full REST API + WebSocket

## File Structure

```
src/widgets/frontdesk/providers/tickets/
├── hooks/                                      # Provider hooks
│   ├── use-tickets-provider.ts                # Main provider hook (1346 lines)
│   ├── use-quick-actions.ts                   # Quick actions integration
│   ├── use-ticket-form-modal.ts               # Create/edit ticket modal logic
│   ├── use-create-ticket-modal.ts             # Legacy create modal
│   └── index.ts                               # Hook exports
├── components/                                 # UI Components (4600+ lines total)
│   ├── ticket-list-panel.tsx                  # Ticket list with filters
│   ├── ticket-list-item.tsx                   # Individual ticket card
│   ├── ticket-detail-view.tsx                 # Ticket workspace
│   ├── ticket-timeline.tsx                    # Multi-channel timeline
│   ├── ticket-form-modal.tsx                  # Create/edit form
│   ├── create-ticket-modal.tsx                # Legacy create modal
│   ├── review-queue.tsx                       # Review queue panel
│   ├── related-tickets.tsx                    # Related tickets sidebar
│   ├── customer-profile-section.tsx           # Customer info
│   ├── ticket-filters-menu.tsx                # Advanced filters
│   ├── ticket-sort-menu.tsx                   # Sort options
│   ├── add-contact-dialog.tsx                 # Add customer dialog
│   └── index.ts                               # Component exports
├── types/                                      # TypeScript types
│   ├── api.types.ts                           # API DTOs & responses
│   ├── ticket.types.ts                        # Ticket data models
│   ├── communication.types.ts                 # Message & conversation types
│   ├── customer.types.ts                      # Customer data types
│   ├── websocket.types.ts                     # WebSocket event payloads (20 events)
│   ├── quick-actions.types.ts                 # Quick actions types
│   ├── transformers.ts                        # Data transformation utilities
│   └── index.ts                               # Type exports
├── utils/                                      # Utilities
│   ├── sla-helpers.ts                         # SLA calculation utilities
│   └── quick-actions-config.tsx               # Quick actions configuration
├── mock-data/                                  # Test data
│   └── tickets.mock.ts                        # Mock tickets for testing
└── index.ts                                    # Public exports
```

## Core Features

### 1. Multi-Channel Ticketing

Consolidates customer communications from multiple channels into unified ticket timelines:

- **Email**: Full thread support with HTML rendering
- **WhatsApp**: Business messaging with media
- **SMS**: Text message support
- **Phone**: Call notes and transcripts
- **Web Chat**: Live chat integration
- **Private Notes**: Internal team communication

### 2. Real-Time Updates (20 WebSocket Events)

Full WebSocket integration for instant collaboration:

**Core Ticket Events (11):**
- `ticket.created` - New ticket created
- `ticket.updated` - General purpose update event (any field changed)
- `ticket.assigned` - Ticket assigned to agent
- `ticket.status.changed` - Status transition
- `ticket.reply.sent` - Outbound reply queued
- `ticket.reopened` - Ticket reopened (manual or automatic)
- `ticket.merged` - Tickets merged
- `tickets.bulkAssigned` - Bulk assignment completed
- `ticket.message.received` - Inbound message received
- `ticket.customer.updated` - Customer info updated (GoMake lookup)
- `sla.breached` - SLA threshold exceeded

**Message Delivery Events (3):**
- `ticket.autoResponse` - Auto-response sent
- `message.delivered` - Message sent successfully
- `message.delivery.failed` - Message send failed

**Tag Events (4):**
- `ticket.tags.added` - Tags added to ticket
- `ticket.tag.removed` - Tag removed from ticket
- `tag.created` - New tag created globally
- `tag.deleted` - Tag deleted globally

**Webhook Events (2):**
- `webhook.message.processed` - Webhook processing complete
- `conversation.needs.review` - New message without ticket (Review Queue)

### 3. Complete Lifecycle Management

**Ticket Statuses:**
- `OPEN` - New, unassigned tickets
- `IN_PROGRESS` - Agent actively working
- `PENDING` - Waiting on customer response
- `RESOLVED` - Issue resolved, awaiting confirmation
- `CLOSED` - Ticket completed
- `REOPENED` - Reopened after closure

**Priority Levels:**
- `Low` - Can wait
- `Medium` - Normal priority
- `High` - Needs attention soon
- `Urgent` - Critical issue

### 4. Role-Based Permissions

Three role levels with different capabilities:

**USER (Agent):**
- View assigned tickets
- Reply to tickets
- Update ticket status
- Add tags
- View customer history

**MANAGER:**
- All USER permissions
- Assign tickets to agents
- Bulk assign tickets
- View all tickets
- Access analytics

**ADMIN:**
- All MANAGER permissions
- System configuration
- User management
- Delete tickets
- Merge tickets

### 5. Advanced Tag System

Complete tagging infrastructure for organization:

- **Tag Management**: Create, update, delete, search
- **Popular Tags**: Most frequently used tags
- **Tag Suggestions**: Auto-suggest as you type (fuzzy search)
- **Bulk Tagging**: Add/remove tags to multiple tickets
- **Tag Colors**: Visual categorization
- **Real-time Sync**: Tag changes broadcast via WebSocket

### 6. Read/Unread Tracking

Per-user view status for each ticket:

- **View Tracking**: Tracks `lastViewedAt` timestamp per user
- **Unread Indicator**: Shows `hasUnread` flag for new messages
- **Unread Count Badge**: Global count of unread tickets
- **Auto Mark Read**: Opening ticket auto-marks as read
- **Last Viewed Message**: Tracks position in conversation

### 7. Quick Actions

Contextual actions for ticket-related operations:

**Available Actions:**
- Create Quote (requires customer)
- Create Order (requires customer)
- Create Invoice (requires customer)
- Create Job (requires customer)
- Print Ticket
- Export Conversation
- Archive Ticket

Quick actions check customer linkage and permissions before execution.

## Key Components

### 1. TicketListPanel

Main list view with filtering, sorting, and search.

**Props:**
```typescript
interface TicketListPanelProps {
  // No props - uses useTicketsProvider hook internally
}
```

**Features:**
- Search by ticket number, title, content
- Filter by status, priority, assignee, tags, customer
- Sort by date, priority, status, title
- Pagination support
- Multi-select for bulk actions
- Empty states

### 2. TicketDetailView

Comprehensive workspace for viewing and managing tickets.

**Props:**
```typescript
interface TicketDetailViewProps {
  ticket: TicketWithDetails;
  onClose?: () => void;
}
```

**Features:**
- **Tabbed Interface**: Three main views
  - Conversation: Multi-channel timeline
  - Objectives & Details: Ticket summary
  - Activity History: Audit log

- **Multi-Channel Tabs**: If ticket spans multiple channels (e.g., email + WhatsApp), shows tabs to switch between conversations

- **Editable Metadata Sidebar**:
  - Status dropdown
  - Priority selector
  - Assignee picker
  - Tags manager
  - Customer info
  - SLA indicators

- **Quick Actions Menu**: Dropdown with contextual actions

- **Timeline Features**:
  - Channel-specific styling
  - Direction indicators (inbound/outbound)
  - Delivery status
  - Private notes highlighting
  - Attachments display
  - Timestamp formatting

### 3. TicketFormModal

Unified create/edit form with validation and suggestions.

**Props:**
```typescript
interface TicketFormModalProps {
  mode: 'create' | 'edit';
  providerId?: string;              // For create mode
  externalConversationId?: string;  // For create mode
  ticketId?: string;                // For edit mode
  ticket?: TicketWithDetails;       // For edit mode
  onSuccess?: (ticket: TicketWithDetails) => void;
  onError?: (error: Error) => void;
}
```

**Features:**
- **Customer Search**: Autocomplete with debouncing
- **Assignee Selection**: Filterable employee list
- **Tag Management**: Popular tags + auto-suggestions
- **Priority Selection**: Visual priority picker
- **Status Selection**: Workflow-aware status transitions
- **Validation**: Client-side + server-side validation
- **Permission Checks**: Role-based field visibility
- **Optimistic Updates**: Instant UI feedback

### 4. TicketTimeline

Multi-channel conversation timeline with rich formatting.

**Props:**
```typescript
interface TicketTimelineProps {
  messages: MessageCard[];
  onSendMessage?: (content: string) => void;
  isLoading?: boolean;
  channel?: ChannelType;
}
```

**Message Types:**
- **Customer Messages**: Inbound communications
- **Agent Replies**: Outbound responses
- **Private Notes**: Internal team notes (yellow highlight)
- **System Events**: Status changes, assignments, etc.

**Channel Styling:**
- Email: Blue left border
- WhatsApp: Green left border
- SMS: Purple left border
- Phone: Orange left border
- Private Note: Yellow background

### 5. ReviewQueue

Panel for triaging new conversations without tickets.

**Props:**
```typescript
interface ReviewQueueProps {
  conversations: ConversationNeedsReviewPayload[];
  onCreateTicket: (conversation: ConversationNeedsReviewPayload) => void;
}
```

**Features:**
- Shows unticketedmessages from all channels
- Real-time updates via WebSocket
- One-click ticket creation
- Conversation preview
- Customer identification
- Channel indicators

### 6. RelatedTickets

Sidebar showing related tickets for context.

**Props:**
```typescript
interface RelatedTicketsProps {
  ticketId: string;
  customerId?: string;
}
```

**Features:**
- Finds tickets from same customer
- Similar tickets (by tags, content)
- Linked tickets
- Duplicate detection
- Quick navigation

## Hooks

### 1. useTicketsProvider

Main provider hook orchestrating all ticket functionality.

**Location:** `hooks/use-tickets-provider.ts` (1346 lines)

**Returns:**

```typescript
interface UseTicketsProviderResult {
  // Connection state
  isConnected: boolean;
  socketConnected: boolean;
  socketError: string | null;
  isLoading: boolean;
  error: string | null;

  // View state
  selectedView: string | null;
  setSelectedView: (view: string | null) => void;

  // Tickets data
  allTickets: TicketWithDetails[];
  filteredTickets: TicketWithDetails[];
  ticketCounts: Record<string, number>;
  pagination: PaginationInfo;

  // Selection
  selectedTicketId: string | null;
  setSelectedTicketId: (id: string | null) => void;
  selectedTicket: TicketWithDetails | null;

  // Multi-channel support
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;

  // Multi-selection
  selectedTicketIds: string[];
  toggleTicketSelection: (ticketId: string) => void;
  clearSelection: () => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: TicketFilters;
  setFilters: (filters: TicketFilters) => void;

  // Tabs
  openTabs: string[];
  openTab: (ticketId: string) => void;
  closeTab: (ticketId: string) => void;

  // Core Actions
  fetchTickets: (filters?: TicketFilters) => Promise<void>;
  refreshTickets: () => Promise<void>;
  createTicketFromConversation: (data: CreateFromConversationDto) => Promise<TicketWithDetails>;
  replyToTicket: (ticketId: string, content: string, conversationId: string) => Promise<void>;
  updateTicket: (ticketId: string, updates: UpdateTicketDto) => Promise<void>;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => Promise<void>;
  updateTicketPriority: (ticketId: string, priority: TicketPriority) => Promise<void>;

  // Assignment Actions (Manager/Admin)
  assignTicket: (ticketId: string, assigneeId: string) => Promise<void>;
  bulkAssignTickets: (ticketIds: string[], assigneeId: string) => Promise<void>;
  reopenTicket: (ticketId: string) => Promise<void>;
  mergeTickets: (sourceId: string, targetId: string) => Promise<void>;

  // Discovery Actions
  fetchRelatedTickets: (ticketId: string) => Promise<void>;
  fetchTicketHistory: (ticketId: string) => Promise<void>;
  fetchCustomerHistory: (identifier: string) => Promise<TicketWithDetails[]>;

  // Dashboard Actions
  fetchUnassignedTickets: () => Promise<TicketWithDetails[]>;
  fetchAgentWorkload: () => Promise<any[]>;

  // Tag Management
  tags: Tag[];
  popularTags: Tag[];
  tagSuggestions: Tag[];
  tagsLoading: boolean;
  fetchTags: (query?: ListTagsQueryDto) => Promise<void>;
  fetchPopularTags: (query?: GetPopularTagsQueryDto) => Promise<void>;
  suggestTags: (query: string, limit?: number) => Promise<void>;
  createTag: (data: CreateTagDto) => Promise<Tag>;
  updateTag: (tagId: string, data: UpdateTagDto) => Promise<Tag>;
  deleteTag: (tagId: string) => Promise<void>;
  addTagsToTicket: (ticketId: string, tags: string[]) => Promise<void>;
  removeTagFromTicket: (ticketId: string, tagId: string) => Promise<void>;

  // View Tracking (Read/Unread)
  ticketViewStatusMap: Record<string, TicketViewStatus>;
  unreadTicketsCount: number;
  fetchTicketViewStatus: (ticketId: string) => Promise<void>;
  markTicketAsRead: (ticketId: string) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;

  // Review Queue
  reviewQueueConversations: ConversationNeedsReviewPayload[];
  setReviewQueueConversations: (conversations: ConversationNeedsReviewPayload[]) => void;
}
```

**Key Responsibilities:**
- WebSocket connection management
- Real-time event handling (20 events)
- REST API integration (15+ endpoints)
- State management via Recoil
- Optimistic updates with reconciliation
- Error handling and retry logic
- Permission checks
- Search debouncing
- Auto-mark-read on view

### 2. useQuickActions

Manages quick action execution and navigation.

**Location:** `hooks/use-quick-actions.ts`

**Parameters:**

```typescript
interface UseQuickActionsOptions {
  ticketId: string;
  customerId?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  onBeforeAction?: (actionType: QuickActionType) => void;
  onActionComplete?: (actionType: QuickActionType) => void;
  onActionError?: (actionType: QuickActionType, error: string) => void;
}
```

**Returns:**

```typescript
interface UseQuickActionsResult {
  availableActions: QuickActionConfig[];
  hasCustomer: boolean;
  executeAction: (actionType: QuickActionType) => void;
  canExecuteAction: (actionType: QuickActionType) => boolean;
  getActionBlockReason: (actionType: QuickActionType) => string | null;
}
```

**Features:**
- Validates customer requirement
- Sets customer context before navigation
- Handles print/export/archive actions
- Provides user-friendly error messages

### 3. useTicketFormModal

Manages ticket create/edit modal state and API calls.

**Location:** `hooks/use-ticket-form-modal.ts`

**Parameters:**

```typescript
interface UseTicketFormModalOptions {
  mode: 'create' | 'edit';
  providerId?: string;              // Create mode
  externalConversationId?: string;  // Create mode
  ticketId?: string;                // Edit mode
  ticket?: TicketWithDetails;       // Edit mode
  onSuccess?: (ticket: TicketWithDetails) => void;
  onError?: (error: Error) => void;
}
```

**Returns:**

```typescript
interface UseTicketFormModalResult {
  // Modal state
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;

  // Submission
  isSubmitting: boolean;
  error: string | null;
  handleSubmit: (data: TicketFormData) => Promise<void>;

  // Customer search
  clients: { id: string; label: string }[];
  clientsLoading: boolean;
  handleClientSearch: (query: string) => void;

  // Assignee search
  assignees: { id: string; label: string }[];
  assigneesLoading: boolean;
  handleAssigneeSearch: (query: string) => void;

  // Tags
  popularTags: Tag[];
  tagSuggestions: Tag[];
  tagsLoading: boolean;
  handleSuggestTags: (query: string) => Promise<Tag[]>;
}
```

**Features:**
- Debounced customer search (700ms)
- Client-side assignee filtering
- Tag auto-suggestions
- Permission validation
- Separate tag handling (API limitation)
- Comprehensive error messages

## TypeScript Types

### Core Ticket Types

```typescript
// Ticket Status (backend enum)
export type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'PENDING'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REOPENED';

// Priority Levels
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

// Communication Channels
export type ChannelType = 'email' | 'whatsapp' | 'sms' | 'phone' | 'private_note' | 'internal' | 'web_chat';

// Message Direction
export type MessageDirection = 'inbound' | 'outbound';

// Message Status
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
```

### TicketWithDetails

Main ticket data structure returned by backend:

```typescript
export interface TicketWithDetails {
  // Core Fields
  id: string;
  ticketNumber: string;           // "APPS-216", "OPS-102"
  title: string;
  status: TicketStatus;
  priority: TicketPriority;

  // Customer Information
  customerId?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;

  // Assignment
  assigneeId?: string | null;
  assignee?: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  };

  // Tags
  tags: Tag[];

  // Multi-Conversation Support
  conversations?: Conversation[];   // Array of conversations (multi-channel)
  conversation?: Conversation;      // Legacy single conversation

  // Related Data (included in GET /tickets/:id)
  relatedTickets?: TicketWithDetails[];
  history?: TicketChangeEntry[];

  // View Status (per-user)
  viewStatus?: {
    lastViewedAt: string | null;
    hasUnread: boolean;
    lastViewedMessageId: string | null;
  };

  // SLA Tracking
  sla?: {
    firstResponseDueAt: string;
    resolutionDueAt: string;
    firstResponseAt?: string;
    resolvedAt?: string;
    breached: boolean;
    breachedAt?: string;
  };

  // Metadata
  createdAt: string;
  updatedAt: string;
  printHouseId: string;
}
```

### Conversation & Messages

```typescript
export interface Conversation {
  id: string;
  channel: ChannelType;
  externalConversationId: string;   // Provider conversation ID
  customChannel?: string;

  // Messages
  messages: MessageCard[];

  // Metadata
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageCard {
  id: string;
  content: string;
  channel: ChannelType;
  direction: MessageDirection;
  status: MessageStatus;

  // Sender
  senderId?: string;
  senderEmail?: string;
  senderName?: string;

  // Recipients (for email)
  toRecipients?: string[];
  ccRecipients?: string[];
  bccRecipients?: string[];

  // Flags
  isPrivate: boolean;               // Internal note (not visible to customer)

  // Attachments
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    mimeType: string;
    size: number;
  }>;

  // Metadata
  channelMetadata?: Record<string, any>;
  sentAt?: string;
  errorMessage?: string;
  createdAt: string;
}
```

### API DTOs

```typescript
// Create ticket from existing conversation
export interface CreateFromConversationDto {
  providerId: string;               // 'email', 'whatsapp', etc.
  externalConversationId: string;   // Provider conversation ID
  priority?: TicketPriority;
  assigneeId?: string;
  customerId?: string;
  // Note: tags cannot be added here (API limitation)
}

// Update ticket (general purpose)
export interface UpdateTicketDto {
  title?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string | null;
  customerId?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
}

// Filters for list tickets
export interface TicketFilters {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  assigneeId?: string;
  customerId?: string;
  tags?: string[];
  search?: string;                  // Search in title, content, customer
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'priority' | 'status';
  sortOrder?: 'asc' | 'desc';
  includeArchived?: boolean;
}
```

## State Management (Recoil)

The tickets provider uses extensive Recoil atoms for state:

**Location:** `src/store/frontdesk/atoms/tickets.atoms.ts`

**Key Atoms:**

```typescript
// Tickets data
ticketsAtom                          // TicketWithDetails[]
ticketsLoadingAtom                   // boolean
ticketsErrorAtom                     // string | null
ticketsPaginationAtom                // PaginationInfo | null

// Selection
selectedTicketIdAtom                 // string | null
selectedTicketIdsAtom                // string[]
activeConversationIdAtom             // string | null (multi-conversation support)

// Filters & Search
ticketFiltersAtom                    // TicketFilters
ticketSearchQueryAtom                // string
selectedTicketViewAtom               // string | null

// Tabs
openTicketTabsAtom                   // string[]

// WebSocket
ticketSocketConnectedAtom            // boolean
ticketSocketErrorAtom                // string | null

// Related data
relatedTicketsAtom                   // TicketWithDetails[]
ticketHistoryAtom                    // TicketChangeEntry[]

// Review Queue
reviewQueueConversationsAtom         // ConversationNeedsReviewPayload[]

// Tags
tagsAtom                            // Tag[]
popularTagsAtom                     // Tag[]
tagSuggestionsAtom                  // Tag[]
tagsLoadingAtom                     // boolean

// View Tracking
ticketViewStatusMapAtom             // Record<string, TicketViewStatus>
unreadTicketsCountAtom              // number
```

**Selectors:**

```typescript
filteredTicketsSelector              // Applies filters + search
selectedTicketSelector               // Gets selected ticket details
ticketCountsSelector                 // Counts by status/priority
```

## API Integration

**Service:** `src/services/frontdesk/api/tickets.service.ts`

**Base URL:** `/api/v1/frontdesk/tickets`

**Endpoints (15+):**

```typescript
// List & Retrieve
GET    /tickets                     // List tickets with filters
GET    /tickets/:id                 // Get ticket details (includes related + history)
GET    /tickets/unassigned          // Get unassigned tickets (Manager+)

// Create
POST   /tickets/from-conversation   // Create from existing conversation

// Update
PATCH  /tickets/:id                 // Update ticket (general purpose)
POST   /tickets/:id/reply           // Reply to ticket (requires conversationId)
POST   /tickets/:id/assign          // Assign ticket (Manager+)
POST   /tickets/:id/reopen          // Reopen closed ticket
POST   /tickets/bulk-assign         // Bulk assign (Manager+)
POST   /tickets/:id/merge/:targetId // Merge tickets (Admin)

// Discovery
GET    /tickets/:id/related         // Get related tickets
GET    /tickets/:id/history         // Get ticket history (audit log)
GET    /tickets/customer/:identifier // Get customer ticket history

// Tags
GET    /tags                        // List all tags
GET    /tags/popular                // Get popular tags
GET    /tags/suggest                // Suggest tags (fuzzy search)
POST   /tags                        // Create tag
PATCH  /tags/:id                    // Update tag
DELETE /tags/:id                    // Delete tag
POST   /tickets/:id/tags            // Add tags to ticket
DELETE /tickets/:id/tags/:tagId     // Remove tag from ticket

// View Tracking
GET    /tickets/:id/view-status     // Get view status for ticket
PATCH  /tickets/:id/mark-read       // Mark ticket as read
GET    /tickets/unread/count        // Get unread tickets count

// Analytics
GET    /tickets/agent-workload      // Get agent workload stats (Manager+)
```

**Authentication:**
All endpoints require JWT token. Backend extracts `printHouseId` from token for tenant isolation.

## WebSocket Integration

**Service:** `src/services/frontdesk/websocket/ticket-socket.service.ts`

**Connection:**

```typescript
// Connect (backend extracts printHouseId from JWT)
await ticketSocketService.connect(token);

// Check connection
const isConnected = ticketSocketService.isConnected();

// Disconnect
ticketSocketService.disconnect();
```

**Event Handlers:**

All 20 WebSocket events have dedicated handler registration methods:

```typescript
// Core ticket events
ticketSocketService.onTicketCreated((payload) => { ... });
ticketSocketService.onTicketUpdated((payload) => { ... });
ticketSocketService.onTicketAssigned((payload) => { ... });
ticketSocketService.onTicketStatusChanged((payload) => { ... });
ticketSocketService.onTicketReplySent((payload) => { ... });
ticketSocketService.onTicketReopened((payload) => { ... });
ticketSocketService.onTicketMerged((payload) => { ... });
ticketSocketService.onTicketsBulkAssigned((payload) => { ... });
ticketSocketService.onTicketMessageReceived((payload) => { ... });
ticketSocketService.onTicketCustomerUpdated((payload) => { ... });
ticketSocketService.onSLABreached((payload) => { ... });

// Message delivery
ticketSocketService.onTicketAutoResponse((payload) => { ... });
ticketSocketService.onMessageDelivered((payload) => { ... });
ticketSocketService.onMessageDeliveryFailed((payload) => { ... });

// Review queue
ticketSocketService.onConversationNeedsReview((payload) => { ... });

// Tags
ticketSocketService.onTicketTagsAdded((payload) => { ... });
ticketSocketService.onTicketTagRemoved((payload) => { ... });
ticketSocketService.onTagCreated((payload) => { ... });
ticketSocketService.onTagDeleted((payload) => { ... });

// Webhooks (admin)
ticketSocketService.onWebhookMessageProcessed((payload) => { ... });
```

**Room:** All events broadcast to organization room: `org:${printHouseId}`

## Usage Examples

### Basic Setup

```typescript
import { useTicketsProvider } from '@/widgets/frontdesk/providers/tickets';

function TicketsPage() {
  const tickets = useTicketsProvider();

  useEffect(() => {
    // Tickets auto-fetch on mount
    // WebSocket auto-connects
  }, []);

  if (tickets.isLoading) {
    return <LoadingSpinner />;
  }

  if (tickets.error) {
    return <ErrorMessage error={tickets.error} />;
  }

  return (
    <TicketListPanel />
  );
}
```

### Creating a Ticket

```typescript
import { useTicketsProvider } from '@/widgets/frontdesk/providers/tickets';

function ReviewQueueItem({ conversation }) {
  const tickets = useTicketsProvider();

  const handleCreateTicket = async () => {
    try {
      const ticket = await tickets.createTicketFromConversation({
        providerId: conversation.providerId,
        externalConversationId: conversation.id,
        priority: 'Medium',
        customerId: conversation.customerId,
      });

      console.log('Ticket created:', ticket.ticketNumber);

      // Add tags separately (API limitation)
      await tickets.addTagsToTicket(ticket.id, ['support', 'new-customer']);

      // Navigate to ticket
      tickets.setSelectedTicketId(ticket.id);
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
  };

  return (
    <Button onClick={handleCreateTicket}>
      Create Ticket
    </Button>
  );
}
```

### Updating Ticket

```typescript
// Update multiple fields in one call
await tickets.updateTicket(ticketId, {
  status: 'IN_PROGRESS',
  priority: 'High',
  assigneeId: 'user-123',
});

// Or use legacy specific methods
await tickets.updateTicketStatus(ticketId, 'RESOLVED');
await tickets.updateTicketPriority(ticketId, 'Urgent');
```

### Replying to Ticket

```typescript
// Reply to specific conversation (multi-channel support)
await tickets.replyToTicket(
  ticketId,
  'Thank you for your inquiry...',
  conversationId  // Which channel to reply on
);
```

### Using Quick Actions

```typescript
import { useQuickActions } from '@/widgets/frontdesk/providers/tickets/hooks';

function TicketActions({ ticket }) {
  const quickActions = useQuickActions({
    ticketId: ticket.id,
    customerId: ticket.customerId,
    customerName: ticket.customerName,
    customerEmail: ticket.customerEmail,
    onActionComplete: (action) => {
      console.log('Action completed:', action);
    },
    onActionError: (action, error) => {
      alert(`Failed to execute ${action}: ${error}`);
    },
  });

  return (
    <Menu>
      {quickActions.availableActions.map(action => (
        <MenuItem
          key={action.type}
          disabled={!quickActions.canExecuteAction(action.type)}
          onClick={() => quickActions.executeAction(action.type)}
        >
          {action.icon}
          {action.label}
          {!quickActions.canExecuteAction(action.type) && (
            <Tooltip title={quickActions.getActionBlockReason(action.type)}>
              <InfoIcon />
            </Tooltip>
          )}
        </MenuItem>
      ))}
    </Menu>
  );
}
```

### Using Ticket Form Modal

```typescript
import { useTicketFormModal } from '@/widgets/frontdesk/providers/tickets/hooks';
import { TicketFormModal } from '@/widgets/frontdesk/providers/tickets/components';

function CreateTicketFlow({ conversation }) {
  const ticketForm = useTicketFormModal({
    mode: 'create',
    providerId: conversation.providerId,
    externalConversationId: conversation.id,
    onSuccess: (ticket) => {
      console.log('Ticket created:', ticket.ticketNumber);
      // Navigate or refresh
    },
    onError: (error) => {
      console.error('Failed to create ticket:', error);
    },
  });

  return (
    <>
      <Button onClick={ticketForm.openModal}>
        Create Ticket
      </Button>

      <TicketFormModal
        mode="create"
        open={ticketForm.isOpen}
        onClose={ticketForm.closeModal}
        onSubmit={ticketForm.handleSubmit}
        isSubmitting={ticketForm.isSubmitting}
        error={ticketForm.error}
        // Form data providers
        clients={ticketForm.clients}
        clientsLoading={ticketForm.clientsLoading}
        onClientSearch={ticketForm.handleClientSearch}
        assignees={ticketForm.assignees}
        assigneesLoading={ticketForm.assigneesLoading}
        onAssigneeSearch={ticketForm.handleAssigneeSearch}
        popularTags={ticketForm.popularTags}
        onSuggestTags={ticketForm.handleSuggestTags}
      />
    </>
  );
}
```

### Tag Management

```typescript
// Fetch popular tags
await tickets.fetchPopularTags({ limit: 10 });

// Suggest tags as user types
await tickets.suggestTags('supp', 5);
// Returns: ['support', 'supplier', 'supplemental']

// Create new tag
const tag = await tickets.createTag({
  name: 'urgent-bug',
  color: '#FF0000',
});

// Add tags to ticket
await tickets.addTagsToTicket(ticketId, ['bug', 'high-priority']);

// Remove tag from ticket
await tickets.removeTagFromTicket(ticketId, tagId);
```

### View Tracking

```typescript
// Check if ticket has unread messages
const viewStatus = tickets.ticketViewStatusMap[ticketId];
if (viewStatus?.hasUnread) {
  console.log('Ticket has unread messages');
}

// Manual mark as read (usually auto-marked on view)
await tickets.markTicketAsRead(ticketId);

// Get unread count for badge
console.log('Unread tickets:', tickets.unreadTicketsCount);
```

## Mock Data

**Location:** `mock-data/tickets.mock.ts`

Provides realistic mock tickets for testing:

```typescript
import { mockTickets } from '@/widgets/frontdesk/providers/tickets/mock-data';

// Use in tests or development
const testTicket = mockTickets[0];
```

Mock data includes:
- Variety of statuses and priorities
- Multi-channel conversations
- Tags and customer info
- SLA data
- View status
- Related tickets

## Performance Optimizations

### 1. Debounced Search

Search is debounced to 500ms to avoid excessive API calls:

```typescript
useEffect(() => {
  const timeoutId = setTimeout(() => {
    fetchTickets({ ...filters, search: searchQuery });
  }, 500);

  return () => clearTimeout(timeoutId);
}, [searchQuery]);
```

### 2. Optimistic Updates

WebSocket events update state immediately:

```typescript
ticketSocketService.onTicketUpdated((payload) => {
  // Update ticket in state without API call
  setTickets(prev => prev.map(t =>
    t.id === payload.ticketId ? payload.ticket : t
  ));
});
```

### 3. Selective Fetching

Only fetch ticket details when selected:

```typescript
useEffect(() => {
  if (selectedTicketId) {
    fetchTicketById(selectedTicketId);
  }
}, [selectedTicketId]);
```

### 4. Auto Mark Read

Backend auto-marks ticket as read when fetched:

```typescript
// GET /tickets/:id automatically marks as viewed
// No separate PATCH /mark-read needed
const ticket = await ticketsService.getTicketById(ticketId);
// ticket.viewStatus.hasUnread is now false
```

## Error Handling

### Permission Errors

```typescript
try {
  await tickets.assignTicket(ticketId, assigneeId);
} catch (error) {
  if (error.response?.status === 403) {
    alert('You don\'t have permission to assign tickets. Contact your manager.');
  }
}
```

### Validation Errors

```typescript
try {
  await tickets.createTicketFromConversation(data);
} catch (error) {
  if (error.response?.status === 400) {
    const validationErrors = error.response.data.errors;
    // Display field-specific errors
  }
}
```

### Connection Errors

```typescript
if (tickets.socketError) {
  return (
    <Alert severity="warning">
      Real-time updates unavailable: {tickets.socketError}
      <Button onClick={() => tickets.refreshTickets()}>
        Refresh Manually
      </Button>
    </Alert>
  );
}
```

## Testing

### Unit Tests

```typescript
import { renderHook } from '@testing-library/react';
import { useTicketsProvider } from './use-tickets-provider';

describe('useTicketsProvider', () => {
  it('should fetch tickets on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useTicketsProvider());

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.allTickets.length).toBeGreaterThan(0);
  });
});
```

### Integration Tests

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { TicketDetailView } from './ticket-detail-view';

describe('TicketDetailView', () => {
  it('should display ticket details', async () => {
    const ticket = mockTickets[0];

    render(<TicketDetailView ticket={ticket} />);

    await waitFor(() => {
      expect(screen.getByText(ticket.ticketNumber)).toBeInTheDocument();
      expect(screen.getByText(ticket.title)).toBeInTheDocument();
    });
  });
});
```

## Best Practices

### 1. Always Check Permissions

```typescript
// Check role before showing admin actions
if (userRole === 'ADMIN' || userRole === 'MANAGER') {
  return <BulkAssignButton />;
}
```

### 2. Handle WebSocket Disconnections

```typescript
if (!tickets.socketConnected) {
  // Show offline indicator
  // Enable manual refresh
  return <OfflineBanner onRefresh={tickets.refreshTickets} />;
}
```

### 3. Use Multi-Conversation IDs

```typescript
// When replying, always specify conversation ID
await tickets.replyToTicket(
  ticketId,
  content,
  activeConversationId  // Important for multi-channel tickets
);
```

### 4. Validate Before Submission

```typescript
const handleSubmit = async (data) => {
  if (!data.customerId) {
    setError('Customer is required');
    return;
  }

  if (!data.priority) {
    setError('Priority is required');
    return;
  }

  await tickets.createTicketFromConversation(data);
};
```

### 5. Clean Up Subscriptions

```typescript
useEffect(() => {
  ticketSocketService.connect(token);

  return () => {
    ticketSocketService.disconnect();
  };
}, [token]);
```

## Related Documentation

- [Base Provider Interfaces](./base.md) - Provider architecture
- [Internal DMs Provider](./internal_dms.md) - Direct messaging
- [Email Provider](./email.md) - Email integration
- [Unified Inbox](./unified_inbox.md) - Multi-provider view
- Backend API: `/Users/omarsabbah/Desktop/Messaging-Hub/docs/README.md`

## Changelog

### v2.0.0 (Current)
- Multi-conversation support (tickets can span multiple channels)
- General purpose update endpoint (PATCH /tickets/:id)
- View tracking system (read/unread status)
- 20 WebSocket events (added 4 tag events)
- Tag suggestions with fuzzy search
- Quick actions integration
- Review queue for unticketed messages
- Auto mark-read on view
- Permission-based UI rendering
- Comprehensive error messages

### v1.0.0
- Initial tickets provider
- Single conversation per ticket
- 16 WebSocket events
- Basic tag support
- Status/priority/assignment management
- Multi-channel timeline
- SLA tracking
