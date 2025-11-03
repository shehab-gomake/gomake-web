/**
 * Compose Conversation Types
 *
 * Type definitions for composing new conversations in Chatwoot
 */

import type { ContactDetail } from "./contacts.types";
import type { ContactableInbox } from "./inboxes.types";

/**
 * Compose Form State
 * Manages the state of the compose conversation form
 */
export interface ComposeFormState {
  /** Selected contact (required) */
  contact: ContactDetail | null;

  /** Selected contactable inbox (required) */
  selectedContactableInbox: ContactableInbox | null;

  /** Message content (required for most channels) */
  message: string;

  /** Email subject (required for Email channel) */
  subject?: string;

  /** CC emails (optional, Email channel only) */
  ccEmails?: string;

  /** BCC emails (optional, Email channel only) */
  bccEmails?: string;

  /** Attachments (optional, Email/Web Widget) */
  attachments: File[];

  /** WhatsApp template params (optional, WhatsApp only) */
  templateParams?: WhatsAppTemplateParams;
}

/**
 * WhatsApp Template Parameters
 * For sending pre-approved WhatsApp templates
 */
export interface WhatsAppTemplateParams {
  name: string;
  category: string;
  language: string;
  namespace?: string;
  processed_params?: Record<string, unknown>;
}

/**
 * Create Conversation Payload
 * Payload for creating a new conversation
 */
export interface CreateConversationPayload {
  inbox_id: number;
  contact_id: number;
  source_id: string;
  assignee_id?: number;
  team_id?: number;
  status?: "open" | "pending";
  additional_attributes?: {
    mail_subject?: string;
  };
  message?: {
    content: string;
    cc_emails?: string;
    bcc_emails?: string;
    attachments?: File[];
    template_params?: WhatsAppTemplateParams;
    private?: boolean;
    echo_id?: string;
  };
}

/**
 * Validation Errors
 * Form validation error messages
 */
export interface ComposeValidationErrors {
  contact?: string;
  inbox?: string;
  message?: string;
  subject?: string;
  ccEmails?: string;
  bccEmails?: string;
  attachments?: string;
}

/**
 * Channel-specific field requirements
 */
export enum ChannelFieldRequirements {
  EMAIL_SUBJECT_REQUIRED = "email_subject_required",
  MESSAGE_REQUIRED = "message_required",
  ATTACHMENTS_SUPPORTED = "attachments_supported",
  TEMPLATE_SUPPORTED = "template_supported",
}

/**
 * Helper to determine if channel requires specific fields
 */
export const channelRequirements = {
  "Channel::Email": {
    subjectRequired: true,
    messageRequired: true,
    attachmentsSupported: true,
    ccBccSupported: true,
  },
  "Channel::WhatsApp": {
    subjectRequired: false,
    messageRequired: false, // Not required if template_params provided
    attachmentsSupported: false,
    ccBccSupported: false,
  },
  "Channel::Sms": {
    subjectRequired: false,
    messageRequired: true,
    attachmentsSupported: false,
    ccBccSupported: false,
  },
  "Channel::TwilioSms": {
    subjectRequired: false,
    messageRequired: true,
    attachmentsSupported: false,
    ccBccSupported: false,
  },
  "Channel::WebWidget": {
    subjectRequired: false,
    messageRequired: true,
    attachmentsSupported: true,
    ccBccSupported: false,
  },
  "Channel::Api": {
    subjectRequired: false,
    messageRequired: true,
    attachmentsSupported: true,
    ccBccSupported: false,
  },
};

/**
 * Get channel requirements helper
 */
export function getChannelRequirements(channelType: string) {
  return (
    channelRequirements[channelType as keyof typeof channelRequirements] ||
    channelRequirements["Channel::Api"]
  );
}
