import {MachineStepper} from "@/widgets/machines/components/stepper/machines-stepper";
import {useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import {machineCategoriesState} from "@/store/machine-categories";
import {IStep} from "@/widgets/machines/utils/interface/step";
import {getSteps} from "@/widgets/machines/utils/steps";
import {usePrintHouseAddMachine} from "@/widgets/machines/hooks/use-print-house-add-machine";
import {useAdminMachines} from "@/widgets/machines/hooks/use-admin-machines";
import {useRouter} from "next/router";
import {machineState} from "@/widgets/machines/state/machine-state";
import {GomakePrimaryButton} from "@/components";
import {useTranslation} from "react-i18next";
import {MachinesContainer} from "@/components/containers/machines-container/machines-container";
import {MachinesSideList} from "@/components/containers/machines-container/side-list/machines-side-list";
import {NavigationButtons} from "@/widgets/machines/components/forms/navigationButtons";

const CustomerAddMachine = () => {
    const router = useRouter();
    const {categoryId} = router.query;
    const [activeStep, setActiveStep] = useState<number>(-1);
    const categories = useRecoilValue(machineCategoriesState);
    const [categoryName, setCategoryName] = useState<string>();
    const [machineSteps, setMachineSteps] = useState<IStep[]>([]);
    const {getMachinesList, setMachine, getAndSetAdminMachines} = useAdminMachines();
    const {addPrintHouseMachine} = usePrintHouseAddMachine();
    const selectedMachine = useRecoilValue(machineState);
    const {t} = useTranslation();

    useEffect(() => {
        getAndSetAdminMachines().then()
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
        setActiveStep(-1);
    };
    const moveToStepByIndex = (stepIndex: number) => {
        setActiveStep(stepIndex)
    }

    const ActionsFooter = () => {
        return activeStep >= 0 &&
            <NavigationButtons canAddMachine={true}
                               canUpdate={false} onClickAddMachine={addPrintHouseMachine}
                               onClickUpdate={() => {}} onClickNext={navigateNext} onClickBack={navigateBack}
                               hasBack={activeStep > 0} hasNext={activeStep + 1 < machineSteps.length}/>
    }
    const Side = () => (
        <MachinesSideList
            list={getMachinesList}
            selectedItem={selectedMachine.id}
            onSelect={onSelectMachine}
            title={"Choose machines"}
        />
    );
    return (
        <MachinesContainer
            side={Side()}
            actions={ActionsFooter()}
            header={"Add new " + t(categoryName) + " machine"}
            sideAction={<GomakePrimaryButton
                disabled={!selectedMachine.id}
                style={{width: '80%', margin: 'auto', height: 40}}
                onClick={addPrintHouseMachine}
            >
                {t('navigationButtons.add')}
            </GomakePrimaryButton>}
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
                    moveToStep={moveToStepByIndex}
                />
            )}
        </MachinesContainer>
    );
};

export {CustomerAddMachine};
