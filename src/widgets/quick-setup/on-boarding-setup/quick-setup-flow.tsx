import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

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

const QuickSetupFlow: React.FC = () => {
  // Use custom hooks for data and navigation
  const {
    allMachines,
    machinesLoading,
    finishingCategories,
    bookFinishingCategories,
    rollFlexoFinishingCategories,
  } = useMachinesData();

  const {
    currentStep,
    steps,
    hasDigitalOrOffsetPrinting,
    hasRollOrFlexoPrinting,
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
    selectedRollFlexoCategoryMachines,
    setSelectedRollFlexoCategoryMachines,
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
      categoryName: category.name,
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
      categoryName: category.name,
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

  // Roll/Flexo finishing machine management functions
  const handleAddRollFlexoFinishingMachine = (categoryId: string) => {
    const selectedMachine = selectedRollFlexoCategoryMachines[categoryId];
    if (!selectedMachine) return;

    const category = rollFlexoFinishingCategories.find(
      (cat) => cat.id === categoryId
    );
    if (!category) return;

    const newFinishingMachine: SelectedFinishingMachine = {
      id: `${categoryId}_${selectedMachine}`,
      name: selectedMachine,
      categoryId: categoryId,
      categoryName: category.name,
    };

    const isDuplicate = selectedRollFlexoFinishingMachines.some(
      (machine) =>
        machine.categoryId === categoryId && machine.name === selectedMachine
    );

    if (!isDuplicate) {
      setSelectedRollFlexoFinishingMachines([
        ...selectedRollFlexoFinishingMachines,
        newFinishingMachine,
      ]);
      setSelectedRollFlexoCategoryMachines((prev) => ({
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

  const handleRollFlexoCategoryMachineChange = (
    categoryId: string,
    machineName: string
  ) => {
    setSelectedRollFlexoCategoryMachines((prev) => ({
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
      ) : (
        <Step4RollFlexoFinishingSelection
          selectedMachines={selectedMachines}
          rollFlexoFinishingCategories={rollFlexoFinishingCategories}
          selectedRollFlexoFinishingMachines={
            selectedRollFlexoFinishingMachines
          }
          selectedRollFlexoCategoryMachines={selectedRollFlexoCategoryMachines}
          onAddRollFlexoFinishingMachine={handleAddRollFlexoFinishingMachine}
          onDeleteRollFlexoFinishingMachine={
            handleDeleteRollFlexoFinishingMachine
          }
          onRollFlexoCategoryMachineChange={
            handleRollFlexoCategoryMachineChange
          }
          hasRollOrFlexoPrinting={hasRollOrFlexoPrinting(selectedMachines)}
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
