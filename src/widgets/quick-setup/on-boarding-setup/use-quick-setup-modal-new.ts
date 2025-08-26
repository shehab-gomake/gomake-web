import { useState } from "react";
import { useModal } from "@/hooks/use-modal";

interface SelectedMachine {
  id: string;
  name: string;
  category: string;
  categoryName: string;
}

const useQuickSetupModalNew = () => {
  const modal = useModal();
  const [selectedMachines, setSelectedMachines] = useState<SelectedMachine[]>(
    []
  );

  const openModal = () => {
    modal.open();
  };

  const closeModal = () => {
    modal.close();
  };

  const handleSave = (machines: SelectedMachine[]) => {
    setSelectedMachines(machines);
    console.log("Selected machines:", machines);
    // Here you can add additional logic like API calls to save the selected machines
  };

  const clearSelectedMachines = () => {
    setSelectedMachines([]);
  };

  return {
    modal,
    selectedMachines,
    openModal,
    closeModal,
    handleSave,
    clearSelectedMachines,
  };
};

export { useQuickSetupModalNew };
export type { SelectedMachine };

