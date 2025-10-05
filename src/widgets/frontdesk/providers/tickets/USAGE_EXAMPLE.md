# Create Ticket Modal - Usage Example

## Basic Usage

```tsx
import React from 'react';
import { Button } from '@mui/material';
import { CreateTicketModal, useCreateTicketModal } from '@/widgets/frontdesk/providers/tickets';

function MyComponent() {
  // Initialize the modal hook
  const createTicketModal = useCreateTicketModal({
    providerId: 'your-provider-id', // From GET /providers API
    externalConversationId: 'conversation-id', // Gmail threadId, WhatsApp chatId, etc.
    onSuccess: (ticketNumber) => {
      console.log(`Ticket #${ticketNumber} created successfully!`);
      // Optionally refresh tickets list, show notification, etc.
    },
    onError: (error) => {
      console.error('Failed to create ticket:', error);
    },
  });

  return (
    <>
      {/* Trigger button */}
      <Button onClick={createTicketModal.openModal}>
        Create Ticket
      </Button>

      {/* Modal component */}
      <CreateTicketModal
        open={createTicketModal.isOpen}
        onClose={createTicketModal.closeModal}
        onSubmit={createTicketModal.handleSubmit}
        // Client search
        clients={createTicketModal.clients}
        onClientSearch={createTicketModal.handleClientSearch}
        clientsLoading={createTicketModal.clientsLoading}
        // Assignee search
        assignees={createTicketModal.assignees}
        onAssigneeSearch={createTicketModal.handleAssigneeSearch}
        assigneesLoading={createTicketModal.assigneesLoading}
        // State
        isSubmitting={createTicketModal.isSubmitting}
        error={createTicketModal.error}
      />
    </>
  );
}
```

## Integration with Email Provider

```tsx
import { useEmailProvider } from '@/widgets/frontdesk/providers/email/hooks/use-email-provider';
import { useProviders } from '@/widgets/frontdesk/providers/email/hooks/use-providers';
import { CreateTicketModal, useCreateTicketModal } from '@/widgets/frontdesk/providers/tickets';

function EmailView() {
  const emailProvider = useEmailProvider();
  const providers = useProviders();

  // Find the EMAIL provider for the selected account
  const selectedAccount = emailProvider.accounts.find(
    acc => acc.id === emailProvider.selectedAccountId
  );

  const emailProviderId = providers.providers.find(
    p => p.type === 'EMAIL' && p.metadata?.email === selectedAccount?.email
  )?.id;

  const createTicketModal = useCreateTicketModal({
    providerId: emailProviderId,
    externalConversationId: emailProvider.selectedConversation?.id, // Gmail threadId
    onSuccess: (ticketNumber) => {
      alert(`Ticket #${ticketNumber} created!`);
    },
  });

  return (
    <>
      <Button onClick={createTicketModal.openModal}>
        Create Ticket
      </Button>

      <CreateTicketModal {...createTicketModal} />
    </>
  );
}
```

## Features

### Client Search
- Searches customers using `/v1/customers/get-customers-pagination` API
- Debounced search (700ms delay)
- Displays: `{name} - {code}`
- **Required field**

### Assignee Search
- Loads employees from `/v1/crm-service/employee/get-all-employees-for-dropdown` API
- Client-side filtering for fast search
- Displays: `{firstname} {lastname} - {email}`
- **Optional field**

### Priority Selection
- Options: LOW, MEDIUM, HIGH, URGENT
- Default: MEDIUM
- **Required field**

## API Request

When submitted, the modal calls:

```typescript
POST /tickets/from-conversation
{
  "providerId": "provider-uuid",
  "externalConversationId": "gmail-thread-id-or-whatsapp-chat-id",
  "priority": "MEDIUM",
  "assigneeId": "user-uuid" // optional
}
```

## Hook Options

```typescript
interface UseCreateTicketModalOptions {
  providerId?: string;              // Provider ID from GET /providers
  externalConversationId?: string;  // Gmail threadId, WhatsApp chatId, etc.
  onSuccess?: (ticketNumber: number) => void;
  onError?: (error: Error) => void;
}
```

## Hook Return Values

```typescript
{
  // Modal state
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;

  // Submission
  isSubmitting: boolean;
  error: string | null;
  handleSubmit: (data) => Promise<void>;

  // Client search
  clients: Array<{id: string, label: string}>;
  clientsLoading: boolean;
  handleClientSearch: (query: string) => void;

  // Assignee search
  assignees: Array<{id: string, label: string}>;
  assigneesLoading: boolean;
  handleAssigneeSearch: (query: string) => void;
}
```
