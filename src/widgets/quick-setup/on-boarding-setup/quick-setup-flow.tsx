import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Chip,
} from "@mui/material";
import { useTranslation } from "react-i18next";

// Import types and interfaces
import {
  Machine,
  SelectedMachine,
  SelectedFinishingMachine,
  FinishingCategory,
} from "@/widgets/quick-setup/on-boarding-setup/types";

// Import custom hooks
import { useMachinesData } from "@/widgets/quick-setup/on-boarding-setup/hooks/use-machines-data";
import { useStepNavigation } from "@/widgets/quick-setup/on-boarding-setup/hooks/use-step-navigation";
import { useMachinesCategories } from "@/widgets/machines/hooks/use-machines-categories";

// Import API services
import { printHouseAddNewMachine } from "@/services/api-service/machines/print-house-machines";
import { useGomakeAxios, useSnackBar } from "@/hooks";

// Import components
import { Step1MachineSelection } from "@/widgets/quick-setup/on-boarding-setup/components/Step1MachineSelection";
import { Step2FinishingSelection } from "@/widgets/quick-setup/on-boarding-setup/components/Step2FinishingSelection";
import { Step3BookFinishingSelection } from "@/widgets/quick-setup/on-boarding-setup/components/Step3BookFinishingSelection";
import { Step4RollFlexoFinishingSelection } from "@/widgets/quick-setup/on-boarding-setup/components/Step4RollFlexoFinishingSelection";
import { Step5WideFormatFinishingSelection } from "@/widgets/quick-setup/on-boarding-setup/components/Step5WideFormatFinishingSelection";
import { Step6DtfSublimationFinishingSelection } from "@/widgets/quick-setup/on-boarding-setup/components/Step6DtfSublimationFinishingSelection";
import { Step7PackagingSelection } from "@/widgets/quick-setup/on-boarding-setup/components/Step7PackagingSelection";

const QuickSetupFlow: React.FC = () => {
  const { t } = useTranslation();
  const { categoryName } = useMachinesCategories();
  const { callApi } = useGomakeAxios();
  const { alertSuccessAdded, alertFaultAdded } = useSnackBar();

  // Use custom hooks for data and navigation
  const {
    allMachines,
    machinesLoading,
    finishingCategories,
    bookFinishingCategories,
    wideFormatFinishingCategories,
    dtfSublimationFinishingCategories,
    rollFlexoFinishingCategories,
    packagingCategories,
  } = useMachinesData();

  const [currentStep, setCurrentStep] = useState(0);

  // State management - MUST be called before any conditional returns
  const [selectedMachines, setSelectedMachines] = useState<SelectedMachine[]>(
    []
  );

  // Navigation - MUST be called before any conditional returns
  const {
    handleNext,
    handleBack,
    isNextDisabled,
    getNextButtonText,
    hasDigitalOrOffsetPrinting,
    hasRollOrFlexoPrinting,
    hasWidePrinting,
    hasDtfOrSublimationPrinting,
    dynamicSteps,
  } = useStepNavigation(currentStep, setCurrentStep, selectedMachines);
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
  const [selectedPackagingMachines, setSelectedPackagingMachines] = useState<
    SelectedFinishingMachine[]
  >([]);
  const [
    selectedPackagingCategoryMachines,
    setSelectedPackagingCategoryMachines,
  ] = useState<{ [categoryId: string]: string }>({});

  // if (machinesLoading) {
  //   return (
  //     <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
  //       <Typography>Loading machines...</Typography>
  //     </Box>
  //   );
  // }

  // Helper function to convert Machine to SelectedMachine
  const convertMachineToSelectedMachine = (
    machine: Machine,
    categoryId: string,
    stepAdded: number = 0,
    machineType: "printing" | "finishing" = "printing"
  ): SelectedMachine => {
    return {
      id: machine.id,
      name: `${machine.manufacturer} - ${machine.model}` || machine.nickName,
      category: categoryId,
      categoryId: categoryId,
      categoryName: categoryName(categoryId), // Use the translated category name
      stepAdded,
      machineType,
    };
  };

  // Helper function to convert Machine to SelectedFinishingMachine
  const convertMachineToSelectedFinishingMachine = (
    machine: Machine,
    categoryId: string,
    stepAdded: number = 0
  ): SelectedFinishingMachine => {
    return {
      id: machine.id,
      name: `${machine.manufacturer} - ${machine.model}` || machine.nickName,
      categoryId: categoryId,
      categoryName: categoryName(categoryId), // Use the translated category name
      stepAdded,
    };
  };

  // Step 1: All Machines Selection (Printing machines)
  const handleAddMachine = (machine: Machine, categoryId: string) => {
    const newSelectedMachine = convertMachineToSelectedMachine(
      machine,
      categoryId,
      0,
      "printing"
    );

    // Check if machine already exists
    const existingIndex = selectedMachines.findIndex(
      (m) => m.id === machine.id
    );
    if (existingIndex === -1) {
      setSelectedMachines((prev) => [...prev, newSelectedMachine]);
    }

    // Bidirectional synchronization: If machine belongs to a finishing category,
    // also add it to the corresponding finishing step selection
    const newSelectedFinishingMachine =
      convertMachineToSelectedFinishingMachine(machine, categoryId, 0);

    // Check which finishing step this machine belongs to and add it there
    if (finishingCategories.some((cat) => cat.id === categoryId)) {
      // Step 2: Digital/Sheet Finishing
      const existingFinishingIndex = selectedFinishingMachines.findIndex(
        (m) => m.id === machine.id
      );
      if (existingFinishingIndex === -1) {
        setSelectedFinishingMachines((prev) => [
          ...prev,
          newSelectedFinishingMachine,
        ]);
      }
    } else if (bookFinishingCategories.some((cat) => cat.id === categoryId)) {
      // Step 3: Book Finishing
      const existingBookFinishingIndex =
        selectedBookFinishingMachines.findIndex((m) => m.id === machine.id);
      if (existingBookFinishingIndex === -1) {
        setSelectedBookFinishingMachines((prev) => [
          ...prev,
          newSelectedFinishingMachine,
        ]);
      }
    } else if (
      rollFlexoFinishingCategories.some((cat) => cat.id === categoryId)
    ) {
      // Step 4: Roll/Flexo Finishing
      const existingRollFlexoIndex =
        selectedRollFlexoFinishingMachines.findIndex(
          (m) => m.id === machine.id
        );
      if (existingRollFlexoIndex === -1) {
        setSelectedRollFlexoFinishingMachines((prev) => [
          ...prev,
          newSelectedFinishingMachine,
        ]);
      }
    } else if (
      wideFormatFinishingCategories.some((cat) => cat.id === categoryId)
    ) {
      // Step 5: Wide Format Finishing
      const existingWideFormatIndex =
        selectedWideFormatFinishingMachines.findIndex(
          (m) => m.id === machine.id
        );
      if (existingWideFormatIndex === -1) {
        setSelectedWideFormatFinishingMachines((prev) => [
          ...prev,
          newSelectedFinishingMachine,
        ]);
      }
    } else if (
      dtfSublimationFinishingCategories.some((cat) => cat.id === categoryId)
    ) {
      // Step 6: DTF & Sublimation Finishing
      const existingDtfSublimationIndex =
        selectedDtfSublimationFinishingMachines.findIndex(
          (m) => m.id === machine.id
        );
      if (existingDtfSublimationIndex === -1) {
        setSelectedDtfSublimationFinishingMachines((prev) => [
          ...prev,
          newSelectedFinishingMachine,
        ]);
      }
    } else if (packagingCategories.some((cat) => cat.id === categoryId)) {
      // Step 7: Packaging
      const existingPackagingIndex = selectedPackagingMachines.findIndex(
        (m) => m.id === machine.id
      );
      if (existingPackagingIndex === -1) {
        setSelectedPackagingMachines((prev) => [
          ...prev,
          newSelectedFinishingMachine,
        ]);
      }
    }
  };

  const handleDeleteMachine = (machineId: string) => {
    setSelectedMachines((prev) => prev.filter((m) => m.id !== machineId));

    // Also remove from individual step selections
    setSelectedFinishingMachines((prev) =>
      prev.filter((m) => m.id !== machineId)
    );
    setSelectedBookFinishingMachines((prev) =>
      prev.filter((m) => m.id !== machineId)
    );
    setSelectedWideFormatFinishingMachines((prev) =>
      prev.filter((m) => m.id !== machineId)
    );
    setSelectedDtfSublimationFinishingMachines((prev) =>
      prev.filter((m) => m.id !== machineId)
    );
    setSelectedRollFlexoFinishingMachines((prev) =>
      prev.filter((m) => m.id !== machineId)
    );
    setSelectedPackagingMachines((prev) =>
      prev.filter((m) => m.id !== machineId)
    );
  };

  // Step 2: Digital/Sheet Finishing
  const handleAddFinishingMachine = (categoryId: string) => {
    const machineName = selectedCategoryMachines[categoryId];
    if (machineName) {
      const category = finishingCategories.find((cat) => cat.id === categoryId);
      if (category) {
        const machine = category.machines.find((m) => m.model === machineName);
        if (machine) {
          const newSelectedMachine = convertMachineToSelectedMachine(
            machine,
            categoryId,
            1,
            "finishing"
          );
          const newSelectedFinishingMachine =
            convertMachineToSelectedFinishingMachine(machine, categoryId, 1);

          // Add to unified selection
          const existingIndex = selectedMachines.findIndex(
            (m) => m.id === machine.id
          );
          if (existingIndex === -1) {
            setSelectedMachines((prev) => [...prev, newSelectedMachine]);
          }

          // Add to step-specific selection
          setSelectedFinishingMachines((prev) => [
            ...prev,
            newSelectedFinishingMachine,
          ]);

          // Clear selection
          setSelectedCategoryMachines((prev) => ({
            ...prev,
            [categoryId]: "",
          }));
        }
      }
    }
  };

  const handleDeleteFinishingMachine = (machineId: string) => {
    setSelectedFinishingMachines((prev) =>
      prev.filter((m) => m.id !== machineId)
    );
    setSelectedMachines((prev) => prev.filter((m) => m.id !== machineId));
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

  // Step 3: Book Finishing
  const handleAddBookFinishingMachine = (categoryId: string) => {
    const machineName = selectedBookFinishingCategoryMachines[categoryId];
    if (machineName) {
      const category = bookFinishingCategories.find(
        (cat) => cat.id === categoryId
      );
      if (category) {
        const machine = category.machines.find((m) => m.model === machineName);
        if (machine) {
          const newSelectedMachine = convertMachineToSelectedMachine(
            machine,
            categoryId,
            2,
            "finishing"
          );
          const newSelectedFinishingMachine =
            convertMachineToSelectedFinishingMachine(machine, categoryId, 2);

          setSelectedMachines((prev) => [...prev, newSelectedMachine]);
          setSelectedBookFinishingMachines((prev) => [
            ...prev,
            newSelectedFinishingMachine,
          ]);
          setSelectedBookFinishingCategoryMachines((prev) => ({
            ...prev,
            [categoryId]: "",
          }));
        }
      }
    }
  };

  const handleDeleteBookFinishingMachine = (machineId: string) => {
    setSelectedBookFinishingMachines((prev) =>
      prev.filter((m) => m.id !== machineId)
    );
    setSelectedMachines((prev) => prev.filter((m) => m.id !== machineId));
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

  // Step 4: Roll/Flexo Finishing
  const handleAddRollFlexoFinishingMachine = (categoryId: string) => {
    const machineName = selectedRollFlexoFinishingCategoryMachines[categoryId];
    if (machineName) {
      const category = rollFlexoFinishingCategories.find(
        (cat) => cat.id === categoryId
      );
      if (category) {
        const machine = category.machines.find((m) => m.model === machineName);
        if (machine) {
          const newSelectedMachine = convertMachineToSelectedMachine(
            machine,
            categoryId,
            3,
            "finishing"
          );
          const newSelectedFinishingMachine =
            convertMachineToSelectedFinishingMachine(machine, categoryId, 3);

          setSelectedMachines((prev) => [...prev, newSelectedMachine]);
          setSelectedRollFlexoFinishingMachines((prev) => [
            ...prev,
            newSelectedFinishingMachine,
          ]);
          setSelectedRollFlexoFinishingCategoryMachines((prev) => ({
            ...prev,
            [categoryId]: "",
          }));
        }
      }
    }
  };

  const handleDeleteRollFlexoFinishingMachine = (machineId: string) => {
    setSelectedRollFlexoFinishingMachines((prev) =>
      prev.filter((m) => m.id !== machineId)
    );
    setSelectedMachines((prev) => prev.filter((m) => m.id !== machineId));
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

  // Step 5: Wide Format Finishing
  const handleAddWideFormatFinishingMachine = (categoryId: string) => {
    const machineName = selectedWideFormatFinishingCategoryMachines[categoryId];
    if (machineName) {
      const category = wideFormatFinishingCategories.find(
        (cat) => cat.id === categoryId
      );
      if (category) {
        const machine = category.machines.find((m) => m.model === machineName);
        if (machine) {
          const newSelectedMachine = convertMachineToSelectedMachine(
            machine,
            categoryId,
            4,
            "finishing"
          );
          const newSelectedFinishingMachine =
            convertMachineToSelectedFinishingMachine(machine, categoryId, 4);

          setSelectedMachines((prev) => [...prev, newSelectedMachine]);
          setSelectedWideFormatFinishingMachines((prev) => [
            ...prev,
            newSelectedFinishingMachine,
          ]);
          setSelectedWideFormatFinishingCategoryMachines((prev) => ({
            ...prev,
            [categoryId]: "",
          }));
        }
      }
    }
  };

  const handleDeleteWideFormatFinishingMachine = (machineId: string) => {
    setSelectedWideFormatFinishingMachines((prev) =>
      prev.filter((m) => m.id !== machineId)
    );
    setSelectedMachines((prev) => prev.filter((m) => m.id !== machineId));
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

  // Step 6: DTF/Sublimation Finishing
  const handleAddDtfSublimationFinishingMachine = (categoryId: string) => {
    const machineName =
      selectedDtfSublimationFinishingCategoryMachines[categoryId];
    if (machineName) {
      const category = dtfSublimationFinishingCategories.find(
        (cat) => cat.id === categoryId
      );
      if (category) {
        const machine = category.machines.find((m) => m.model === machineName);
        if (machine) {
          const newSelectedMachine = convertMachineToSelectedMachine(
            machine,
            categoryId,
            5,
            "finishing"
          );
          const newSelectedFinishingMachine =
            convertMachineToSelectedFinishingMachine(machine, categoryId, 5);

          setSelectedMachines((prev) => [...prev, newSelectedMachine]);
          setSelectedDtfSublimationFinishingMachines((prev) => [
            ...prev,
            newSelectedFinishingMachine,
          ]);
          setSelectedDtfSublimationFinishingCategoryMachines((prev) => ({
            ...prev,
            [categoryId]: "",
          }));
        }
      }
    }
  };

  const handleDeleteDtfSublimationFinishingMachine = (machineId: string) => {
    setSelectedDtfSublimationFinishingMachines((prev) =>
      prev.filter((m) => m.id !== machineId)
    );
    setSelectedMachines((prev) => prev.filter((m) => m.id !== machineId));
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

  // Step 7: Packaging
  const handleAddPackagingMachine = (categoryId: string) => {
    const machineName = selectedPackagingCategoryMachines[categoryId];
    if (machineName) {
      const category = packagingCategories.find((cat) => cat.id === categoryId);
      if (category) {
        const machine = category.machines.find((m) => m.model === machineName);
        if (machine) {
          const newSelectedMachine = convertMachineToSelectedMachine(
            machine,
            categoryId,
            6,
            "finishing"
          );
          const newSelectedFinishingMachine =
            convertMachineToSelectedFinishingMachine(machine, categoryId, 6);

          setSelectedMachines((prev) => [...prev, newSelectedMachine]);
          setSelectedPackagingMachines((prev) => [
            ...prev,
            newSelectedFinishingMachine,
          ]);
          setSelectedPackagingCategoryMachines((prev) => ({
            ...prev,
            [categoryId]: "",
          }));
        }
      }
    }
  };

  const handleDeletePackagingMachine = (machineId: string) => {
    setSelectedPackagingMachines((prev) =>
      prev.filter((m) => m.id !== machineId)
    );
    setSelectedMachines((prev) => prev.filter((m) => m.id !== machineId));
  };

  const handlePackagingCategoryMachineChange = (
    categoryId: string,
    machineName: string
  ) => {
    setSelectedPackagingCategoryMachines((prev) => ({
      ...prev,
      [categoryId]: machineName,
    }));
  };

  // Function to handle adding new machines when search results are empty
  const handleAddNewMachine = async (
    categoryId: string,
    machineName: string
  ) => {
    try {
      // Create a new machine object based on the search term
      const newMachine = {
        nickName: machineName,
        manufacturer: machineName.split(" ")[0] || machineName, // Use first word as manufacturer
        model: machineName.split(" ").slice(1).join(" ") || machineName, // Rest as model
        category: categoryId,
      };

      const callBack = (res: any) => {
        if (res.success) {
          // Create a machine object that matches our Machine interface
          const createdMachine: Machine = {
            id: res.data.id,
            manufacturer: res.data.manufacturer || newMachine.manufacturer,
            model: res.data.model || newMachine.model,
            nickName: res.data.nickName || newMachine.nickName,
            category: res.data.category || categoryId,
            categoryId: categoryId,
          };

          // Determine which step this machine belongs to and add it to the appropriate category
          let targetCategory: FinishingCategory | undefined;
          let stepNumber = 0; // Default to step 0 (printing machines)
          let machineType: "printing" | "finishing" = "printing"; // Default to printing

          // Check if this is a finishing category
          if (finishingCategories.some((cat) => cat.id === categoryId)) {
            targetCategory = finishingCategories.find(
              (cat) => cat.id === categoryId
            );
            stepNumber = 1;
            machineType = "finishing";
          } else if (
            bookFinishingCategories.some((cat) => cat.id === categoryId)
          ) {
            targetCategory = bookFinishingCategories.find(
              (cat) => cat.id === categoryId
            );
            stepNumber = 2;
            machineType = "finishing";
          } else if (
            rollFlexoFinishingCategories.some((cat) => cat.id === categoryId)
          ) {
            targetCategory = rollFlexoFinishingCategories.find(
              (cat) => cat.id === categoryId
            );
            stepNumber = 3;
            machineType = "finishing";
          } else if (
            wideFormatFinishingCategories.some((cat) => cat.id === categoryId)
          ) {
            targetCategory = wideFormatFinishingCategories.find(
              (cat) => cat.id === categoryId
            );
            stepNumber = 4;
            machineType = "finishing";
          } else if (
            dtfSublimationFinishingCategories.some(
              (cat) => cat.id === categoryId
            )
          ) {
            targetCategory = dtfSublimationFinishingCategories.find(
              (cat) => cat.id === categoryId
            );
            stepNumber = 5;
            machineType = "finishing";
          } else if (packagingCategories.some((cat) => cat.id === categoryId)) {
            targetCategory = packagingCategories.find(
              (cat) => cat.id === categoryId
            );
            stepNumber = 6;
            machineType = "finishing";
          }

          if (targetCategory) {
            // Add the new machine to the category's machines array
            targetCategory.machines.push(createdMachine);
          }

          // Add the machine to the selected machines
          const newSelectedMachine = convertMachineToSelectedMachine(
            createdMachine,
            categoryId,
            stepNumber,
            machineType
          );

          // Add to unified selection
          setSelectedMachines((prev) => [...prev, newSelectedMachine]);

          // If it's a finishing machine, also add to step-specific selection
          if (machineType === "finishing") {
            const newSelectedFinishingMachine =
              convertMachineToSelectedFinishingMachine(
                createdMachine,
                categoryId,
                stepNumber
              );

            // Add to step-specific selection based on the category
            if (finishingCategories.some((cat) => cat.id === categoryId)) {
              setSelectedFinishingMachines((prev) => [
                ...prev,
                newSelectedFinishingMachine,
              ]);
            } else if (
              bookFinishingCategories.some((cat) => cat.id === categoryId)
            ) {
              setSelectedBookFinishingMachines((prev) => [
                ...prev,
                newSelectedFinishingMachine,
              ]);
            } else if (
              rollFlexoFinishingCategories.some((cat) => cat.id === categoryId)
            ) {
              setSelectedRollFlexoFinishingMachines((prev) => [
                ...prev,
                newSelectedFinishingMachine,
              ]);
            } else if (
              wideFormatFinishingCategories.some((cat) => cat.id === categoryId)
            ) {
              setSelectedWideFormatFinishingMachines((prev) => [
                ...prev,
                newSelectedFinishingMachine,
              ]);
            } else if (
              dtfSublimationFinishingCategories.some(
                (cat) => cat.id === categoryId
              )
            ) {
              setSelectedDtfSublimationFinishingMachines((prev) => [
                ...prev,
                newSelectedFinishingMachine,
              ]);
            } else if (
              packagingCategories.some((cat) => cat.id === categoryId)
            ) {
              setSelectedPackagingMachines((prev) => [
                ...prev,
                newSelectedFinishingMachine,
              ]);
            }
          }

          alertSuccessAdded();
        } else {
          alertFaultAdded();
        }
      };

      await printHouseAddNewMachine(callApi, callBack, newMachine);
    } catch (error) {
      console.error("Error adding new machine:", error);
      alertFaultAdded();
    }
  };

  return (
    <Box sx={{ p: "0px 24px 24px 24px" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {t("Quick Machines Setup")}
      </Typography>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper
          activeStep={dynamicSteps.findIndex((step) => step.id === currentStep)}
          alternativeLabel
        >
          {dynamicSteps.map((step, index) => (
            <Step key={step.id}>
              <StepLabel>{t(step.title)}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t(dynamicSteps.find((step) => step.id === currentStep)?.title || "")}
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
          {dynamicSteps.find((step) => step.id === currentStep)?.description ||
            ""}
        </Typography>

        {/* Step 1: All Machines Selection */}
        {currentStep === 0 && (
          <Step1MachineSelection
            allMachines={allMachines}
            machinesLoading={machinesLoading}
            selectedMachines={selectedMachines}
            onAddMachine={handleAddMachine}
            onDeleteMachine={handleDeleteMachine}
            hasDigitalOrOffsetPrinting={selectedMachines.some(
              (m) => m.machineType === "printing"
            )}
            onAddNewMachine={handleAddNewMachine}
          />
        )}

        {/* Step 2: Digital/Sheet Finishing */}
        {currentStep === 1 &&
          (hasDigitalOrOffsetPrinting() ? (
            <Step2FinishingSelection
              finishingCategories={finishingCategories}
              selectedFinishingMachines={selectedFinishingMachines}
              selectedCategoryMachines={selectedCategoryMachines}
              onAddFinishingMachine={handleAddFinishingMachine}
              onDeleteFinishingMachine={handleDeleteFinishingMachine}
              onCategoryMachineChange={handleCategoryMachineChange}
              onAddNewMachine={handleAddNewMachine}
            />
          ) : (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                No Digital/Offset printing machines selected. This step is not
                applicable.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                You can proceed to the next step or go back to select
                Digital/Offset printing machines.
              </Typography>
            </Box>
          ))}

        {/* Step 3: Book Finishing */}
        {currentStep === 2 &&
          (hasDigitalOrOffsetPrinting() ? (
            <Step3BookFinishingSelection
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
              onAddNewMachine={handleAddNewMachine}
            />
          ) : (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                No Digital/Offset printing machines selected. This step is not
                applicable.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                You can proceed to the next step or go back to select
                Digital/Offset printing machines.
              </Typography>
            </Box>
          ))}

        {/* Step 4: Roll/Flexo Finishing */}
        {currentStep === 3 &&
          (hasRollOrFlexoPrinting() ? (
            <Step4RollFlexoFinishingSelection
              rollFlexoFinishingCategories={rollFlexoFinishingCategories}
              selectedRollFlexoFinishingMachines={
                selectedRollFlexoFinishingMachines
              }
              selectedRollFlexoFinishingCategoryMachines={
                selectedRollFlexoFinishingCategoryMachines
              }
              onAddRollFlexoFinishingMachine={
                handleAddRollFlexoFinishingMachine
              }
              onDeleteRollFlexoFinishingMachine={
                handleDeleteRollFlexoFinishingMachine
              }
              onRollFlexoFinishingCategoryMachineChange={
                handleRollFlexoFinishingCategoryMachineChange
              }
              onAddNewMachine={handleAddNewMachine}
            />
          ) : (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                No Roll/Flexo printing machines selected. This step is not
                applicable.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                You can proceed to the next step or go back to select Roll/Flexo
                printing machines.
              </Typography>
            </Box>
          ))}

        {/* Step 5: Wide Format Finishing */}
        {currentStep === 4 &&
          (hasWidePrinting() ? (
            <Step5WideFormatFinishingSelection
              wideFormatFinishingCategories={wideFormatFinishingCategories}
              selectedWideFormatFinishingMachines={
                selectedWideFormatFinishingMachines
              }
              selectedWideFormatFinishingCategoryMachines={
                selectedWideFormatFinishingCategoryMachines
              }
              onAddWideFormatFinishingMachine={
                handleAddWideFormatFinishingMachine
              }
              onDeleteWideFormatFinishingMachine={
                handleDeleteWideFormatFinishingMachine
              }
              onWideFormatFinishingCategoryMachineChange={
                handleWideFormatFinishingCategoryMachineChange
              }
              onAddNewMachine={handleAddNewMachine}
            />
          ) : (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                No Wide Format printing machines selected. This step is not
                applicable.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                You can proceed to the next step or go back to select Wide
                Format printing machines.
              </Typography>
            </Box>
          ))}

        {/* Step 6: DTF/Sublimation Finishing */}
        {currentStep === 5 &&
          (hasDtfOrSublimationPrinting() ? (
            <Step6DtfSublimationFinishingSelection
              dtfSublimationFinishingCategories={
                dtfSublimationFinishingCategories
              }
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
              onAddNewMachine={handleAddNewMachine}
            />
          ) : (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                No DTF/Sublimation printing machines selected. This step is not
                applicable.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                You can proceed to the next step or go back to select
                DTF/Sublimation printing machines.
              </Typography>
            </Box>
          ))}

        {/* Step 7: Packaging */}
        {currentStep === 6 && (
          <Step7PackagingSelection
            packagingCategories={packagingCategories}
            selectedPackagingMachines={selectedPackagingMachines}
            selectedPackagingCategoryMachines={
              selectedPackagingCategoryMachines
            }
            onAddPackagingMachine={handleAddPackagingMachine}
            onDeletePackagingMachine={handleDeletePackagingMachine}
            onPackagingCategoryMachineChange={
              handlePackagingCategoryMachineChange
            }
            onAddNewMachine={handleAddNewMachine}
          />
        )}
      </Paper>

      {/* Navigation Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          {t("Back")}
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            handleNext(
              selectedMachines,
              selectedFinishingMachines,
              selectedBookFinishingMachines,
              selectedWideFormatFinishingMachines,
              selectedDtfSublimationFinishingMachines,
              selectedRollFlexoFinishingMachines,
              selectedPackagingMachines
            )
          }
          disabled={isNextDisabled(
            selectedMachines,
            selectedFinishingMachines,
            selectedBookFinishingMachines,
            selectedWideFormatFinishingMachines,
            selectedDtfSublimationFinishingMachines,
            selectedRollFlexoFinishingMachines,
            selectedPackagingMachines
          )}
        >
          {t(getNextButtonText(selectedMachines))}
        </Button>
      </Box>

      {/* Summary - Show all selected machines */}
      {selectedMachines.length > 0 && (
        <Paper sx={{ p: 2, mt: 3, backgroundColor: "#e8f5e8" }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Total Selected Machines: {selectedMachines.length}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {selectedMachines.map((machine) => (
              <Chip
                key={machine.id}
                label={`${machine.name} (${machine.machineType || "printing"})`}
                size="small"
                color={
                  machine.machineType === "finishing" ? "secondary" : "primary"
                }
                variant="outlined"
              />
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default QuickSetupFlow;
