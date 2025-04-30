import { Dispatch, SetStateAction, useMemo } from "react";
import { renderOptions, useSetupSteps } from "./use-setup-steps";
import { Box, TextField, Typography } from "@mui/material";
import { SummarySection } from "./summery";
import { PrimaryButton } from "@/components/button/primary-button";
import { useStyle } from "../style";

export const SetupSteps = () => {
  const { classes } = useStyle();
  const {
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
    setSelectedDigitalOffsetActions,
    setSelectedBookFinishingActions,
    setSelectedRollActions,
    setSelectedWidePrinterActions,
    setSelectedDTFActions,
    setSelectedPacking,
    setStepIndex,
    handleMethodToggle,
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
      {stepIndex === steps.length - 1
        ? t(`quickSetup.finish`)
        : t(`quickSetup.next`)}
    </PrimaryButton>
  );

  const backButton = (
    <PrimaryButton
      style={{ width: 90 }}
      variant="text"
      onClick={() => setStepIndex(stepIndex - 1)}
    >
      {t(`quickSetup.back`)}
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
            materialDigitalOffset={materialDigitalOffset}
            materialRollMaxWidth={materialRollMaxWidth}
            materialWide={materialWide}
            materialWideMaxWidth={materialWideMaxWidth}
            materialWideMaxLength={materialWideMaxLength}
          />
        ) : (
          <>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              {t(`quickSetup.${stepConfig?.label}`)}
            </Typography>
            {(() => {
              switch (currentStep.type) {
                case "material-digital-offset":
                  return (
                    <>
                      {/* Render preset + custom selections */}
                      {renderOptions(
                        Array.from(
                          new Set([
                            ...(stepConfig?.options ?? []),
                            ...materialDigitalOffset,
                          ])
                        ),
                        materialDigitalOffset,
                        (item) => {
                          setMaterialDigitalOffset((prev) =>
                            prev.includes(item)
                              ? prev.filter((i) => i !== item)
                              : [...prev, item]
                          );
                        },
                        (item) => {
                          setMaterialDigitalOffset((prev) =>
                            prev.filter((i) => i !== item)
                          );
                        },
                        (item) => {
                          return !(stepConfig?.options ?? []).includes(item);
                        }
                      )}
                      {/* Manual input for custom size */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          mt: 3,
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{
                            "& label.Mui-focused": {
                              color: "#2E3092",
                            },
                          }}
                          type="number"
                          label={t(`quickSetup.${isUs ? "widthUs" : "width"}`)}
                          value={manualWidth}
                          onChange={(e) => setManualWidth(e.target.value)}
                          style={{ width: "140px" }}
                        />
                        <TextField
                          sx={{
                            "& label.Mui-focused": {
                              color: "#2E3092",
                            },
                          }}
                          type="number"
                          label={t(
                            `quickSetup.${isUs ? "heightUs" : "height"}`
                          )}
                          value={manualHeight}
                          onChange={(e) => setManualHeight(e.target.value)}
                          style={{ width: "140px" }}
                        />
                        <PrimaryButton
                          style={{ width: "fit-content" }}
                          // variant="outlined"
                          onClick={() => {
                            const customSize = `${manualWidth}X${manualHeight}`;
                            if (
                              manualWidth &&
                              manualHeight &&
                              !materialDigitalOffset.includes(customSize)
                            ) {
                              setMaterialDigitalOffset((prev) => [
                                ...prev,
                                customSize,
                              ]);
                              setManualWidth("");
                              setManualHeight("");
                            }
                          }}
                        >
                          {t(`quickSetup.add_custom_size`)}
                        </PrimaryButton>
                      </Box>
                    </>
                  );

                case "material-roll":
                  return (
                    <TextField
                      sx={{
                        "& label.Mui-focused": {
                          color: "#2E3092",
                        },
                      }}
                      type="number"
                      label={t(
                        `quickSetup.${isUs ? "maxWidthUs" : "maxWidth"}`
                      )}
                      value={materialRollMaxWidth}
                      onChange={(e) => setMaterialRollMaxWidth(e.target.value)}
                    />
                  );

                case "material-wide":
                  return (
                    <>
                      {renderOptions(
                        stepConfig?.options ?? [],
                        materialWide,
                        (item) => {
                          setMaterialWide((prev) =>
                            prev.includes(item)
                              ? prev.filter((i) => i !== item)
                              : [...prev, item]
                          );
                        }
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          mt: 3,
                          flexWrap: "wrap",
                        }}
                      >
                        <TextField
                          sx={{
                            mt: 2,
                            "& label.Mui-focused": {
                              color: "#2E3092",
                            },
                          }}
                          type="number"
                          label={t(
                            `quickSetup.${isUs ? "maxWidthUs" : "maxWidth"}`
                          )}
                          value={materialWideMaxWidth}
                          onChange={(e) =>
                            setMaterialWideMaxWidth(e.target.value)
                          }
                        />
                        <TextField
                          sx={{
                            mt: 2,
                            "& label.Mui-focused": {
                              color: "#2E3092",
                            },
                          }}
                          type="number"
                          label={t(
                            `quickSetup.${isUs ? "maxLengthUs" : "maxLength"}`
                          )}
                          value={materialWideMaxLength}
                          onChange={(e) =>
                            setMaterialWideMaxLength(e.target.value)
                          }
                        />
                      </Box>
                    </>
                  );

                default:
                  return renderOptions(
                    stepConfig?.type === "methods"
                      ? stepConfig.options!
                      : displayedOptions,
                    stepConfig?.type === "methods"
                      ? selectedMethods
                      : selectedArray,
                    stepConfig?.type === "methods"
                      ? handleMethodToggle
                      : handleToggle
                  );
              }
            })()}
          </>
        )}
      </Box>
      {/* Sticky Footer */}
      <Box
        sx={{
          padding: 2,
          borderTop: "1px solid #e0e0e0",
          display: "flex",
          justifyContent:
            currentStep.type === "summary" ? "flex-end" : "space-between",
          backgroundColor: "#fff",
        }}
      >
        {currentStep.type === "summary" ? (
          <>
            <PrimaryButton onClick={() => setStepIndex(0)}>
              {t(`quickSetup.start_over`)}
            </PrimaryButton>
            <PrimaryButton
              variant="contained"
              style={{ width: 90 }}
              sx={{ ml: 2 }}
              onClick={onSave}
            >
              {t(`quickSetup.save`)}
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
