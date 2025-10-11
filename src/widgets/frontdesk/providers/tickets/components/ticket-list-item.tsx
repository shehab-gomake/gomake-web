import React from 'react';
import { TicketListItem as DSTicketListItem } from '@/widgets/frontdesk/design-system';
import { TicketWithDetails } from '../types/api.types';
import { apiStatusToUi, apiPriorityToUi } from '../types/transformers';
import { formatConversationDate } from '@/widgets/frontdesk/utils';

interface TicketListItemProps {
  ticket: TicketWithDetails;
  selected?: boolean;
  onSelect: (ticketId: string, openInNewTab?: boolean) => void;
}

/**
 * Ticket List Item - Wrapper around design system component
 *
 * Adapts TicketWithDetails (backend format) to the design system's TicketListItem interface
 */
export const TicketListItem: React.FC<TicketListItemProps> = ({
  ticket,
  selected = false,
  onSelect
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

  // Multi-conversation support: Use conversations array if available, otherwise fall back to single conversation
  const conversations = ticket.conversations || (ticket.conversation ? [{
    ...ticket.conversation,
    channel: 'EMAIL' as any, // Default to EMAIL for old format
    provider: { id: '', vendor: '', type: 'EMAIL' },
    identifier: ticket.customerEmail || '',
    messageCount: ticket.conversation.messages?.length || 0,
  }] : []);
  const latestConversation = conversations.length > 0 ? conversations[0] : null;

  // Determine if ticket is unread (has recent message and no first response)
  const isUnread = Boolean(
    latestConversation?.lastMessageAt &&
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
                latestConversation?.name ||
                'Unknown Customer';

  // Extract channel info for multi-conversation badge
  const channels = ticket.channels || (latestConversation?.channel ? [{ type: latestConversation.channel, vendor: latestConversation.provider?.vendor || '' }] : []);
  const conversationCount = ticket.conversationCount || conversations.length;

  // TODO: Add channel badges and conversation count to design system component
  // For now, the multi-conversation info will be visible in the detail view tabs

  return (
    <DSTicketListItem
      id={ticket.id}
      ticketNumber={`#${ticket.ticketNumber}`}
      title={title}
      status={apiStatusToUi(ticket.status)}
      priority={apiPriorityToUi(ticket.priority)}
      type={'Support'} // All backend tickets are Support type
      updatedAt={formatConversationDate(latestConversation?.lastMessageAt || ticket.updatedAt)}
      isSelected={selected}
      isUnread={isUnread}
      participants={participants}
      tags={ticket.tags || []} // Display tags
      onClick={handleClick}
    />
  );
};