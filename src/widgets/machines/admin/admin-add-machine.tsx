import {useCallback, useState} from "react";
import {MachineStepper} from "@/widgets/machines/components/stepper/machines-stepper";
import {useMachinesCategories} from "@/widgets/machines/hooks/use-machines-categories";
import {getSteps} from "@/widgets/machines/utils/steps";
import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {useAdminAddMachine} from "@/widgets/machines/hooks/use-admin-add-machine";
import {SideBarContainer} from "@/components/containers/side-container/side-bar-container";
import {MachinesSideList} from "@/components/containers/machines-container/side-list/machines-side-list";

const AdminAddMachine = () => {
    const {categoryList, categoryName} = useMachinesCategories();
    const [selectedCategory, setSelectedCategory] = useState<string>();
    const [activeStep, setActiveStep] = useState<number>(-1);
    const {adminAddMachine, initMachineStateCategory} = useAdminAddMachine()

    const getCategorySteps = useCallback(() => {
        return getSteps(selectedCategory as ECategoryId, true);
    }, [selectedCategory])
    const navigateBack = () => {
        setActiveStep(activeStep - 1);
    }
    const navigateNext = () => {
        setActiveStep(activeStep + 1);
    }
    const onSelectCategory = (value: string) => {
        setSelectedCategory(value);
        initMachineStateCategory(value as ECategoryId);
        setActiveStep(0);
    }
    const moveToStepByIndex = (stepIndex: number) => {
        setActiveStep(stepIndex)
    }
    const Side = () => <MachinesSideList list={categoryList} selectedItem={selectedCategory} onSelect={onSelectCategory}
                                 title={'Categories'}/>
  return (
      <SideBarContainer side={Side()} header={categoryName(selectedCategory)} subHeader={'Add Machine'}>

          <MachineStepper steps={getCategorySteps()} activeStep={activeStep} previousStep={navigateBack}
                          nextStep={navigateNext} actionButtonClicked={adminAddMachine} moveToStep={moveToStepByIndex}
                          isAddForm={true}/>
      </SideBarContainer>  );
}

export {AdminAddMachine}