import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useTranslation } from "react-i18next";

// Import types and interfaces
import {
  SelectedMachine,
  SelectedFinishingMachine,
} from "@/widgets/quick-setup/on-boarding-setup/types";

// Import custom hooks
import { useMachinesData } from "@/widgets/quick-setup/on-boarding-setup/hooks/use-machines-data";
import { useStepNavigation } from "@/widgets/quick-setup/on-boarding-setup/hooks/use-step-navigation";

// Import components
import { Step1MachineSelection } from "@/widgets/quick-setup/on-boarding-setup/components/Step1MachineSelection";
import { Step2FinishingSelection } from "@/widgets/quick-setup/on-boarding-setup/components/Step2FinishingSelection";
import { Step3BookFinishingSelection } from "@/widgets/quick-setup/on-boarding-setup/components/Step3BookFinishingSelection";
import { Step4RollFlexoFinishingSelection } from "@/widgets/quick-setup/on-boarding-setup/components/Step4RollFlexoFinishingSelection";
import { Step5WideFormatFinishingSelection } from "@/widgets/quick-setup/on-boarding-setup/components/Step5WideFormatFinishingSelection";
import { Step6DtfSublimationFinishingSelection } from "@/widgets/quick-setup/on-boarding-setup/components/Step6DtfSublimationFinishingSelection";

const QuickSetupFlow: React.FC = () => {
  const { t } = useTranslation();

  // Use custom hooks for data and navigation
  const {
    allMachines,
    machinesLoading,
    finishingCategories,
    bookFinishingCategories,
    wideFormatFinishingCategories,
    dtfSublimationFinishingCategories,
    rollFlexoFinishingCategories,
  } = useMachinesData();

  const {
    currentStep,
    steps,
    hasDigitalOrOffsetPrinting,
    hasRollOrFlexoPrinting,
    hasWidePrinting,
    hasDtfOrSublimationPrinting,
    handleNext,
    handleBack,
    isNextDisabled,
    getNextButtonText,
  } = useStepNavigation();

  // State management
  const [selectedMachines, setSelectedMachines] = useState<SelectedMachine[]>(
    []
  );
  const [selectedFinishingMachines, setSelectedFinishingMachines] = useState<
    SelectedFinishingMachine[]
  >([]);
  const [selectedBookFinishingMachines, setSelectedBookFinishingMachines] =
    useState<SelectedFinishingMachine[]>([]);
  const [
    selectedWideFormatFinishingMachines,
    setSelectedWideFormatFinishingMachines,
  ] = useState<SelectedFinishingMachine[]>([]);
  const [
    selectedDtfSublimationFinishingMachines,
    setSelectedDtfSublimationFinishingMachines,
  ] = useState<SelectedFinishingMachine[]>([]);
  const [
    selectedRollFlexoFinishingMachines,
    setSelectedRollFlexoFinishingMachines,
  ] = useState<SelectedFinishingMachine[]>([]);
  const [selectedCategoryMachines, setSelectedCategoryMachines] = useState<{
    [categoryId: string]: string;
  }>({});
  const [
    selectedBookFinishingCategoryMachines,
    setSelectedBookFinishingCategoryMachines,
  ] = useState<{
    [categoryId: string]: string;
  }>({});
  const [
    selectedWideFormatFinishingCategoryMachines,
    setSelectedWideFormatFinishingCategoryMachines,
  ] = useState<{
    [categoryId: string]: string;
  }>({});
  const [
    selectedDtfSublimationFinishingCategoryMachines,
    setSelectedDtfSublimationFinishingCategoryMachines,
  ] = useState<{
    [categoryId: string]: string;
  }>({});
  const [
    selectedRollFlexoFinishingCategoryMachines,
    setSelectedRollFlexoFinishingCategoryMachines,
  ] = useState<{ [categoryId: string]: string }>({});

  // Machine management functions
  const handleAddMachine = (machine: SelectedMachine) => {
    setSelectedMachines([...selectedMachines, machine]);
  };

  const handleDeleteMachine = (machineId: string) => {
    setSelectedMachines(selectedMachines.filter((m) => m.id !== machineId));
  };

  // Finishing machine management functions
  const handleAddFinishingMachine = (categoryId: string) => {
    const selectedMachine = selectedCategoryMachines[categoryId];
    if (!selectedMachine) return;

    const category = finishingCategories.find((cat) => cat.id === categoryId);
    if (!category) return;

    const newFinishingMachine: SelectedFinishingMachine = {
      id: `${categoryId}_${selectedMachine}`,
      name: selectedMachine,
      categoryId: categoryId,
      categoryName: t(category.name),
    };

    const isDuplicate = selectedFinishingMachines.some(
      (machine) =>
        machine.categoryId === categoryId && machine.name === selectedMachine
    );

    if (!isDuplicate) {
      setSelectedFinishingMachines([
        ...selectedFinishingMachines,
        newFinishingMachine,
      ]);
      setSelectedCategoryMachines((prev) => ({
        ...prev,
        [categoryId]: "",
      }));
    }
  };

  const handleDeleteFinishingMachine = (machineId: string) => {
    setSelectedFinishingMachines((prev) =>
      prev.filter((machine) => machine.id !== machineId)
    );
  };

  const handleCategoryMachineChange = (
    categoryId: string,
    machineName: string
  ) => {
    setSelectedCategoryMachines((prev) => ({
      ...prev,
      [categoryId]: machineName,
    }));
  };

  // Book finishing machine management functions
  const handleAddBookFinishingMachine = (categoryId: string) => {
    const selectedMachine = selectedBookFinishingCategoryMachines[categoryId];
    if (!selectedMachine) return;

    const category = bookFinishingCategories.find(
      (cat) => cat.id === categoryId
    );
    if (!category) return;

    const newBookFinishingMachine: SelectedFinishingMachine = {
      id: `${categoryId}_${selectedMachine}`,
      name: selectedMachine,
      categoryId: categoryId,
      categoryName: t(category.name),
    };

    const isDuplicate = selectedBookFinishingMachines.some(
      (machine) =>
        machine.categoryId === categoryId && machine.name === selectedMachine
    );

    if (!isDuplicate) {
      setSelectedBookFinishingMachines([
        ...selectedBookFinishingMachines,
        newBookFinishingMachine,
      ]);
      setSelectedBookFinishingCategoryMachines((prev) => ({
        ...prev,
        [categoryId]: "",
      }));
    }
  };

  const handleDeleteBookFinishingMachine = (machineId: string) => {
    setSelectedBookFinishingMachines((prev) =>
      prev.filter((machine) => machine.id !== machineId)
    );
  };

  const handleBookFinishingCategoryMachineChange = (
    categoryId: string,
    machineName: string
  ) => {
    setSelectedBookFinishingCategoryMachines((prev) => ({
      ...prev,
      [categoryId]: machineName,
    }));
  };

  // Wide format finishing machine management functions
  const handleAddWideFormatFinishingMachine = (categoryId: string) => {
    const selectedMachine =
      selectedWideFormatFinishingCategoryMachines[categoryId];
    if (!selectedMachine) return;

    const category = wideFormatFinishingCategories.find(
      (cat) => cat.id === categoryId
    );
    if (!category) return;

    const newWideFormatFinishingMachine: SelectedFinishingMachine = {
      id: `${categoryId}_${selectedMachine}`,
      name: selectedMachine,
      categoryId: categoryId,
      categoryName: t(category.name),
    };

    const isDuplicate = selectedWideFormatFinishingMachines.some(
      (machine) =>
        machine.categoryId === categoryId && machine.name === selectedMachine
    );

    if (!isDuplicate) {
      setSelectedWideFormatFinishingMachines([
        ...selectedWideFormatFinishingMachines,
        newWideFormatFinishingMachine,
      ]);
      setSelectedWideFormatFinishingCategoryMachines((prev) => ({
        ...prev,
        [categoryId]: "",
      }));
    }
  };

  const handleDeleteWideFormatFinishingMachine = (machineId: string) => {
    setSelectedWideFormatFinishingMachines((prev) =>
      prev.filter((machine) => machine.id !== machineId)
    );
  };

  const handleWideFormatFinishingCategoryMachineChange = (
    categoryId: string,
    machineName: string
  ) => {
    setSelectedWideFormatFinishingCategoryMachines((prev) => ({
      ...prev,
      [categoryId]: machineName,
    }));
  };

  // DTF & Sublimation finishing machine management functions
  const handleAddDtfSublimationFinishingMachine = (categoryId: string) => {
    const selectedMachine =
      selectedDtfSublimationFinishingCategoryMachines[categoryId];
    if (!selectedMachine) return;

    const category = dtfSublimationFinishingCategories.find(
      (cat) => cat.id === categoryId
    );
    if (!category) return;

    const newDtfSublimationFinishingMachine: SelectedFinishingMachine = {
      id: `${categoryId}_${selectedMachine}`,
      name: selectedMachine,
      categoryId: categoryId,
      categoryName: t(category.name),
    };

    const isDuplicate = selectedDtfSublimationFinishingMachines.some(
      (machine) =>
        machine.categoryId === categoryId && machine.name === selectedMachine
    );

    if (!isDuplicate) {
      setSelectedDtfSublimationFinishingMachines([
        ...selectedDtfSublimationFinishingMachines,
        newDtfSublimationFinishingMachine,
      ]);
      setSelectedDtfSublimationFinishingCategoryMachines((prev) => ({
        ...prev,
        [categoryId]: "",
      }));
    }
  };

  const handleDeleteDtfSublimationFinishingMachine = (machineId: string) => {
    setSelectedDtfSublimationFinishingMachines((prev) =>
      prev.filter((machine) => machine.id !== machineId)
    );
  };

  const handleDtfSublimationFinishingCategoryMachineChange = (
    categoryId: string,
    machineName: string
  ) => {
    setSelectedDtfSublimationFinishingCategoryMachines((prev) => ({
      ...prev,
      [categoryId]: machineName,
    }));
  };

  // Roll/Flexo finishing machine management functions
  const handleAddRollFlexoFinishingMachine = (categoryId: string) => {
    const selectedMachine =
      selectedRollFlexoFinishingCategoryMachines[categoryId];
    if (!selectedMachine) return;

    const category = rollFlexoFinishingCategories.find(
      (cat) => cat.id === categoryId
    );
    if (!category) return;

    const newRollFlexoFinishingMachine: SelectedFinishingMachine = {
      id: `${categoryId}_${selectedMachine}`,
      name: selectedMachine,
      categoryId: categoryId,
      categoryName: t(category.name),
    };

    const isDuplicate = selectedRollFlexoFinishingMachines.some(
      (machine) =>
        machine.categoryId === categoryId && machine.name === selectedMachine
    );

    if (!isDuplicate) {
      setSelectedRollFlexoFinishingMachines([
        ...selectedRollFlexoFinishingMachines,
        newRollFlexoFinishingMachine,
      ]);
      setSelectedRollFlexoFinishingCategoryMachines((prev) => ({
        ...prev,
        [categoryId]: "",
      }));
    }
  };

  const handleDeleteRollFlexoFinishingMachine = (machineId: string) => {
    setSelectedRollFlexoFinishingMachines((prev) =>
      prev.filter((machine) => machine.id !== machineId)
    );
  };

  const handleRollFlexoFinishingCategoryMachineChange = (
    categoryId: string,
    machineName: string
  ) => {
    setSelectedRollFlexoFinishingCategoryMachines((prev) => ({
      ...prev,
      [categoryId]: machineName,
    }));
  };

  // Navigation handler
  const onNext = () => {
    handleNext(
      selectedMachines,
      selectedFinishingMachines,
      selectedBookFinishingMachines,
      selectedWideFormatFinishingMachines,
      selectedDtfSublimationFinishingMachines,
      selectedRollFlexoFinishingMachines
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Quick Setup - Multi-Step Configuration (Refactored)
      </Typography>

      <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {currentStep === 0 ? (
        <Step1MachineSelection
          allMachines={allMachines}
          machinesLoading={machinesLoading}
          selectedMachines={selectedMachines}
          onAddMachine={handleAddMachine}
          onDeleteMachine={handleDeleteMachine}
          hasDigitalOrOffsetPrinting={hasDigitalOrOffsetPrinting(
            selectedMachines
          )}
        />
      ) : currentStep === 1 ? (
        <Step2FinishingSelection
          selectedMachines={selectedMachines}
          finishingCategories={finishingCategories}
          selectedFinishingMachines={selectedFinishingMachines}
          selectedCategoryMachines={selectedCategoryMachines}
          onAddFinishingMachine={handleAddFinishingMachine}
          onDeleteFinishingMachine={handleDeleteFinishingMachine}
          onCategoryMachineChange={handleCategoryMachineChange}
          hasDigitalOrOffsetPrinting={hasDigitalOrOffsetPrinting(
            selectedMachines
          )}
        />
      ) : currentStep === 2 ? (
        <Step3BookFinishingSelection
          selectedMachines={selectedMachines}
          bookFinishingCategories={bookFinishingCategories}
          selectedBookFinishingMachines={selectedBookFinishingMachines}
          selectedBookFinishingCategoryMachines={
            selectedBookFinishingCategoryMachines
          }
          onAddBookFinishingMachine={handleAddBookFinishingMachine}
          onDeleteBookFinishingMachine={handleDeleteBookFinishingMachine}
          onBookFinishingCategoryMachineChange={
            handleBookFinishingCategoryMachineChange
          }
          hasDigitalOrOffsetPrinting={hasDigitalOrOffsetPrinting(
            selectedMachines
          )}
        />
      ) : currentStep === 3 ? (
        <Step4RollFlexoFinishingSelection
          selectedMachines={selectedMachines}
          rollFlexoFinishingCategories={rollFlexoFinishingCategories}
          selectedRollFlexoFinishingMachines={
            selectedRollFlexoFinishingMachines
          }
          selectedRollFlexoFinishingCategoryMachines={
            selectedRollFlexoFinishingCategoryMachines
          }
          onAddRollFlexoFinishingMachine={handleAddRollFlexoFinishingMachine}
          onDeleteRollFlexoFinishingMachine={
            handleDeleteRollFlexoFinishingMachine
          }
          onRollFlexoFinishingCategoryMachineChange={
            handleRollFlexoFinishingCategoryMachineChange
          }
          hasRollOrFlexoPrinting={hasRollOrFlexoPrinting(selectedMachines)}
        />
      ) : currentStep === 4 ? (
        <Step5WideFormatFinishingSelection
          selectedMachines={selectedMachines}
          wideFormatFinishingCategories={wideFormatFinishingCategories}
          selectedWideFormatFinishingMachines={
            selectedWideFormatFinishingMachines
          }
          selectedWideFormatFinishingCategoryMachines={
            selectedWideFormatFinishingCategoryMachines
          }
          onAddWideFormatFinishingMachine={handleAddWideFormatFinishingMachine}
          onDeleteWideFormatFinishingMachine={
            handleDeleteWideFormatFinishingMachine
          }
          onWideFormatFinishingCategoryMachineChange={
            handleWideFormatFinishingCategoryMachineChange
          }
          hasWidePrinting={hasWidePrinting(selectedMachines)}
        />
      ) : (
        <Step6DtfSublimationFinishingSelection
          selectedMachines={selectedMachines}
          dtfSublimationFinishingCategories={dtfSublimationFinishingCategories}
          selectedDtfSublimationFinishingMachines={
            selectedDtfSublimationFinishingMachines
          }
          selectedDtfSublimationFinishingCategoryMachines={
            selectedDtfSublimationFinishingCategoryMachines
          }
          onAddDtfSublimationFinishingMachine={
            handleAddDtfSublimationFinishingMachine
          }
          onDeleteDtfSublimationFinishingMachine={
            handleDeleteDtfSublimationFinishingMachine
          }
          onDtfSublimationFinishingCategoryMachineChange={
            handleDtfSublimationFinishingCategoryMachineChange
          }
          hasDtfOrSublimationPrinting={hasDtfOrSublimationPrinting(
            selectedMachines
          )}
        />
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          onClick={handleBack}
          disabled={currentStep === 0}
          variant="outlined"
        >
          Back
        </Button>

        <Button
          onClick={onNext}
          variant="contained"
          disabled={isNextDisabled(
            selectedMachines,
            selectedFinishingMachines,
            selectedBookFinishingMachines,
            selectedWideFormatFinishingMachines,
            selectedDtfSublimationFinishingMachines,
            selectedRollFlexoFinishingMachines
          )}
        >
          {getNextButtonText()}
        </Button>
      </Box>
    </Box>
  );
};

export default QuickSetupFlow;
