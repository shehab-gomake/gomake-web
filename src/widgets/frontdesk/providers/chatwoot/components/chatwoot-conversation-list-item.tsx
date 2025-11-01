import React, { useMemo, useCallback } from "react";
import { ConversationListItem as DSConversationListItem } from "@/widgets/frontdesk/design-system";
import { formatConversationDate } from "@/widgets/frontdesk/utils";
import { ConversationContextMenu } from "@/widgets/frontdesk/components/shared";
import { useConversationContextMenu } from "@/widgets/frontdesk/hooks/use-conversation-context-menu";
import { useChatwootInboxes } from "../hooks/use-chatwoot-inboxes";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";

// ============================================================================
// Type Definitions
// ============================================================================

interface ChatwootConversationListItemProps {
  conversation: any; // TODO: Use proper ChatwootConversation type when available
  isSelected: boolean;
  onSelect: (conversation: any) => void;
  onContextMenuAction?: (actionId: string, conversationId: string | number) => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Extracts the email subject from conversation metadata
 */
function extractEmailSubject(conversation: any): string | null {
  return (
    conversation.additional_attributes?.subject ||
    conversation.custom_attributes?.subject ||
    conversation.messages?.[0]?.content_attributes?.subject ||
    conversation.messages?.[0]?.content_attributes?.email?.subject ||
    null
  );
}

/**
 * Extracts the email recipient from conversation metadata
 */
function extractEmailRecipient(conversation: any): string | null {
  const firstMessage = conversation.messages?.[0];
  return (
    conversation.custom_attributes?.to_email ||
    conversation.additional_attributes?.to_email ||
    firstMessage?.content_attributes?.email?.to?.[0]?.email ||
    firstMessage?.content_attributes?.to_email ||
    null
  );
}

/**
 * Formats Chatwoot Unix timestamp to ISO string
 */
function formatChatwootTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString();
}

/**
 * Extracts and formats the conversation timestamp
 */
function getFormattedTimestamp(conversation: any): string {
  const timestamp = conversation.updated_at || conversation.created_at || conversation.timestamp;

  if (!timestamp) {
    return "";
  }

  // Chatwoot uses Unix timestamps (seconds), convert to ISO
  const isoTimestamp =
    conversation.updated_at ? formatChatwootTimestamp(conversation.updated_at)
    : conversation.created_at ? formatChatwootTimestamp(conversation.created_at)
    : conversation.timestamp;

  return formatConversationDate(isoTimestamp);
}

/**
 * Extracts the conversation snippet/preview
 */
function getConversationSnippet(conversation: any): string {
  const lastMessage = conversation.last_non_activity_message || conversation.messages?.[0];

  if (!lastMessage?.content) {
    return "";
  }

  return typeof lastMessage.content === "string"
    ? lastMessage.content
    : JSON.stringify(lastMessage.content);
}

/**
 * Extracts participant names from conversation
 */
function getParticipantNames(conversation: any): string[] {
  const sender = conversation.meta?.sender;

  if (!sender) {
    return [];
  }

  const name = String(sender.name || sender.email || "Unknown");
  return [name];
}

/**
 * Extracts conversation title
 */
function getConversationTitle(conversation: any): string {
  const sender = conversation.meta?.sender;
  return String(sender?.name || sender?.email || "Unknown");
}

// ============================================================================
// Component
// ============================================================================

/**
 * Chatwoot Conversation List Item
 *
 * Adapts Chatwoot conversation data structure to the design system's
 * ConversationListItem interface. Handles data extraction, transformation,
 * and normalization for consistent display.
 *
 * @see CONVERSATION_LIST_ICONS_GUIDE.md
 */
export const ChatwootConversationListItem: React.FC<ChatwootConversationListItemProps> = ({
  conversation,
  isSelected,
  onSelect,
  onContextMenuAction,
}) => {
  const { contextMenuPosition, handleContextMenu, handleCloseContextMenu } = useConversationContextMenu();
  const { inboxes } = useChatwootInboxes();

  // ========================================================================
  // Memoized Data Extraction
  // ========================================================================

  const inbox = useMemo(() => {
    if (!conversation.inbox_id || !inboxes.length) {
      return null;
    }
    return inboxes.find((inbox) => inbox.id === conversation.inbox_id) || null;
  }, [conversation.inbox_id, inboxes]);

  const conversationData = useMemo(() => {
    const sender = conversation.meta?.sender;

    return {
      title: getConversationTitle(conversation),
      participants: getParticipantNames(conversation),
      snippet: getConversationSnippet(conversation),
      timestamp: getFormattedTimestamp(conversation),
      subject: extractEmailSubject(conversation),
      recipient: extractEmailRecipient(conversation),
      unreadCount: conversation.unread_count || 0,
      presence: sender?.availability_status || sender?.availabilityStatus || null,
      avatarSrc: sender?.avatar_url,
      priority: conversation.priority || null,
      inboxChannelType: inbox?.channel_type || conversation.meta?.channel || null,
      inboxMedium: (inbox as any)?.medium || null,
      inboxName: inbox?.name || null,
      assignee: conversation.meta?.assignee
        ? {
            name: conversation.meta.assignee.name,
            avatarSrc: conversation.meta.assignee.avatar_url,
            presence: conversation.meta.assignee.availability_status || null,
          }
        : null,
      labels: conversation.labels || [],
      appliedSla: conversation.applied_sla || conversation.appliedSla || null,
      conversationTimestamp: conversation.timestamp || conversation.created_at || null,
      lastActivityAt: conversation.last_activity_at || conversation.lastActivityAt || null,
    };
  }, [conversation, inbox]);

  // ========================================================================
  // Event Handlers
  // ========================================================================

  const handleSelect = useCallback(() => {
    onSelect(conversation);
  }, [conversation, onSelect]);

  const handleAction = useCallback(
    (actionId: string, conversationId: string | number) => {
      onContextMenuAction?.(actionId, conversationId);
    },
    [onContextMenuAction]
  );

  // ========================================================================
  // Render
  // ========================================================================

  return (
    <>
      <DSConversationListItem
        id={String(conversation.id)}
        title={conversationData.title}
        participants={conversationData.participants}
        snippet={conversationData.snippet}
        timestamp={conversationData.timestamp}
        isRead={conversationData.unreadCount === 0}
        isSelected={isSelected}
        unreadCount={conversationData.unreadCount}
        hasAttachments={false}
        isStarred={false}
        avatarSrc={conversationData.avatarSrc}
        presence={conversationData.presence}
        priority={conversationData.priority}
        onClick={handleSelect}
        onContextMenu={handleContextMenu}
        subject={conversationData.subject}
        recipient={conversationData.recipient}
        inboxChannelType={conversationData.inboxChannelType}
        inboxMedium={conversationData.inboxMedium}
        inboxName={conversationData.inboxName || undefined}
        assignee={conversationData.assignee}
        labels={conversationData.labels}
        appliedSla={conversationData.appliedSla}
        conversationTimestamp={conversationData.conversationTimestamp}
        lastActivityAt={conversationData.lastActivityAt}
      />
      <ConversationContextMenu
        anchorPosition={contextMenuPosition}
        open={Boolean(contextMenuPosition)}
        onClose={handleCloseContextMenu}
        conversationId={conversation.id}
        onActionClick={handleAction}
      />
    </>
  );
};
