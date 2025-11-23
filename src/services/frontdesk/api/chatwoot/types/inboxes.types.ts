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
 * Chatwoot Inbox
 * Represents an inbox (channel) in Chatwoot
 */
export interface ChatwootInbox {
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

  /** Provider name (e.g., "email", "facebook", "whatsapp") */
  provider?: InboxProvider;

  /** Enable auto-assignment */
  enable_auto_assignment?: boolean;

  /** Working hours enabled */
  working_hours_enabled?: boolean;

  /** Working hours configuration */
  working_hours?: Record<string, any>;

  /** Timezone */
  timezone?: string;

  /** Phone number (for SMS/WhatsApp) */
  phone_number?: string;

  /** Account ID this inbox belongs to */
  account_id?: number;

  /** Created at timestamp */
  created_at?: number;

  /** Updated at timestamp */
  updated_at?: number;

  /** Additional attributes */
  [key: string]: any;
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





