import React from 'react';
import { TicketListItem as DSTicketListItem } from '@/widgets/frontdesk/design-system';
import { Ticket } from '../types/ticket.types';
import { formatConversationDate } from '@/widgets/frontdesk/utils';

interface TicketListItemProps {
  ticket: Ticket;
  selected?: boolean;
  checked?: boolean;
  onSelect: (ticketId: string, openInNewTab?: boolean) => void;
  onCheck?: (ticketId: string, checked: boolean) => void;
}

/**
 * Ticket List Item - Wrapper around design system component
 *
 * Adapts Ticket data to the design system's TicketListItem interface
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

  return (
    <DSTicketListItem
      id={ticket.id}
      ticketNumber={ticket.ticketNumber}
      title={ticket.title}
      status={ticket.status}
      priority={ticket.priority as 'Urgent' | 'High' | 'Medium' | 'Low'}
      type={ticket.type as 'Bug' | 'Feature' | 'Task' | 'Support'}
      updatedAt={formatConversationDate(ticket.updatedAt)}
      isSelected={selected}
      isChecked={checked}
      isUnread={ticket.isUnread}
      participants={ticket.participants}
      onClick={handleClick}
      onCheck={onCheck ? handleCheck : undefined}
    />
  );
};