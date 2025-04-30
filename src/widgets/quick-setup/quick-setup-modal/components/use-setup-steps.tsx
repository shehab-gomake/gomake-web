import { useMemo, useState } from "react";
import { getSetupStepsConfig, Step } from "./data";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { isUsPrintHouseState } from "@/store/print-house-profile";

export const StyledCheckboxItem = ({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px 16px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: 500,
        border: checked ? "1px solid #2E3092" : "1px solid #E0E0E0",
        backgroundColor: checked ? "#EFF0FF" : "#F9FAFB",
        color: checked ? "#2E3092" : "#333",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: "#2E3092",
        },
      }}
    >
      {label}
    </Box>
  );
};

export const StyledSelectableChip = ({
  label,
  checked,
  onClick,
  onRemove,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
  onRemove?: () => void;
}) => {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        padding: "10px 16px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: 500,
        border: checked ? "1px solid #2E3092" : "1px solid #E0E0E0",
        backgroundColor: checked ? "#EFF0FF" : "#F9FAFB",
        color: checked ? "#2E3092" : "#333",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: "#2E3092",
        },
        position: "relative",
        pr: onRemove ? "28px" : undefined,
      }}
      onClick={onClick}
    >
      {label}
      {onRemove && (
        <Box
          sx={{
            pr: "4px",
            position: "absolute",
            top: "4px",
            right: "4px",
            fontSize: "12px",
            cursor: "pointer",
            color: "#999",
            "&:hover": {
              color: "#000",
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          ✕
        </Box>
      )}
    </Box>
  );
};

export const renderOptionsOld = (
  options: string[],
  selected: string[],
  toggle: (item: string) => void
) => (
  <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2,
    }}
  >
    {options.map((item) => (
      <StyledCheckboxItem
        key={item}
        label={item}
        checked={selected.includes(item)}
        onClick={() => toggle(item)}
      />
    ))}
  </Box>
);

export const renderOptions = (
  options: string[],
  selected: string[],
  toggle: (item: string) => void,
  remove?: (item: string) => void,
  isCustom?: (item: string) => boolean // 👈 NEW
) => (
  <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2,
    }}
  >
    {options.map((item) => (
      <StyledSelectableChip
        key={item}
        label={item}
        checked={selected.includes(item)}
        onClick={() => toggle(item)}
        onRemove={
          remove && isCustom?.(item) ? () => remove(item) : undefined // 👈 Don't pass if not custom
        }
      />
    ))}
  </Box>
);

const useSetupSteps = () => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRtl = dir === "rtl";

  const isUs = useRecoilValue<any>(isUsPrintHouseState);
  const setupStepsConfig = useMemo(() => getSetupStepsConfig(isUs), [isUs]);

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
  const hasOffsetPrinting = selectedMethods.includes("Offset Printing");
  const hasRollPrinting =
    selectedMethods.includes("Roll Digital Printing") ||
    selectedMethods.includes("Roll Offset Printing") ||
    selectedMethods.includes("Flexo Printing");

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

      if (!updated.includes("Wide Printer")) {
        setSelectedWidePrinterActions([]);
        setMaterialWide([]);
        setMaterialWideMaxWidth("");
        setMaterialWideMaxLength("");
      }

      if (
        !(
          updated.includes("Roll Digital Printing") ||
          updated.includes("Roll Offset Printing") ||
          updated.includes("Flexo Printing")
        )
      ) {
        setSelectedRollActions([]);
        setMaterialRollMaxWidth("");
      }

      if (!updated.includes("DTF & Sublimation")) {
        setSelectedDTFActions([]);
      }

      if (
        !(
          updated.includes("Digital Printing") ||
          updated.includes("Offset Printing")
        )
      ) {
        setSelectedDigitalOffsetActions([]);
        setSelectedBookFinishingActions([]);
        setMaterialDigitalOffset([]);
      } else {
        // Special case: only Digital remains
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

  const steps: Step[] = useMemo(() => {
    return setupStepsConfig
      .filter((step) => {
        if (!step.dependsOn) return true;
        return step.dependsOn.some((m) => selectedMethods.includes(m));
      })
      .map((s) => ({ type: s.type }));
  }, [selectedMethods]);

  const currentStep = steps[stepIndex];

  const onSave = () => {
    const finishingMachines: Record<string, string[]> = {};

    if (selectedMethods.includes("Digital Printing")) {
      finishingMachines["Digital Printing"] = selectedDigitalOffsetActions;
    }

    if (selectedMethods.includes("Offset Printing")) {
      finishingMachines["Offset Printing"] = selectedDigitalOffsetActions;
    }

    if (hasRollPrinting) {
      if (selectedRollActions.length > 0) {
        finishingMachines["Roll Printing"] = selectedRollActions;
      }
    }

    if (
      selectedMethods.includes("Wide Printer") &&
      selectedWidePrinterActions.length > 0
    ) {
      finishingMachines["Wide Printer"] = selectedWidePrinterActions;
    }

    if (
      selectedMethods.includes("DTF & Sublimation") &&
      selectedDTFActions.length > 0
    ) {
      finishingMachines["DTF & Sublimation"] = selectedDTFActions;
    }

    const result = {
      printingMethods: selectedMethods,
      finishingActions: {
        "Digital Printing": selectedDigitalOffsetActions,
        "Offset Printing": selectedDigitalOffsetActions,
        "Roll Printing": selectedRollActions,
        "Wide Printer": selectedWidePrinterActions,
        "DTF & Sublimation": selectedDTFActions,
      },
      bookFinishingActions: selectedBookFinishingActions,
      packingMethods: selectedPacking,
      materials: {
        "Digital/Offset": materialDigitalOffset,
        Roll: {
          maxWidth: materialRollMaxWidth,
        },
        "Wide Printer": {
          types: materialWide,
          maxWidth: materialWideMaxWidth,
          maxLength: materialWideMaxLength,
        },
      },
    };
    console.log("FINAL RESULT:", result);
  };

  const [materialDigitalOffset, setMaterialDigitalOffset] = useState<string[]>(
    []
  );
  const [materialRollMaxWidth, setMaterialRollMaxWidth] = useState<string>(""); // or number
  const [materialWide, setMaterialWide] = useState<string[]>([]);
  const [materialWideMaxWidth, setMaterialWideMaxWidth] = useState<string>("");
  const [materialWideMaxLength, setMaterialWideMaxLength] =
    useState<string>("");

  const [manualWidth, setManualWidth] = useState("");
  const [manualHeight, setManualHeight] = useState("");

  return {
    t,
    dir,
    isRtl,
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
    onSave,
    materialDigitalOffset,
    setMaterialDigitalOffset,
    materialRollMaxWidth,
    setMaterialRollMaxWidth,
    materialWide,
    setMaterialWide,
    materialWideMaxWidth,
    setMaterialWideMaxWidth,
    materialWideMaxLength,
    setMaterialWideMaxLength,
    manualWidth,
    setManualWidth,
    manualHeight,
    setManualHeight,
    isUs,
    setupStepsConfig,
  };
};

export { useSetupSteps };
