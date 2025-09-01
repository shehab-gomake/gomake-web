import { useCallback } from "react";
import {
  SelectedMachine,
  SelectedFinishingMachine,
} from "@/widgets/quick-setup/on-boarding-setup/types";
import { useDynamicSteps, DynamicStep } from "./use-dynamic-steps";

export const useStepNavigation = (
  currentStep: number,
  setCurrentStep: (step: number) => void,
  selectedMachines: SelectedMachine[]
) => {
  const {
    dynamicSteps,
    getNextStepId,
    getPreviousStepId,
    hasDigitalOrOffsetPrinting,
    hasRollOrFlexoPrinting,
    hasWidePrinting,
    hasDtfOrSublimationPrinting,
  } = useDynamicSteps(selectedMachines, currentStep);

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
        const nextStepId = getNextStepId(currentStep);
        setCurrentStep(nextStepId);
        return true;
      } else if (currentStep === 1) {
        // Step 2 - Validate finishing machines if we have digital/offset printing
        if (
          hasDigitalOrOffsetPrinting() &&
          selectedFinishingMachines.length === 0
        ) {
          alert(
            "Please select at least one finishing machine for Digital/Offset printing"
          );
          return false;
        }
        const nextStepId = getNextStepId(currentStep);
        setCurrentStep(nextStepId);
        return true;
      } else if (currentStep === 2) {
        // Step 3 - Validate book finishing machines if we have digital/offset printing
        if (
          hasDigitalOrOffsetPrinting() &&
          selectedBookFinishingMachines.length === 0
        ) {
          alert(
            "Please select at least one book finishing machine for Digital/Offset printing"
          );
          return false;
        }
        const nextStepId = getNextStepId(currentStep);
        setCurrentStep(nextStepId);
        return true;
      } else if (currentStep === 3) {
        // Step 4 - Validate roll/flexo finishing machines if we have roll/flexo printing
        if (
          hasRollOrFlexoPrinting() &&
          selectedRollFlexoFinishingMachines.length === 0
        ) {
          alert(
            "Please select at least one finishing machine for Roll/Flexo printing"
          );
          return false;
        }
        const nextStepId = getNextStepId(currentStep);
        setCurrentStep(nextStepId);
        return true;
      } else if (currentStep === 4) {
        // Step 5 - Validate wide format finishing machines if we have wide printing
        if (
          hasWidePrinting() &&
          selectedWideFormatFinishingMachines.length === 0
        ) {
          alert(
            "Please select at least one finishing machine for Wide format printing"
          );
          return false;
        }
        const nextStepId = getNextStepId(currentStep);
        setCurrentStep(nextStepId);
        return true;
      } else if (currentStep === 5) {
        // Step 6 - Only validate if we have DTF/sublimation printing machines
        if (
          hasDtfOrSublimationPrinting() &&
          selectedDtfSublimationFinishingMachines.length === 0
        ) {
          alert(
            "Please select at least one finishing machine for DTF & Sublimation printing"
          );
          return false;
        }
        const nextStepId = getNextStepId(currentStep);
        setCurrentStep(nextStepId);
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
        // alert("Setup completed!");
        return true;
      }
    },
    [
      currentStep,
      getNextStepId,
      setCurrentStep,
      hasDigitalOrOffsetPrinting,
      hasRollOrFlexoPrinting,
      hasWidePrinting,
      hasDtfOrSublimationPrinting,
    ]
  );

  const handleBack = useCallback(() => {
    const previousStepId = getPreviousStepId(currentStep);
    setCurrentStep(previousStepId);
  }, [currentStep, getPreviousStepId, setCurrentStep]);

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
          hasDigitalOrOffsetPrinting() && selectedFinishingMachines.length === 0
        );
      } else if (currentStep === 2) {
        return (
          hasDigitalOrOffsetPrinting() &&
          selectedBookFinishingMachines.length === 0
        );
      } else if (currentStep === 3) {
        return (
          hasRollOrFlexoPrinting() &&
          selectedRollFlexoFinishingMachines.length === 0
        );
      } else if (currentStep === 4) {
        return (
          hasWidePrinting() && selectedWideFormatFinishingMachines.length === 0
        );
      } else if (currentStep === 5) {
        return (
          hasDtfOrSublimationPrinting() &&
          selectedDtfSublimationFinishingMachines.length === 0
        );
      } else if (currentStep === 6) {
        return false; // Step 7 (packaging) is optional, so never disabled
      }
      return false;
    },
    [
      currentStep,
      hasDigitalOrOffsetPrinting,
      hasRollOrFlexoPrinting,
      hasWidePrinting,
      hasDtfOrSublimationPrinting,
    ]
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
    dynamicSteps,
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
