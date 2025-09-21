import { atom } from "recoil";
import { EmailAccount, EmailThread, EmailMessage, EmailConnectionState, EmailAuthState, EmailDraft, EmailConversation } from "../types/email.types";

// Email Accounts State
export const emailAccountsState = atom<EmailAccount[]>({
  key: "email_accounts_state",
  default: [],
});

export const selectedEmailAccountIdState = atom<string | null>({
  key: "selected_email_account_id_state",
  default: null,
});

export const emailAccountsLoadingState = atom<boolean>({
  key: "email_accounts_loading_state",
  default: false,
});

export const emailAccountsErrorState = atom<string | null>({
  key: "email_accounts_error_state",
  default: null,
});

// Messages State (per account)
export interface EmailMessagesState {
  messages: EmailMessage[];
  threads: EmailThread[];
  pageToken?: string;
  hasMore: boolean;
  loading: boolean;
  error?: string;
}

export const emailMessagesByAccountState = atom<Record<string, EmailMessagesState>>({
  key: "email_messages_by_account_state",
  default: {},
});

// Selected Thread State
export const selectedEmailThreadState = atom<EmailThread | null>({
  key: "selected_email_thread_state",
  default: null,
});

export const emailThreadLoadingState = atom<boolean>({
  key: "email_thread_loading_state",
  default: false,
});

// Composer State
export interface EmailComposerState {
  isOpen: boolean;
  mode: 'new' | 'reply' | 'replyAll' | 'forward';
  draft: EmailDraft | null;
  sending: boolean;
  attachments: File[];
}

export const emailComposerState = atom<EmailComposerState>({
  key: "email_composer_state",
  default: {
    isOpen: false,
    mode: 'new',
    draft: null,
    sending: false,
    attachments: [],
  },
});

// Search and Filter State
export const emailSearchQueryState = atom<string>({
  key: "email_search_query_state",
  default: "",
});

export const emailActiveFolderState = atom<string>({
  key: "email_active_folder_state",
  default: "INBOX",
});

// UI State
export interface EmailUIState {
  showAuthModal: boolean;
  showComposeModal: boolean;
  sidebarCollapsed: boolean;
  infoPanelCollapsed: boolean;
  density: 'comfortable' | 'compact';
  refreshing: boolean;
}

export const emailUIState = atom<EmailUIState>({
  key: "email_ui_state",
  default: {
    showAuthModal: false,
    showComposeModal: false,
    sidebarCollapsed: false,
    infoPanelCollapsed: false,
    density: 'comfortable',
    refreshing: false,
  },
});

// Connection State
export const emailConnectionState = atom<EmailConnectionState>({
  key: "email_connection_state",
  default: {
    connected: false,
    loading: false,
    error: undefined,
  },
});

// OAuth State
export const emailOAuthState = atom<EmailAuthState>({
  key: "email_oauth_state",
  default: {
    isAuthenticating: false,
    authUrl: undefined,
    error: undefined,
  },
});

// Simplified messages state for current account
export const emailMessagesState = atom<EmailMessage[]>({
  key: "email_messages_state",
  default: [],
});

export const emailMessagesLoadingState = atom<boolean>({
  key: "email_messages_loading_state",
  default: false,
});

export const emailMessagesErrorState = atom<string | null>({
  key: "email_messages_error_state",
  default: null,
});

// Unread Counts (per account and folder)
export interface UnreadCounts {
  [accountId: string]: {
    [folderId: string]: number;
    total: number;
  };
}

export const emailUnreadCountsState = atom<UnreadCounts>({
  key: "email_unread_counts_state",
  default: {},
});

// Conversations State
export const emailConversationsState = atom<EmailConversation[]>({
  key: "email_conversations_state",
  default: [],
});

export const emailConversationsLoadingState = atom<boolean>({
  key: "email_conversations_loading_state",
  default: false,
});

export const emailConversationsErrorState = atom<string | null>({
  key: "email_conversations_error_state",
  default: null,
});