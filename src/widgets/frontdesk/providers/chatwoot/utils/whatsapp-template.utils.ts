/**
 * WhatsApp Template Utility Functions
 *
 * Helper functions for processing, validating, and manipulating WhatsApp templates.
 */

import {
  WhatsAppTemplate,
  ExtractedVariable,
  TemplateValidationResult,
  TemplateSelectorState,
  HeaderType,
  ButtonType,
} from "../types/whatsapp-templates.types";
import type { WhatsAppTemplateParams } from "@/services/frontdesk/api/chatwoot/types/compose.types";

/**
 * Extract variables from template text
 * Finds all {{1}}, {{2}}, etc. placeholders
 *
 * @param text - Template text with variable placeholders
 * @returns Array of extracted variables with metadata
 */
export function extractVariables(text: string): ExtractedVariable[] {
  const regex = /\{\{(\d+)\}\}/g;
  const variables: ExtractedVariable[] = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    variables.push({
      key: match[1],
      position: match.index,
      placeholder: match[0],
    });
  }

  // Sort by key (numeric order)
  return variables.sort((a, b) => parseInt(a.key) - parseInt(b.key));
}

/**
 * Interpolate template text with variable values
 * Replaces {{1}}, {{2}}, etc. with actual values
 *
 * @param text - Template text with placeholders
 * @param variables - Variable values map
 * @returns Interpolated text
 */
export function interpolateTemplate(
  text: string,
  variables: Record<string, string>
): string {
  let result = text;

  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), value);
  });

  return result;
}

/**
 * Validate template inputs
 * Checks that all required variables are filled and valid
 *
 * @param template - The template to validate
 * @param state - Current selector state with variable values
 * @returns Validation result with errors
 */
export function validateTemplateInputs(
  template: WhatsAppTemplate,
  state: TemplateSelectorState
): TemplateValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Validate body variables
  const bodyVars = extractVariables(template.components.body.text);
  for (const variable of bodyVars) {
    const value = state.bodyVariables[variable.key];

    if (!value || !value.trim()) {
      errors.push(`Variable {{${variable.key}}} is required`);
    } else if (value.length > 1024) {
      errors.push(`Variable {{${variable.key}}} must be less than 1024 characters`);
    }
  }

  // 2. Validate header media (if media template)
  if (
    template.components.header &&
    template.components.header.type !== HeaderType.TEXT
  ) {
    if (!state.headerMedia) {
      errors.push(
        `${template.components.header.type} header is required for this template`
      );
    } else {
      // Validate media URL
      if (!state.headerMedia.url || !isValidMediaUrl(state.headerMedia.url)) {
        errors.push("Header media URL must be a valid HTTPS URL");
      }

      // Validate media type matches
      if (state.headerMedia.type.toUpperCase() !== template.components.header.type) {
        errors.push(
          `Header media type must be ${template.components.header.type.toLowerCase()}`
        );
      }
    }
  }

  // 3. Validate button variables (for dynamic URL buttons)
  template.components.buttons?.forEach((button, index) => {
    if (button.type === ButtonType.URL && button.url?.includes("{{1}}")) {
      const value = state.buttonVariables[index.toString()];

      if (!value || !value.trim()) {
        errors.push(`URL parameter for "${button.text}" button is required`);
      } else if (!isValidUrlParam(value)) {
        warnings.push(
          `URL parameter for "${button.text}" button may contain invalid characters`
        );
      }
    }
  });

  // 4. Additional WhatsApp-specific validations
  if (template.category === "UTILITY") {
    // UTILITY templates have stricter rules
    bodyVars.forEach((variable) => {
      const value = state.bodyVariables[variable.key];
      if (value && containsPromoLanguage(value)) {
        warnings.push(
          `Variable {{${variable.key}}} contains promotional language. UTILITY templates should be transactional only.`
        );
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Convert template selector state to WhatsApp template params
 * Prepares the payload for sending to Chatwoot API
 *
 * @param template - The selected template
 * @param state - Current selector state
 * @returns WhatsApp template parameters ready for API
 */
export function convertToTemplateParams(
  template: WhatsAppTemplate,
  state: TemplateSelectorState
): WhatsAppTemplateParams {
  const params: WhatsAppTemplateParams = {
    name: template.name,
    category: template.category,
    language: template.language,
    processed_params: {},
  };

  // Add namespace if available
  if (template.namespace) {
    params.namespace = template.namespace;
  }

  // Add body variables
  if (Object.keys(state.bodyVariables).length > 0) {
    params.processed_params.body = state.bodyVariables;
  }

  // Add header media
  if (state.headerMedia && template.components.header?.type !== HeaderType.TEXT) {
    params.processed_params.header = {
      media_url: state.headerMedia.url,
      media_type: state.headerMedia.type,
    };
  }

  // Add button parameters
  const buttonParams: Array<{ type: string; parameter: string }> = [];
  template.components.buttons?.forEach((button, index) => {
    if (button.type === ButtonType.URL && button.url?.includes("{{1}}")) {
      const param = state.buttonVariables[index.toString()];
      if (param) {
        buttonParams.push({
          type: "url",
          parameter: param,
        });
      }
    } else if (button.type === ButtonType.COPY_CODE) {
      // Copy code button parameter comes from button example
      const param = button.example?.[0];
      if (param) {
        buttonParams.push({
          type: "copy_code",
          parameter: param,
        });
      }
    }
  });

  if (buttonParams.length > 0) {
    params.processed_params.buttons = buttonParams;
  }

  return params;
}

/**
 * Generate message content from template
 * Creates the content field for the message payload
 *
 * @param template - The template
 * @param variables - Variable values
 * @returns Message content string
 */
export function generateMessageContent(
  template: WhatsAppTemplate,
  variables: Record<string, string>
): string {
  return interpolateTemplate(template.components.body.text, variables);
}

/**
 * Get variable labels from template
 * Attempts to infer meaningful labels for variables based on examples
 *
 * @param template - The template
 * @returns Map of variable keys to labels
 */
export function getVariableLabels(template: WhatsAppTemplate): Record<string, string> {
  const variables = extractVariables(template.components.body.text);
  const labels: Record<string, string> = {};

  variables.forEach((variable, index) => {
    const example = template.components.body.examples[0]?.[index];

    // Try to infer label from example
    if (example) {
      if (isEmail(example)) {
        labels[variable.key] = "Email Address";
      } else if (isPhoneNumber(example)) {
        labels[variable.key] = "Phone Number";
      } else if (isDate(example)) {
        labels[variable.key] = "Date";
      } else if (isTime(example)) {
        labels[variable.key] = "Time";
      } else if (isOrderNumber(example)) {
        labels[variable.key] = "Order Number";
      } else if (isName(example)) {
        labels[variable.key] = "Name";
      } else {
        labels[variable.key] = `Variable ${variable.key}`;
      }
    } else {
      labels[variable.key] = `Variable ${variable.key}`;
    }
  });

  return labels;
}

/**
 * Estimate template message length
 * Calculates approximate final message length
 *
 * @param template - The template
 * @param variables - Variable values
 * @returns Estimated character count
 */
export function estimateMessageLength(
  template: WhatsAppTemplate,
  variables: Record<string, string>
): number {
  let length = interpolateTemplate(template.components.body.text, variables).length;

  if (template.components.header?.type === HeaderType.TEXT && template.components.header.text) {
    length += template.components.header.text.length + 2; // +2 for newlines
  }

  if (template.components.footer) {
    length += template.components.footer.text.length + 2; // +2 for newlines
  }

  return length;
}

// === Private Validation Helpers ===

/**
 * Check if URL is valid and HTTPS
 */
function isValidMediaUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.length > 0;
  } catch {
    return false;
  }
}

/**
 * Check if URL parameter is valid
 */
function isValidUrlParam(param: string): boolean {
  // Check for dangerous characters
  return !/[<>"'`]/.test(param);
}

/**
 * Check if text contains promotional language
 */
function containsPromoLanguage(text: string): boolean {
  const promoKeywords = [
    "discount",
    "offer",
    "sale",
    "promotion",
    "coupon",
    "deal",
    "free",
    "win",
    "prize",
  ];
  const lowerText = text.toLowerCase();
  return promoKeywords.some((keyword) => lowerText.includes(keyword));
}

// === Type Detection Helpers ===

function isEmail(text: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}

function isPhoneNumber(text: string): boolean {
  return /^[\d\s\-\+\(\)]{8,}$/.test(text);
}

function isDate(text: string): boolean {
  return /\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\w+\s\d{1,2},?\s\d{4}/.test(text);
}

function isTime(text: string): boolean {
  return /\d{1,2}:\d{2}\s?(AM|PM|am|pm)?/.test(text);
}

function isOrderNumber(text: string): boolean {
  return /^(ORD|ORDER|INV|INVOICE|#)[-\s]?\d+/i.test(text);
}

function isName(text: string): boolean {
  // Simple heuristic: Contains spaces and starts with capital letters
  return /^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/.test(text);
}

/**
 * Format template for display
 * Adds visual separators for components
 *
 * @param template - The template
 * @param variables - Variable values
 * @returns Formatted display text
 */
export function formatTemplateForDisplay(
  template: WhatsAppTemplate,
  variables: Record<string, string>
): string {
  const parts: string[] = [];

  // Header (text only)
  if (template.components.header?.type === HeaderType.TEXT && template.components.header.text) {
    parts.push(`📄 ${template.components.header.text}`);
  }

  // Body
  parts.push(interpolateTemplate(template.components.body.text, variables));

  // Footer
  if (template.components.footer) {
    parts.push(`\n${template.components.footer.text}`);
  }

  return parts.join("\n\n");
}
