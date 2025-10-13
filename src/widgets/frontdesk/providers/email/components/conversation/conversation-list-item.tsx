import React from "react";
import { ConversationListItem as DSConversationListItem } from "@/widgets/frontdesk/design-system";
import { EmailConversation } from "../../types/email.types";
import { safeDecodeHtml } from "../../utils/html-decode";
import { formatConversationDate } from "@/widgets/frontdesk/utils";

interface ConversationListItemProps {
  conversation: EmailConversation;
  isSelected: boolean;
  onSelect: (conversation: EmailConversation) => void;
  onParticipantHover: (email: string, element: HTMLElement) => void;
  onParticipantLeave: () => void;
}

/**
 * Email Conversation List Item - Wrapper around design system component
 *
 * Adapts EmailConversation data to the design system's ConversationListItem interface
 */
export const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  isSelected,
  onSelect,
  onParticipantHover,
  onParticipantLeave,
}) => {
  return (
    <DSConversationListItem
      id={conversation.id}
      title={safeDecodeHtml(conversation.subject)}
      participants={conversation.participants}
      snippet={safeDecodeHtml(conversation.snippet)}
      timestamp={formatConversationDate(conversation.date)}
      isRead={conversation.isRead}
      isSelected={isSelected}
      unreadCount={conversation.unreadCount}
      hasAttachments={conversation.hasAttachments}
      isStarred={conversation.isStarred}
      onClick={() => onSelect(conversation)}
    />
  );
};
