/**
 * Type Transformers: Convert between UI types and Backend API types
 *
 * The UI uses legacy types (e.g., "To Do", "In Progress") while the backend uses
 * Prisma enums (e.g., "OPEN", "IN_PROGRESS"). These utilities handle the conversion.
 */

import {
  TicketStatus as ApiTicketStatus,
  TicketPriority as ApiTicketPriority,
  TicketWithDetails as ApiTicket,
  MessageDirection,
  ChannelType,
} from './api.types';
import {
  Ticket as UiTicket,
  TicketStatus as UiTicketStatus,
  TicketPriority as UiTicketPriority,
  TicketComment,
} from './ticket.types';

// ============================================
// Status Formatters (Unified Backend Enum)
// ============================================

/**
 * Format backend ticket status for display
 * Uses backend enum directly - no transformation needed
 * This maintains consistency between backend and frontend
 */
export function formatTicketStatus(status: ApiTicketStatus): string {
  const labels: Record<ApiTicketStatus, string> = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    PENDING: 'Pending',
    RESOLVED: 'Resolved',
    CLOSED: 'Closed',
    REOPENED: 'Reopened',
  };
  return labels[status] || status;
}

/**
 * @deprecated Use formatTicketStatus() instead
 * Kept for backward compatibility during migration
 */
export function apiStatusToUi(status: ApiTicketStatus): string {
  return formatTicketStatus(status);
}

// ============================================
// Priority Transformers
// ============================================

const API_TO_UI_PRIORITY: Record<ApiTicketPriority, UiTicketPriority> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

const UI_TO_API_PRIORITY: Record<UiTicketPriority, ApiTicketPriority> = {
  Low: 'LOW',
  Medium: 'MEDIUM',
  High: 'HIGH',
  Urgent: 'URGENT',
};

export function apiPriorityToUi(priority: ApiTicketPriority): UiTicketPriority {
  return API_TO_UI_PRIORITY[priority] || 'Medium';
}

export function uiPriorityToApi(priority: UiTicketPriority): ApiTicketPriority {
  return UI_TO_API_PRIORITY[priority] || 'MEDIUM';
}

// ============================================
// Channel Badge Helpers
// ============================================

export function getChannelIcon(channel: ChannelType | string): string {
  const icons: Record<string, string> = {
    EMAIL: '📧',
    WHATSAPP: '💬',
    SMS: '📱',
    PUSH: '🔔',
  };
  return icons[channel] || '💬';
}

export function getChannelColor(channel: ChannelType | string): string {
  const colors: Record<string, string> = {
    EMAIL: '#2563eb',
    WHATSAPP: '#25d366',
    SMS: '#8b5cf6',
    PUSH: '#f59e0b',
  };
  return colors[channel] || '#6b7280';
}

export function getChannelLabel(channel: ChannelType | string): string {
  return channel.charAt(0) + channel.slice(1).toLowerCase();
}

// ============================================
// Message Direction Helpers
// ============================================

export function getDirectionLabel(direction: MessageDirection): string {
  return direction === 'INBOUND' ? 'Received' : 'Sent';
}

export function getDirectionIcon(direction: MessageDirection): string {
  return direction === 'INBOUND' ? '⬇️' : '⬆️';
}

// ============================================
// Ticket Transformer (API → UI)
// ============================================

export function transformApiTicketToUi(apiTicket: ApiTicket): UiTicket {
  // Transform messages to comments (with null-safety)
  const messages = apiTicket.conversation?.messages || [];
  const comments: TicketComment[] = messages.map((msg) => ({
    id: msg.id,
    author: {
      userId: msg.direction === 'INBOUND' ? apiTicket.customerId || 'customer' : apiTicket.assigneeId || 'agent',
      name: msg.direction === 'INBOUND' ? apiTicket.customerName || msg.fromIdentifier || 'Customer' : apiTicket.assignee?.name || 'Agent',
      email: msg.direction === 'INBOUND' ? apiTicket.customerEmail || msg.fromIdentifier || '' : apiTicket.assignee?.email || '',
      avatarUrl: undefined,
    },
    content: msg.content,
    createdAt: msg.createdAt,
    isPrivate: false,
    attachments: [],
    channel: msg.channel?.toLowerCase() as TicketComment['channel'],
    direction: msg.direction === 'INBOUND' ? 'inbound' : 'outbound',
    status: 'sent',
    channelMetadata: msg.metadata,
  }));

  return {
    id: apiTicket.id,
    ticketNumber: `#${apiTicket.ticketNumber}`,
    title: apiTicket.conversation.name || `Ticket #${apiTicket.ticketNumber}`,
    description: messages[0]?.content || '',
    status: apiTicket.status, // Use backend enum directly - unified types
    priority: apiPriorityToUi(apiTicket.priority),
    type: 'Support', // Default type for tickets from backend

    // People
    reporter: {
      userId: apiTicket.customerId || 'customer',
      name: apiTicket.customerName || apiTicket.customerEmail || apiTicket.customerPhone || 'Customer',
      email: apiTicket.customerEmail || '',
      avatarUrl: undefined,
    },
    assignedTo: apiTicket.assignee
      ? {
          userId: apiTicket.assignee.id,
          name: apiTicket.assignee.name,
          email: apiTicket.assignee.email,
          avatarUrl: undefined,
        }
      : undefined,
    participants: [],
    watchers: [],

    // Organization
    project: apiTicket.printHouseId,
    tags: apiTicket.tags as any,

    // Dates
    createdAt: apiTicket.createdAt,
    updatedAt: apiTicket.updatedAt,
    dueDate: apiTicket.sla?.resolutionDue,
    resolvedAt: apiTicket.resolvedAt || undefined,

    // Content
    comments,
    attachments: [],
    tasks: [],
    linkedTickets: [],
    customFields: [],

    // Metadata
    viewCount: 0,
    isUnread: false,
  };
}

// ============================================
// Filter Helpers
// ============================================

export function getFilterLabel(key: string, value: any): string {
  if (key === 'status') return formatTicketStatus(value as ApiTicketStatus);
  if (key === 'priority') return apiPriorityToUi(value as ApiTicketPriority);
  return String(value);
}

// ============================================
// SLA Helpers
// ============================================

export function isSLABreached(ticket: ApiTicket): boolean {
  return ticket.sla?.breached || false;
}

export function getSLAStatus(ticket: ApiTicket): 'ok' | 'warning' | 'breached' {
  if (!ticket.sla) return 'ok';
  if (ticket.sla.breached) return 'breached';

  const now = new Date();
  const firstResponseDue = new Date(ticket.sla.firstResponseDue);
  const resolutionDue = new Date(ticket.sla.resolutionDue);

  // Warning if within 20% of deadline
  const firstResponseWarning = new Date(firstResponseDue.getTime() - (firstResponseDue.getTime() - now.getTime()) * 0.2);
  const resolutionWarning = new Date(resolutionDue.getTime() - (resolutionDue.getTime() - now.getTime()) * 0.2);

  if (now > firstResponseWarning && !ticket.sla.firstResponseAt) return 'warning';
  if (now > resolutionWarning && !ticket.sla.resolvedAt) return 'warning';

  return 'ok';
}

export function formatSLATime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const hours = Math.floor(Math.abs(diff) / (1000 * 60 * 60));
  const minutes = Math.floor((Math.abs(diff) % (1000 * 60 * 60)) / (1000 * 60));

  if (diff < 0) {
    return `Overdue by ${hours}h ${minutes}m`;
  }
  return `${hours}h ${minutes}m remaining`;
}
