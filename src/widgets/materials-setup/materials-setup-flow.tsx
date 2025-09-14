import React, { useState } from "react";
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

interface SelectedMaterial {
  id: string;
  name: string;
  category: string;
  width?: number;
  length?: number;
  type?: string;
}

const MaterialsSetupFlow: React.FC = () => {
  const { t } = useTranslation();
  const { alertSuccessAdded, alertFaultAdded } = useSnackBar();
  const { navigate } = useGomakeRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<
    SelectedMaterial[]
  >([]);

  // Define the steps
  const steps = [
    { id: "sheet-printing", title: "Sheet printing department" },
    { id: "roll-printing", title: "Roll printing department" },
    { id: "wide-format-material", title: "Wide Format" },
    { id: "flatbeds", title: "Flatbeds" },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
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

      // // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // alertSuccessAdded();
      // navigate("/");
    } catch (error) {
      alertFaultAdded();
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step1SheetPrintingSelection
            selectedMaterials={selectedMaterials}
            onMaterialsChange={setSelectedMaterials}
          />
        );
      case 1:
        return (
          <Step2RollPrintingSelection
            selectedMaterials={selectedMaterials}
            onMaterialsChange={setSelectedMaterials}
          />
        );
      case 2:
        return (
          <Step3WideFormatMaterialSelection
            selectedMaterials={selectedMaterials}
            onMaterialsChange={setSelectedMaterials}
          />
        );
      case 3:
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
          {steps.map((step, index) => (
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
        {currentStep === steps.length - 1 ? (
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
            {selectedMaterials.map((material) => (
              <Box
                key={material.id}
                sx={{
                  p: 1,
                  border: "1px solid",
                  borderColor: "primary.main",
                  borderRadius: 1,
                  backgroundColor: "primary.light",
                }}
              >
                <Typography variant="body2">
                  {material.name} ({material.category})
                  {material.width && ` - Width: ${material.width}`}
                  {material.length && ` - Length: ${material.length}`}
                  {material.type && ` - Type: ${material.type}`}
                </Typography>
              </Box>
            ))}
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
