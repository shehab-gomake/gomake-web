/**
 * API Response Extractors
 *
 * Centralized utilities for extracting and validating data from Chatwoot API responses.
 * Provides type-safe extraction with comprehensive error handling and validation.
 *
 * @module api-response-extractors
 */

import type { ChatwootConversation } from '@/services/frontdesk/api/chatwoot/types/conversations.types';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Possible response structures from Chatwoot API
 * Handles multiple nested payload structures
 */
type ChatwootApiResponse<T> =
  | { data: { payload: T } }
  | { data: T }
  | { payload: T }
  | T;

/**
 * Result type for extraction operations
 * Allows handling of success/failure cases
 */
type ExtractionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if value is a valid conversation
 *
 * @param value - Value to check
 * @returns True if value is a valid ChatwootConversation
 *
 * @example
 * if (isValidConversation(response)) {
 *   console.log(response.id); // TypeScript knows this is safe
 * }
 */
export function isValidConversation(value: unknown): value is ChatwootConversation {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const conv = value as Record<string, unknown>;

  // Must have a numeric ID (required field)
  if (!('id' in conv) || typeof conv.id !== 'number') {
    return false;
  }

  // Validate critical fields exist and have correct types
  const hasValidStatus = !conv.status || typeof conv.status === 'string';
  const hasValidMeta = !conv.meta || typeof conv.meta === 'object';

  return hasValidStatus && hasValidMeta;
}

/**
 * Type guard to check if object has nested data property
 */
function hasDataProperty<T>(obj: unknown): obj is { data: T } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'data' in obj &&
    obj.data != null
  );
}

/**
 * Type guard to check if object has payload property
 */
function hasPayloadProperty<T>(obj: unknown): obj is { payload: T } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'payload' in obj &&
    obj.payload != null
  );
}

// ============================================================================
// Extraction Functions
// ============================================================================

/**
 * Extracts conversation data from various API response shapes
 *
 * Handles multiple response structures:
 * - { data: { payload: T } }
 * - { data: T }
 * - { payload: T }
 * - T (direct object)
 *
 * @param response - Raw API response (unknown type for safety)
 * @param fallback - Fallback value if extraction fails
 * @returns Extracted and validated conversation, or fallback
 *
 * @example
 * const conv = extractConversation(apiResponse, currentConversation);
 */
export function extractConversation(
  response: unknown,
  fallback: ChatwootConversation
): ChatwootConversation {
  // Early return for invalid input
  if (!response || typeof response !== 'object') {
    console.warn('[extractConversation] Invalid response type:', typeof response);
    return fallback;
  }

  let extracted: unknown = response;

  // Level 1: Try data.payload
  if (hasDataProperty(response)) {
    if (hasPayloadProperty(response.data)) {
      extracted = response.data.payload;
    } else {
      extracted = response.data;
    }
  }
  // Level 2: Try payload directly
  else if (hasPayloadProperty(response)) {
    extracted = response.payload;
  }

  // Validate the extracted conversation
  if (isValidConversation(extracted)) {
    return extracted;
  }

  console.warn('[extractConversation] Extracted data is not a valid conversation, using fallback');
  return fallback;
}

/**
 * Safely extracts conversation with result type (no fallback required)
 *
 * @param response - Raw API response
 * @returns Result object with success/failure and data/error
 *
 * @example
 * const result = tryExtractConversation(apiResponse);
 * if (result.success) {
 *   updateUI(result.data);
 * } else {
 *   showError(result.error);
 * }
 */
export function tryExtractConversation(
  response: unknown
): ExtractionResult<ChatwootConversation> {
  if (!response || typeof response !== 'object') {
    return {
      success: false,
      error: 'Response is not an object',
    };
  }

  let extracted: unknown = response;

  // Extract through nested structures
  if (hasDataProperty(response)) {
    if (hasPayloadProperty(response.data)) {
      extracted = response.data.payload;
    } else {
      extracted = response.data;
    }
  } else if (hasPayloadProperty(response)) {
    extracted = response.payload;
  }

  // Validate extraction
  if (isValidConversation(extracted)) {
    return { success: true, data: extracted };
  }

  return {
    success: false,
    error: 'Extracted data is not a valid conversation',
  };
}

// ============================================================================
// Merge Functions
// ============================================================================

/**
 * Safely merges conversation updates with existing conversation
 *
 * Performs deep merge for nested objects (meta, custom_attributes)
 * while maintaining type safety and immutability.
 *
 * @param base - Base conversation to merge into
 * @param updates - Partial updates to apply
 * @returns New conversation object with merged data
 *
 * @example
 * const updated = mergeConversationUpdate(conversation, {
 *   status: 'resolved',
 *   meta: { assignee: newAgent }
 * });
 */
export function mergeConversationUpdate(
  base: ChatwootConversation,
  updates: Partial<ChatwootConversation>
): ChatwootConversation {
  // Shallow merge for top-level properties
  const merged = { ...base, ...updates };

  // Deep merge for meta (if both exist)
  if (base.meta || updates.meta) {
    merged.meta = {
      ...(base.meta || {}),
      ...(updates.meta || {}),
    };
  }

  // Deep merge for custom_attributes (if both exist)
  if (base.custom_attributes || updates.custom_attributes) {
    merged.custom_attributes = {
      ...(base.custom_attributes || {}),
      ...(updates.custom_attributes || {}),
    };
  }

  // Deep merge for labels (combine arrays, remove duplicates)
  if (updates.labels !== undefined) {
    merged.labels = updates.labels;
  } else if (base.labels) {
    merged.labels = base.labels;
  }

  return merged;
}

/**
 * Creates a deep clone of a conversation
 * Useful for preventing mutations
 *
 * @param conversation - Conversation to clone
 * @returns Deep cloned conversation
 */
export function cloneConversation(
  conversation: ChatwootConversation
): ChatwootConversation {
  return {
    ...conversation,
    meta: conversation.meta ? { ...conversation.meta } : undefined,
    custom_attributes: conversation.custom_attributes
      ? { ...conversation.custom_attributes }
      : undefined,
    labels: conversation.labels ? [...conversation.labels] : undefined,
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Extracts error message from API error response
 *
 * @param error - Error object from API call
 * @returns Human-readable error message
 */
export function extractErrorMessage(error: unknown): string {
  if (!error) {
    return 'Unknown error occurred';
  }

  // Axios error structure
  if (typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
  }

  // Standard Error object
  if (error instanceof Error) {
    return error.message;
  }

  // String error
  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
}
