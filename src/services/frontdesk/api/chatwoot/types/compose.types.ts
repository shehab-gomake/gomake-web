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
 * Form validation error messages for compose conversation form
 *
 * All fields are optional strings containing error messages.
 * Only fields that have validation errors should be present.
 *
 * @example
 * ```typescript
 * const errors: ComposeValidationErrors = {
 *   contact: "Contact is required",
 *   subject: "Subject is required for email conversations"
 * };
 * ```
 */
export interface ComposeValidationErrors {
  /** Error message for contact field */
  readonly contact?: string;
  /** Error message for inbox field */
  readonly inbox?: string;
  /** Error message for message content field */
  readonly message?: string;
  /** Error message for email subject field */
  readonly subject?: string;
  /** Error message for CC emails field */
  readonly ccEmails?: string;
  /** Error message for BCC emails field */
  readonly bccEmails?: string;
  /** Error message for attachments field */
  readonly attachments?: string;
}

/**
 * Type guard to check if a key is a valid ComposeValidationErrors key
 */
export function isValidationErrorKey(key: string): key is keyof ComposeValidationErrors {
  return ["contact", "inbox", "message", "subject", "ccEmails", "bccEmails", "attachments"].includes(key);
}

/**
 * Helper to check if there are any validation errors
 */
export function hasValidationErrors(errors: ComposeValidationErrors): boolean {
  return Object.values(errors).some((error) => error !== undefined && error !== "");
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
