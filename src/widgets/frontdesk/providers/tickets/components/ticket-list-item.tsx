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
      avatarUrl: undefined,
    },
    ticket.assignee && {
      userId: ticket.assignee.id,
      name: ticket.assignee.name,
      avatarUrl: undefined,
    },
    ticket.manager && {
      userId: ticket.manager.id,
      name: ticket.manager.name,
      avatarUrl: undefined,
    },
  ].filter(Boolean) as any[];

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
      onClick={handleClick}
      onCheck={onCheck ? handleCheck : undefined}
    />
  );
};