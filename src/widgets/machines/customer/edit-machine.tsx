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
import {useTranslation} from "react-i18next";
import {MachinesContainer} from "@/components/containers/machines-container/machines-container";
import {MachinesSideList} from "@/components/containers/machines-container/side-list/machines-side-list";
import {NavigationButtons} from "@/widgets/machines/components/forms/navigationButtons";

const CustomerEditMachines = () => {
    const router = useRouter();
    const {categoryId} = router.query;
    const [activeStep, setActiveStep] = useState<number>(-1);
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
        setActiveStep(-1);
    }
    const moveToStepByIndex = (stepIndex: number) => {
        setActiveStep(stepIndex)
    }
    const ActionsFooter = () => {
        return activeStep >= 0 &&
            <NavigationButtons canAddMachine={activeStep + 1 === machineSteps.length}
                               canUpdate={true} onClickAddMachine={() => {}}
                               onClickUpdate={updateMachine} onClickNext={navigateNext} onClickBack={navigateBack}
                               hasBack={activeStep > 0} hasNext={activeStep + 1 < machineSteps.length}/>
    }
    const Side = () => {
        return <MachinesSideList list={getPrintHouseMachinesList()} selectedItem={selectedMachine?.id}
                                 onSelect={onSelectMachine}
                                 title={t("machineAttributes.machines")} quickActions={true}>
        </MachinesSideList>
    }
    return (
        <MachinesContainer side={Side()} header={t(categoryName)}
                           actions={ActionsFooter()}
                           sideAction={<SecondaryButton variant={'contained'} style={{width: '80%', margin: 'auto'}}
                                                                  href={`/machines/add-machine/category/${categoryId}`}>{t('navigationButtons.add')}</SecondaryButton>}
                           subHeader={selectedMachine?.manufacturer && selectedMachine?.nickName ? selectedMachine?.manufacturer + ' - ' + selectedMachine?.nickName : ''}>
            {!!selectedMachine?.id &&
                <MachineStepper steps={machineSteps} activeStep={activeStep} previousStep={navigateBack}
                                nextStep={navigateNext} actionButtonClicked={updateMachine}
                                moveToStep={moveToStepByIndex}
                                isAddForm={false}/>
            }
        </MachinesContainer>

    );
}


export {CustomerEditMachines}