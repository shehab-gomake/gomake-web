import { useState, useCallback } from "react";
import {
  SelectedMachine,
  SelectedFinishingMachine,
} from "@/widgets/quick-setup/on-boarding-setup/types";
import { STEPS_CONFIG } from "@/widgets/quick-setup/on-boarding-setup/steps-config";
import { ECategoryId } from "@/widgets/machines/enums/category-id";

export const useStepNavigation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { steps } = STEPS_CONFIG;

  // Check if we have digital or offset printing machines
  const hasDigitalOrOffsetPrinting = (
    selectedMachines: SelectedMachine[]
  ): boolean => {
    return selectedMachines.some((machine) => {
      const categoryId = machine.categoryId || machine.category;
      return (
        categoryId === ECategoryId.DIGITAL_PRINTING ||
        categoryId === ECategoryId.OFSSET_PRINTING
      );
    });
  };

  // Check if we have roll, flexo, or roll sheet machines
  const hasRollOrFlexoPrinting = (
    selectedMachines: SelectedMachine[]
  ): boolean => {
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
  const hasWidePrinting = (selectedMachines: SelectedMachine[]): boolean => {
    return selectedMachines.some((machine) => {
      const categoryId = machine.categoryId || machine.category;
      return categoryId === ECategoryId.ROLL_WIDE_PRINTING;
    });
  };

  // Check if we have DTF or sublimation printing machines
  const hasDtfOrSublimationPrinting = (
    selectedMachines: SelectedMachine[]
  ): boolean => {
    return selectedMachines.some((machine) => {
      const categoryId = machine.categoryId || machine.category;
      return categoryId === ECategoryId.SUBLIMATION;
    });
  };

  // Helper function to get the next step based on current step and selected machines
  const getNextStep = useCallback(
    (currentStep: number, selectedMachines: SelectedMachine[]): number => {
      if (currentStep === 0) {
        return 1; // Always go to step 1 after step 0
      } else if (currentStep === 1) {
        return 2; // Always go to step 2 after step 1
      } else if (currentStep === 2) {
        return 3; // Always go to step 3 after step 2
      } else if (currentStep === 3) {
        return 4; // Always go to step 4 after step 3
      } else if (currentStep === 4) {
        return 5; // Always go to step 5 after step 4
      } else if (currentStep === 5) {
        return 6; // Always go to step 6 after step 5
      } else if (currentStep === 6) {
        return 6; // Stay on step 6 (final step)
      }
      return currentStep; // Default case
    },
    []
  );

  const handleNext = useCallback(
    (
      selectedMachines: SelectedMachine[],
      selectedFinishingMachines: SelectedFinishingMachine[],
      selectedBookFinishingMachines: SelectedFinishingMachine[],
      selectedWideFormatFinishingMachines: SelectedFinishingMachine[],
      selectedDtfSublimationFinishingMachines: SelectedFinishingMachine[],
      selectedRollFlexoFinishingMachines: SelectedFinishingMachine[],
      selectedPackagingMachines: SelectedFinishingMachine[]
    ) => {
      if (currentStep === 0) {
        // Validate step 1 - only require at least one machine
        if (selectedMachines.length === 0) {
          alert("Please select at least one machine");
          return false;
        }
        const nextStep = getNextStep(currentStep, selectedMachines);
        setCurrentStep(nextStep);
        return true;
      } else if (currentStep === 1) {
        // Step 2 - Validate finishing machines if we have digital/offset printing
        if (
          hasDigitalOrOffsetPrinting(selectedMachines) &&
          selectedFinishingMachines.length === 0
        ) {
          alert(
            "Please select at least one finishing machine for Digital/Offset printing"
          );
          return false;
        }
        const nextStep = getNextStep(currentStep, selectedMachines);
        setCurrentStep(nextStep);
        return true;
      } else if (currentStep === 2) {
        // Step 3 - Validate book finishing machines if we have digital/offset printing
        if (
          hasDigitalOrOffsetPrinting(selectedMachines) &&
          selectedBookFinishingMachines.length === 0
        ) {
          alert(
            "Please select at least one book finishing machine for Digital/Offset printing"
          );
          return false;
        }
        const nextStep = getNextStep(currentStep, selectedMachines);
        setCurrentStep(nextStep);
        return true;
      } else if (currentStep === 3) {
        // Step 4 - Validate roll/flexo finishing machines if we have roll/flexo printing
        if (
          hasRollOrFlexoPrinting(selectedMachines) &&
          selectedRollFlexoFinishingMachines.length === 0
        ) {
          alert(
            "Please select at least one finishing machine for Roll/Flexo printing"
          );
          return false;
        }
        const nextStep = getNextStep(currentStep, selectedMachines);
        setCurrentStep(nextStep);
        return true;
      } else if (currentStep === 4) {
        // Step 5 - Validate wide format finishing machines if we have wide printing
        if (
          hasWidePrinting(selectedMachines) &&
          selectedWideFormatFinishingMachines.length === 0
        ) {
          alert(
            "Please select at least one finishing machine for Wide format printing"
          );
          return false;
        }
        const nextStep = getNextStep(currentStep, selectedMachines);
        setCurrentStep(nextStep);
        return true;
      } else if (currentStep === 5) {
        // Step 6 - Only validate if we have DTF/sublimation printing machines
        if (
          hasDtfOrSublimationPrinting(selectedMachines) &&
          selectedDtfSublimationFinishingMachines.length === 0
        ) {
          alert(
            "Please select at least one finishing machine for DTF & Sublimation printing"
          );
          return false;
        }
        const nextStep = getNextStep(currentStep, selectedMachines);
        setCurrentStep(nextStep);
        return true;
      } else if (currentStep === 6) {
        // Step 7 - Save or complete
        console.log("Selected machines:", selectedMachines);
        console.log("Selected finishing machines:", selectedFinishingMachines);
        console.log(
          "Selected book finishing machines:",
          selectedBookFinishingMachines
        );
        console.log(
          "Selected wide format finishing machines:",
          selectedWideFormatFinishingMachines
        );
        console.log(
          "Selected DTF & sublimation finishing machines:",
          selectedDtfSublimationFinishingMachines
        );
        console.log(
          "Selected roll/flexo finishing machines:",
          selectedRollFlexoFinishingMachines
        );
        console.log("Selected packaging machines:", selectedPackagingMachines);
        alert("Setup completed!");
        return true;
      }
    },
    [currentStep, getNextStep]
  );

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const isNextDisabled = useCallback(
    (
      selectedMachines: SelectedMachine[],
      selectedFinishingMachines: SelectedFinishingMachine[],
      selectedBookFinishingMachines: SelectedFinishingMachine[],
      selectedWideFormatFinishingMachines: SelectedFinishingMachine[],
      selectedDtfSublimationFinishingMachines: SelectedFinishingMachine[],
      selectedRollFlexoFinishingMachines: SelectedFinishingMachine[],
      selectedPackagingMachines: SelectedFinishingMachine[]
    ): boolean => {
      if (currentStep === 0) {
        return selectedMachines.length === 0;
      } else if (currentStep === 1) {
        return (
          hasDigitalOrOffsetPrinting(selectedMachines) &&
          selectedFinishingMachines.length === 0
        );
      } else if (currentStep === 2) {
        return (
          hasDigitalOrOffsetPrinting(selectedMachines) &&
          selectedBookFinishingMachines.length === 0
        );
      } else if (currentStep === 3) {
        return (
          hasRollOrFlexoPrinting(selectedMachines) &&
          selectedRollFlexoFinishingMachines.length === 0
        );
      } else if (currentStep === 4) {
        return (
          hasWidePrinting(selectedMachines) &&
          selectedWideFormatFinishingMachines.length === 0
        );
      } else if (currentStep === 5) {
        return (
          hasDtfOrSublimationPrinting(selectedMachines) &&
          selectedDtfSublimationFinishingMachines.length === 0
        );
      } else if (currentStep === 6) {
        return false; // Step 7 (packaging) is optional, so never disabled
      }
      return false;
    },
    [currentStep]
  );

  // Helper functions to determine which steps should be shown
  const shouldShowStep2 = useCallback(
    (selectedMachines: SelectedMachine[]): boolean => {
      return hasDigitalOrOffsetPrinting(selectedMachines);
    },
    [hasDigitalOrOffsetPrinting]
  );

  const shouldShowStep3 = useCallback(
    (selectedMachines: SelectedMachine[]): boolean => {
      return hasDigitalOrOffsetPrinting(selectedMachines);
    },
    [hasDigitalOrOffsetPrinting]
  );

  const shouldShowStep4 = useCallback(
    (selectedMachines: SelectedMachine[]): boolean => {
      return hasRollOrFlexoPrinting(selectedMachines);
    },
    [hasRollOrFlexoPrinting]
  );

  const shouldShowStep5 = useCallback(
    (selectedMachines: SelectedMachine[]): boolean => {
      return hasWidePrinting(selectedMachines);
    },
    [hasWidePrinting]
  );

  const shouldShowStep6 = useCallback(
    (selectedMachines: SelectedMachine[]): boolean => {
      return hasDtfOrSublimationPrinting(selectedMachines);
    },
    [hasDtfOrSublimationPrinting]
  );

  const getNextButtonText = useCallback(
    (selectedMachines: SelectedMachine[]) => {
      // Show "Complete Setup" on the final step (step 6)
      return currentStep === 6 ? "Complete Setup" : "Next";
    },
    [currentStep]
  );

  return {
    currentStep,
    steps,
    hasDigitalOrOffsetPrinting,
    hasRollOrFlexoPrinting,
    hasWidePrinting,
    hasDtfOrSublimationPrinting,
    shouldShowStep2,
    shouldShowStep3,
    shouldShowStep4,
    shouldShowStep5,
    shouldShowStep6,
    handleNext,
    handleBack,
    isNextDisabled,
    getNextButtonText,
  };
};
