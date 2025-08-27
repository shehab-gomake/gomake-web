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

  const handleNext = useCallback(
    (
      selectedMachines: SelectedMachine[],
      selectedFinishingMachines: SelectedFinishingMachine[],
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
      } else {
        // Step 3 - Validate roll/flexo finishing machines if we have roll/flexo printing
        if (
          hasRollOrFlexoPrinting(selectedMachines) &&
          selectedRollFlexoFinishingMachines.length === 0
        ) {
          alert(
            "Please select at least one finishing machine for Roll/Flexo printing"
          );
          return false;
        }
        // Step 3 - Save or complete
        console.log("Selected machines:", selectedMachines);
        console.log("Selected finishing machines:", selectedFinishingMachines);
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
          hasRollOrFlexoPrinting(selectedMachines) &&
          selectedRollFlexoFinishingMachines.length === 0
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
    handleNext,
    handleBack,
    isNextDisabled,
    getNextButtonText,
  };
};
