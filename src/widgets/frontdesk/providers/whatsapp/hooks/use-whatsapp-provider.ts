import { useCallback, useMemo, useState } from "react";
import type { ConversationItem } from "@/widgets/frontdesk/components/providers/provider-types";
import type { ConversationMessage } from "@/widgets/frontdesk/components/conversation/conversation-types";

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

function nowIso(offsetMinutes = 0): string {
  const d = new Date(Date.now() + offsetMinutes * 60 * 1000);
  return d.toISOString();
}

function toHumanTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString();
}

const MOCK_CONVERSATIONS: ConversationItem[] = [
  {
    id: "wa_1",
    from: "+1 650-555-0100",
    subject: "Sam (WhatsApp)",
    snippet: "Got the quote, thanks!",
    receivedAt: nowIso(-12),
    unread: true,
  },
  {
    id: "wa_2",
    from: "+44 20 7946 0958",
    subject: "Maya (WA)",
    snippet: "Can we reschedule to Friday?",
    receivedAt: nowIso(-45),
  },
  {
    id: "wa_3",
    from: "+972 52-555-1122",
    subject: "Order #54821",
    snippet: "Payment received. Preparing shipment.",
    receivedAt: nowIso(-80),
  },
];

const MOCK_MESSAGES: Record<string, ConversationMessage[]> = {
  wa_1: [
    { id: "m1", from: "them", text: "Hi, this is Sam.", at: toHumanTime(nowIso(-180)) },
    { id: "m2", from: "me", text: "Hey Sam! Sharing the quote now.", at: toHumanTime(nowIso(-170)) },
    { id: "m3", from: "them", text: "Got the quote, thanks!", at: toHumanTime(nowIso(-12)) },
  ],
  wa_2: [{ id: "m1", from: "them", text: "Can we reschedule to Friday?", at: toHumanTime(nowIso(-45)) }],
  wa_3: [{ id: "m1", from: "them", text: "Payment received. Preparing shipment.", at: toHumanTime(nowIso(-80)) }],
};

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
