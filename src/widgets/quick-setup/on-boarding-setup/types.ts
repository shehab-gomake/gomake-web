export interface Machine {
  id: string;
  manufacturer: string;
  model: string;
  nickName?: string;
  category: string;
  categoryId?: string;
}

export interface SelectedMachine {
  id: string;
  name: string;
  category: string;
  categoryId: string | number; // Allow both string and number (ECategoryId enum)
  categoryName: string;
  stepAdded?: number; // Track which step this machine was added from
  machineType?: "printing" | "finishing"; // Distinguish between printing and finishing machines
}

export interface FinishingCategory {
  id: string;
  name: string;
  machines: Machine[]; // Changed from string[] to Machine[]
  categoryType:
    | "digital_offset"
    | "roll_flexo"
    | "book_finishing"
    | "wide_format"
    | "dtf_sublimation"
    | "packaging";
}

// Keep for backward compatibility but mark as deprecated
export interface SelectedFinishingMachine {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  stepAdded?: number;
}

export interface StepState {
  currentStep: number;
  selectedMachines: SelectedMachine[]; // Unified array for all machines
  // Individual step selections for UI state management
  selectedFinishingMachines: SelectedFinishingMachine[];
  selectedBookFinishingMachines: SelectedFinishingMachine[];
  selectedWideFormatFinishingMachines: SelectedFinishingMachine[];
  selectedDtfSublimationFinishingMachines: SelectedFinishingMachine[];
  selectedRollFlexoFinishingMachines: SelectedFinishingMachine[];
  selectedPackagingMachines: SelectedFinishingMachine[];
  finishingCategories: FinishingCategory[];
  bookFinishingCategories: FinishingCategory[];
  wideFormatFinishingCategories: FinishingCategory[];
  dtfSublimationFinishingCategories: FinishingCategory[];
  rollFlexoFinishingCategories: FinishingCategory[];
  packagingCategories: FinishingCategory[];
  selectedCategoryMachines: { [categoryId: string]: string };
  selectedBookFinishingCategoryMachines: { [categoryId: string]: string };
  selectedWideFormatFinishingCategoryMachines: { [categoryId: string]: string };
  selectedDtfSublimationFinishingCategoryMachines: {
    [categoryId: string]: string;
  };
  selectedRollFlexoCategoryMachines: { [categoryId: string]: string };
  selectedPackagingCategoryMachines: { [categoryId: string]: string };
}

export interface MachineCategory {
  id: string;
  name: string;
  machines?: Machine[];
}

export interface IQuickSetupAddMachine {
  id?: string; // Optional since new machines won't have an ID
  name: string;
  category: string;
  isAdminMachine: boolean;
}
