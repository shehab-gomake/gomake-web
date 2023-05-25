import {SideList} from "@/widgets/machines/components/side-list/side-list";
import {MachineStepper} from "@/widgets/machines/components/stepper/machines-stepper";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useRecoilValue} from "recoil";
import {machineCategoriesState} from "@/store/machine-categories";
import {IStep} from "@/widgets/machines/utils/interface/step";
import {getSteps} from "@/widgets/machines/utils/steps";
import {NextButton} from "@/widgets/machines/utils/forms/navigationButtons";
import {MachineLayout} from "@/widgets/machines/components/layout/machine-layout";
import {usePrintHouseUpdateMachine} from "@/widgets/machines/hooks/use-print-house-update-machine";
import {useRouter} from "next/router";
import {usePrintHouseMachines} from "@/widgets/machines/hooks/use-print-house-machines";
import {machineState} from "@/widgets/machines/utils/state/machine-state";

const CustomerEditMachines = () => {
    const router = useRouter();
    const {categoryId} = router.query;
    const [activeStep, setActiveStep] = useState<number>(0);
    const categories = useRecoilValue(machineCategoriesState);
    const [categoryName, setCategoryName] = useState<string>();
    const [machineSteps, setMachineSteps] = useState<IStep[]>([]);
    const {updateMachine} = usePrintHouseUpdateMachine();
    const selectedMachine = useRecoilValue(machineState);
    const {getPrintHouseMachinesList, setMachine} = usePrintHouseMachines()
    const {t} = useTranslation();
    useEffect(() => {
        getPrintHouseMachinesList();
        if (categoryId) {
            const category = categories.find(category => category.id === categoryId)
            setCategoryName(category?.name ? category?.name : '');
            if (category) setMachineSteps(getSteps(category.id));
        }
    }, [categoryId]);
    const navigateBack = () => {
        setActiveStep(activeStep - 1);
    }
    const navigateNext = () => {
        setActiveStep(activeStep + 1);
    }
    const onSelectMachine = (value: string) => {
        setMachine(value);
        setActiveStep(0);
    }
    const Side = () => {
        return <SideList list={getPrintHouseMachinesList()} selectedItem={selectedMachine.id} onSelect={onSelectMachine}
                         title={'Machines'} quickActions={true}>
            <NextButton style={{width: '100%'}} href={`/machines/add-machine/category/${categoryId}`}> add
                Machine</NextButton>
        </SideList>
    }
    return (
        <MachineLayout side={Side()} header={categoryName}
                       subHeader={selectedMachine.manufacturer && selectedMachine.nickName ? selectedMachine.manufacturer + ' - ' + selectedMachine.nickName : ''}>
            {!!selectedMachine.id &&
                <MachineStepper steps={machineSteps} activeStep={activeStep} previousStep={navigateBack}
                                nextStep={navigateNext} actionButtonClicked={updateMachine}
                                isAddForm={false}/>}
        </MachineLayout>

    );
}


export {CustomerEditMachines}