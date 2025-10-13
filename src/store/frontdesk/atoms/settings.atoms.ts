/**
 * FrontDesk Settings Atoms
 * Recoil state management for settings feature
 */

import { atom } from 'recoil';
import {
  MessageTemplate,
  TemplateGroup,
  TemplateType,
  TemplateVariable,
  TemplateFilters,
  SettingsTab,
} from '@/widgets/frontdesk/settings/types/settings.types';

// Active tab
export const settingsActiveTabAtom = atom<SettingsTab>({
  key: 'frontdesk.settings.activeTab',
  default: 'templates',
});

// Message templates
export const settingsTemplatesAtom = atom<MessageTemplate[]>({
  key: 'frontdesk.settings.templates',
  default: [],
});

export const settingsSelectedTemplateAtom = atom<MessageTemplate | null>({
  key: 'frontdesk.settings.selectedTemplate',
  default: null,
});

// Template metadata
export const settingsTemplateGroupsAtom = atom<TemplateGroup[]>({
  key: 'frontdesk.settings.templateGroups',
  default: [],
});

export const settingsTemplateTypesAtom = atom<TemplateType[]>({
  key: 'frontdesk.settings.templateTypes',
  default: [],
});

export const settingsTemplateVariablesAtom = atom<TemplateVariable[]>({
  key: 'frontdesk.settings.templateVariables',
  default: [],
});

// Filters
export const settingsTemplateFiltersAtom = atom<TemplateFilters>({
  key: 'frontdesk.settings.templateFilters',
  default: {
    searchQuery: '',
  },
});

// UI state
export const settingsLoadingAtom = atom<boolean>({
  key: 'frontdesk.settings.isLoading',
  default: false,
});

export const settingsErrorAtom = atom<string | null>({
  key: 'frontdesk.settings.error',
  default: null,
});

// Modal states
export const settingsTemplateEditorModalAtom = atom<boolean>({
  key: 'frontdesk.settings.templateEditorModal',
  default: false,
});

export const settingsAddTemplateModalAtom = atom<boolean>({
  key: 'frontdesk.settings.addTemplateModal',
  default: false,
});

export const settingsAddGroupModalAtom = atom<boolean>({
  key: 'frontdesk.settings.addGroupModal',
  default: false,
});

// Template editor state (for rich text editor)
export const settingsTemplateSubjectAtom = atom<string>({
  key: 'frontdesk.settings.templateSubject',
  default: '',
});

export const settingsTemplateBodyAtom = atom<string>({
  key: 'frontdesk.settings.templateBody',
  default: '',
});
