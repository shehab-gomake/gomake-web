/**
 * FrontDesk Settings Types
 * Type definitions for settings feature
 */

// Re-export types from settings-mailing for compatibility
export interface MessageTemplate {
  id: string;
  templateType: string;
  title: string;
  text: string;
  attachment?: string;
  smsTemplatesGroupId?: string;
  language?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TemplateGroup {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TemplateVariable {
  id?: string;
  name?: string;
  description?: string;
  value: string;
  label: string; // Display text for the variable (e.g., "Customer Name")
}

export interface TemplateType {
  value: string;
  text: string;
}

export interface TemplateFilters {
  templateType?: string;
  groupId?: string;
  searchQuery?: string;
}

export type SettingsTab = 'templates' | 'general' | 'notifications';

export interface SettingsState {
  activeTab: SettingsTab;
  templates: MessageTemplate[];
  selectedTemplate: MessageTemplate | null;
  templateGroups: TemplateGroup[];
  templateTypes: TemplateType[];
  templateVariables: TemplateVariable[];
  filters: TemplateFilters;
  isLoading: boolean;
  error: string | null;
}
