import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { useGomakeRouter } from "@/hooks/use-gomake-router";
import { useSnackBar } from "@/hooks/use-snack-bar";

// Import step components
import { Step1SheetPrintingSelection } from "./components/Step1SheetPrintingSelection";
import { Step2RollPrintingSelection } from "./components/Step2RollPrintingSelection";
import { Step3WideFormatMaterialSelection } from "./components/Step3WideFormatMaterialSelection";
import { Step4FlatbedsSelection } from "./components/Step4FlatbedsSelection";
import { useMachines } from "../employees-working-hours-widgets/use-machines";
import { ECategoryId } from "../machines/enums/category-id";

interface MaterialValue {
  valueKey: string;
  value: string | number;
}

interface SelectedMaterial {
  materialTypeKey: string;
  categoryKey: string;
  values: MaterialValue[];
}

const MaterialsSetupFlow: React.FC = () => {
  const { t } = useTranslation();
  const { alertSuccessAdded, alertFaultAdded } = useSnackBar();
  const { navigate } = useGomakeRouter();
  const { machines, machinesLoading, machinesFetched, getMachines } =
    useMachines();
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<
    SelectedMaterial[]
  >([]);
  const [availableSteps, setAvailableSteps] = useState<any[]>([]);

  // Get machines on component mount
  useEffect(() => {
    getMachines();
  }, []);

  // Determine which steps to show based on machine categories
  useEffect(() => {
    if (machines !== null) {
      // machines is loaded (could be empty array or with data)
      if (machines.length > 0) {
        const machineCategories = machines.map((machine) => machine.category);

        const stepsToShow = [];
        let stepIndex = 0;

        // Check for Step 1: Sheet printing (DIGITAL_PRINTING or OFSSET_PRINTING)
        if (
          machineCategories.includes(ECategoryId.DIGITAL_PRINTING) ||
          machineCategories.includes(ECategoryId.OFSSET_PRINTING)
        ) {
          stepsToShow.push({
            id: "sheet-printing",
            title: "Sheet printing department",
            index: stepIndex++,
          });
        }

        // Check for Step 2: Roll printing (ROLL_DIGITAL_PRINTING or FLEXO_PRINTING or ROLL_OFF_SET_PRINTING)
        if (
          machineCategories.includes(ECategoryId.ROLL_DIGITAL_PRINTING) ||
          machineCategories.includes(ECategoryId.FLEXO_PRINTING) ||
          machineCategories.includes(ECategoryId.ROLL_OFF_SET_PRINTING)
        ) {
          stepsToShow.push({
            id: "roll-printing",
            title: "Roll printing department",
            index: stepIndex++,
          });
        }

        // Check for Step 3 & 4: Wide format and Flatbeds (FLATBED_WIDE_PRINTING)
        if (machineCategories.includes(ECategoryId.FLATBED_WIDE_PRINTING)) {
          stepsToShow.push({
            id: "wide-format-material",
            title: "Wide Format",
            index: stepIndex++,
          });
          stepsToShow.push({
            id: "flatbeds",
            title: "Flatbeds",
            index: stepIndex++,
          });
        }

        setAvailableSteps(stepsToShow);
        setCurrentStep(0);
      } else {
        // No machines found
        setAvailableSteps([]);
        setCurrentStep(0);
      }
    }
  }, [machines]);

  const handleNext = () => {
    if (currentStep < availableSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  //!here new api should be called
  const handleCompleteSetup = async () => {
    try {
      console.log("Selected materials:", selectedMaterials);

      // alertSuccessAdded();
      // navigate("/");
    } catch (error) {
      alertFaultAdded();
    }
  };

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
  if (machinesFetched && !machinesLoading && availableSteps.length === 0) {
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
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          {t("Back")}
        </Button>
        {currentStep === availableSteps.length - 1 ? (
          // Show Complete Setup button on last step
          <Button
            variant="contained"
            color="success"
            onClick={() => setShowConfirmModal(true)}
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
              const widthValue = material.values.find(
                (v) => v.valueKey === "width"
              )?.value;
              const lengthValue = material.values.find(
                (v) => v.valueKey === "length"
              )?.value;
              const typeValue = material.values.find(
                (v) => v.valueKey === "type"
              )?.value;

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
                    {widthValue && ` - Width: ${widthValue}`}
                    {lengthValue && ` - Length: ${lengthValue}`}
                    {typeValue && ` - Type: ${typeValue}`}
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
        onClose={() => setShowConfirmModal(false)}
        onClickDelete={handleCompleteSetup}
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
