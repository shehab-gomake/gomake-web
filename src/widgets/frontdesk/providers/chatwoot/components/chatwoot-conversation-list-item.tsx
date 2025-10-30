import React from "react";
import { ConversationListItem as DSConversationListItem } from "@/widgets/frontdesk/design-system";
import { formatConversationDate } from "@/widgets/frontdesk/utils";

interface ChatwootConversationListItemProps {
  conversation: any;
  isSelected: boolean;
  onSelect: (conversation: any) => void;
}

/**
 * Chatwoot Conversation List Item
 * Adapts Chatwoot conversation data to the design system's ConversationListItem interface
 */
export const ChatwootConversationListItem: React.FC<ChatwootConversationListItemProps> = ({
  conversation,
  isSelected,
  onSelect,
}) => {
  // Transform Chatwoot conversation to design system format
  // Chatwoot conversations have a meta field with sender information
  // The last_non_activity_message contains the latest message content
  const sender = conversation.meta?.sender;
  const lastMessage = conversation.last_non_activity_message || conversation.messages?.[0];
  
  const title = sender?.name || sender?.email || "Unknown";
  const snippet = lastMessage?.content 
    ? (typeof lastMessage.content === 'string' ? lastMessage.content : JSON.stringify(lastMessage.content))
    : "";

  // Extract participants - Chatwoot has contact info in meta
  const participants = sender
    ? [
        {
          name: sender.name || sender.email || "Unknown",
          email: sender.email || "",
          avatar: sender.avatar_url,
        },
      ]
    : [];

  // Format timestamp - Chatwoot uses Unix timestamps (seconds)
  const timestamp = conversation.updated_at || conversation.created_at || conversation.timestamp
    ? formatConversationDate(
        conversation.updated_at 
          ? new Date(conversation.updated_at * 1000).toISOString()
          : conversation.created_at
          ? new Date(conversation.created_at * 1000).toISOString()
          : conversation.timestamp
      )
    : "";

  // Unread count
  const unreadCount = conversation.unread_count || 0;

  return (
    <DSConversationListItem
      id={conversation.id}
      title={title}
      participants={participants}
      snippet={snippet}
      timestamp={timestamp}
      isRead={unreadCount === 0}
      isSelected={isSelected}
      unreadCount={unreadCount}
      hasAttachments={false}
      isStarred={false}
      onClick={() => onSelect(conversation)}
    />
  );
};

