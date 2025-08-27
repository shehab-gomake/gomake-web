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
  categoryId?: string;
  categoryName: string;
}

export interface FinishingCategory {
  id: string;
  name: string;
  machines: string[]; //!here should be machine structure
  categoryType:
    | "digital_offset"
    | "roll_flexo"
    | "book_finishing"
    | "wide_format"
    | "dtf_sublimation";
}

//!here
export interface SelectedFinishingMachine {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
}

export interface StepState {
  currentStep: number;
  selectedMachines: SelectedMachine[];
  selectedFinishingMachines: SelectedFinishingMachine[];
  selectedBookFinishingMachines: SelectedFinishingMachine[];
  selectedWideFormatFinishingMachines: SelectedFinishingMachine[];
  selectedDtfSublimationFinishingMachines: SelectedFinishingMachine[];
  selectedRollFlexoFinishingMachines: SelectedFinishingMachine[];
  finishingCategories: FinishingCategory[];
  bookFinishingCategories: FinishingCategory[];
  wideFormatFinishingCategories: FinishingCategory[];
  dtfSublimationFinishingCategories: FinishingCategory[];
  rollFlexoFinishingCategories: FinishingCategory[];
  selectedCategoryMachines: { [categoryId: string]: string };
  selectedBookFinishingCategoryMachines: { [categoryId: string]: string };
  selectedWideFormatFinishingCategoryMachines: { [categoryId: string]: string };
  selectedDtfSublimationFinishingCategoryMachines: {
    [categoryId: string]: string;
  };
  selectedRollFlexoCategoryMachines: { [categoryId: string]: string };
}

export interface MachineCategory {
  id: string;
  name: string;
  machines?: Machine[];
}
