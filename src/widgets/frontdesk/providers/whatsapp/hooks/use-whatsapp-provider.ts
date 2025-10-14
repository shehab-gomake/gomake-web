import { useCallback, useMemo, useState } from "react";
import type { ConversationItem } from "@/widgets/frontdesk/components/providers/provider-types";
import type { ConversationMessage } from "@/widgets/frontdesk/components/conversation/conversation-types";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES, mockUtils } from "../mock-data/whatsapp.mock";

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

export interface UseWhatsAppProviderResult {
  // Connection
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
  isLoading: boolean;
  error?: string;

  // Conversations
  conversations: ConversationItem[];
  conversationsLoading: boolean;
  conversationsError?: string;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;

  // Selection
  selectedConversation: ConversationItem | null;
  handleConversationSelect: (item: ConversationItem) => void;
  handleBack: () => void;

  // Messages
  messages: ConversationMessage[];
  isSending: boolean;
  handleSendReply: (text: string) => Promise<boolean>;

  // Search
  searchQuery: string;
  onSearch: (q: string) => void;
}

const { toHumanTime } = mockUtils;

export const useWhatsAppProvider = (): UseWhatsAppProviderResult => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connected");
  const [error] = useState<string | undefined>(undefined);

  const [conversations, setConversations] = useState<ConversationItem[]>(MOCK_CONVERSATIONS);
  const [conversationsLoading, setConversationsLoading] = useState<boolean>(false);
  const [selectedConversation, setSelectedConversation] = useState<ConversationItem | null>(null);
  const [messagesById, setMessagesById] = useState<Record<string, ConversationMessage[]>>({ ...MOCK_MESSAGES });
  const [isSending, setIsSending] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.subject.toLowerCase().includes(q) || c.from.toLowerCase().includes(q) || (c.snippet || "").toLowerCase().includes(q)
    );
  }, [conversations, searchQuery]);

  const messages = useMemo<ConversationMessage[]>(() => {
    if (!selectedConversation) return [];
    const list = messagesById[selectedConversation.id] || [];
    return list;
  }, [messagesById, selectedConversation]);

  const loadMore = useCallback(() => {
    setConversationsLoading(true);
    setTimeout(() => setConversationsLoading(false), 400);
  }, []);

  const refresh = useCallback(() => {
    setConversationsLoading(true);
    setTimeout(() => setConversationsLoading(false), 400);
  }, []);

  const handleConversationSelect = useCallback((item: ConversationItem) => {
    setSelectedConversation(item);
    if (item.unread) {
      setConversations((prev) => prev.map((c) => (c.id === item.id ? { ...c, unread: false } : c)));
    }
  }, []);

  const handleBack = useCallback(() => {
    setSelectedConversation(null);
  }, []);

  const handleSendReply = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !selectedConversation) return false;
      setIsSending(true);
      const newMsg: ConversationMessage = {
        id: `tmp_${Date.now()}`,
        from: "me",
        text: trimmed,
        at: toHumanTime(new Date().toISOString()),
      };
      // optimistic append
      setMessagesById((prev) => ({
        ...prev,
        [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMsg],
      }));
      await new Promise((r) => setTimeout(r, 350));
      setIsSending(false);
      // Simulate echo reply sometimes
      setTimeout(() => {
        setMessagesById((prev) => ({
          ...prev,
          [selectedConversation.id]: [
            ...(prev[selectedConversation.id] || []),
            {
              id: `echo_${Date.now()}`,
              from: "them",
              text: "👍 Received on WhatsApp",
              at: toHumanTime(new Date().toISOString()),
            },
          ],
        }));
      }, 700);
      return true;
    },
    [selectedConversation]
  );

  return {
    connectionStatus,
    isConnected: connectionStatus === "connected",
    isLoading: false,
    error,

    conversations: filteredConversations,
    conversationsLoading,
    conversationsError: undefined,
    hasMore: false,
    loadMore,
    refresh,

    selectedConversation,
    handleConversationSelect,
    handleBack,

    messages,
    isSending,
    handleSendReply,

    searchQuery,
    onSearch: setSearchQuery,
  };
};
