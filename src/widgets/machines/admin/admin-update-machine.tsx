import {MachineStepper} from "@/widgets/machines/components/stepper/machines-stepper";
import {useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import {machineCategoriesState} from "@/store/machine-categories";
import {IStep} from "@/widgets/machines/utils/interface/step";
import {getSteps} from "@/widgets/machines/utils/steps";
import {useAdminMachines} from "@/widgets/machines/hooks/use-admin-machines";
import {useRouter} from "next/router";
import {machineState} from "@/widgets/machines/state/machine-state";
import {useAdminAddMachine} from "@/widgets/machines/hooks/use-admin-add-machine";
import {SideBarContainer} from "@/components/containers/side-container/side-bar-container";
import {MachinesSideList} from "@/components/containers/machines-container/side-list/machines-side-list";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

const AdminUpdateMachine = () => {
    const router = useRouter();
    const {t} = useTranslation();
    const {categoryId} = router.query;
    const [activeStep, setActiveStep] = useState<number>(0);
    const categories = useRecoilValue(machineCategoriesState);
    const [categoryName, setCategoryName] = useState<string>();
    const [machineSteps, setMachineSteps] = useState<IStep[]>([]);
    const {getMachinesList, setMachine, getAndSetAdminMachines} = useAdminMachines();
    const {updateMachine} = useAdminAddMachine();
    const selectedMachine = useRecoilValue(machineState);

    useEffect(() => {
        getAndSetAdminMachines().then();
        if (categoryId) {
            const category = categories.find(category => category.id === categoryId)
            setCategoryName(category?.name ? t(category?.name) : '');
            if (category) setMachineSteps(getSteps(category.id, true));
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
    const moveToStepByIndex = (stepIndex: number) => {
        setActiveStep(stepIndex)
    }

    const Side = () => <MachinesSideList list={getMachinesList} selectedItem={selectedMachine?.id} onSelect={onSelectMachine}
                                 title={t("machineAttributes.machines")} quickActions={true} isAdmin={true}/>
    return (
        <SideBarContainer side={Side()} header={categoryName} subHeader={ selectedMachine.manufacturer ? selectedMachine?.manufacturer + ' - ' + selectedMachine?.model : ''}>
            <Button variant={'contained'} onClick={updateMachine}>{t("machines.updateMachine")}</Button>
            {!!selectedMachine.id && <MachineStepper steps={machineSteps} activeStep={activeStep} previousStep={navigateBack}
                                                     nextStep={navigateNext} actionButtonClicked={updateMachine}
                                                     moveToStep={moveToStepByIndex}
                                                     isAddForm={false}/>}
        </SideBarContainer>
    );
}

export {AdminUpdateMachine}