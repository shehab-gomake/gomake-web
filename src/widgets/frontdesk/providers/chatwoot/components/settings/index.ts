/**
 * Settings Components Exports
 *
 * Centralized exports for all Chatwoot settings components.
 */

export { BaseSettingsSubpage, type BaseSettingsSubpageProps } from "./base-settings-subpage";
export { SettingsSection, type SettingsSectionProps } from "./settings-section";
export { EditAgentModal } from "./edit-agent-modal";
export { AddAgentModal, type AddAgentModalProps, type AddAgentData } from "./add-agent-modal";
export { AddEditLabelModal } from "./add-edit-label-modal";
export { AddEditTeamModal, type AddEditTeamData } from "./add-edit-team-modal";

// New shared components
export { CodeDisplay, type CodeDisplayProps } from "./CodeDisplay";
export { RichTextEditor, type RichTextEditorProps } from "./RichTextEditor";
export { AvatarUploader, type AvatarUploaderProps } from "./AvatarUploader";
export {
  WeeklyAvailability,
  createDefaultSchedule,
  type WeeklyAvailabilityProps,
  type WeekSchedule,
  type DayAvailability,
} from "./WeeklyAvailability";
export { ConfirmDialog, type ConfirmDialogProps } from "./ConfirmDialog";
export {
  CSATDisplayTypeSelector,
  type CSATDisplayTypeSelectorProps,
  type CSATDisplayType,
} from "./CSATDisplayTypeSelector";
