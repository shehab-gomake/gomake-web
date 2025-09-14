import { atom } from "recoil";

// Gmail Connection State
export interface GmailConnectionState {
  connected: boolean;
  email?: string;
  loading: boolean;
  error?: string;
}

export const gmailConnectionState = atom<GmailConnectionState>({
  key: "gmail_connection_state",
  default: {
    connected: false,
    email: undefined,
    loading: false,
    error: undefined,
  },
});

// Gmail OAuth Flow State
export interface GmailOAuthState {
  isAuthenticating: boolean;
  authUrl?: string;
  error?: string;
}

export const gmailOAuthState = atom<GmailOAuthState>({
  key: "gmail_oauth_state",
  default: {
    isAuthenticating: false,
    authUrl: undefined,
    error: undefined,
  },
});

// Gmail Conversations State
export interface GmailMessage {
  id: string;
  messageId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  body: string;
  htmlBody?: string;
  snippet: string;
  isUnread: boolean;
  internalDate: string;
  labels: string[];
}

export interface GmailConversationDetail {
  id: string;
  messages: GmailMessage[];
  messageCount: number;
}

export const selectedGmailConversationState = atom<GmailConversationDetail | null>({
  key: "selected_gmail_conversation_state",
  default: null,
});

// Gmail Send State
export interface GmailSendState {
  sending: boolean;
  lastSent?: {
    to: string;
    subject: string;
    timestamp: number;
  };
  error?: string;
}

export const gmailSendState = atom<GmailSendState>({
  key: "gmail_send_state",
  default: {
    sending: false,
    lastSent: undefined,
    error: undefined,
  },
});

// Gmail UI State
export interface GmailUIState {
  showAuthModal: boolean;
  showComposeModal: boolean;
  refreshing: boolean;
}

export const gmailUIState = atom<GmailUIState>({
  key: "gmail_ui_state",
  default: {
    showAuthModal: false,
    showComposeModal: false,
    refreshing: false,
  },
});