export interface Machine {
  id: string;
  manufacturer: string;
  model: string;
  nickName?: string;
  category: string;
}

export interface SelectedMachine {
  id: string;
  name: string;
  category: string;
  categoryName: string;
}

export interface FinishingCategory {
  id: string;
  name: string;
  machines: string[];
  categoryType: "digital_offset" | "roll_flexo";
}

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
  selectedRollFlexoFinishingMachines: SelectedFinishingMachine[];
  finishingCategories: FinishingCategory[];
  rollFlexoFinishingCategories: FinishingCategory[];
  selectedCategoryMachines: { [categoryId: string]: string };
  selectedRollFlexoCategoryMachines: { [categoryId: string]: string };
}

export interface MachineCategory {
  id: string;
  name: string;
  machines?: Machine[];
}
