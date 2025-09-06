import { MachineStepper } from "@/widgets/machines/components/stepper/machines-stepper";
import React, { useEffect, useState, useCallback } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { machineCategoriesState } from "@/store/machine-categories";
import { IStep } from "@/widgets/machines/utils/interface/step";
import { getSteps } from "@/widgets/machines/utils/steps";
import { useRouter } from "next/router";
import { usePrintHouseMachines } from "@/widgets/machines/hooks/use-print-house-machines";
import { machineState } from "@/widgets/machines/state/machine-state";
import { machinesListState } from "@/widgets/machines/state/machines";
import { SecondaryButton } from "@/components/button/secondary-button";
import { usePrintHouseAddMachine } from "@/widgets/machines/hooks/use-print-house-add-machine";
import { useTranslation } from "react-i18next";
import { MachinesContainer } from "@/components/containers/machines-container/machines-container";
import { MachinesSideList } from "@/components/containers/machines-container/side-list/machines-side-list";
import { NavigationButtons } from "@/widgets/machines/components/forms/navigationButtons";
import { StepType } from "@reactour/tour";
import { useGoMakeTour } from "@/hooks/use-go-make-tour";
import { GoMakeDeleteModal, GoMakeModal } from "@/components";
import { AddMachineModal } from "@/widgets/machines/customer/add-machine-modal";
import { useUserPermission } from "@/hooks/use-permission";
import { ModalType } from "@/enums";
import { useGomakeAxios } from "@/hooks";
import { Typography } from "@mui/material";
import { useCustomerMachinesGrouped } from "./use-customer-machines-grouped";

const CustomerEditMachines = () => {
    const router = useRouter();
    const { categoryId, machineId } = router.query;
    const [activeStep, setActiveStep] = useState<number>(-1);
    const categories = useRecoilValue(machineCategoriesState);
    const [categoryName, setCategoryName] = useState<string>();
    const [machineSteps, setMachineSteps] = useState<IStep[]>([]);
    const selectedMachine = useRecoilValue(machineState);
    const { updateMachine, setOpenOptionsModal, openUpdateOptionsModal, updateProfitProfile } = usePrintHouseAddMachine();
    const { t } = useTranslation();
    const [openAddMachineModal, setOpenAddMachineModal] = useState<boolean>(false);
    const { CheckPermission } = useUserPermission();
    const { callApi } = useGomakeAxios();
    const [machines, setMachines] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentMachineId, setCurrentMachineId] = useState<string>('');

    // Get admin machines functionality
    const { allAdminMachines, loadAdminMachines } = useCustomerMachinesGrouped();

    // Proper Recoil setters
    const setMachineState = useSetRecoilState(machineState);
    const setMachinesListState = useSetRecoilState(machinesListState);

    // Function to fetch machines
    const fetchMachines = useCallback(async () => {
        if (!categoryId) return;
        if (router.isReady === false) return;
        try {
            setIsLoading(true);
            const res = await callApi("Get", `/v1/machines/category/${categoryId}`);

            if (res?.data?.data?.data?.length > 0) {
                const machinesList = res.data.data.data;
                setMachines(machinesList);

                // Set machines in Recoil state
                setMachinesListState(machinesList);

                // Select machine from URL or first machine
                if (machineId && typeof machineId === 'string') {
                    onSelectMachine(machineId, machinesList);
                } else {
                    onSelectMachine(machinesList[0].id, machinesList[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching machines:', error);
        } finally {
            setIsLoading(false);
        }
    }, [categoryId, machineId, callApi, setMachineState, setMachinesListState]);

    useEffect(() => {
        if (router.isReady === false) return;
        if (categoryId) {
            fetchMachines();

            const category = categories.find(category => category.id === categoryId);
            setCategoryName(category?.name ? category?.name : '');
            if (category) setMachineSteps(getSteps(category.id, false, CheckPermission));
        }
    }, [categoryId, fetchMachines]);

    const navigateBack = () => {
        setActiveStep(activeStep - 1);
    }

    const navigateNext = () => {
        setActiveStep(activeStep + 1);
    }

    const onSelectMachine = (value: string, machinesList?: any[]) => {
        debugger
        setCurrentMachineId(value);
        let finalMachineList = machinesList;
        if (!(finalMachineList && finalMachineList.length > 0)) {
            finalMachineList = machines;
        }
        const machine = finalMachineList.find((m: any) => m.id === value);
        if (machine) {
            setCurrentMachineId(value);
            setMachineState(machine);
            setTimeout(() => {
                setCurrentMachineId(value);
                setMachineState(machine);
                setActiveStep(-1);
            }, 5);
            // Update the URL to reflect the selected machine
            router.replace(`/machines/category/${categoryId}?machineId=${value}`, undefined, { shallow: true }).then();
        }
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
                hasBack={activeStep > 0} hasNext={activeStep + 1 < machineSteps.length} />
    }

    const Side = () => {
        return <MachinesSideList
            list={machines.map((machine: any) => ({
                text: machine.nickName || machine.manufacturer || machine.model || 'Unknown Machine',
                value: machine.id,
            }))}
            selectedItem={currentMachineId}
            onSelect={onSelectMachine}
            title={t("machineAttributes.machines")}
            quickActions={true}
        />
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
                maskWrapper: (base) => ({ ...base, zIndex: 1000000 }),
            },
        },
    ]

    const { } = useGoMakeTour(editMachinesSteps, []);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <Typography>{t('machineAttributes.loadingMachines')}</Typography>
            </div>
        );
    }

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
                    }}>{t('tabs.addMachine')}</SecondaryButton>}
                subHeader={selectedMachine?.nickName}>
                {!!selectedMachine?.id &&
                    <MachineStepper steps={machineSteps} activeStep={activeStep} previousStep={navigateBack}
                        nextStep={navigateNext} actionButtonClicked={updateMachine}
                        moveToStep={moveToStepByIndex}
                        isAddForm={false} />
                }
            </MachinesContainer>
            <GoMakeModal insideStyle={{ width: 'fit-content', height: 'fit-content' }} openModal={openAddMachineModal} onClose={() => setOpenAddMachineModal(false)} modalTitle={t('tabs.addMachine')}>
                <AddMachineModal
                    closeModal={() => setOpenAddMachineModal(false)}
                    allAdminMachines={allAdminMachines}
                    loadAdminMachines={loadAdminMachines}
                />
            </GoMakeModal>
            <GoMakeDeleteModal
                openModal={openUpdateOptionsModal}
                onClose={() => setOpenOptionsModal(false)}
                hideIcon
                modalType={ModalType.WARNING}
                title={t("updateProfitProfileMachineModal.title")}
                subTitle={t("updateProfitProfileMachineModal.subTitle")}
                yesBtn={t("updateProfitProfileMachineModal.yesButton")}
                cancelBtn={t("updateProfitProfileMachineModal.noButton")}
                onClickDelete={async () => {
                    await updateProfitProfile(true)
                }}
                onClickCancel={async () => {
                    await updateProfitProfile(false)
                }}
            />
        </>
    );
}

export { CustomerEditMachines }