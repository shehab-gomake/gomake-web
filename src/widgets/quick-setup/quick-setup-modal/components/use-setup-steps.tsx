import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { isUsPrintHouseState } from "@/store/print-house-profile";
import { getSetupStepsConfig, Step } from "./workflowStepsConfig";
import { savePrintHouseProductsSetupFormApi } from "@/services/api-service/admin-service/print-houses-controller";
import { useCustomer, useGomakeAxios, useSnackBar } from "@/hooks";
import { ProductsSetupData } from "../../interfaces";
import { ModalControls, useModal } from "@/hooks/use-modal";

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

const useSetupSteps = (
  initialData: ProductsSetupData,
  ActionsModal: ModalControls
) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const dir: "rtl" | "ltr" = t("direction");
  const isRtl = dir === "rtl";
  const { alertFaultUpdate } = useSnackBar();
  const confirmSetupProducts = useModal();
  const { getPrintHouseSetupSteps } = useCustomer();
  const isUs = useRecoilValue<any>(isUsPrintHouseState);

  const setupStepsConfig = useMemo(() => getSetupStepsConfig(isUs), [isUs]);
  const [stepIndex, setStepIndex] = useState(0);
  const [manualWidth, setManualWidth] = useState("");
  const [manualHeight, setManualHeight] = useState("");
  const [selectedMethods, setSelectedMethods] = useState<string[]>(
    initialData?.printingMethods || []
  );
  const [selectedDigitalOffsetActions, setSelectedDigitalOffsetActions] =
    useState<string[]>(
      initialData?.finishingActions?.digital_offset_printing || []
    );
  const [selectedBookFinishingActions, setSelectedBookFinishingActions] =
    useState<string[]>(initialData?.bookFinishingActions || []);
  const [selectedRollActions, setSelectedRollActions] = useState<string[]>(
    initialData?.finishingActions?.roll_printing || []
  );
  const [selectedWidePrinterActions, setSelectedWidePrinterActions] = useState<
    string[]
  >(initialData?.finishingActions?.wide_printer || []);
  const [selectedDTFActions, setSelectedDTFActions] = useState<string[]>(
    initialData?.finishingActions?.dtf_sublimation || []
  );
  const [selectedPacking, setSelectedPacking] = useState<string[]>(
    initialData?.packingMethods || []
  );
  const [materialDigitalOffset, setMaterialDigitalOffset] = useState<string[]>(
    initialData?.materials?.digital_offset || []
  );
  const [materialRollMaxWidth, setMaterialRollMaxWidth] = useState<string>(
    initialData?.materials?.roll?.maxWidth || ""
  );
  const [materialWide, setMaterialWide] = useState<string[]>(
    initialData?.materials?.wide_printer?.types || []
  );
  const [materialWideMaxWidth, setMaterialWideMaxWidth] = useState<string>(
    initialData?.materials?.wide_printer?.maxWidth || ""
  );
  const [materialWideMaxLength, setMaterialWideMaxLength] = useState<string>(
    initialData?.materials?.wide_printer?.maxLength || ""
  );

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

  const savePrintHouseProductsSetupForm = async (data) => {
    const callBack = (res) => {
      if (res.success) {
        ActionsModal.close();
        getPrintHouseSetupSteps(); //!here
      } else {
        alertFaultUpdate();
      }
    };
    await savePrintHouseProductsSetupFormApi(callApi, callBack, data);
  };

  const removeEmptyFields = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.filter((item) => item != null && item !== "");
    } else if (typeof obj === "object" && obj !== null) {
      return Object.entries(obj)
        .filter(
          ([_, value]) =>
            value != null &&
            value !== "" &&
            !(Array.isArray(value) && value.length === 0) &&
            !(
              typeof value === "object" &&
              Object.keys(removeEmptyFields(value)).length === 0
            )
        )
        .reduce((acc, [key, value]) => {
          acc[key] = removeEmptyFields(value);
          return acc;
        }, {} as any);
    }
    return obj;
  };

  const onSave = (isConfirmed = false) => {
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

    if (
      selectedMethods.includes("dtf_sublimation") &&
      selectedDTFActions.length > 0
    ) {
      finishingMachines["dtf_sublimation"] = selectedDTFActions;
    }

    const rawData = {
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

    const cleanedData = removeEmptyFields(rawData);
    savePrintHouseProductsSetupForm({
      isConfirmed,
      submissionData: cleanedData,
    });
  };

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
    confirmSetupProducts,
  };
};

export { useSetupSteps };
