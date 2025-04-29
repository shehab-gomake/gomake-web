import { useMemo, useState } from "react";
import { Step } from "./data";

const useSetupSteps = () => {
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [selectedDigitalOffsetActions, setSelectedDigitalOffsetActions] =
    useState<string[]>([]);
  const [selectedBookFinishingActions, setSelectedBookFinishingActions] =
    useState<string[]>([]);
  const [selectedRollActions, setSelectedRollActions] = useState<string[]>([]);
  const [selectedWidePrinterActions, setSelectedWidePrinterActions] = useState<
    string[]
  >([]);
  const [selectedDTFActions, setSelectedDTFActions] = useState<string[]>([]);
  const [selectedPacking, setSelectedPacking] = useState<string[]>([]);
  const [stepIndex, setStepIndex] = useState(0);

  const hasDigitalOrOffset =
    selectedMethods.includes("Digital Printing") ||
    selectedMethods.includes("Offset Printing");
  const hasOffsetPrinting = selectedMethods.includes("Offset Printing");
  const hasRollPrinting =
    selectedMethods.includes("Roll Digital Printing") ||
    selectedMethods.includes("Roll Offset Printing") ||
    selectedMethods.includes("Flexo Printing");
  const hasWidePrinter = selectedMethods.includes("Wide Printer");
  const hasDTF = selectedMethods.includes("DTF & Sublimation");

  const steps: Step[] = useMemo(() => {
    if (selectedMethods.length === 0) return [{ type: "methods" }];
    const newSteps: Step[] = [{ type: "methods" }];

    if (hasDigitalOrOffset) {
      newSteps.push({ type: "finishing-digital-offset" });
      newSteps.push({ type: "book-finishing" });
    }
    if (hasRollPrinting) {
      newSteps.push({ type: "finishing-roll" });
    }
    if (hasWidePrinter) {
      newSteps.push({ type: "finishing-wide" });
    }
    if (hasDTF) {
      newSteps.push({ type: "finishing-dtf" });
    }

    newSteps.push({ type: "packing" });
    newSteps.push({ type: "summary" });

    return newSteps;
  }, [selectedMethods]);

  const currentStep = steps[stepIndex];

  const goNextStep = () => {
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goPreviousStep = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleMethodToggle = (method: string) => {
    setSelectedMethods((prev) => {
      let updated: string[];
      if (prev.includes(method)) {
        updated = prev.filter((m) => m !== method);
      } else {
        updated = [...prev, method];
      }

      // Check if Wide Printer was removed
      if (!updated.includes("Wide Printer")) {
        setSelectedWidePrinterActions([]);
      }

      // Check if Roll Printing methods were removed
      if (
        !(
          updated.includes("Roll Digital Printing") ||
          updated.includes("Roll Offset Printing") ||
          updated.includes("Flexo Printing")
        )
      ) {
        setSelectedRollActions([]);
      }

      // Check if DTF was removed
      if (!updated.includes("DTF & Sublimation")) {
        setSelectedDTFActions([]);
      }

      // Check if Digital or Offset removed
      if (
        !(
          updated.includes("Digital Printing") ||
          updated.includes("Offset Printing")
        )
      ) {
        setSelectedDigitalOffsetActions([]);
        setSelectedBookFinishingActions([]);
      } else {
        // If only Digital Printing is left, remove "Plate Processor" from selectedDigitalOffsetActions
        if (
          updated.includes("Digital Printing") &&
          !updated.includes("Offset Printing")
        ) {
          setSelectedDigitalOffsetActions((prev) =>
            prev.filter((a) => a !== "Plate Processor")
          );
        }
      }

      return updated;
    });
  };

  return {
    selectedMethods,
    selectedDigitalOffsetActions,
    selectedBookFinishingActions,
    selectedRollActions,
    selectedWidePrinterActions,
    selectedDTFActions,
    selectedPacking,
    stepIndex,
    steps,
    currentStep,
    setSelectedMethods,
    setSelectedDigitalOffsetActions,
    setSelectedBookFinishingActions,
    setSelectedRollActions,
    setSelectedWidePrinterActions,
    setSelectedDTFActions,
    setSelectedPacking,
    setStepIndex,
    handleMethodToggle,
    goNextStep,
    goPreviousStep,
    hasOffsetPrinting,
  };
};

export { useSetupSteps };
