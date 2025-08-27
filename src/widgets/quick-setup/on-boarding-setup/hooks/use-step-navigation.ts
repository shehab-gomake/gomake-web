import { useState, useCallback } from "react";
import {
  SelectedMachine,
  SelectedFinishingMachine,
} from "@/widgets/quick-setup/on-boarding-setup/types";
import { STEPS_CONFIG } from "@/widgets/quick-setup/on-boarding-setup/steps-config";

export const useStepNavigation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { steps } = STEPS_CONFIG;

  // Check if we have digital or offset printing machines
  const hasDigitalOrOffsetPrinting = (
    selectedMachines: SelectedMachine[]
  ): boolean => {
    return selectedMachines.some((machine) => {
      const categoryName = machine.categoryName.toLowerCase();
      return (
        categoryName.includes("digital") || categoryName.includes("offset")
      );
    });
  };

  // Check if we have roll or flexo printing machines
  const hasRollOrFlexoPrinting = (
    selectedMachines: SelectedMachine[]
  ): boolean => {
    return selectedMachines.some((machine) => {
      const categoryName = machine.categoryName.toLowerCase();
      return categoryName.includes("roll") || categoryName.includes("flexo");
    });
  };

  // Check if we have wide printing machines
  const hasWidePrinting = (selectedMachines: SelectedMachine[]): boolean => {
    return selectedMachines.some((machine) => {
      const categoryName = machine.categoryName.toLowerCase();
      return categoryName.includes("wide");
    });
  };

  // Check if we have DTF or sublimation printing machines
  const hasDtfOrSublimationPrinting = (
    selectedMachines: SelectedMachine[]
  ): boolean => {
    return selectedMachines.some((machine) => {
      const categoryName = machine.categoryName.toLowerCase();
      return (
        categoryName.includes("dtf") || categoryName.includes("sublimation")
      );
    });
  };

  const handleNext = useCallback(
    (
      selectedMachines: SelectedMachine[],
      selectedFinishingMachines: SelectedFinishingMachine[],
      selectedBookFinishingMachines: SelectedFinishingMachine[],
      selectedWideFormatFinishingMachines: SelectedFinishingMachine[],
      selectedDtfSublimationFinishingMachines: SelectedFinishingMachine[],
      selectedRollFlexoFinishingMachines: SelectedFinishingMachine[]
    ) => {
      if (currentStep === 0) {
        // Validate step 1 - only require at least one machine
        if (selectedMachines.length === 0) {
          alert("Please select at least one machine");
          return false;
        }
        setCurrentStep(1);
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
        setCurrentStep(2);
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
        setCurrentStep(3);
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
        setCurrentStep(4);
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
        setCurrentStep(5);
        return true;
      } else {
        // Step 6 - Validate DTF/sublimation finishing machines if we have DTF/sublimation printing
        if (
          hasDtfOrSublimationPrinting(selectedMachines) &&
          selectedDtfSublimationFinishingMachines.length === 0
        ) {
          alert(
            "Please select at least one finishing machine for DTF & Sublimation printing"
          );
          return false;
        }
        // Step 6 - Save or complete
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
        alert("Setup completed!");
        return true;
      }
    },
    [currentStep]
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
      selectedRollFlexoFinishingMachines: SelectedFinishingMachine[]
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
      }
      return false;
    },
    [currentStep]
  );

  const getNextButtonText = useCallback(() => {
    return currentStep === steps.length - 1 ? "Complete Setup" : "Next";
  }, [currentStep, steps.length]);

  return {
    currentStep,
    steps,
    hasDigitalOrOffsetPrinting,
    hasRollOrFlexoPrinting,
    hasWidePrinting,
    hasDtfOrSublimationPrinting,
    handleNext,
    handleBack,
    isNextDisabled,
    getNextButtonText,
  };
};
