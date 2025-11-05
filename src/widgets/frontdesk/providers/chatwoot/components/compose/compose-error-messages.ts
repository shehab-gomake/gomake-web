/**
 * Compose Error Messages
 *
 * Centralized error messages for compose conversation form validation
 * and API error responses.
 */

/**
 * Validation Error Messages
 * Used for form field validation
 */
export const VALIDATION_ERRORS = {
  // Contact validation
  CONTACT_REQUIRED: "Contact is required",
  CONTACT_NOT_FOUND: "Contact not found",

  // Inbox validation
  INBOX_REQUIRED: "Please select an inbox",
  INBOX_NOT_AVAILABLE: "No inboxes available for this contact",

  // Message validation
  MESSAGE_REQUIRED: "Message is required",
  MESSAGE_TOO_LONG: "Message is too long (max 10,000 characters)",
  MESSAGE_EMPTY: "Message cannot be empty",

  // Email-specific validation
  SUBJECT_REQUIRED: "Subject is required for email conversations",
  SUBJECT_TOO_LONG: "Subject is too long (max 200 characters)",
  INVALID_EMAIL: "Invalid email address",
  INVALID_CC_EMAILS: "One or more CC email addresses are invalid",
  INVALID_BCC_EMAILS: "One or more BCC email addresses are invalid",

  // Attachment validation
  ATTACHMENT_TOO_LARGE: "File size exceeds the maximum allowed (10MB)",
  ATTACHMENT_INVALID_TYPE: "File type is not supported",
  TOO_MANY_ATTACHMENTS: "Maximum 5 attachments allowed",

  // WhatsApp template validation
  TEMPLATE_REQUIRED: "WhatsApp template is required",
  TEMPLATE_PARAMS_INVALID: "Invalid template parameters",
} as const;

/**
 * API Error Messages
 * User-friendly messages for API errors
 */
export const API_ERRORS = {
  // General errors
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  TIMEOUT_ERROR: "Request timed out. Please try again.",

  // Conversation creation errors
  CREATE_CONVERSATION_FAILED: "Failed to create conversation. Please try again.",
  SEND_MESSAGE_FAILED: "Failed to send message. Please try again.",
  UPLOAD_ATTACHMENT_FAILED: "Failed to upload attachment. Please try again.",

  // Contact errors
  CREATE_CONTACT_FAILED: "Failed to create contact. Please try again.",
  SEARCH_CONTACT_FAILED: "Failed to search contacts. Please try again.",
  FETCH_CONTACT_FAILED: "Failed to fetch contact details.",

  // Inbox errors
  FETCH_INBOXES_FAILED: "Failed to load inboxes. Please try again.",
  INBOX_NOT_CONFIGURED: "This inbox is not properly configured.",

  // Permission errors
  PERMISSION_DENIED: "You don't have permission to perform this action.",
  ACCOUNT_SUSPENDED: "Your account has been suspended. Contact support.",

  // Rate limiting
  RATE_LIMIT_EXCEEDED: "Too many requests. Please wait a moment and try again.",
} as const;

/**
 * Success Messages
 * Confirmation messages for successful operations
 */
export const SUCCESS_MESSAGES = {
  CONVERSATION_CREATED: "Conversation created successfully",
  MESSAGE_SENT: "Message sent successfully",
  CONTACT_CREATED: "Contact created successfully",
  ATTACHMENT_UPLOADED: "Attachment uploaded successfully",
} as const;

/**
 * Helper function to format email validation error
 */
export function getEmailValidationError(emails: string): string | undefined {
  if (!emails.trim()) return undefined;

  const emailList = emails.split(",").map((e) => e.trim());
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const invalidEmails = emailList.filter((email) => !emailRegex.test(email));

  if (invalidEmails.length > 0) {
    return `Invalid email address${invalidEmails.length > 1 ? "es" : ""}: ${invalidEmails.join(", ")}`;
  }

  return undefined;
}

/**
 * Helper function to format file size validation error
 */
export function getFileSizeError(file: File, maxSizeMB: number = 10): string | undefined {
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return `${file.name} exceeds ${maxSizeMB}MB limit`;
  }
  return undefined;
}

/**
 * Helper function to format attachment count error
 */
export function getAttachmentCountError(count: number, maxCount: number = 5): string | undefined {
  if (count > maxCount) {
    return `Maximum ${maxCount} attachments allowed (you have ${count})`;
  }
  return undefined;
}

/**
 * Map HTTP status codes to user-friendly error messages
 */
export function mapHttpErrorToMessage(status: number): string {
  switch (status) {
    case 400:
      return "Invalid request. Please check your input and try again.";
    case 401:
      return "Session expired. Please refresh the page and try again.";
    case 403:
      return API_ERRORS.PERMISSION_DENIED;
    case 404:
      return "Resource not found. It may have been deleted.";
    case 422:
      return "Invalid data. Please check your input and try again.";
    case 429:
      return API_ERRORS.RATE_LIMIT_EXCEEDED;
    case 500:
      return "Server error. Please try again later.";
    case 503:
      return "Service temporarily unavailable. Please try again later.";
    default:
      return API_ERRORS.UNKNOWN_ERROR;
  }
}
