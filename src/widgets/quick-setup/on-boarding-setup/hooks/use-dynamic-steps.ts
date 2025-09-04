import { useMemo } from "react";
import { SelectedMachine } from "@/widgets/quick-setup/on-boarding-setup/types";
import { ECategoryId } from "@/widgets/machines/enums/category-id";

export interface DynamicStep {
  id: number;
  title: string;
  description: string;
  isVisible: boolean;
  isActive: boolean;
  isCompleted: boolean;
}

export const useDynamicSteps = (
  selectedMachines: SelectedMachine[],
  currentStep: number
) => {
  // Check if we have digital or offset printing machines
  const hasDigitalOrOffsetPrinting = (): boolean => {
    return selectedMachines.some((machine) => {
      const categoryId = machine.categoryId || machine.category;
      return (
        categoryId === ECategoryId.DIGITAL_PRINTING ||
        categoryId === ECategoryId.OFSSET_PRINTING
      );
    });
  };

  // Check if we have roll, flexo, or roll sheet machines
  const hasRollOrFlexoPrinting = (): boolean => {
    return selectedMachines.some((machine) => {
      const categoryId = machine.categoryId || machine.category;
      return (
        categoryId === ECategoryId.ROLL_DIGITAL_PRINTING ||
        categoryId === ECategoryId.ROLL_SHEET_MACHINE ||
        categoryId === ECategoryId.FLEXO_PRINTING
      );
    });
  };

  // Check if we have wide printing machines
  const hasWidePrinting = (): boolean => {
    return selectedMachines.some((machine) => {
      const categoryId = machine.categoryId || machine.category;
      return categoryId === ECategoryId.ROLL_WIDE_PRINTING;
    });
  };

  // Check if we have DTF or sublimation printing machines
  const hasDtfOrSublimationPrinting = (): boolean => {
    return selectedMachines.some((machine) => {
      const categoryId = machine.categoryId || machine.category;
      return categoryId === ECategoryId.SUBLIMATION;
    });
  };

  // Generate dynamic steps based on selected machines
  const dynamicSteps = useMemo((): DynamicStep[] => {
    const steps: DynamicStep[] = [];

    // Step 0: Always visible - Select Machines
    steps.push({
      id: 0,
      title: "Select Machines",
      description: "Select the machines you want to configure",
      isVisible: true,
      isActive: currentStep === 0,
      isCompleted: currentStep > 0,
    });

    // Step 1: Digital/Sheet Finishing - Only visible if digital/offset printing selected
    if (hasDigitalOrOffsetPrinting()) {
      steps.push({
        id: 1,
        title: "Digital/Sheet Finishing",
        description: "Configure finishing machines for Digital/Offset printing",
        isVisible: true,
        isActive: currentStep === 1,
        isCompleted: currentStep > 1,
      });
    }

    // Step 2: Book Finishing - Only visible if digital/offset printing selected
    if (hasDigitalOrOffsetPrinting()) {
      steps.push({
        id: 2,
        title: "Book Finishing",
        description:
          "Configure book finishing machines for Digital/Offset printing",
        isVisible: true,
        isActive: currentStep === 2,
        isCompleted: currentStep > 2,
      });
    }

    // Step 3: Roll/Flexo Finishing - Only visible if roll/flexo printing selected
    if (hasRollOrFlexoPrinting()) {
      steps.push({
        id: 3,
        title: "Roll/Flexo Finishing",
        description: "Configure finishing machines for Roll/Flexo printing",
        isVisible: true,
        isActive: currentStep === 3,
        isCompleted: currentStep > 3,
      });
    }

    // Step 4: Wide Format Finishing - Only visible if wide printing selected
    if (hasWidePrinting()) {
      steps.push({
        id: 4,
        title: "Wide Format Finishing",
        description: "Configure finishing machines for Wide format printing",
        isVisible: true,
        isActive: currentStep === 4,
        isCompleted: currentStep > 4,
      });
    }

    // Step 5: DTF & Sublimation Finishing - Only visible if DTF/sublimation printing selected
    if (hasDtfOrSublimationPrinting()) {
      steps.push({
        id: 5,
        title: "DTF & Sublimation Finishing",
        description:
          "Configure finishing machines for DTF & Sublimation printing",
        isVisible: true,
        isActive: currentStep === 5,
        isCompleted: currentStep > 5,
      });
    }

    // Step 6: Packaging - Always visible (optional)
    steps.push({
      id: 6,
      title: "Select Packaging Machines",
      description: "Configure packaging machines",
      isVisible: true,
      isActive: currentStep === 6,
      isCompleted: false, // Never completed as it's the final step
    });

    return steps;
  }, [selectedMachines, currentStep]);

  // Get the actual step number for the current step (accounting for hidden steps)
  const getActualStepNumber = (stepId: number): number => {
    return dynamicSteps.findIndex((step) => step.id === stepId);
  };

  // Get the next step ID based on current step
  const getNextStepId = (currentStepId: number): number => {
    const currentStepIndex = dynamicSteps.findIndex(
      (step) => step.id === currentStepId
    );
    if (currentStepIndex < dynamicSteps.length - 1) {
      return dynamicSteps[currentStepIndex + 1].id;
    }
    return currentStepId; // Stay on current step if it's the last one
  };

  // Get the previous step ID based on current step
  const getPreviousStepId = (currentStepId: number): number => {
    const currentStepIndex = dynamicSteps.findIndex(
      (step) => step.id === currentStepId
    );
    if (currentStepIndex > 0) {
      return dynamicSteps[currentStepIndex - 1].id;
    }
    return currentStepId; // Stay on current step if it's the first one
  };

  // Check if a step should be shown in the stepper
  const isStepVisible = (stepId: number): boolean => {
    const step = dynamicSteps.find((s) => s.id === stepId);
    return step?.isVisible || false;
  };

  // Get visible steps only
  const visibleSteps = useMemo(() => {
    return dynamicSteps.filter((step) => step.isVisible);
  }, [dynamicSteps]);

  return {
    dynamicSteps,
    visibleSteps,
    getActualStepNumber,
    getNextStepId,
    getPreviousStepId,
    isStepVisible,
    hasDigitalOrOffsetPrinting,
    hasRollOrFlexoPrinting,
    hasWidePrinting,
    hasDtfOrSublimationPrinting,
  };
};
