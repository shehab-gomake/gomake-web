# Tickets Provider

The Tickets provider is a complete, feature-rich support ticketing system integrated into FrontDesk. It is the most complex provider and serves as a reference for advanced functionality.

-   **Status**: ✅ **Fully Integrated**
-   **Key Files**:
    -   `hooks/use-tickets-provider.ts`
    -   `components/ticket-detail-view.tsx`
    -   `types/ticket.types.ts`

## 1. Core Functionality

-   **Multi-Channel Tickets**: Consolidates customer communications from any source (Email, WhatsApp, etc.) into a single ticket timeline.
-   **Real-time Updates**: Leverages WebSockets for instant updates on status changes, new messages, assignments, and more.
-   **Lifecycle Management**: Full support for ticket statuses (`OPEN`, `IN_PROGRESS`, `PENDING`, `RESOLVED`, `CLOSED`).
-   **Assignments & Collaboration**: Assign tickets to agents, add participants, and track activity.
-   **Tagging**: A complete tag management system for categorization and filtering.
-   **Quick Actions**: Shortcuts to perform related business operations, like creating quotes or invoices from a ticket.
-   **Read/Unread Tracking**: Tracks which tickets are unread for each agent.

## 2. The `useTicketsProvider` Hook

This is the "brain" of the provider, located at `hooks/use-tickets-provider.ts`. It is a large and powerful hook that orchestrates all state and logic.

### Key Responsibilities:

-   **WebSocket Management**: Connects to the ticket WebSocket and handles **19 distinct real-time events** (e.g., `ticket.created`, `ticket.message.received`, `sla.breached`).
-   **API Integration**: Implements over **15 API service calls** for fetching, creating, updating, assigning, and merging tickets.
-   **State Management**: Manages all ticket-related state in Recoil, including the main ticket list, filters, pagination, and the currently selected ticket.
-   **Tag Management**: Includes a full suite of functions for fetching, creating, suggesting, adding, and removing tags.
-   **View Tracking**: Manages the read/unread status of tickets for the current user.

## 3. The `TicketDetailView` Component

This is the primary UI for viewing and interacting with a single ticket, located at `components/ticket-detail-view.tsx`. It is a complex "workspace" component, not just a simple view.

### Key Features:

-   **Tabbed Interface**: Organizes information into three main views:
    1.  **Conversation**: A multi-channel timeline of all messages, notes, and system events.
    2.  **Objectives & Details**: A summary of the ticket's goals, customer information, and success criteria.
    3.  **Activity History**: A detailed audit log of every change made to the ticket.
-   **Multi-Channel Conversation Tabs**: If a ticket involves multiple channels (e.g., an email thread and a WhatsApp chat), the conversation view will show tabs to switch between them.
-   **Quick Actions Integration**: Integrates the `useQuickActions` hook to provide a dropdown menu of contextual actions (e.g., "Create Quote").
-   **Editable Metadata**: The right sidebar allows for editing key ticket fields like Status, Priority, Assignee, and Tags.
-   **Modal Integration**: Uses the `useTicketFormModal` hook to open a sidebar-style modal for editing the ticket's core details.

## 4. Data Model (`ticket.types.ts`)

The data structures for the Tickets provider are highly detailed to support its rich feature set.

### `TicketWithDetails` Interface:

This is the main interface for a ticket. Key properties include:
-   `id`, `ticketNumber`, `title`
-   `status`: `TicketStatus` enum
-   `priority`: `TicketPriority` enum
-   `assignee`, `reporter`, `participants`
-   `tags`: An array of `Tag` objects.
-   `conversations`: An array of `Conversation` objects, allowing a single ticket to span multiple communication channels.
-   `viewStatus`: An object containing `hasUnread` and `lastViewedAt` to track read status per user.

### `TicketComment` / `MessageCard` Interface:

This interface represents a single entry in the ticket timeline. It is designed for multi-channel support.
-   `channel`: The source of the message (e.g., `'email'`, `'whatsapp'`, `'private_note'`).
-   `direction`: `'inbound'` or `'outbound'`.
-   `status`: Delivery status (e.g., `'sent'`, `'delivered'`, `'read'`).
-   `isPrivate`: `true` for internal notes that are not visible to the customer.

This detailed data model allows the UI (specifically the `MessageCard` component) to render each timeline entry with channel-specific styling (e.g., a blue border for email, green for WhatsApp, yellow background for private notes).

---

### Developer Playbook

For a deep, code-level guide to the ticket creation and editing process, see the [**Developer Playbook: The Ticket Lifecycle**](../development/playbook_ticket_lifecycle.md).