/**
 * FrontDesk V2 - Contact Types
 * Based on Chatwoot Swagger DTOs
 */

import { ContactType } from './enums';

export interface Contact {
  id: number;
  name: string;
  email: string | null;
  phone_number: string | null;
  identifier: string | null;
  
  // Profile
  thumbnail: string | null;
  avatar_url?: string;
  availability_status: 'online' | 'offline' | string;
  
  // Type
  contact_type?: ContactType;
  
  // Status
  blocked: boolean;
  
  // Attributes
  custom_attributes: Record<string, any>;
  additional_attributes: Record<string, any>;
  
  // Timestamps
  created_at: number;
  last_activity_at: number;
  
  // Relationships
  contact_inboxes?: ContactInbox[];
}

export interface ContactInbox {
  id: number;
  contact_id: number;
  inbox_id: number;
  source_id: string;
  created_at: number;
  updated_at: number;
  hmac_verified: boolean;
  pubsub_token: string;
}

export interface ContactListItem {
  id: number;
  name: string;
  email: string | null;
  phone_number: string | null;
  thumbnail: string | null;
  availability_status: string;
  last_activity_at: number;
}

export interface ContactPayload {
  name: string;
  email?: string;
  phone_number?: string;
  identifier?: string;
  custom_attributes?: Record<string, any>;
  additional_attributes?: Record<string, any>;
}

export interface ContactUpdatePayload {
  name?: string;
  email?: string;
  phone_number?: string;
  custom_attributes?: Record<string, any>;
  additional_attributes?: Record<string, any>;
}

export interface ContactsListResponse {
  payload: Contact[];
  meta: {
    count: number;
    current_page: number;
  };
}
