import React from "react";
import { ConversationListItem as DSConversationListItem } from "@/widgets/frontdesk/design-system";
import { formatConversationDate } from "@/widgets/frontdesk/utils";
import { ConversationContextMenu } from "@/widgets/frontdesk/components/shared";
import { useConversationContextMenu } from "@/widgets/frontdesk/hooks/use-conversation-context-menu";

interface ChatwootConversationListItemProps {
  conversation: any;
  isSelected: boolean;
  onSelect: (conversation: any) => void;
  onContextMenuAction?: (actionId: string, conversationId: string | number) => void;
}

/**
 * Chatwoot Conversation List Item
 * Adapts Chatwoot conversation data to the design system's ConversationListItem interface
 */
export const ChatwootConversationListItem: React.FC<ChatwootConversationListItemProps> = ({
  conversation,
  isSelected,
  onSelect,
  onContextMenuAction,
}) => {
  const { contextMenuPosition, handleContextMenu, handleCloseContextMenu } = useConversationContextMenu();

  const handleActionClick = (actionId: string, conversationId: string | number) => {
    if (onContextMenuAction) {
      onContextMenuAction(actionId, conversationId);
    }
  };
  // Transform Chatwoot conversation to design system format
  // Chatwoot conversations have a meta field with sender information
  // The last_non_activity_message contains the latest message content
  const sender = conversation.meta?.sender;
  const lastMessage = conversation.last_non_activity_message || conversation.messages?.[0];
  const firstMessage = conversation.messages?.[0];
  
  const title = String(sender?.name || sender?.email || "Unknown");
  const snippet = lastMessage?.content 
    ? (typeof lastMessage.content === 'string' ? lastMessage.content : JSON.stringify(lastMessage.content))
    : "";

  // Extract participants - Chatwoot has contact info in meta
  // ConversationListItem expects participants to be string[], not objects
  const participants = sender
    ? [String(sender.name || sender.email || "Unknown")]
    : [];

  // Extract email-specific fields (subject, recipient) from various possible locations
  // Check additional_attributes, custom_attributes, and message content_attributes
  const subject = 
    conversation.additional_attributes?.subject ||
    conversation.custom_attributes?.subject ||
    firstMessage?.content_attributes?.subject ||
    firstMessage?.content_attributes?.email?.subject ||
    null;

  // Extract recipient - could be in email metadata or custom attributes
  const recipient = 
    conversation.custom_attributes?.to_email ||
    conversation.additional_attributes?.to_email ||
    firstMessage?.content_attributes?.email?.to?.[0]?.email ||
    firstMessage?.content_attributes?.to_email ||
    null;

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
    <>
      <DSConversationListItem
        id={String(conversation.id)}
        title={title}
        participants={participants}
        snippet={snippet}
        timestamp={timestamp}
        isRead={unreadCount === 0}
        isSelected={isSelected}
        unreadCount={unreadCount}
        hasAttachments={false}
        isStarred={false}
        avatarSrc={sender?.avatar_url}
        onClick={() => onSelect(conversation)}
        onContextMenu={handleContextMenu}
        subject={subject}
        recipient={recipient}
      />
      <ConversationContextMenu
        anchorPosition={contextMenuPosition}
        open={Boolean(contextMenuPosition)}
        onClose={handleCloseContextMenu}
        conversationId={conversation.id}
        onActionClick={handleActionClick}
      />
    </>
  );
};

