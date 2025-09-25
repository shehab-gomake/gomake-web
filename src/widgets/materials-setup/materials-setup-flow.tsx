import React from "react";
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
} from "@mui/material";
import { GoMakeDeleteModal } from "@/components/modal-deleted";
import { ModalType } from "@/enums";
import { Step1SheetPrintingSelection } from "./components/Step1SheetPrintingSelection";
import { Step2RollPrintingSelection } from "./components/Step2RollPrintingSelection";
import { Step3WideFormatMaterialSelection } from "./components/Step3WideFormatMaterialSelection";
import { Step4FlatbedsSelection } from "./components/Step4FlatbedsSelection";
import { useMaterialsSetupFlow } from "./hooks/use-materials-setup-flow";

const MaterialsSetupFlow: React.FC = () => {
  const {
    currentStep,
    showConfirmModal,
    selectedMaterials,
    availableSteps,
    machinesLoading,
    hasNoRelevantMachines,
    // Computed values
    isFirstStep,
    isLastStep,
    // Functions
    handleNext,
    handleBack,
    handleCompleteSetupMaterials,
    openConfirmModal,
    closeConfirmModal,
    setSelectedMaterials,
    t,
  } = useMaterialsSetupFlow();

  const renderCurrentStep = () => {
    if (availableSteps.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography>{t("Loading available steps...")}</Typography>
        </Box>
      );
    }

    const currentStepData = availableSteps[currentStep];
    if (!currentStepData) return null;

    switch (currentStepData.id) {
      case "sheet-printing":
        return (
          <Step1SheetPrintingSelection
            selectedMaterials={selectedMaterials}
            onMaterialsChange={setSelectedMaterials}
          />
        );
      case "roll-printing":
        return (
          <Step2RollPrintingSelection
            selectedMaterials={selectedMaterials}
            onMaterialsChange={setSelectedMaterials}
          />
        );
      case "wide-format-material":
        return (
          <Step3WideFormatMaterialSelection
            selectedMaterials={selectedMaterials}
            onMaterialsChange={setSelectedMaterials}
          />
        );
      case "flatbeds":
        return (
          <Step4FlatbedsSelection
            selectedMaterials={selectedMaterials}
            onMaterialsChange={setSelectedMaterials}
          />
        );
      default:
        return null;
    }
  };

  // Show loading state while machines are being fetched
  if (machinesLoading) {
    return (
      <Box sx={{ p: "0px 24px 24px 24px", textAlign: "center", py: 4 }}>
        <Typography>{t("Loading machines...")}</Typography>
      </Box>
    );
  }

  // Show message when no relevant machines are found (only after machines are fetched and not loading)
  if (hasNoRelevantMachines) {
    return (
      <Box sx={{ p: "0px 24px 24px 24px" }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            {t("Materials Setup")}
          </Typography>
        </Box>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t("No Relevant Machines Found")}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
            {t(
              "No machines found that require material setup. Please ensure you have machines with the following categories:"
            )}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: "0px 24px 24px 24px" }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            mb: 2,
            p: 2,
            backgroundColor: "primary.light",
            borderRadius: 2,
            background:
              "linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)",
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
              flexShrink: 0,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              📄
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "primary.dark", mb: 1 }}
            >
              {t("Welcome to Materials Setup")}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", lineHeight: 1.6, mb: 1 }}
            >
              {t(
                "This setup will help you configure all the materials you use in your print service provider (PSP). Select materials for each department and specify their dimensions."
              )}
            </Typography>

            {/* Important Notice inside the box */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                px: 1.5,
                py: 0.5,
                backgroundColor: "error.light",
              }}
            >
              <Typography
                sx={{
                  color: "error.main",
                  fontSize: "0.8rem",
                  mr: 1,
                }}
              >
                ⚠️
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ffffff", fontWeight: 500 }}
              >
                {t(
                  "Important: This setup will replace your current materials configuration."
                )}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={currentStep} alternativeLabel>
          {availableSteps.map((step, index) => (
            <Step key={step.id}>
              <StepLabel>{t(step.title)}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Current Step Content */}
      <Paper sx={{ p: 3, mb: 3 }}>{renderCurrentStep()}</Paper>

      {/* Navigation Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Button variant="outlined" onClick={handleBack} disabled={isFirstStep}>
          {t("Back")}
        </Button>
        {isLastStep ? (
          // Show Complete Setup button on last step
          <Button
            variant="contained"
            color="success"
            onClick={openConfirmModal}
            disabled={selectedMaterials.length === 0}
          >
            {t("Complete Setup")}
          </Button>
        ) : (
          // Show Next button on other steps
          <Button variant="contained" onClick={handleNext}>
            {t("Next")}
          </Button>
        )}
      </Box>

      {/* Selected Materials Summary */}
      {selectedMaterials.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t("Selected Materials")} ({selectedMaterials.length})
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {selectedMaterials.map((material) => {
              return (
                <Box
                  key={material.categoryKey}
                  sx={{
                    p: 1,
                    border: "1px solid",
                    borderColor: "primary.main",
                    borderRadius: 1,
                    backgroundColor: "rgba(25, 118, 210, 0.08)",
                  }}
                >
                  <Typography variant="body2">
                    {material.categoryKey} ({material.materialTypeKey})
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Paper>
      )}

      {/* Confirmation Modal */}
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        openModal={showConfirmModal}
        onClose={closeConfirmModal}
        onClickDelete={handleCompleteSetupMaterials}
        title={t("Confirm Materials Setup")}
        subTitle={t(
          "Once you click Finish, your current materials setup will be replaced. You can always make changes or add more materials later in the Materials section."
        )}
        yesBtn={t("Finish")}
      />
    </Box>
  );
};

export { MaterialsSetupFlow };
