/**
 * Chatwoot Inboxes Types
 *
 * Type definitions for inbox (channel) related API requests and responses
 * In Chatwoot, "inboxes" are channels like Email, WhatsApp, Facebook, etc.
 */

/**
 * Channel Type Enum
 * Different types of channels/inboxes supported by Chatwoot
 */
export enum ChannelType {
  EMAIL = "Channel::Email",
  FACEBOOK_PAGE = "Channel::FacebookPage",
  WEB_WIDGET = "Channel::WebWidget",
  WHATSAPP = "Channel::WhatsApp",
  SMS = "Channel::Sms",
  TWITTER = "Channel::Twitter",
  TELEGRAM = "Channel::Telegram",
  LINE = "Channel::Line",
  TWILIO_SMS = "Channel::TwilioSms",
  API = "Channel::Api",
}

/**
 * Inbox Provider Type
 * Provider name for the inbox
 */
export type InboxProvider = "email" | "facebook" | "whatsapp" | "sms" | "twitter" | "telegram" | "line" | "twilio" | "api" | "web_widget";

/**
 * Email Channel Configuration
 * Specific properties for email inboxes (SMTP/IMAP)
 * Based on Chatwoot's _inbox.json.jbuilder
 */
export interface EmailChannelConfig {
  /** Direct email property */
  email?: string;
  /** Forward-to email address */
  forward_to_email?: string;
  /** Sender email address */
  sender_email?: string;

  // IMAP Configuration
  /** IMAP login username */
  imap_login?: string;
  /** IMAP password */
  imap_password?: string;
  /** IMAP server address */
  imap_address?: string;
  /** IMAP port */
  imap_port?: number;
  /** IMAP enabled flag */
  imap_enabled?: boolean;
  /** IMAP SSL enabled */
  imap_enable_ssl?: boolean;

  // SMTP Configuration
  /** SMTP login username */
  smtp_login?: string;
  /** SMTP password */
  smtp_password?: string;
  /** SMTP server address */
  smtp_address?: string;
  /** SMTP port */
  smtp_port?: number;
  /** SMTP enabled flag */
  smtp_enabled?: boolean;
  /** SMTP domain */
  smtp_domain?: string;
  /** SMTP SSL/TLS enabled */
  smtp_enable_ssl_tls?: boolean;
  /** SMTP STARTTLS auto */
  smtp_enable_starttls_auto?: boolean;
  /** SMTP OpenSSL verify mode */
  smtp_openssl_verify_mode?: string;
  /** SMTP authentication type */
  smtp_authentication?: string;

  /** OAuth reauthorization required */
  reauthorization_required?: boolean;

  /** OAuth email account (nested) - for internal use */
  _emailAccount?: {
    id?: string;
    email?: string;
    provider?: 'gmail' | 'outlook' | 'yahoo';
    displayName?: string;
    isActive?: boolean;
    isPrimary?: boolean;
    providerChannelId?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

/**
 * Chatwoot Inbox
 * Represents an inbox (channel) in Chatwoot
 */
export interface ChatwootInbox extends Partial<EmailChannelConfig> {
  /** Inbox ID */
  id: number;

  /** Inbox name */
  name: string;

  /** Channel type (e.g., "Channel::Email") */
  channel_type: ChannelType | string;

  /** Channel identifier */
  channel_id?: number;

  /** Avatar image URL */
  avatar_url?: string;

  /** Website URL (for web widgets) */
  website_url?: string;

  /** Website token (for web widgets) */
  website_token?: string;

  /** Widget color (for web widgets) */
  widget_color?: string;

  /** HMAC token (for web widgets and API inboxes) */
  hmac_token?: string;

  /** HMAC mandatory flag (for web widgets) */
  hmac_mandatory?: boolean;

  /** Allowed domains (for web widgets) */
  allowed_domains?: string[];

  /** Inbox identifier (for API inboxes) */
  inbox_identifier?: string;

  /** Webhook URL (for API inboxes) */
  webhook_url?: string;

  /** Callback webhook URL */
  callback_webhook_url?: string;

  /** Provider name (e.g., "email", "facebook", "whatsapp") */
  provider?: InboxProvider;

  /** Enable auto-assignment */
  enable_auto_assignment?: boolean;

  /** Auto-assignment configuration */
  auto_assignment_config?: {
    /** Maximum number of conversations that can be assigned to an agent */
    max_assignment_limit?: number;
  };

  /** Business name (for professional sender name type) */
  business_name?: string;

  /** Sender name type (friendly or professional) */
  sender_name_type?: "friendly" | "professional";

  /** Greeting enabled */
  greeting_enabled?: boolean;

  /** Greeting message */
  greeting_message?: string;

  /** CSAT survey enabled */
  csat_survey_enabled?: boolean;

  /** CSAT configuration */
  csat_config?: {
    display_type?: string;
    custom_message?: string;
    survey_rules?: Record<string, unknown>;
  };

  /** Enable email collection (for web widgets) */
  enable_email_collect?: boolean;

  /** Allow messages after conversation is resolved */
  allow_messages_after_resolved?: boolean;

  /** Lock to single conversation (WhatsApp) */
  lock_to_single_conversation?: boolean;

  /** Working hours enabled */
  working_hours_enabled?: boolean;

  /** Working hours configuration */
  working_hours?: Record<string, unknown>;

  /** Timezone */
  timezone?: string;

  /** Phone number (for SMS/WhatsApp) */
  phone_number?: string;

  /** Provider configuration (WhatsApp, etc.) */
  provider_config?: {
    phone_number?: string;
    phone_number_id?: string;
    business_account_id?: string;
    api_key?: string;
    webhook_verify_token?: string;
    access_token?: string;
  };

  /** Message templates (WhatsApp) */
  message_templates?: unknown[];

  /** Account ID this inbox belongs to */
  account_id?: number;

  /** Created at timestamp */
  created_at?: number;

  /** Updated at timestamp */
  updated_at?: number;

  // Additional properties from messaging-hub-v2 Inbox type

  /** Script used to load the website widget */
  web_widget_script?: string;

  /** Welcome title to be displayed on the widget */
  welcome_title?: string;

  /** Welcome tagline to be displayed on the widget */
  welcome_tagline?: string;

  /** Message to show when agents are out of office */
  out_of_office_message?: string;

  /** Selected feature flags for the inbox */
  selected_feature_flags?: Record<string, unknown>;

  /** Expected reply time */
  reply_time?: string;

  /** Messaging service SID for SMS providers */
  messaging_service_sid?: string;

  /** Medium of communication (e.g., sms, email) */
  medium?: string;
}

/**
 * Inbox List Response
 * Response structure for list inboxes endpoint
 */
export interface InboxListResponse {
  payload?: ChatwootInbox[];
  data?: {
    payload?: ChatwootInbox[];
  };
}

/**
 * Inbox Detail Response
 * Response structure for get inbox details endpoint
 */
export interface InboxDetailResponse {
  payload?: ChatwootInbox;
  data?: ChatwootInbox;
}

/**
 * Contactable Inbox
 * Represents an inbox that a contact can be reached through
 */
export interface ContactableInbox {
  /** Source ID (email address, phone number, or identifier) */
  source_id: string;

  /** Inbox details */
  inbox: ChatwootInbox;
}

/**
 * Contactable Inboxes Response
 * Response structure for get contactable inboxes endpoint
 */
export interface ContactableInboxesResponse {
  payload?: ContactableInbox[];
  data?: {
    payload?: ContactableInbox[];
  };
}





