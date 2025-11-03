/**
 * FrontDesk V2 - Inbox Types
 * Based on Chatwoot Swagger DTOs
 */

import { ChannelType } from './enums';

export interface Inbox {
  id: number;
  name: string;
  channel_type: ChannelType | string;
  
  // Channel Configuration
  channel_id: number;
  avatar_url: string | null;
  
  // Website Widget Config
  website_url?: string;
  website_token?: string;
  widget_color?: string;
  web_widget_script?: string;
  
  // Messaging Config
  phone_number?: string;
  messaging_service_sid?: string;
  provider?: string;
  medium?: string;
  
  // Features
  enable_auto_assignment: boolean;
  auto_assignment_config: Record<string, any> | null;
  
  // Greetings
  greeting_enabled: boolean;
  greeting_message: string | null;
  welcome_title: string | null;
  welcome_tagline: string | null;
  
  // Working Hours
  working_hours_enabled: boolean;
  working_hours: WorkingHour[];
  timezone: string | null;
  out_of_office_message: string | null;
  
  // Features
  enable_email_collect: boolean;
  csat_survey_enabled: boolean;
  allow_messages_after_resolved: boolean;
  lock_to_single_conversation: boolean;
  hmac_mandatory: boolean;
  
  // Advanced
  callback_webhook_url: string | null;
  sender_name_type: string | null;
  business_name: string | null;
  reply_time: string | null;
  selected_feature_flags: Record<string, any> | null;
}

export interface WorkingHour {
  day_of_week: number; // 0-6 (Sunday-Saturday)
  closed_all_day: boolean;
  open_all_day: boolean;
  open_hour: number;    // 0-23
  open_minutes: number; // 0-59
  close_hour: number;   // 0-23
  close_minutes: number; // 0-59
}

export interface InboxListItem {
  id: number;
  name: string;
  channel_type: string;
  avatar_url: string | null;
  enable_auto_assignment: boolean;
}

export interface InboxPayload {
  name: string;
  channel: {
    type: string;
    website_url?: string;
    phone_number?: string;
    [key: string]: any;
  };
}

export interface InboxUpdatePayload {
  name?: string;
  enable_auto_assignment?: boolean;
  greeting_enabled?: boolean;
  greeting_message?: string;
  working_hours_enabled?: boolean;
  csat_survey_enabled?: boolean;
  [key: string]: any;
}

