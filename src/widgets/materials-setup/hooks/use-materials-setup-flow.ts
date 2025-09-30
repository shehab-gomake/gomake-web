import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeRouter } from "@/hooks/use-gomake-router";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { useGomakeAxios } from "@/hooks";
import { useMachines } from "../../employees-working-hours-widgets/use-machines";
import { ECategoryId } from "../../machines/enums/category-id";
import { updatePrintHouseSetupStepsApi } from "@/services/api-service/quick-setup-menu/set-up-api";
import { SetupStep, StepStatus } from "@/store/print-house-setup-state-state";
import { quickSetupAddMaterials } from "@/services/api-service/materials/quick-setup-materials-endpoints";

interface MaterialValue {
  valueKey: string;
  value: string | number;
}

interface MaterialSize {
  index: number;
  values: MaterialValue[];
}

interface SelectedMaterial {
  materialTypeKey: string;
  categoryKey: string;
  sizes: MaterialSize[];
}

interface StepData {
  id: string;
  title: string;
  index: number;
}

export const useMaterialsSetupFlow = () => {
  const { t } = useTranslation();
  const { alertSuccessAdded, alertFaultAdded } = useSnackBar();
  const { navigate } = useGomakeRouter();
  const { callApi } = useGomakeAxios();
  const { machines, machinesLoading, machinesFetched, getMachines } =
    useMachines();

  // State management
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<
    SelectedMaterial[]
  >([]);
  const [availableSteps, setAvailableSteps] = useState<StepData[]>([]);

  // Setup step management
  const updatePrintHouseSetupSteps = async (
    step: SetupStep,
    status: StepStatus = StepStatus.DONE
  ) => {
    try {
      const updatedStep = {
        step: step,
        status: status,
      };

      await updatePrintHouseSetupStepsApi(callApi, () => {}, updatedStep);
    } catch (error) {
      console.error("Error updating setup steps:", error);
    }
  };

  // Mark materials setup as in progress when component mounts
  // useEffect(() => {
  //   updatePrintHouseSetupSteps(
  //     SetupStep.SETUP_YOUR_MATERIALS,
  //     StepStatus.IN_PROGRESS
  //   );
  // }, []);

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

        const stepsToShow: StepData[] = [];
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

        // Check for Step 3 & 4: Wide format and Flatbeds (FLATBED_WIDE_PRINTING or ROLL_WIDE_PRINTING)
        if (
          machineCategories.includes(ECategoryId.FLATBED_WIDE_PRINTING) ||
          machineCategories.includes(ECategoryId.ROLL_WIDE_PRINTING)
        ) {
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

  // Navigation functions
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

  // Complete setup function
  // const handleCompleteSetupMaterials = async () => {
  //   try {
  //     const callBack = async (res: any) => {
  //       if (res.success) {
  //         await updatePrintHouseSetupSteps(
  //           SetupStep.SETUP_YOUR_MATERIALS,
  //           StepStatus.DONE
  //         );
  //         alertSuccessAdded();
  //         navigate("/");
  //       } else {
  //         alertFaultAdded();
  //       }
  //     };

  //     await quickSetupAddMaterials(callApi, callBack, selectedMaterials);
  //   } catch (error) {
  //     console.error("Error completing setup:", error);
  //     alertFaultAdded();
  //   }
  // };

  // Modal functions
  const openConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  // Computed values
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === availableSteps.length - 1;
  const hasNoRelevantMachines =
    !machinesLoading && machinesFetched && availableSteps.length === 0;

  return {
    // State
    currentStep,
    showConfirmModal,
    selectedMaterials,
    availableSteps,
    machines,
    machinesLoading,
    machinesFetched,

    // Computed values
    isFirstStep,
    isLastStep,
    hasNoRelevantMachines,

    // Functions
    handleNext,
    handleBack,
    // handleCompleteSetupMaterials,
    openConfirmModal,
    closeConfirmModal,
    setSelectedMaterials,

    // Translation
    t,
  };
};
