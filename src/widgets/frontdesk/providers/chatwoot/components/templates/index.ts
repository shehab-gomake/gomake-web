/**
 * WhatsApp Template Components
 *
 * Export all template-related components, types, and utilities.
 */

// Components
export { WhatsAppTemplateSelector } from "./whatsapp-template-selector";
export { TemplateCard } from "./whatsapp-template-card";
export { TemplatePreview } from "./whatsapp-template-preview";
export { TemplateVariableForm } from "./whatsapp-template-variable-form";

// Types
export type {
  WhatsAppTemplate,
  WhatsAppTemplateSelectorProps,
  TemplateSelectorState,
  TemplateCategory,
  TemplateStatus,
  HeaderType,
  ButtonType,
  TemplateComponents,
  TemplateHeaderMedia,
  TemplateValidationResult,
} from "../../types/whatsapp-templates.types";

// Constants
export {
  WHATSAPP_TEMPLATES,
  TEMPLATE_CATEGORY_LABELS,
  TEMPLATE_CATEGORY_COLORS,
  getTemplatesByCategory,
  getTemplateById,
  getTemplateByName,
  searchTemplates,
  getRecentTemplates,
  getMostUsedTemplates,
} from "../../constants/whatsapp-templates.constants";

// Utilities
export {
  extractVariables,
  interpolateTemplate,
  validateTemplateInputs,
  convertToTemplateParams,
  generateMessageContent,
  getVariableLabels,
  estimateMessageLength,
  formatTemplateForDisplay,
} from "../../utils/whatsapp-template.utils";
