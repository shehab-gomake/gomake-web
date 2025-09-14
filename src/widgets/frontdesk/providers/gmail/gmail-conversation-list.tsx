import React, { useEffect, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { gmailUIState } from "@/store/frontdesk/providers/gmail";
import { useGmailConversations, GmailConversation } from "@/hooks/frontdesk/providers/gmail";
import { BaseConversationList } from "@/widgets/frontdesk/components/providers/base-conversation-list";
import { ConversationItem } from "@/widgets/frontdesk/components/providers/provider-types";

export type MailItem = {
  id: string;
  from: string;
  subject: string;
  snippet?: string;
  receivedAt: string; // mock string timestamp
  unread?: boolean;
  body?: string;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const parseFromField = (fromField: string): string => {
  // Extract name from email format like "John Doe <john@example.com>"
  const match = fromField.match(/^(.*?)\s*<.*>$/);
  return match ? match[1].trim().replace(/"/g, '') : fromField;
};

const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(parseInt(timestamp));
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  } catch {
    return timestamp;
  }
};

const decodeHtmlEntities = (str: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
};

const mapConversationToMailItem = (conversation: GmailConversation): MailItem => ({
  id: conversation.id,
  from: parseFromField(conversation.from),
  subject: conversation.subject,
  snippet: decodeHtmlEntities(conversation.snippet),
  receivedAt: formatTimestamp(conversation.latestDate),
  unread: conversation.hasUnread,
  body: decodeHtmlEntities(conversation.snippet), // Use snippet as body for now
});

const mapMailItemToConversationItem = (mail: MailItem): ConversationItem => ({
  id: mail.id,
  from: mail.from,
  subject: mail.subject,
  snippet: mail.snippet,
  receivedAt: mail.receivedAt,
  unread: mail.unread,
  body: mail.body,
});

interface GmailConversationListProps {
  onSelect?: (mail: MailItem) => void;
  onLoaded?: (mails: MailItem[]) => void;
  selectedId?: string;
}

const GmailConversationList: React.FC<GmailConversationListProps> = ({ onSelect, onLoaded, selectedId }) => {
  console.log('📧 GmailConversationList component rendered'); // Debug log

  const { conversations, loading, error, hasMore, loadMore, refresh } = useGmailConversations();
  const uiState = useRecoilValue(gmailUIState);

  const mails: MailItem[] = useMemo(() => {
    console.log('Gmail conversations state:', { conversations, error, loading }); // Debug log

    if (!conversations || conversations.length === 0) {
      return [];
    }

    console.log('Mapping conversations to mail items:', conversations); // Debug log
    return conversations.map(mapConversationToMailItem);
  }, [conversations, error, loading]);

  useEffect(() => {
    if (mails.length > 0) {
      onLoaded?.(mails);
      if (!selectedId) {
        onSelect?.(mails[0]);
      }
    }
  }, [mails, selectedId, onLoaded, onSelect]);

  // Convert MailItem[] to ConversationItem[] for BaseConversationList
  const conversationItems: ConversationItem[] = useMemo(() => {
    return mails.map(mapMailItemToConversationItem);
  }, [mails]);

  const handleSelectConversation = (item: ConversationItem) => {
    const mail = mails.find(m => m.id === item.id);
    if (mail && onSelect) {
      onSelect(mail);
    }
  };

  return (
    <BaseConversationList
      items={conversationItems}
      loading={loading && conversations.length === 0}
      error={error || undefined}
      hasMore={hasMore}
      onLoadMore={loadMore}
      onRefresh={refresh}
      onSelect={handleSelectConversation}
      selectedId={selectedId}
      density={uiState.listDensity}
      enableVirtualization={true}
    />
  );
};

export { GmailConversationList };
