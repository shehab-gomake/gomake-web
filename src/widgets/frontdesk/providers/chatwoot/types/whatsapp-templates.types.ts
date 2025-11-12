/**
 * WhatsApp Template Types
 *
 * Complete type definitions for WhatsApp Business templates.
 * Templates must be pre-approved in WhatsApp Business Manager before use.
 *
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates
 */

/**
 * WhatsApp Template Categories
 * Each template must belong to one of these approved categories
 */
export enum TemplateCategory {
  /** Transactional updates (orders, shipping, appointments) */
  UTILITY = "UTILITY",
  /** Promotional messages and offers */
  MARKETING = "MARKETING",
  /** Shipping and delivery notifications */
  SHIPPING_UPDATE = "SHIPPING_UPDATE",
  /** Account changes and verifications */
  ACCOUNT_UPDATE = "ACCOUNT_UPDATE",
  /** Support and issue tracking */
  ISSUE_RESOLUTION = "ISSUE_RESOLUTION",
}

/**
 * Template Approval Status
 */
export enum TemplateStatus {
  /** Template is approved and can be used */
  APPROVED = "APPROVED",
  /** Template is pending review */
  PENDING = "PENDING",
  /** Template was rejected */
  REJECTED = "REJECTED",
  /** Template is disabled */
  DISABLED = "DISABLED",
}

/**
 * Header Component Types
 */
export enum HeaderType {
  /** Plain text header (no variables) */
  TEXT = "TEXT",
  /** Image header (requires media URL) */
  IMAGE = "IMAGE",
  /** Video header (requires media URL) */
  VIDEO = "VIDEO",
  /** Document header (requires media URL) */
  DOCUMENT = "DOCUMENT",
}

/**
 * Button Types
 */
export enum ButtonType {
  /** URL button (can have dynamic URL with {{1}}) */
  URL = "URL",
  /** Phone number button */
  PHONE_NUMBER = "PHONE_NUMBER",
  /** Quick reply button */
  QUICK_REPLY = "QUICK_REPLY",
  /** Copy code button (copies text to clipboard) */
  COPY_CODE = "COPY_CODE",
}

/**
 * Template Header Component
 */
export interface TemplateHeaderComponent {
  /** Header type */
  type: HeaderType;
  /** Header text (for TEXT type) */
  text?: string;
  /** Example media URL (for IMAGE/VIDEO/DOCUMENT types) */
  example?: string;
}

/**
 * Template Body Component
 */
export interface TemplateBodyComponent {
  /** Body text with variable placeholders {{1}}, {{2}}, etc. */
  text: string;
  /** Example values for variables (array of arrays for multiple examples) */
  examples: string[][];
}

/**
 * Template Footer Component
 */
export interface TemplateFooterComponent {
  /** Footer text (no variables allowed) */
  text: string;
}

/**
 * Template Button Component
 */
export interface TemplateButtonComponent {
  /** Button type */
  type: ButtonType;
  /** Button text */
  text: string;
  /** URL (for URL buttons, may contain {{1}}) */
  url?: string;
  /** Phone number (for PHONE_NUMBER buttons) */
  phone_number?: string;
  /** Example values for dynamic URLs */
  example?: string[];
}

/**
 * Template Components
 */
export interface TemplateComponents {
  /** Optional header component */
  header?: TemplateHeaderComponent;
  /** Required body component */
  body: TemplateBodyComponent;
  /** Optional footer component */
  footer?: TemplateFooterComponent;
  /** Optional buttons (max 3 for quick replies, max 2 for call-to-action) */
  buttons?: TemplateButtonComponent[];
}

/**
 * WhatsApp Template Definition
 * This represents a template configured in WhatsApp Business Manager
 */
export interface WhatsAppTemplate {
  /** Unique template identifier */
  id: string;
  /** Template name (as registered in WhatsApp Business Manager) */
  name: string;
  /** Template category */
  category: TemplateCategory;
  /** Language code (BCP 47 format, e.g., "en", "ar", "en_US") */
  language: string;
  /** Optional namespace (WhatsApp Business Account namespace) */
  namespace?: string;
  /** Approval status */
  status: TemplateStatus;
  /** Template components */
  components: TemplateComponents;

  // UI/UX helpers
  /** Human-readable description */
  description?: string;
  /** Tags for categorization and search */
  tags?: string[];
  /** Last time this template was used */
  lastUsed?: Date;
  /** Number of times this template has been used */
  usageCount?: number;
}

/**
 * Template Variable Input Configuration
 * Defines how to collect variable values from users
 */
export interface TemplateVariableInput {
  /** Variable key (e.g., "1", "2", "3") */
  key: string;
  /** User-friendly label for the input */
  label: string;
  /** Input type */
  type: "text" | "url" | "date" | "number" | "email" | "phone";
  /** Placeholder text */
  placeholder?: string;
  /** Example value */
  example?: string;
  /** Validation function */
  validation?: (value: string) => boolean | string;
  /** Whether this variable is required */
  required?: boolean;
}

/**
 * Template Header Media Input
 */
export interface TemplateHeaderMedia {
  /** Media URL (must be publicly accessible HTTPS URL) */
  url: string;
  /** Media type */
  type: "image" | "video" | "document";
  /** File object (if uploading) */
  file?: File;
}

/**
 * Template Selector State
 * Manages the state of the template selector component
 */
export interface TemplateSelectorState {
  /** Currently selected template */
  selectedTemplate: WhatsAppTemplate | null;

  /** Body variable values: { "1": "value1", "2": "value2" } */
  bodyVariables: Record<string, string>;

  /** Button variable values (for dynamic URLs): { "0": "param1", "1": "param2" } */
  buttonVariables: Record<string, string>;

  /** Header media (for IMAGE/VIDEO/DOCUMENT templates) */
  headerMedia?: TemplateHeaderMedia;

  /** Search query for filtering templates */
  searchQuery: string;

  /** Category filter */
  categoryFilter: TemplateCategory | "ALL";

  /** Whether to show the preview panel */
  showPreview: boolean;

  /** Whether the current inputs are valid */
  isValid: boolean;

  /** Validation errors */
  errors: string[];
}

/**
 * Template Validation Result
 */
export interface TemplateValidationResult {
  /** Whether the template inputs are valid */
  isValid: boolean;
  /** List of validation errors */
  errors: string[];
  /** List of warnings (non-blocking) */
  warnings?: string[];
}

/**
 * Template Selector Props
 */
export interface WhatsAppTemplateSelectorProps {
  /** Whether the selector is open */
  open: boolean;
  /** Callback when selector is closed */
  onClose: () => void;
  /** Callback when a template is selected and confirmed */
  onSelect: (template: WhatsAppTemplate, variables: TemplateSelectorState) => void;
  /** Available templates */
  templates?: WhatsAppTemplate[];
  /** Initially selected template (optional) */
  initialTemplate?: WhatsAppTemplate;
  /** Whether template selection is required before sending */
  required?: boolean;
}

/**
 * Utility type for extracting variables from template text
 */
export interface ExtractedVariable {
  /** Variable key (e.g., "1", "2") */
  key: string;
  /** Variable position in text */
  position: number;
  /** Original placeholder (e.g., "{{1}}") */
  placeholder: string;
}
