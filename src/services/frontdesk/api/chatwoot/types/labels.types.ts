/**
 * Chatwoot Label Types
 *
 * Type definitions for Chatwoot labels and label-related operations.
 */

// Conversation Labels interface
export interface ConversationLabels {
  payload?: string[];
}

// Label type alias
export interface Label {
  id?: number;
  title?: string;
  description?: string;
  color?: string;
  show_on_sidebar?: boolean;
}

// Label response wrapper
export interface LabelListResponse {
  data?: { payload?: Label[] };
  payload?: Label[];
}

export interface LabelDetailResponse {
  data?: { payload?: Label };
  payload?: Label;
}

// Type guard for Label
export function isLabel(value: unknown): value is Label {
  if (!value || typeof value !== 'object') return false;
  const label = value as Label;
  return typeof label.id === 'number' && typeof label.title === 'string';
}
