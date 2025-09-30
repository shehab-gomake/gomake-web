export type TicketStatus = 'To Do' | 'In Progress' | 'Done' | 'Blocked' | 'Cancelled';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketType = 'Task' | 'Bug' | 'Feature' | 'Support' | 'Question';

export interface TicketParticipant {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface TicketAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface TicketComment {
  id: string;
  author: TicketParticipant;
  content: string;
  createdAt: string;
  isPrivate: boolean;
  attachments?: TicketAttachment[];
}

export interface TicketLink {
  id: string;
  ticketId: string;
  title: string;
  status: TicketStatus;
  relationship: 'blocks' | 'blocked-by' | 'relates-to' | 'duplicates' | 'duplicated-by';
}

export interface TicketTask {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
}

export interface CustomField {
  id: string;
  name: string;
  value: string | number | boolean;
  type: 'text' | 'number' | 'boolean' | 'date' | 'select';
}

export interface Ticket {
  id: string;
  ticketNumber: string; // e.g., "APPS-216", "OPS-102"
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  type: TicketType;

  // People
  reporter: TicketParticipant;
  assignedTo?: TicketParticipant;
  participants: TicketParticipant[];
  watchers: TicketParticipant[];

  // Organization
  project: string;
  tags: string[];

  // Dates
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  resolvedAt?: string;

  // Content
  comments: TicketComment[];
  attachments: TicketAttachment[];
  tasks: TicketTask[];
  linkedTickets: TicketLink[];
  customFields: CustomField[];

  // Metadata
  viewCount: number;
  isUnread?: boolean;
}

export interface TicketView {
  id: string;
  name: string;
  icon?: string;
  filter: (ticket: Ticket) => boolean;
  count?: number;
}

export interface TicketListState {
  tickets: Ticket[];
  selectedTicketId: string | null;
  selectedView: string;
  searchQuery: string;
  sortBy: 'date' | 'priority' | 'status' | 'title';
  sortOrder: 'asc' | 'desc';
  selectedTicketIds: string[]; // for bulk actions
}