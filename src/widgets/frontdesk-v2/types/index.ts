/**
 * FrontDesk V2 - Type Definitions Index
 * Based on Chatwoot Swagger DTOs
 */

// Enums
export * from './enums';

// Core Types
export * from './conversation.types';
export * from './message.types';
export * from './contact.types';
export * from './agent.types';
export * from './inbox.types';
export * from './team.types';

// API Response Types
export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  payload: T[];
  meta: {
    count: number;
    current_page: number;
    total_pages?: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// WebSocket Event Types
export interface WebSocketEvent<T = any> {
  event: string;
  data: T;
}

export interface PresenceUpdateEvent {
  account_id: number;
  users: Record<number, string>; // userId -> availability
  contacts: Record<number, string>; // contactId -> availability
}

// UI State Types
export interface UIState {
  isLoading: boolean;
  error: string | null;
}

export interface ConversationUIState extends UIState {
  selectedConversationId: number | null;
  isComposerFocused: boolean;
  draftMessage: string;
}

// Filter Types
export interface FilterOption {
  id: string | number;
  label: string;
  value: any;
}

export interface SavedFilter {
  id: string;
  name: string;
  filter_type: string;
  query: Record<string, any>;
}
