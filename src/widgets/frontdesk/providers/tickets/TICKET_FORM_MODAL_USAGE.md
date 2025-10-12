# TicketFormModal - Usage Guide

The new `TicketFormModal` is a unified component that replaces `CreateTicketModal` and supports both create and edit modes with a professional sidebar-style design matching the ticket detail view.

## Features

✅ **Dual Mode** - Single component for create and edit operations
✅ **Sidebar Style** - Matches the right sidebar design from ticket detail view
✅ **Full Fields** - Customer, Priority, Assignee, Tags, Status (edit mode)
✅ **Tag Management** - Popular tags, autocomplete, add/remove
✅ **Type-Safe** - Full TypeScript with backend DTO compliance
✅ **Design System** - Uses FrontDesk design system components

---

## Migration from CreateTicketModal

### Before (Old)
```tsx
import { CreateTicketModal, useCreateTicketModal } from '@/widgets/frontdesk/providers/tickets';

function EmailProviderView() {
  const modal = useCreateTicketModal({
    providerId: 'gmail-provider-id',
    externalConversationId: threadId,
    onSuccess: (ticket) => {
      console.log('Ticket created:', ticket);
    },
  });

  return (
    <>
      <button onClick={modal.openModal}>Create Ticket</button>
      <CreateTicketModal
        open={modal.isOpen}
        onClose={modal.closeModal}
        onSubmit={modal.handleSubmit}
        clients={modal.clients}
        onClientSearch={modal.handleClientSearch}
        clientsLoading={modal.clientsLoading}
        assignees={modal.assignees}
        onAssigneeSearch={modal.handleAssigneeSearch}
        assigneesLoading={modal.assigneesLoading}
        isSubmitting={modal.isSubmitting}
        error={modal.error}
      />
    </>
  );
}
```

### After (New)
```tsx
import { TicketFormModal, useTicketFormModal } from '@/widgets/frontdesk/providers/tickets';

function EmailProviderView() {
  const modal = useTicketFormModal({
    mode: 'create',
    providerId: 'gmail-provider-id',
    externalConversationId: threadId,
    onSuccess: (ticket) => {
      console.log('Ticket created:', ticket);
    },
  });

  return (
    <>
      <button onClick={modal.openModal}>Create Ticket</button>
      <TicketFormModal
        mode="create"
        open={modal.isOpen}
        onClose={modal.closeModal}
        onSubmit={modal.handleSubmit}
        clients={modal.clients}
        onClientSearch={modal.handleClientSearch}
        clientsLoading={modal.clientsLoading}
        assignees={modal.assignees}
        onAssigneeSearch={modal.handleAssigneeSearch}
        assigneesLoading={modal.assigneesLoading}
        popularTags={modal.popularTags}
        onSuggestTags={modal.handleSuggestTags}
        isSubmitting={modal.isSubmitting}
        error={modal.error}
      />
    </>
  );
}
```

---

## Create Mode Example

### Basic Usage
```tsx
import { TicketFormModal, useTicketFormModal } from '@/widgets/frontdesk/providers/tickets';

function CreateTicketExample() {
  const createModal = useTicketFormModal({
    mode: 'create',
    providerId: 'gmail-provider-123',
    externalConversationId: 'thread-456',
    onSuccess: (ticket) => {
      console.log('✅ Ticket created:', ticket.ticketNumber);
      // Navigate to ticket or refresh list
    },
    onError: (error) => {
      console.error('❌ Failed to create ticket:', error);
    },
  });

  return (
    <>
      <button onClick={createModal.openModal}>
        Create Ticket from Email
      </button>

      <TicketFormModal
        mode="create"
        open={createModal.isOpen}
        onClose={createModal.closeModal}
        onSubmit={createModal.handleSubmit}

        // Customer search
        clients={createModal.clients}
        onClientSearch={createModal.handleClientSearch}
        clientsLoading={createModal.clientsLoading}

        // Assignee search
        assignees={createModal.assignees}
        onAssigneeSearch={createModal.handleAssigneeSearch}
        assigneesLoading={createModal.assigneesLoading}

        // Tags
        popularTags={createModal.popularTags}
        onSuggestTags={createModal.handleSuggestTags}

        // State
        isSubmitting={createModal.isSubmitting}
        error={createModal.error}
      />
    </>
  );
}
```

### Create Mode Features
- **Required**: Customer selection
- **Optional**: Priority (default: MEDIUM), Assignee, Tags
- **Note**: Tags are added after ticket creation (API limitation)

---

## Edit Mode Example

### Basic Usage
```tsx
import { TicketFormModal, useTicketFormModal } from '@/widgets/frontdesk/providers/tickets';
import { TicketWithDetails } from '@/widgets/frontdesk/providers/tickets/types';

function EditTicketExample({ ticket }: { ticket: TicketWithDetails }) {
  const editModal = useTicketFormModal({
    mode: 'edit',
    ticketId: ticket.id,
    ticket: ticket,
    onSuccess: (updatedTicket) => {
      console.log('✅ Ticket updated:', updatedTicket.ticketNumber);
      // Refresh ticket data
    },
    onError: (error) => {
      console.error('❌ Failed to update ticket:', error);
    },
  });

  return (
    <>
      <button onClick={editModal.openModal}>
        Edit Ticket
      </button>

      <TicketFormModal
        mode="edit"
        open={editModal.isOpen}
        onClose={editModal.closeModal}
        onSubmit={editModal.handleSubmit}
        ticket={ticket}

        // Customer search (editable)
        clients={editModal.clients}
        onClientSearch={editModal.handleClientSearch}
        clientsLoading={editModal.clientsLoading}

        // Assignee search
        assignees={editModal.assignees}
        onAssigneeSearch={editModal.handleAssigneeSearch}
        assigneesLoading={editModal.assigneesLoading}

        // Tags
        popularTags={editModal.popularTags}
        onSuggestTags={editModal.handleSuggestTags}

        // State
        isSubmitting={editModal.isSubmitting}
        error={editModal.error}
      />
    </>
  );
}
```

### Edit Mode Features
- **All fields editable**: Customer, Status, Priority, Assignee, Tags
- **Pre-filled**: Form is automatically populated with ticket data
- **Smart Updates**: Only changed fields are sent to backend
- **Tag Management**: Add/remove tags with visual feedback

---

## Component Props

### TicketFormModal Props

```typescript
interface TicketFormModalProps {
  mode: 'create' | 'edit';
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TicketFormData) => Promise<void>;
  ticket?: TicketWithDetails; // Required for edit mode

  // Customer search
  clients: Array<{ id: string; label: string }>;
  onClientSearch: (query: string) => void;
  clientsLoading: boolean;

  // Assignee search
  assignees: Array<{ id: string; label: string }>;
  onAssigneeSearch: (query: string) => void;
  assigneesLoading: boolean;

  // Tags
  popularTags?: Tag[];
  onSuggestTags?: (query: string) => Promise<Tag[]>;

  // State
  isSubmitting: boolean;
  error?: string | null;
}
```

### TicketFormData

```typescript
interface TicketFormData {
  // Create mode fields
  customerId?: string;
  priority: TicketPriority; // LOW | MEDIUM | HIGH | URGENT
  assigneeId?: string;
  tags?: string[]; // Tag names

  // Edit mode fields
  status?: TicketStatus; // OPEN | IN_PROGRESS | PENDING | RESOLVED | CLOSED
  categoryId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}
```

---

## Hook Options

### useTicketFormModal Options

```typescript
interface UseTicketFormModalOptions {
  mode: 'create' | 'edit';

  // Create mode options
  providerId?: string; // Required for create mode
  externalConversationId?: string; // Required for create mode

  // Edit mode options
  ticketId?: string; // Required for edit mode
  ticket?: TicketWithDetails; // Required for edit mode

  // Callbacks
  onSuccess?: (ticket: TicketWithDetails) => void;
  onError?: (error: Error) => void;
}
```

---

## Advanced Examples

### Create with Pre-filled Priority
```tsx
const modal = useTicketFormModal({
  mode: 'create',
  providerId: 'provider-123',
  externalConversationId: 'conv-456',
  onSuccess: (ticket) => {
    // Priority is set via form state, not hook options
    console.log('Created with priority:', ticket.priority);
  },
});
```

### Edit with Validation
```tsx
const modal = useTicketFormModal({
  mode: 'edit',
  ticketId: ticket.id,
  ticket: ticket,
  onSuccess: (updatedTicket) => {
    // Validate changes
    if (updatedTicket.status === 'RESOLVED' && !updatedTicket.resolvedAt) {
      console.warn('Ticket marked resolved but no resolution timestamp');
    }
  },
});
```

### Handling Errors
```tsx
const modal = useTicketFormModal({
  mode: 'create',
  providerId: 'provider-123',
  externalConversationId: 'conv-456',
  onError: (error: Error) => {
    // Show toast notification
    if (error.message.includes('Customer')) {
      showToast('Please select a valid customer', 'error');
    } else if (error.message.includes('Permission')) {
      showToast('You do not have permission to create tickets', 'error');
    } else {
      showToast('Failed to create ticket. Please try again.', 'error');
    }
  },
});
```

---

## Design System Components Used

The modal uses the following FrontDesk design system components:

- **PriorityBadge** - Visual priority indicator (colored dots)
- **TicketTypeBadge** - Ticket type icons (🐛, ✨, 🔧, etc.)
- **TagInput** - Autocomplete tag input with suggestions
- **PopularTags** - Quick-add popular tags
- **TagList** - Display and manage selected tags
- **Chip** - Status display with colors
- **colorTokens** - Consistent color palette

All styling matches the right sidebar in [ticket-detail-view.tsx](src/widgets/frontdesk/providers/tickets/components/ticket-detail-view.tsx:880-1140).

---

## Validation Rules

### Create Mode
- ✅ **Customer**: Required
- ✅ **Priority**: Required (default: MEDIUM)
- ✅ **Assignee**: Optional
- ✅ **Tags**: Optional

### Edit Mode
- ✅ **All fields**: Optional (only changed fields sent to backend)
- ✅ **Customer**: Can be changed/linked
- ✅ **Status**: Can transition between any valid status
- ✅ **Priority**: Can be changed
- ✅ **Tags**: Add/remove independently

---

## Backend Integration

### Create Flow
1. Submit `CreateFromConversationDto` to `POST /api/tickets/from-conversation`
2. If tags selected, call `POST /api/tickets/:id/tags` after creation
3. Return full `TicketWithDetails` with tags

### Edit Flow
1. Submit `UpdateTicketDto` to `PATCH /api/tickets/:id`
2. Calculate tag changes (added/removed)
3. Add new tags via `POST /api/tickets/:id/tags`
4. Remove tags via `DELETE /api/tickets/:id/tags/:tagId`
5. Return updated `TicketWithDetails`

---

## Future Enhancements

The component is designed to easily support:

- **Category Selection** - Field exists in DTO, UI pending
- **Custom Fields** - Ready for future expansion
- **Attachments** - Can be added to form
- **Ticket Type Selection** - Currently defaults to "Support"
- **Due Date Picker** - For SLA management
- **Description Field** - Rich text editor for detailed description

---

## Troubleshooting

### Tags Not Saving
- Check that `onSuggestTags` prop is provided
- Verify backend has tag endpoints enabled
- Check console for API errors

### Customer Not Found
- Ensure customer search returns valid GoMake customer IDs
- Check backend customer linking logic
- Verify customer exists in system

### Assignee Not Updating
- Verify user has permission to assign tickets
- Check that assignee ID is valid user ID
- Ensure backend role-based access control (RBAC) is configured

---

## Support

For issues or questions:
- Check backend docs: `/Users/omarsabbah/Desktop/Messaging-Hub/docs/README.md`
- Review design system: `src/widgets/frontdesk/design-system/README.md`
- See main guide: `docs/frontdesk/README.md`
