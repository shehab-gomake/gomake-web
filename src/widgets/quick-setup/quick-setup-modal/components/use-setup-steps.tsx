import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { isUsPrintHouseState } from "@/store/print-house-profile";
import { getSetupStepsConfig, Step } from "./workflowStepsConfig";

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
        userSelect: "none",
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

export const renderOptions = (
  t: (key: string) => string,
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
    {options.map((item) => {
      const label = isCustom?.(item) ? item : t(`quickSetup.options.${item}`);

      return (
        <StyledSelectableChip
          key={item}
          label={label}
          checked={selected.includes(item)}
          onClick={() => toggle(item)}
          onRemove={remove && isCustom?.(item) ? () => remove(item) : undefined}
        />
      );
    })}
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

  const hasOffsetPrinting = selectedMethods.includes("offset_printing");
  const hasRollPrinting =
    selectedMethods.includes("roll_digital_printing") ||
    selectedMethods.includes("roll_offset_printing") ||
    selectedMethods.includes("flexo_printing");

  const handleMethodToggle = (method: string) => {
    setSelectedMethods((prev) => {
      const updated = prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method];

      if (!updated.includes("wide_printer")) {
        setSelectedWidePrinterActions([]);
        setMaterialWide([]);
        setMaterialWideMaxWidth("");
        setMaterialWideMaxLength("");
      }

      if (
        !(
          updated.includes("roll_digital_printing") ||
          updated.includes("roll_offset_printing") ||
          updated.includes("flexo_printing")
        )
      ) {
        setSelectedRollActions([]);
        setMaterialRollMaxWidth("");
      }

      if (!updated.includes("dtf_sublimation")) {
        setSelectedDTFActions([]);
      }

      if (
        !updated.includes("digital_printing") &&
        !updated.includes("offset_printing")
      ) {
        setSelectedDigitalOffsetActions([]);
        setSelectedBookFinishingActions([]);
        setMaterialDigitalOffset([]);
      } else {
        if (
          updated.includes("digital_printing") &&
          !updated.includes("offset_printing")
        ) {
          setSelectedDigitalOffsetActions((prev) =>
            prev.filter((a) => a !== "plate_processor")
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

    if (
      selectedMethods.includes("digital_printing") ||
      selectedMethods.includes("offset_printing")
    ) {
      finishingMachines["digital_offset_printing"] =
        selectedDigitalOffsetActions;
    }

    if (hasRollPrinting && selectedRollActions.length > 0) {
      finishingMachines["roll_printing"] = selectedRollActions;
    }

    if (
      selectedMethods.includes("wide_printer") &&
      selectedWidePrinterActions.length > 0
    ) {
      finishingMachines["wide_printer"] = selectedWidePrinterActions;
    }

    debugger;
    if (
      selectedMethods.includes("dtf_sublimation") &&
      selectedDTFActions.length > 0
    ) {
      finishingMachines["dtf_sublimation"] = selectedDTFActions;
    }

    const result = {
      printingMethods: selectedMethods,
      finishingActions: finishingMachines,
      bookFinishingActions: selectedBookFinishingActions,
      materials: {
        digital_offset: materialDigitalOffset,
        roll: {
          maxWidth: materialRollMaxWidth,
        },
        wide_printer: {
          types: materialWide,
          maxWidth: materialWideMaxWidth,
          maxLength: materialWideMaxLength,
        },
      },
      packingMethods: selectedPacking,
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
