export interface ConversationItem {
  id: string;
  from: string;
  subject: string;
  snippet?: string;
  receivedAt: string;
  unread?: boolean;
  body?: string;
}

export interface ProviderConnectionState {
  isConnected: boolean;
  isLoading: boolean;
  email?: string;
  error?: string;
}

export interface ProviderHooks<T = any> {
  connectionState: ProviderConnectionState;
  conversations: ConversationItem[];
  loading: boolean;
  error?: string;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  sendReply: (data: T) => Promise<boolean>;
  isSending: boolean;
}

export interface BaseProviderViewProps {
  providerName: string;
  providerIcon: React.ReactNode;
  authModalComponent: React.ComponentType<{ open: boolean; onClose: () => void }>;
  conversationListComponent: React.ComponentType<ConversationListProps>;
  hooks: ProviderHooks;
}

export interface ConversationListProps {
  onSelect?: (item: ConversationItem) => void;
  onLoaded?: (items: ConversationItem[]) => void;
  selectedId?: string;
}