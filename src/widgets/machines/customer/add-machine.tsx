import {SideList} from "@/widgets/machines/components/side-list/side-list";
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
import {SideBarContainer} from "@/components/containers/side-bar-container";
import {useTranslation} from "react-i18next";

const CustomerAddMachine = () => {
    const router = useRouter();
    const {categoryId} = router.query;
    const [activeStep, setActiveStep] = useState<number>(0);
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
        setActiveStep(0);
    };
    const moveToStepByIndex = (stepIndex: number) => {
        setActiveStep(stepIndex)
    }

    const Side = () => (
        <SideList
            list={getMachinesList}
            selectedItem={selectedMachine.id}
            onSelect={onSelectMachine}
            title={"Choose machines"}
        >
            <GomakePrimaryButton
                disabled={!selectedMachine.id}
                style={{height: 40}}
                onClick={addPrintHouseMachine}
            >
                {t('navigationButtons.add')}
            </GomakePrimaryButton>
        </SideList>
    );
    return (
        <SideBarContainer
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
                    moveToStep={moveToStepByIndex}
                />
            )}
        </SideBarContainer>
    );
};

export {CustomerAddMachine};
