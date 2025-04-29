import { useMemo } from "react";
import {
  bookFinishingActions,
  finishingActionsDigitalOffset,
  finishingActionsDTF,
  finishingActionsRollPrinting,
  finishingActionsWidePrinter,
  packingMethods,
} from "./data";
import { useSetupSteps } from "./use-setup-steps";
import { Box, Typography, Button, Grid, Paper, useTheme } from "@mui/material";
import { SummarySection } from "./summery";
import { PrimaryButton } from "@/components/button/primary-button";

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
    <Paper
      onClick={onClick}
      elevation={checked ? 6 : 1}
      sx={{
        padding: 2,
        borderRadius: 2,
        border: checked ? `2px solid #2e3092d1` : "1px solid #E0E0E0",
        backgroundColor: checked ? "#F3F4F6" : "#fff",
        cursor: "pointer",
        textAlign: "center",
        fontWeight: checked ? "bold" : "normal",
        userSelect: "none",
      }}
    >
      {label}
    </Paper>
  );
};

const renderOptions = (
  options: string[],
  selected: string[],
  toggle: (item: string) => void
) => (
  <Grid container spacing={2}>
    {options.map((item) => (
      <Grid item xs={6} sm={4} key={item}>
        <StyledCheckboxItem
          label={item}
          checked={selected.includes(item)}
          onClick={() => toggle(item)}
        />
      </Grid>
    ))}
  </Grid>
);

export const SetupSteps = () => {
  const {
    hasOffsetPrinting,
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
  } = useSetupSteps();

  const handleToggle = (
    selected: string[],
    setSelected: (val: string[]) => void,
    item: string
  ) => {
    setSelected(
      selected.includes(item)
        ? selected.filter((x) => x !== item)
        : [...selected, item]
    );
  };

  const nextButton = (
    <PrimaryButton
      variant="contained"
      style={{
        width: 90,
      }}
      onClick={() => setStepIndex(stepIndex + 1)}
      disabled={currentStep.type === "methods" && selectedMethods.length === 0}
    >
      {stepIndex === steps.length - 1 ? "Finish" : "Next"}
    </PrimaryButton>
  );

  const backButton = (
    <PrimaryButton
      style={{
        width: 90,
      }}
      variant="text"
      onClick={() => setStepIndex(stepIndex - 1)}
      sx={{ ml: 2 }}
    >
      Back
    </PrimaryButton>
  );

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        padding: 4,
        borderRadius: 4,
        maxWidth: 800,
        margin: "auto",
        boxShadow: 3,
      }}
    >
      {currentStep.type === "methods" && (
        <>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Select Printing Methods
          </Typography>
          {renderOptions(
            [
              "Digital Printing",
              "Offset Printing",
              "Roll Digital Printing",
              "Roll Offset Printing",
              "Flexo Printing",
              "Wide Printer",
              "DTF & Sublimation",
            ],
            selectedMethods,
            handleMethodToggle
          )}
          <Box
            mt={4}
            sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
          >
            {nextButton}
          </Box>
        </>
      )}

      {currentStep.type === "finishing-digital-offset" && (
        <>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Select Finishing Actions (Digital/Offset)
          </Typography>
          {renderOptions(
            hasOffsetPrinting
              ? finishingActionsDigitalOffset
              : finishingActionsDigitalOffset.filter(
                  (a) => a !== "Plate Processor"
                ),
            selectedDigitalOffsetActions,
            (item) =>
              handleToggle(
                selectedDigitalOffsetActions,
                setSelectedDigitalOffsetActions,
                item
              )
          )}
          <Box mt={4} sx={{ display: "flex", justifyContent: "space-between" }}>
            {backButton}
            {nextButton}
          </Box>
        </>
      )}

      {currentStep.type === "book-finishing" && (
        <>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Select Book Finishing Actions
          </Typography>
          {renderOptions(
            bookFinishingActions,
            selectedBookFinishingActions,
            (item) =>
              handleToggle(
                selectedBookFinishingActions,
                setSelectedBookFinishingActions,
                item
              )
          )}
          <Box mt={4} sx={{ display: "flex", justifyContent: "space-between" }}>
            {backButton}
            {nextButton}
          </Box>
        </>
      )}

      {currentStep.type === "finishing-roll" && (
        <>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Select Roll Finishing Actions
          </Typography>
          {renderOptions(
            finishingActionsRollPrinting,
            selectedRollActions,
            (item) =>
              handleToggle(selectedRollActions, setSelectedRollActions, item)
          )}
          <Box mt={4} sx={{ display: "flex", justifyContent: "space-between" }}>
            {backButton}
            {nextButton}
          </Box>
        </>
      )}

      {currentStep.type === "finishing-wide" && (
        <>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Select Wide Printer Actions
          </Typography>
          {renderOptions(
            finishingActionsWidePrinter,
            selectedWidePrinterActions,
            (item) =>
              handleToggle(
                selectedWidePrinterActions,
                setSelectedWidePrinterActions,
                item
              )
          )}
          <Box mt={4} sx={{ display: "flex", justifyContent: "space-between" }}>
            {backButton}
            {nextButton}
          </Box>
        </>
      )}

      {currentStep.type === "finishing-dtf" && (
        <>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Select DTF & Sublimation Actions
          </Typography>
          {renderOptions(finishingActionsDTF, selectedDTFActions, (item) =>
            handleToggle(selectedDTFActions, setSelectedDTFActions, item)
          )}
          <Box mt={4} sx={{ display: "flex", justifyContent: "space-between" }}>
            {backButton}
            {nextButton}
          </Box>
        </>
      )}

      {currentStep.type === "packing" && (
        <>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Select Packing Methods
          </Typography>
          {renderOptions(packingMethods, selectedPacking, (item) =>
            handleToggle(selectedPacking, setSelectedPacking, item)
          )}
          <Box mt={4} sx={{ display: "flex", justifyContent: "space-between" }}>
            {backButton}
            {nextButton}
          </Box>
        </>
      )}

      {currentStep.type === "summary" && (
        <>
          <SummarySection
            selectedMethods={selectedMethods}
            selectedDigitalOffsetActions={selectedDigitalOffsetActions}
            selectedBookFinishingActions={selectedBookFinishingActions}
            selectedRollActions={selectedRollActions}
            selectedWidePrinterActions={selectedWidePrinterActions}
            selectedDTFActions={selectedDTFActions}
            selectedPacking={selectedPacking}
          />
          <Box mt={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <PrimaryButton onClick={() => setStepIndex(0)}>
              Start Over
            </PrimaryButton>
            <PrimaryButton
              variant="contained"
              style={{
                width: 90,
              }}
              sx={{ ml: 2 }}
              onClick={() => {
                const result = {
                  printingMethods: selectedMethods,
                  finishingActionsDigitalOffset: selectedDigitalOffsetActions,
                  bookFinishingDigitalOffsetActions:
                    selectedBookFinishingActions,
                  finishingActionsRollPrinting: selectedRollActions,
                  finishingActionsWidePrinter: selectedWidePrinterActions,
                  finishingActionsDTF: selectedDTFActions,
                  packingMethods: selectedPacking,
                };
                console.log("FINAL RESULT:", result);
              }}
            >
              Save
            </PrimaryButton>
          </Box>
        </>
      )}
    </Box>
  );
};
