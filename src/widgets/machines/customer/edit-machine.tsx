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
import {StepType} from "@reactour/tour";
import {useGoMakeTour} from "@/hooks/use-go-make-tour";
import {GoMakeModal} from "@/components";
import {AddMachineModal} from "@/widgets/machines/customer/add-machine-modal";

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
    const [openAddMachineModal, setOpenAddMachineModal] = useState<boolean>(false);

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
                               canUpdate={true} onClickAddMachine={() => {
            }}
                               onClickUpdate={updateMachine} onClickNext={navigateNext} onClickBack={navigateBack}
                               hasBack={activeStep > 0} hasNext={activeStep + 1 < machineSteps.length}/>
    }
    const Side = () => {
        return <MachinesSideList list={getPrintHouseMachinesList()} selectedItem={selectedMachine?.id}
                                 onSelect={onSelectMachine}
                                 title={t("machineAttributes.machines")} quickActions={true}>
        </MachinesSideList>
    }
    const editMachinesSteps: StepType[] = [
        {
            selector: '[data-tour="machinesList"]',
            content: 'Here, you can navigate between your digital printer modules and add new ones as needed.',
            position: 'right',
        },
        {
            selector: '[data-tour="editMachineStepper"]',
            content: 'Here, you can edit your machine  costs, speed, media compatibility, and more.\n',
            position: 'bottom',
        },
        {
            selector: '[data-tour="menuActions"]',
            content: 'Take your time to explore and discover all machine details later.\n' +
                'Now, let\'s proceed to view the most important part.\n' +
                'Please press "Action" in the bar.',
            position: 'top',
            styles: {
                maskWrapper: (base) => ({...base, zIndex: 1000000}),
            },
        },
    ]
    const {} = useGoMakeTour(editMachinesSteps, []);
    return (
        <>
            <MachinesContainer side={Side()} header={t(categoryName)}
                               sideDataTour={'machinesList'}
                               bodyDataTour={'editMachineStepper'}
                               actions={ActionsFooter()}
                               sideAction={<SecondaryButton onClick={() => setOpenAddMachineModal(true)}
                                                            variant={'contained'} style={{
                                   width: '80%',
                                   margin: 'auto'
                               }}>{t('navigationButtons.add')}</SecondaryButton>}
                               subHeader={selectedMachine?.manufacturer && selectedMachine?.nickName ? selectedMachine?.manufacturer + ' - ' + selectedMachine?.nickName : ''}>
                {!!selectedMachine?.id &&
                    <MachineStepper steps={machineSteps} activeStep={activeStep} previousStep={navigateBack}
                                    nextStep={navigateNext} actionButtonClicked={updateMachine}
                                    moveToStep={moveToStepByIndex}
                                    isAddForm={false}/>
                }
            </MachinesContainer>
            <GoMakeModal insideStyle={{width: 'fit-content', height: 'fit-content'}} openModal={openAddMachineModal} onClose={()=> setOpenAddMachineModal(false)} modalTitle={t('tabs.addMachine')}>
                <AddMachineModal closeModal={()=>setOpenAddMachineModal(false)}/>
            </GoMakeModal>
        </>

    );
}


export {CustomerEditMachines}