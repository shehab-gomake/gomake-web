# Developer Playbook: The Ticket Lifecycle

This playbook provides a deep, code-level guide to the ticket creation and editing process. It is designed to help developers debug issues, add new fields, or understand the end-to-end data flow.

-   **Primary Hook**: `hooks/use-ticket-form-modal.ts`
-   **Primary UI Component**: `components/ticket-form-modal.tsx`
-   **API Service**: `services/frontdesk/api/tickets.service.ts`
-   **Data Contracts**: `types/api.types.ts`

## 1. The Flow: From UI to API

The ticket creation and editing process follows a clear, hook-driven pattern:

1.  **Initiation**: A component (e.g., `TicketDetailView` or a button in the Email provider) calls `openModal()` from the `useTicketFormModal` hook.
2.  **Data Fetching**: The `openModal` function in the hook immediately triggers API calls to fetch the initial data needed for the form's dropdowns (customers, assignees, popular tags).
3.  **UI Rendering**: The `TicketFormModal` component renders the form, receiving all data and functions as props from the hook. It is a **controlled component**.
4.  **User Interaction**: The user fills out the form. All state changes are managed within the `TicketFormModal` component itself (e.g., `useState` for `selectedClient`, `selectedPriority`, etc.).
5.  **Submission**: The user clicks "Create Ticket" or "Save Changes," which calls the `handleSubmit` function passed down from the hook.
6.  **Logic Execution**: The `handleSubmit` function inside `useTicketFormModal` takes over. It performs validation, constructs the appropriate API payload (DTO), and calls the relevant method on the `ticketsService`.
7.  **API Call**: The `ticketsService` makes the `POST` or `PATCH` request to the backend.
8.  **State Update**: Upon a successful API response, the `onSuccess` callback is invoked. This typically triggers a state update in the main `use-tickets-provider.ts` hook, often via a WebSocket event, which then re-renders the ticket list or detail view.

## 2. Deep Dive: Creating a Ticket

### Step 1: Initiation

A component needs to create a ticket from a conversation.

```typescript
// Some component, e.g., in the Email provider
const createModal = useTicketFormModal({
  mode: 'create',
  providerId: 'gmail-provider-123', // The ID of the source provider
  externalConversationId: 'thread-abc-456', // The ID of the email thread
  onSuccess: (newTicket) => {
    // This is called after the ticket is successfully created
    console.log('Ticket created:', newTicket.ticketNumber);
  },
});

// The user clicks a button that calls:
createModal.openModal();
```

### Step 2: `handleSubmit` in the Hook

The `handleSubmit` function in `use-ticket-form-modal.ts` receives the form data.

```typescript
// Inside use-ticket-form-modal.ts
const handleSubmit = async (data: TicketFormData) => {
  // ...
  const payload: CreateFromConversationDto = {
    providerId: options.providerId,
    externalConversationId: options.externalConversationId,
    priority: data.priority,
    assigneeId: data.assigneeId,
    customerId: data.customerId,
  };

  // Calls the API service
  const ticket = await ticketsService.createTicketFromConversation(payload);

  // If tags were selected, a *separate* API call is made
  if (data.tags && data.tags.length > 0) {
    await ticketsService.addTagsToTicket(ticket.id, data.tags);
    // The ticket object is then re-fetched to get the updated tags
  }
  // ...
};
```

-   **File**: `hooks/use-ticket-form-modal.ts`
-   **Data Contract**: `CreateFromConversationDto` from `types/api.types.ts`
-   **API Method**: `createTicketFromConversation` in `services/frontdesk/api/tickets.service.ts`
-   **Endpoint**: `POST /api/tickets/create-from-conversation`

**Key Insight for Debugging**: Tag creation is a separate step. If tickets are being created but tags are missing, the `addTagsToTicket` call is the place to investigate.

## 3. Deep Dive: Editing a Ticket

### Step 1: `handleSubmit` in the Hook

When editing, the logic is more complex. It identifies only the fields that have changed to construct a minimal payload.

```typescript
// Inside use-ticket-form-modal.ts
const handleSubmit = async (data: TicketFormData) => {
  // ...
  const updatePayload: UpdateTicketDto = {};

  // Compare current form data with the original ticket data
  if (data.status !== options.ticket?.status) {
    updatePayload.status = data.status;
  }
  if (data.priority !== options.ticket?.priority) {
    updatePayload.priority = data.priority;
  }
  // ... and so on for other fields

  // If anything changed, call the API
  if (Object.keys(updatePayload).length > 0) {
    const response = await ticketsService.updateTicket(options.ticketId, updatePayload);
  }
  // ...
};
```

-   **File**: `hooks/use-ticket-form-modal.ts`
-   **Data Contract**: `UpdateTicketDto` from `types/api.types.ts`
-   **API Method**: `updateTicket` in `services/frontdesk/api/tickets.service.ts`
-   **Endpoint**: `PATCH /api/tickets/:id`

### Step 2: Tag Updates during Edit

The hook also calculates the difference between the initial and current tags to determine which to add and which to remove.

```typescript
// Inside use-ticket-form-modal.ts
const existingTags = options.ticket.tags?.map((t) => t.name) || [];
const newTags = data.tags.filter((tag) => !existingTags.includes(tag));
const removedTags = existingTags.filter((tag) => !data.tags!.includes(tag));

// Make API calls for new tags
if (newTags.length > 0) {
  await ticketsService.addTagsToTicket(ticket.id, newTags);
}

// Make API calls for removed tags
for (const tagName of removedTags) {
  const tagToRemove = options.ticket.tags?.find((t) => t.name === tagName);
  if (tagToRemove) {
    await ticketsService.removeTagFromTicket(ticket.id, tagToRemove.id);
  }
}
```

**Key Insight for Debugging**: If a user reports that they can't remove a tag, the logic for calculating `removedTags` or the `removeTagFromTicket` API call is the place to look. Permission errors on this specific endpoint (`DELETE /api/tickets/:id/tags/:tagId`) could also be a cause.
