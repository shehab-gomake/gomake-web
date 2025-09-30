/**
 * Communication Channel Types
 *
 * Types for multi-channel ticket communication system supporting
 * email, WhatsApp, SMS, phone calls, and internal notes.
 */

import { TicketParticipant, TicketAttachment } from './ticket.types';

/**
 * Supported communication channels
 */
export type CommunicationChannel =
  | 'email'
  | 'whatsapp'
  | 'sms'
  | 'phone'
  | 'private_note'
  | 'internal'
  | 'web_chat';

/**
 * Message direction relative to the support team
 */
export type MessageDirection = 'inbound' | 'outbound';

/**
 * Message delivery/read status
 */
export type MessageStatus =
  | 'pending'    // Being sent
  | 'sent'       // Successfully sent
  | 'delivered'  // Delivered to recipient (WhatsApp, SMS)
  | 'read'       // Read by recipient (WhatsApp, Email)
  | 'failed';    // Failed to send

/**
 * Channel-specific metadata
 */
export interface EmailMetadata {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  messageId?: string;
  inReplyTo?: string;
  threadId?: string;
}

export interface WhatsAppMetadata {
  phoneNumber: string;
  messageId?: string;
  templateName?: string;
}

export interface SmsMetadata {
  phoneNumber: string;
  messageId?: string;
}

export interface PhoneMetadata {
  phoneNumber: string;
  duration?: number; // in seconds
  recordingUrl?: string;
  callType?: 'inbound' | 'outbound';
}

export interface PrivateNoteMetadata {
  mentions?: string[]; // User IDs mentioned in the note
  visibility?: 'team' | 'agents_only';
}

export type ChannelMetadata =
  | EmailMetadata
  | WhatsAppMetadata
  | SmsMetadata
  | PhoneMetadata
  | PrivateNoteMetadata
  | Record<string, never>; // For channels without specific metadata

/**
 * Channel Message - Enhanced comment with channel information
 */
export interface ChannelMessage {
  id: string;

  // Channel information
  channel: CommunicationChannel;
  direction: MessageDirection;
  status: MessageStatus;

  // Sender/Recipient
  author: TicketParticipant;
  recipient?: TicketParticipant | TicketParticipant[];

  // Content
  content: string;
  contentType?: 'text' | 'html' | 'markdown';

  // Metadata
  createdAt: string;
  updatedAt?: string;
  editedAt?: string;

  // Channel-specific data
  channelMetadata?: ChannelMetadata;

  // Attachments
  attachments?: TicketAttachment[];

  // Threading
  threadId?: string;
  parentMessageId?: string;

  // Flags
  isPrivate: boolean;
  isEdited?: boolean;
  isSystemMessage?: boolean;
}

/**
 * System event messages (status changes, assignments, etc.)
 */
export interface SystemMessage extends Omit<ChannelMessage, 'channel' | 'direction' | 'status'> {
  channel: 'internal';
  direction: 'inbound';
  status: 'sent';
  eventType: 'status_change' | 'assignment' | 'priority_change' | 'note' | 'mention';
  eventData?: Record<string, any>;
  isSystemMessage: true;
}

/**
 * Communication statistics for a ticket
 */
export interface CommunicationStats {
  totalMessages: number;
  byChannel: Record<CommunicationChannel, number>;
  lastContactAt?: string;
  lastResponseAt?: string;
  averageResponseTime?: number; // in minutes
  firstResponseTime?: number; // in minutes
}

/**
 * Channel configuration for composer
 */
export interface ChannelConfig {
  channel: CommunicationChannel;
  label: string;
  icon: string;
  enabled: boolean;
  defaultRecipient?: string;
  placeholder?: string;
  supportedFeatures?: {
    richText?: boolean;
    attachments?: boolean;
    mentions?: boolean;
    templates?: boolean;
  };
}