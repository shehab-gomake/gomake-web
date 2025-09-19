export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailAccount {
  id: string;
  provider: 'gmail' | 'outlook' | 'yahoo';
  email: string;
  displayName: string;
  isActive: boolean;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmailMessage {
  id: string;
  messageId?: string;
  threadId: string;
  subject: string;
  from: EmailRecipient;
  to: EmailRecipient[];
  cc?: EmailRecipient[];
  bcc?: EmailRecipient[];
  createdAt: string;
  text: string;
  html?: string;
  snippet: string;
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
  labels?: string[];
  attachments?: EmailAttachment[];
}

export interface EmailThread {
  id: string;
  messages: EmailMessage[];
  messageCount: number;
  subject: string;
  participants: string[];
  latestDate: string;
  hasUnread: boolean;
}

export interface EmailAttachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url?: string;
}

export interface EmailFolder {
  id: string;
  name: string;
  type: 'inbox' | 'sent' | 'draft' | 'trash' | 'spam' | 'custom';
  unreadCount: number;
  totalCount: number;
  icon?: string;
}

export interface EmailDraft {
  to: EmailRecipient[];
  cc: EmailRecipient[];
  bcc: EmailRecipient[];
  subject: string;
  text: string;
  html: string;
  replyToMessageId?: string;
  threadId?: string;
  attachments?: EmailAttachment[];
}

export interface EmailSendRequest {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html?: string;
  text: string;
  replyToMessageId?: string;
  threadId?: string;
}

export interface EmailConnectionState {
  connected: boolean;
  loading: boolean;
  error?: string;
}

export interface EmailAuthState {
  isAuthenticating: boolean;
  authUrl?: string;
  error?: string;
}

export interface EmailListResponse {
  messages: EmailMessage[];
  threads?: EmailThread[];
  nextPageToken?: string;
  hasMore: boolean;
}

export interface EmailSearchQuery {
  query?: string;
  limit?: number;
  pageToken?: string;
  folder?: string;
}

export type EmailProvider = 'gmail' | 'outlook' | 'yahoo';

export interface EmailOAuthConfig {
  provider: EmailProvider;
  clientId: string;
  redirectUri: string;
  scope: string[];
}

export interface EmailApiError {
  code: string;
  message: string;
  status: number;
  retryable?: boolean;
}