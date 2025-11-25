import React, { useMemo, useCallback } from "react";
import { ConversationListItem as DSConversationListItem } from "@/widgets/frontdesk/design-system";
import { formatConversationDate } from "@/widgets/frontdesk/utils";
import { htmlToPlainText, isHtmlContent } from "@/widgets/frontdesk/utils/html-sanitizer";
import { ConversationContextMenu } from "@/widgets/frontdesk/components/shared";
import { useConversationContextMenu } from "@/widgets/frontdesk/hooks/use-conversation-context-menu";
import { useChatwootContextMenu } from "../hooks/use-chatwoot-context-menu";
import { formatChatwootTimestamp } from "../utils/conversation-helpers";
import { generateContactAvatar } from "../utils/avatar.utils";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";

// ============================================================================
// Type Definitions
// ============================================================================

interface ChatwootConversationListItemProps {
  conversation: any; // TODO: Use proper ChatwootConversation type when available
  isSelected: boolean;
  onSelect: (conversation: any) => void;
  onContextMenuAction?: (actionId: string, conversationId: string | number) => void;
  inboxes?: ChatwootInbox[];
  inboxesLoading?: boolean;
  hideAssigneeAvatar?: boolean;
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
    conversation.additional_attributes?.mail_subject ||
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
 * Extracts and formats the conversation timestamp
 * 
 * Uses the shared formatChatwootTimestamp utility for consistent conversion.
 */
function getFormattedTimestamp(conversation: any): string {
  const timestamp = conversation.updated_at || conversation.created_at || conversation.timestamp;

  if (!timestamp) {
    return "";
  }

  // Chatwoot uses Unix timestamps (seconds), convert to ISO
  let isoTimestamp: string;
  if (conversation.updated_at) {
    isoTimestamp = formatChatwootTimestamp(conversation.updated_at);
  } else if (conversation.created_at) {
    isoTimestamp = formatChatwootTimestamp(conversation.created_at);
  } else if (typeof conversation.timestamp === 'number') {
    // Handle numeric timestamp (Unix seconds)
    isoTimestamp = formatChatwootTimestamp(conversation.timestamp);
  } else {
    // Already an ISO string
    isoTimestamp = conversation.timestamp;
  }

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

  let content = typeof lastMessage.content === "string" ? lastMessage.content : JSON.stringify(lastMessage.content);

  // Strip HTML tags if content contains HTML
  if (isHtmlContent(content)) {
    content = htmlToPlainText(content);
  }

  // Truncate to reasonable length for preview
  const maxLength = 100;
  if (content.length > maxLength) {
    content = content.substring(0, maxLength) + "...";
  }

  // Check if message is private (support both _private and private properties)
  const isPrivate = lastMessage._private === true || lastMessage.private === true;

  // Add visual indicator for private messages
  if (isPrivate) {
    return `🔒 Private Note: ${content}`;
  }

  return content;
}

/**
 * Checks if the conversation has attachments in the last message
 */
function hasAttachments(conversation: any): boolean {
  const lastMessage = conversation.last_non_activity_message || conversation.messages?.[0];
  return Array.isArray(lastMessage?.attachments) && lastMessage.attachments.length > 0;
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
const ChatwootConversationListItemComponent: React.FC<ChatwootConversationListItemProps> = ({
  conversation,
  isSelected,
  onSelect,
  onContextMenuAction,
  inboxes = [],
  inboxesLoading = false,
  hideAssigneeAvatar = false,
}) => {
  // Context menu position state (for right-click menu positioning)
  const { contextMenuPosition, handleContextMenu, handleCloseContextMenu } = useConversationContextMenu();

  // Context menu actions and handlers (Chatwoot-specific business logic)
  const chatwootContextMenu = useChatwootContextMenu(conversation);

  // ========================================================================
  // Memoized Data Extraction
  // ========================================================================

  const inbox = useMemo(() => {
    if (!conversation.inbox_id || !inboxes.length) {
      return null;
    }
    return inboxes.find((inbox) => inbox.id === conversation.inbox_id) || null;
  }, [conversation.inbox_id, inboxes]);

  // Generate consistent avatar data using unified utility
  const senderAvatarData = useMemo(() => {
    const sender = conversation.meta?.sender;
    return generateContactAvatar({
      id: sender?.id,
      name: sender?.name,
      email: sender?.email,
      thumbnail: sender?.thumbnail,
      avatar_url: sender?.avatar_url,
      availability_status: sender?.availability_status || sender?.availabilityStatus,
    });
  }, [conversation.meta?.sender]);

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
      avatarSrc: senderAvatarData.src,
      avatarBackgroundColor: senderAvatarData.backgroundColor,
      avatarInitials: senderAvatarData.initials,
      priority: conversation.priority || null,
      inboxChannelType: inbox?.channel_type || conversation.meta?.channel || null,
      inboxMedium: (inbox as any)?.medium || null,
      inboxName: inbox?.name || null,
      assignee: hideAssigneeAvatar ? null : (conversation.meta?.assignee
        ? {
            name: conversation.meta.assignee.name,
            avatarSrc: conversation.meta.assignee.avatar_url,
            presence: conversation.meta.assignee.availability_status || null,
          }
        : null),
      labels: conversation.labels || [],
      appliedSla: conversation.applied_sla || conversation.appliedSla || null,
      conversationTimestamp: conversation.timestamp || conversation.created_at || null,
      lastActivityAt: conversation.last_activity_at || conversation.lastActivityAt || null,
      hasAttachments: hasAttachments(conversation),
    };
  }, [conversation, inbox, hideAssigneeAvatar, senderAvatarData]);

  // ========================================================================
  // Event Handlers
  // ========================================================================

  const handleSelect = useCallback(() => {
    onSelect(conversation);
  }, [conversation, onSelect]);

  /**
   * Handle context menu actions
   * Use the Chatwoot-specific handler from the hook
   * Fall back to onContextMenuAction prop if provided (for backward compatibility)
   */
  const handleAction = useCallback(
    async (actionId: string, conversationId?: string | number) => {
      // Use the hook's handler first (has all the business logic)
      await chatwootContextMenu.handleAction(actionId);

      // Also call the prop handler if provided (for parent component tracking)
      if (onContextMenuAction && conversationId !== undefined) {
        onContextMenuAction(actionId, conversationId);
      }
    },
    [chatwootContextMenu, onContextMenuAction]
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
        hasAttachments={conversationData.hasAttachments}
        isStarred={false}
        avatarSrc={conversationData.avatarSrc}
        avatarBackgroundColor={conversationData.avatarBackgroundColor}
        avatarInitials={conversationData.avatarInitials}
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
        actions={chatwootContextMenu.actions}
        onActionClick={handleAction}
      />
    </>
  );
};

/**
 * Memoized Conversation List Item
 *
 * Optimizes performance by preventing unnecessary re-renders.
 * Only re-renders when conversation data or selection state changes.
 */
export const ChatwootConversationListItem = React.memo(ChatwootConversationListItemComponent, (prevProps, nextProps) => {
  // Custom comparison: only re-render if these specific props change
  return (
    prevProps.conversation?.id === nextProps.conversation?.id &&
    prevProps.conversation?.updated_at === nextProps.conversation?.updated_at &&
    prevProps.conversation?.unread_count === nextProps.conversation?.unread_count &&
    prevProps.conversation?.status === nextProps.conversation?.status &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.inboxesLoading === nextProps.inboxesLoading
  );
});
