import { Dispatch, SetStateAction, useMemo } from "react";
import { useSetupSteps } from "./use-setup-steps";
import { Box, Typography, useTheme } from "@mui/material";
import { SummarySection } from "./summery";
import { PrimaryButton } from "@/components/button/primary-button";
import { setupStepsConfig } from "./data";
import { useStyle } from "../style";

const StyledCheckboxItem = ({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) => {
  const theme = useTheme();
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

const renderOptions = (
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

export const SetupSteps = () => {
  const { classes } = useStyle();
  const {
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
    setSelectedDigitalOffsetActions,
    setSelectedBookFinishingActions,
    setSelectedRollActions,
    setSelectedWidePrinterActions,
    setSelectedDTFActions,
    setSelectedPacking,
    setStepIndex,
    handleMethodToggle,
    onSave,
  } = useSetupSteps();

  const stepConfig = setupStepsConfig.find((s) => s.type === currentStep.type);

  const getSelectedAndSetter = (type: string) => {
    switch (type) {
      case "finishing-digital-offset":
        return [selectedDigitalOffsetActions, setSelectedDigitalOffsetActions];
      case "book-finishing":
        return [selectedBookFinishingActions, setSelectedBookFinishingActions];
      case "finishing-roll":
        return [selectedRollActions, setSelectedRollActions];
      case "finishing-wide":
        return [selectedWidePrinterActions, setSelectedWidePrinterActions];
      case "finishing-dtf":
        return [selectedDTFActions, setSelectedDTFActions];
      case "packing":
        return [selectedPacking, setSelectedPacking];
      default:
        return [[], () => {}];
    }
  };

  const [selectedArray, setSelectedArray] = getSelectedAndSetter(
    currentStep.type
  ) as [string[], Dispatch<SetStateAction<string[]>>];

  const displayedOptions = useMemo(() => {
    if (!stepConfig?.options) return [];
    if (stepConfig.filter && stepConfig.filter.condition(selectedMethods)) {
      return stepConfig.options.filter(
        (opt) => !stepConfig.filter!.exclude.includes(opt)
      );
    }
    return stepConfig.options;
  }, [stepConfig, selectedMethods]);

  const handleToggle = (item: string) => {
    if (!setSelectedArray || !selectedArray) return;
    setSelectedArray(
      selectedArray.includes(item)
        ? selectedArray.filter((i) => i !== item)
        : [...selectedArray, item]
    );
  };

  const nextButton = (
    <PrimaryButton
      variant="contained"
      style={{ width: 90 }}
      onClick={() => setStepIndex(stepIndex + 1)}
      disabled={currentStep.type === "methods" && selectedMethods.length === 0}
    >
      {stepIndex === steps.length - 1 ? "Finish" : "Next"}
    </PrimaryButton>
  );

  const backButton = (
    <PrimaryButton
      style={{ width: 90 }}
      variant="text"
      onClick={() => setStepIndex(stepIndex - 1)}
    >
      Back
    </PrimaryButton>
  );

  return (
    <Box sx={classes.mainBox}>
      {/* Scrollable Content Area */}
      <Box
        sx={{
          padding: currentStep.type === "summary" ? 4 : 2,
          overflowY: "auto",
          flex: 1,
        }}
      >
        {currentStep.type === "summary" ? (
          <SummarySection
            selectedMethods={selectedMethods}
            selectedDigitalOffsetActions={selectedDigitalOffsetActions}
            selectedBookFinishingActions={selectedBookFinishingActions}
            selectedRollActions={selectedRollActions}
            selectedWidePrinterActions={selectedWidePrinterActions}
            selectedDTFActions={selectedDTFActions}
            selectedPacking={selectedPacking}
          />
        ) : (
          <>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              {stepConfig?.label}
            </Typography>
            {renderOptions(
              stepConfig?.type === "methods"
                ? stepConfig.options!
                : displayedOptions,
              stepConfig?.type === "methods" ? selectedMethods : selectedArray,
              stepConfig?.type === "methods" ? handleMethodToggle : handleToggle
            )}
          </>
        )}
      </Box>
      {/* Sticky Footer */}
      <Box
        sx={{
          padding: 2,
          // borderTop: "1px solid #e0e0e0",
          display: "flex",
          justifyContent:
            currentStep.type === "summary" ? "flex-end" : "space-between",
          backgroundColor: "#fff",
        }}
      >
        {currentStep.type === "summary" ? (
          <>
            <PrimaryButton onClick={() => setStepIndex(0)}>
              Start Over
            </PrimaryButton>
            <PrimaryButton
              variant="contained"
              style={{ width: 90 }}
              sx={{ ml: 2 }}
              onClick={onSave}
            >
              Save
            </PrimaryButton>
          </>
        ) : (
          <>
            {stepIndex > 0 && backButton}
            {nextButton}
          </>
        )}
      </Box>
    </Box>
  );
};
