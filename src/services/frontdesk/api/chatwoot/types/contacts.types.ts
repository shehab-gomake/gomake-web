/**
 * Chatwoot Contact Types
 *
 * Type definitions for Chatwoot contacts and contact-related operations.
 */

// Contact Detail interface
export interface ContactDetail {
  additional_attributes?: Record<string, unknown>;
  custom_attributes?: Record<string, unknown>;
  email?: string;
  id?: number;
  identifier?: string | null;
  name?: string;
  phone_number?: string | null;
  thumbnail?: string;
  blocked?: boolean;
  type?: string;
}

// Contact List Item interface
export interface ContactListItem {
  id?: number;
  name?: string;
  email?: string;
  phone_number?: string;
  thumbnail?: string;
  additional_attributes?: Record<string, unknown>;
}

// Contact Meta interface
export interface ContactMeta {
  count?: number;
  current_page?: number;
}

// Contact Create Payload
export interface ContactCreatePayload {
  name?: string;
  email?: string;
  phone_number?: string;
  identifier?: string;
  custom_attributes?: Record<string, unknown>;
  additional_attributes?: Record<string, unknown>;
}

// Contact Update Payload
export interface ContactUpdatePayload {
  name?: string;
  email?: string;
  phone_number?: string;
  custom_attributes?: Record<string, unknown>;
  additional_attributes?: Record<string, unknown>;
}

// Contact Filter Request
export interface ContactFilterRequest {
  payload?: Array<{
    attribute_key?: string;
    filter_operator?: string;
    values?: unknown[];
    query_operator?: string;
    attribute_model?: string;
  }>;
  page?: number;
}

// Contact Conversations Response
export interface ContactConversationsResponse {
  payload?: Array<{
    id?: number;
    inbox_id?: number;
    messages?: unknown[];
    contact?: ContactDetail;
  }>;
}

// Contact-specific response wrappers
export interface ContactListResponse {
  data?: { meta?: ContactMeta; payload?: ContactListItem[] };
  meta?: ContactMeta;
  payload?: ContactListItem[];
}

export interface ContactDetailResponse {
  data?: { payload?: ContactDetail };
  payload?: ContactDetail;
}

export interface ContactsListResponse {
  meta?: ContactMeta;
  payload?: ContactListItem[];
}

// Type guard for ContactDetail
export function isContactDetail(value: unknown): value is ContactDetail {
  if (!value || typeof value !== 'object') return false;
  const contact = value as ContactDetail;
  return (
    typeof contact.id === 'number' &&
    (typeof contact.email === 'string' || typeof contact.phone_number === 'string')
  );
}

// Type guard for ContactListItem
export function isContactListItem(value: unknown): value is ContactListItem {
  if (!value || typeof value !== 'object') return false;
  const contact = value as ContactListItem;
  return typeof contact.id === 'number';
}

// Helper function to extract payload from response
export function extractContactPayload<T>(response: {
  data?: { payload?: T };
  payload?: T;
}): T | null {
  return response.data?.payload ?? response.payload ?? null;
}
