// Types
export * from './types/ticket.types';

// Components
export { TicketListPanel } from './components/ticket-list-panel';
export { TicketListItem } from './components/ticket-list-item';
export { TicketDetailView } from './components/ticket-detail-view';
export { CreateTicketModal } from './components/create-ticket-modal'; // @deprecated Use TicketFormModal instead
export { TicketFormModal } from './components/ticket-form-modal';

// Hooks
export { useCreateTicketModal } from './hooks/use-create-ticket-modal'; // @deprecated Use useTicketFormModal instead
export { useTicketFormModal } from './hooks/use-ticket-form-modal';

// Mock data
export { mockTickets, mockParticipants, ticketViews } from './mock-data/tickets.mock';