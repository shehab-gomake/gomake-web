import { SideList } from "@/widgets/machines/components/side-list/side-list";
import { MachineStepper } from "@/widgets/machines/components/stepper/machines-stepper";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { machineCategoriesState } from "@/store/machine-categories";
import { IStep } from "@/widgets/machines/utils/interface/step";
import { getSteps } from "@/widgets/machines/utils/steps";
import { usePrintHouseAddMachine } from "@/widgets/machines/hooks/use-print-house-add-machine";
import { MachineLayout } from "@/widgets/machines/components/layout/machine-layout";
import { useAdminMachines } from "@/widgets/machines/hooks/use-admin-machines";
import { useRouter } from "next/router";
import { machineState } from "@/widgets/machines/state/machine-state";
import {GomakePrimaryButton} from "@/components";

const CustomerAddMachine = () => {
  const router = useRouter();
  const { categoryId } = router.query;
  const [activeStep, setActiveStep] = useState<number>(0);
  const categories = useRecoilValue(machineCategoriesState);
  const [categoryName, setCategoryName] = useState<string>();
  const [machineSteps, setMachineSteps] = useState<IStep[]>([]);
  const { getMachinesList, setMachine } = useAdminMachines();
  const { addPrintHouseMachine } = usePrintHouseAddMachine();
  const selectedMachine = useRecoilValue(machineState);

  useEffect(() => {
    if (categoryId) {
      const category = categories.find(
        (category) => category.id === categoryId
      );
      setCategoryName(category?.name ? category?.name : "");
      if (category) setMachineSteps(getSteps(category.id, false));
    }
  }, [categoryId]);
  const navigateBack = () => {
    setActiveStep(activeStep - 1);
  };
  const navigateNext = () => {
    setActiveStep(activeStep + 1);
  };
  const onSelectMachine = (value: string) => {
    setMachine(value);
    setActiveStep(0);
  };

  const Side = () => (
    <SideList
      list={getMachinesList}
      selectedItem={selectedMachine.id}
      onSelect={onSelectMachine}
      title={"Choose machines"}
    >
      <GomakePrimaryButton
        disabled={!selectedMachine.id}
        style={{ height: 40 }}
        onClick={addPrintHouseMachine}
      >
        Add Machine
      </GomakePrimaryButton>
    </SideList>
  );
  return (
    <MachineLayout
      side={Side()}
      header={"Add new " + categoryName + " machine"}
      subHeader={
        selectedMachine.manufacturer && selectedMachine.nickName
          ? selectedMachine.manufacturer + " - " + selectedMachine.nickName
          : ""
      }
    >
      {!!selectedMachine.id && (
        <MachineStepper
          steps={machineSteps}
          activeStep={activeStep}
          previousStep={navigateBack}
          nextStep={navigateNext}
          actionButtonClicked={addPrintHouseMachine}
          isAddForm={true}
        />
      )}
    </MachineLayout>
  );
};

export { CustomerAddMachine };
