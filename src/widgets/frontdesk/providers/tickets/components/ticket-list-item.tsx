import React from 'react';
import { TicketListItem as DSTicketListItem } from '@/widgets/frontdesk/design-system';
import { TicketWithDetails } from '../types/api.types';
import { apiStatusToUi, apiPriorityToUi } from '../types/transformers';
import { formatConversationDate } from '@/widgets/frontdesk/utils';

interface TicketListItemProps {
  ticket: TicketWithDetails;
  selected?: boolean;
  checked?: boolean;
  onSelect: (ticketId: string, openInNewTab?: boolean) => void;
  onCheck?: (ticketId: string, checked: boolean) => void;
}

/**
 * Ticket List Item - Wrapper around design system component
 *
 * Adapts TicketWithDetails (backend format) to the design system's TicketListItem interface
 */
export const TicketListItem: React.FC<TicketListItemProps> = ({
  ticket,
  selected = false,
  checked = false,
  onSelect,
  onCheck
}) => {
  const handleClick = (e: React.MouseEvent) => {
    // Middle click or Ctrl/Cmd + click opens in new tab
    const openInNewTab = e.button === 1 || e.ctrlKey || e.metaKey;

    if (openInNewTab) {
      e.preventDefault();
      onSelect(ticket.id, true);
    } else {
      onSelect(ticket.id, false);
    }
  };

  const handleCheck = (checked: boolean) => {
    onCheck?.(ticket.id, checked);
  };

  // Determine if ticket is unread (has recent message and no first response)
  const isUnread = Boolean(
    ticket.conversation.lastMessageAt &&
    !ticket.firstResponseAt &&
    ticket.status === 'OPEN'
  );

  // Get participants from creator, assignee and manager
  const participants = [
    ticket.creator && {
      userId: ticket.creator.id,
      name: ticket.creator.name,
      email: ticket.creator.email,
      avatarUrl: undefined,
    },
    ticket.assignee && {
      userId: ticket.assignee.id,
      name: ticket.assignee.name,
      email: ticket.assignee.email,
      avatarUrl: undefined,
    },
    ticket.manager && {
      userId: ticket.manager.id,
      name: ticket.manager.name,
      email: ticket.manager.email,
      avatarUrl: undefined,
    },
  ].filter(Boolean) as any[];

  // Extract customer info
  const customer = ticket.originProviderChannel
    ? {
        name: ticket.customerName,
        email: ticket.customerEmail,
        phone: ticket.customerPhone,
        channel: ticket.originProviderChannel.type,
      }
    : undefined;

  // Get last message preview (first inbound message or last message)
  const lastMessage = ticket.conversation.messages[ticket.conversation.messages.length - 1];
  const messagePreview = lastMessage?.content
    ? lastMessage.content.substring(0, 100)
    : undefined;

  // Extract assignee info
  const assignee = ticket.assignee
    ? {
        name: ticket.assignee.name,
        avatarUrl: undefined,
      }
    : null;

  // Determine response status
  const responseStatus = ticket.firstResponseAt
    ? ('in_conversation' as const)
    : ('awaiting_first_response' as const);

  // Calculate SLA urgency (if SLA data exists)
  const slaUrgency = ticket.sla
    ? calculateSlaUrgency(ticket.sla)
    : undefined;

  // Get message count
  const messageCount = ticket.conversation.messages.length;

  // Get category name
  const category = ticket.category?.name || null;

  // Get last message direction
  const lastMessageDirection = lastMessage?.direction;

  // Build title from customer info (prioritize name, fallback to email/phone)
  const title = ticket.customerName ||
                ticket.customerEmail ||
                ticket.customerPhone ||
                ticket.conversation.name ||
                'Unknown Customer';

  return (
    <DSTicketListItem
      id={ticket.id}
      ticketNumber={`#${ticket.ticketNumber}`}
      title={title}
      status={apiStatusToUi(ticket.status)}
      priority={apiPriorityToUi(ticket.priority)}
      type={'Support'} // All backend tickets are Support type
      updatedAt={formatConversationDate(ticket.conversation.lastMessageAt || ticket.updatedAt)}
      isSelected={selected}
      isChecked={checked}
      isUnread={isUnread}
      participants={participants}
      tags={ticket.tags || []} // Display tags
      customer={customer}
      messagePreview={messagePreview}
      assignee={assignee}
      responseStatus={responseStatus}
      slaUrgency={slaUrgency}
      messageCount={messageCount}
      category={category}
      lastMessageDirection={lastMessageDirection}
      onClick={handleClick}
      onCheck={onCheck ? handleCheck : undefined}
    />
  );
};

/**
 * Calculate SLA urgency from ticket SLA data
 */
function calculateSlaUrgency(sla: {
  firstResponseDue: string;
  resolutionDue: string;
  firstResponseAt?: string | null;
  resolvedAt?: string | null;
  breached: boolean;
  breachedAt?: string | null;
}): { status: 'safe' | 'warning' | 'overdue'; timeRemaining: string } | undefined {
  if (sla.breached) {
    // Calculate time overdue
    const breachedAt = sla.breachedAt ? new Date(sla.breachedAt) : null;
    if (breachedAt) {
      const overdueDuration = Date.now() - breachedAt.getTime();
      return {
        status: 'overdue',
        timeRemaining: `Overdue ${formatDuration(overdueDuration)}`,
      };
    }
    return { status: 'overdue', timeRemaining: 'Overdue' };
  }

  // Use firstResponseDue if no first response yet, otherwise resolutionDue
  const targetDue = !sla.firstResponseAt ? sla.firstResponseDue : sla.resolutionDue;
  const dueDate = new Date(targetDue);
  const timeRemaining = dueDate.getTime() - Date.now();

  if (timeRemaining < 0) {
    return { status: 'overdue', timeRemaining: 'Overdue' };
  }

  // Warning if less than 2 hours remaining
  const status = timeRemaining < 2 * 60 * 60 * 1000 ? 'warning' : 'safe';

  return {
    status,
    timeRemaining: formatDuration(timeRemaining),
  };
}

/**
 * Format duration in ms to human-readable string
 */
function formatDuration(ms: number): string {
  const hours = Math.floor(ms / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};