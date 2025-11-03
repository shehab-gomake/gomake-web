/**
 * FrontDesk V2 - Enums
 * Based on Chatwoot DTOs and backend models
 */

// Conversation Status
export enum ConversationStatus {
  OPEN = "open",
  RESOLVED = "resolved",
  PENDING = "pending",
  SNOOZED = "snoozed",
}

// Conversation Priority
export enum ConversationPriority {
  NONE = "none",
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

// Message Type
export enum MessageType {
  INCOMING = 0, // From contact
  OUTGOING = 1, // From agent
  ACTIVITY = 2, // System message
  TEMPLATE = 3, // Template message
}

// Message Status
export enum MessageStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed",
}

// Message Content Type
export enum MessageContentType {
  TEXT = "text",
  INPUT_SELECT = "input_select",
  CARDS = "cards",
  FORM = "form",
  INPUT_TEXT = "input_text",
  INPUT_TEXTAREA = "input_textarea",
  INPUT_EMAIL = "input_email",
  ARTICLE = "article",
  INCOMING_EMAIL = "incoming_email",
  INPUT_CSAT = "input_csat",
  INTEGRATIONS = "integrations",
  STICKER = "sticker",
  VOICE_CALL = "voice_call",
}

// Sender Type
export enum SenderType {
  CONTACT = "contact",
  AGENT = "agent",
  AGENT_BOT = "agent_bot",
}

// Assignee Type
export enum AssigneeType {
  ME = "me",
  UNASSIGNED = "unassigned",
  ALL = "all",
}

// Sort By Type
export enum SortByType {
  LAST_ACTIVITY_AT_ASC = "last_activity_at_asc",
  LAST_ACTIVITY_AT_DESC = "last_activity_at_desc",
  CREATED_AT_ASC = "created_at_asc",
  CREATED_AT_DESC = "created_at_desc",
  PRIORITY_ASC = "priority_asc",
  PRIORITY_DESC = "priority_desc",
  WAITING_SINCE_ASC = "waiting_since_asc",
  WAITING_SINCE_DESC = "waiting_since_desc",
}

// Agent Availability Status
export enum AgentAvailabilityStatus {
  ONLINE = "available",
  BUSY = "busy",
  OFFLINE = "offline",
}

// Agent Role
export enum AgentRole {
  AGENT = "agent",
  ADMINISTRATOR = "administrator",
}

// Contact Type
export enum ContactType {
  VISITOR = "visitor",
  LEAD = "lead",
  CUSTOMER = "customer",
}

// Channel Type
export enum ChannelType {
  WEB_WIDGET = "Channel::WebWidget",
  FACEBOOK = "Channel::FacebookPage",
  TWITTER = "Channel::TwitterProfile",
  WHATSAPP = "Channel::Whatsapp",
  EMAIL = "Channel::Email",
  API = "Channel::Api",
  LINE = "Channel::Line",
  TELEGRAM = "Channel::Telegram",
  SMS = "Channel::Sms",
}

// Attachment Type
export enum AttachmentType {
  IMAGE = "image",
  AUDIO = "audio",
  VIDEO = "video",
  FILE = "file",
  LOCATION = "location",
  FALLBACK = "fallback",
  SHARE = "share",
  STORY_MENTION = "story_mention",
  CONTACT = "contact",
  IG_REEL = "ig_reel",
}

// Inbox Filter Type
export enum InboxFilterType {
  STATUS = "status",
  TYPE = "type",
  SORT_ORDER = "sort_order",
}

// Inbox Display By
export enum InboxDisplayBy {
  SNOOZED = "snoozed",
  READ = "read",
}

// Inbox Sort By
export enum InboxSortBy {
  NEWEST = "desc",
  OLDEST = "asc",
}

// SLA Miss Types
export enum SLAMissType {
  FRT = "frt", // First Response Time
  NRT = "nrt", // Next Response Time
  RT = "rt", // Resolution Time
}
