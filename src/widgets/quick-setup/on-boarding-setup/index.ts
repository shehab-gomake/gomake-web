export { default as TestPageRefactored } from "./quick-setup-flow";
export { default as QuickSetupModalNew } from "./quick-setup-modal-new";
export { useQuickSetupModalNew } from "./use-quick-setup-modal-new";
export type { SelectedMachine } from "./use-quick-setup-modal-new";

// Export new modular structure
export * from "./types";
export * from "./steps-config";
export * from "./hooks/use-machines-data";
export * from "./hooks/use-step-navigation";
export * from "./components/Step1MachineSelection";
export * from "./components/Step2FinishingSelection";
export * from "./components/Step3RollFlexoFinishingSelection";
