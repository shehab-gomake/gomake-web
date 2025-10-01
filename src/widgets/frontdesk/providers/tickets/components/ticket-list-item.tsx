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

  // Get participants from assignee and manager
  const participants = [
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

  return (
    <DSTicketListItem
      id={ticket.id}
      ticketNumber={`#${ticket.ticketNumber}`}
      title={ticket.conversation.name || `Ticket #${ticket.ticketNumber}`}
      status={apiStatusToUi(ticket.status)}
      priority={apiPriorityToUi(ticket.priority)}
      type={'Support'} // All backend tickets are Support type
      updatedAt={formatConversationDate(ticket.conversation.lastMessageAt || ticket.updatedAt)}
      isSelected={selected}
      isChecked={checked}
      isUnread={isUnread}
      participants={participants}
      onClick={handleClick}
      onCheck={onCheck ? handleCheck : undefined}
    />
  );
};