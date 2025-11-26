/**
 * Message Validation Utilities
 *
 * Comprehensive validation for message content across different channels.
 * Handles length limits, content validation, email validation, etc.
 */

import type { ChannelFeatures } from "./channel-features.service";

/**
 * Validation result with detailed error information
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  type: "length" | "empty" | "email" | "format" | "unsupported";
  message: string;
  field?: string;
}

export interface ValidationWarning {
  type: "length" | "format";
  message: string;
}

/**
 * Email validation regex (RFC 5322 simplified)
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validate multiple comma/semicolon-separated emails
 */
export function validateEmailList(emailString: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!emailString.trim()) {
    return { isValid: true, errors, warnings };
  }

  // Split by comma or semicolon
  const emails = emailString.split(/[,;]/).map((e) => e.trim()).filter(Boolean);

  for (const email of emails) {
    if (!isValidEmail(email)) {
      errors.push({
        type: "email",
        message: `Invalid email address: ${email}`,
        field: "email",
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate message content
 */
export function validateMessageContent(
  content: string,
  features: ChannelFeatures,
  isPrivate: boolean = false
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Empty check
  if (!content.trim()) {
    errors.push({
      type: "empty",
      message: "Message content cannot be empty",
    });
    return { isValid: false, errors, warnings };
  }

  // Length validation
  const maxLength = features.maxMessageLength;
  const currentLength = content.length;

  if (currentLength > maxLength) {
    errors.push({
      type: "length",
      message: `Message exceeds maximum length of ${maxLength} characters (current: ${currentLength})`,
    });
  } else if (currentLength > maxLength * 0.9) {
    // Warning at 90% capacity
    warnings.push({
      type: "length",
      message: `Message is close to the maximum length (${currentLength}/${maxLength})`,
    });
  }

  // Check for unsupported HTML in plain text channels
  if (!features.shouldUseRichEditor && /<[^>]+>/.test(content)) {
    warnings.push({
      type: "format",
      message: "HTML tags will be displayed as plain text in this channel",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate email header (TO, CC, BCC)
 */
export function validateEmailHeader(
  to: string,
  cc: string = "",
  bcc: string = ""
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // TO field is required
  if (!to.trim()) {
    errors.push({
      type: "email",
      message: "TO field is required",
      field: "to",
    });
  } else {
    const toValidation = validateEmailList(to);
    errors.push(...toValidation.errors.map((e) => ({ ...e, field: "to" })));
  }

  // Validate CC if provided
  if (cc.trim()) {
    const ccValidation = validateEmailList(cc);
    errors.push(...ccValidation.errors.map((e) => ({ ...e, field: "cc" })));
  }

  // Validate BCC if provided
  if (bcc.trim()) {
    const bccValidation = validateEmailList(bcc);
    errors.push(...bccValidation.errors.map((e) => ({ ...e, field: "bcc" })));
  }

  // Check for duplicate emails across fields
  const allEmails = [
    ...to.split(/[,;]/).map((e) => e.trim()),
    ...cc.split(/[,;]/).map((e) => e.trim()),
    ...bcc.split(/[,;]/).map((e) => e.trim()),
  ].filter(Boolean);

  const uniqueEmails = new Set(allEmails);
  if (uniqueEmails.size < allEmails.length) {
    warnings.push({
      type: "format",
      message: "Duplicate email addresses detected",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate complete message for sending
 */
export function validateMessage(
  content: string,
  features: ChannelFeatures,
  isPrivate: boolean = false,
  emailHeader?: { to?: string; cc?: string; bcc?: string }
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Validate content
  const contentValidation = validateMessageContent(content, features, isPrivate);
  errors.push(...contentValidation.errors);
  warnings.push(...contentValidation.warnings);

  // Validate email header if applicable
  if (!isPrivate && features.shouldShowEmailHeader && emailHeader) {
    const headerValidation = validateEmailHeader(
      emailHeader.to || "",
      emailHeader.cc,
      emailHeader.bcc
    );
    errors.push(...headerValidation.errors);
    warnings.push(...headerValidation.warnings);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Sanitize message content
 *
 * Removes potentially harmful content while preserving formatting
 */
export function sanitizeMessageContent(content: string, features: ChannelFeatures): string {
  let sanitized = content;

  // For plain text channels, strip HTML tags
  if (!features.shouldUseRichEditor) {
    sanitized = sanitized.replace(/<[^>]+>/g, "");
  }

  // Trim whitespace
  sanitized = sanitized.trim();

  // Normalize line breaks
  sanitized = sanitized.replace(/\r\n/g, "\n");

  // Remove excessive blank lines (more than 2 consecutive)
  sanitized = sanitized.replace(/\n{3,}/g, "\n\n");

  return sanitized;
}

/**
 * Split long message into chunks for channels that require it
 */
export function splitMessage(content: string, maxLength: number): string[] {
  if (content.length <= maxLength) {
    return [content];
  }

  const chunks: string[] = [];
  const paragraphs = content.split("\n\n");

  let currentChunk = "";

  for (const paragraph of paragraphs) {
    // If single paragraph is too long, split by sentences
    if (paragraph.length > maxLength) {
      const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];

      for (const sentence of sentences) {
        if ((currentChunk + sentence).length > maxLength) {
          if (currentChunk) chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          currentChunk += sentence;
        }
      }
    } else {
      // Add paragraph to chunk if it fits
      if ((currentChunk + "\n\n" + paragraph).length > maxLength) {
        chunks.push(currentChunk.trim());
        currentChunk = paragraph;
      } else {
        currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Get character count with smart formatting
 */
export function getCharacterCountDisplay(current: number, max: number): string {
  const remaining = max - current;
  const percentage = (current / max) * 100;

  if (percentage >= 100) {
    return `${current} / ${max} (exceeded by ${-remaining})`;
  } else if (percentage >= 90) {
    return `${remaining} characters remaining`;
  } else {
    return `${current} / ${max}`;
  }
}

/**
 * Get validation status color
 */
export function getValidationColor(current: number, max: number): "error" | "warning" | "default" {
  const percentage = (current / max) * 100;

  if (percentage >= 100) return "error";
  if (percentage >= 90) return "warning";
  return "default";
}
