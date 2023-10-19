import {SideList} from "@/widgets/machines/components/side-list/side-list";
import {MachineStepper} from "@/widgets/machines/components/stepper/machines-stepper";
import {useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import {machineCategoriesState} from "@/store/machine-categories";
import {IStep} from "@/widgets/machines/utils/interface/step";
import {getSteps} from "@/widgets/machines/utils/steps";
import {useRouter} from "next/router";
import {usePrintHouseMachines} from "@/widgets/machines/hooks/use-print-house-machines";
import {machineState} from "@/widgets/machines/state/machine-state";
import {SecondaryButton} from "@/components/button/secondary-button";
import {usePrintHouseAddMachine} from "@/widgets/machines/hooks/use-print-house-add-machine";
import {SideBarContainer} from "@/components/containers/side-bar-container";
import {useTranslation} from "react-i18next";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";

const CustomerEditMachines = () => {
    const router = useRouter();
    const {categoryId} = router.query;
    const [activeStep, setActiveStep] = useState<number>(0);
    const categories = useRecoilValue(machineCategoriesState);
    const [categoryName, setCategoryName] = useState<string>();
    const [machineSteps, setMachineSteps] = useState<IStep[]>([]);
    const selectedMachine = useRecoilValue(machineState);
    const {getPrintHouseMachinesList, setMachine, getAndSetMachines} = usePrintHouseMachines();
    const {updateMachine} = usePrintHouseAddMachine();
    const {t} = useTranslation();

    useEffect(() => {
        getAndSetMachines();
        if (categoryId) {
            const category = categories.find(category => category.id === categoryId)
            setCategoryName(category?.name ? category?.name : '');
            if (category) setMachineSteps(getSteps(category.id, false));
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
    const Side = () => {
        return <SideList list={getPrintHouseMachinesList()} selectedItem={selectedMachine?.id} onSelect={onSelectMachine}
                         title={'Machines'} quickActions={true}>
                            <PermissionCheck userPermission={Permissions.ADD_MACHINE} >
                                         <SecondaryButton variant={'contained'} style={{width: '100%'}} href={`/machines/add-machine/category/${categoryId}`}>{t('navigationButtons.add')}</SecondaryButton>
                            </PermissionCheck>
        </SideList>
    }
    return (
        <SideBarContainer side={Side()} header={categoryName}
                       subHeader={selectedMachine?.manufacturer && selectedMachine?.nickName ? selectedMachine?.manufacturer + ' - ' + selectedMachine?.nickName : ''}>
            {!!selectedMachine?.id &&
                <MachineStepper steps={machineSteps} activeStep={activeStep} previousStep={navigateBack}
                                nextStep={navigateNext} actionButtonClicked={updateMachine} moveToStep={moveToStepByIndex}
                                isAddForm={false}/>}
        </SideBarContainer>

    );
}


export {CustomerEditMachines}