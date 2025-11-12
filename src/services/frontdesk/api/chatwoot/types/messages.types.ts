/**
 * Chatwoot Message Types
 *
 * Type definitions for Chatwoot messages and message-related operations.
 * Exports types from the OpenAPI-generated client for consistency.
 */

// Message interface
export interface Message {
  id?: number;
  content?: string;
  account_id?: number;
  inbox_id?: number;
  conversation_id?: number;
  message_type?: 0 | 1 | 2; // 0: incoming, 1: outgoing, 2: activity
  created_at?: number;
  updated_at?: number;
  private?: boolean;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
  source_id?: string;
  content_type?: string;
  content_attributes?: Record<string, unknown>;
  sender_type?: string;
  sender_id?: number;
  sender?: unknown;
  attachment?: unknown;
}

// Message Detailed interface (with more fields)
export interface MessageDetailed extends Message {
  processed_message_content?: string;
  sentiment?: Record<string, unknown>;
  conversation?: unknown;
}

// Conversation Messages response
export interface ConversationMessages {
  meta?: {
    labels?: string[];
    contact?: unknown;
    agent_last_seen_at?: string | null;
    assignee_last_seen_at?: string | null;
  };
  payload?: MessageDetailed[];
}

// Message Creation Payload
export interface ConversationMessageCreatePayload {
  content: string;
  message_type?: 'outgoing' | 'incoming';
  private?: boolean;
  content_type?: string;
  content_attributes?: Record<string, unknown>;
  campaign_id?: number;
  template_params?: {
    name: string;
    category: string;
    language: string;
    processed_params?: Record<string, unknown>;
  };
  attachments?: File[]; // Support for file attachments
}

// Message type aliases for convenience
export type MessageType = 0 | 1 | 2; // 0: incoming, 1: outgoing, 2: activity
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';
export type MessageContentType = 'text' | 'input_email' | 'input_select' | 'cards' | 'form' | 'article';
export type MessageSenderType = 'contact' | 'agent' | 'agent_bot';

// Message-specific response wrappers
export interface MessageListResponse {
  data?: { payload?: MessageDetailed[]; meta?: ConversationMessages['meta'] };
  payload?: MessageDetailed[];
  meta?: ConversationMessages['meta'];
}

export interface MessageDetailResponse {
  data?: { payload?: Message };
  payload?: Message;
}

// Type guards for messages
export function isMessage(value: unknown): value is Message {
  if (!value || typeof value !== 'object') return false;
  const message = value as Message;
  return (
    typeof message.id === 'number' &&
    typeof message.conversation_id === 'number' &&
    typeof message.content === 'string'
  );
}

export function isActivityMessage(message: Message | MessageDetailed): boolean {
  return message.message_type === 2;
}

export function isIncomingMessage(message: Message | MessageDetailed): boolean {
  return message.message_type === 0;
}

export function isOutgoingMessage(message: Message | MessageDetailed): boolean {
  return message.message_type === 1;
}

// Helper function to check if message has content
export function hasContent(message: Message | MessageDetailed): boolean {
  return Boolean(message.content && message.content.trim().length > 0);
}

// Helper function to extract payload from response
export function extractMessagePayload<T>(response: {
  data?: { payload?: T };
  payload?: T;
}): T | null {
  return response.data?.payload ?? response.payload ?? null;
}

