/**
 * FrontDesk V2 - Message Types
 * Based on Chatwoot Swagger DTOs
 */

import { MessageType, MessageStatus, MessageContentType, SenderType } from "./enums";
import { Contact } from "./contact.types";
import { Agent } from "./agent.types";

export interface Message {
  id: number;
  content: string;

  // IDs
  account_id: number;
  inbox_id: number;
  conversation_id: number;

  // Type and Status
  message_type: MessageType;
  content_type: MessageContentType;
  status: MessageStatus;

  // Sender Information
  sender_type: SenderType;
  sender_id: number;
  sender?: Contact | Agent;

  // Timestamps
  created_at: number;
  updated_at: number;

  // Message Properties
  private: boolean;
  source_id: string | null;
  echo_id?: string; // For optimistic updates

  // Content and Attributes
  content_attributes: Record<string, any>;
  additional_attributes: Record<string, any>;
  processed_message_content: string;

  // External Integration
  external_source_ids: Record<string, any>;

  // AI/Sentiment
  sentiment: Record<string, any> | null;

  // Attachments
  attachments?: Attachment[];
  attachment?: Attachment; // Single attachment (legacy)

  // Related Data
  conversation?: Partial<Conversation>;
}

export interface Attachment {
  id: number;
  message_id: number;
  file_type: string;
  account_id: number;
  extension: string | null;
  data_url: string;
  thumb_url: string | null;
  file_size: number;
  width?: number;
  height?: number;
  coordinates_lat?: number;
  coordinates_long?: number;
}

export interface MessagePayload {
  content: string;
  message_type?: MessageType;
  private?: boolean;
  content_type?: MessageContentType;
  content_attributes?: Record<string, any>;
  echo_id?: string;
  file?: File;
  attachments?: File[];
}

export interface MessageUpdatePayload {
  content?: string;
}

// Typing Indicator
export interface TypingIndicator {
  conversation_id: number;
  user_id: number;
  is_private: boolean;
}

// Message Status Update
export interface MessageStatusUpdate {
  id: number;
  status: MessageStatus;
  conversation_id: number;
}

// Conversation import (to avoid circular dependency)
interface Conversation {
  id: number;
  status: string;
  unread_count: number;
}
