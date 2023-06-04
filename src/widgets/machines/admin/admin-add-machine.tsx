import {SideList} from "@/widgets/machines/components/side-list/side-list";
import {useCallback, useState} from "react";
import {MachineStepper} from "@/widgets/machines/components/stepper/machines-stepper";
import {MachineLayout} from "@/widgets/machines/components/layout/machine-layout";
import {useMachinesCategories} from "@/widgets/machines/hooks/use-machines-categories";
import {getSteps} from "@/widgets/machines/utils/steps";
import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {useAdminAddMachine} from "@/widgets/machines/hooks/use-admin-add-machine";

const AdminAddMachine = () => {
    const {categoryList, categoryName} = useMachinesCategories();
    const [selectedCategory, setSelectedCategory] = useState<string>(categoryList[0].value);
    const [activeStep, setActiveStep] = useState<number>(0);
    const {adminAddMachine, initMachineStateCategory} = useAdminAddMachine()

    const getCategorySteps = useCallback(() => {
        return getSteps(selectedCategory as ECategoryId);
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
    const Side = () => <SideList list={categoryList} selectedItem={selectedCategory} onSelect={onSelectCategory}
                                 title={'Categories'}/>
  return (
      <MachineLayout side={Side()} header={categoryName(selectedCategory)} subHeader={'Machine Name'}>

          <MachineStepper steps={getCategorySteps()} activeStep={activeStep} previousStep={navigateBack}
                          nextStep={navigateNext} actionButtonClicked={adminAddMachine}
                          isAddForm={true}/>
      </MachineLayout>  );
}

export {AdminAddMachine}