import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {machineState as STATE} from "@/widgets/machines/state/machine-state";
import {useRouter} from "next/router";
import {usePrintHouseMachines} from "@/widgets/machines/hooks/use-print-house-machines";
import {
    printHouseAddNewMachine,
    printHouseDeleteMachine, printHouseDuplicateMachine,
    printHouseUpdateMachine
} from "@/services/api-service/machines/print-house-machines";
import {machineCategoriesState} from "@/store/machine-categories";
import {useCallback, useState} from "react";
import {updateProfitProfileProductMachineApi} from "@/services/api-service/products/product-endpoints";

const usePrintHouseAddMachine = () => {
    const {addMachineToList, setUpdatedMachine, deleteMachineFromArray} = usePrintHouseMachines();
    const {callApi} = useGomakeAxios();
    const machineState = useRecoilValue(STATE);
    const setMachineState = useSetRecoilState(STATE);
    const machinesCategories = useRecoilValue(machineCategoriesState);
    const [openUpdateOptionsModal, setOpenOptionsModal] = useState<boolean>(false);
    const {
        alertFaultAdded,
        alertSuccessAdded,
        alertFaultDelete,
        alertSuccessDelete,
        alertFaultUpdate,
        alertSuccessUpdate
    } = useSnackBar();
    const {push} = useRouter();

    const getMachineCategory = useCallback(() => {
        return machinesCategories?.find(category => category.id === machineState.category);
    }, [machineState])
    const addPrintHouseMachine = async () => {
        const payload = {...machineState};
        payload.machineId = machineState.id;
        delete payload['_id'];
        delete payload['id'];
        const callBack = async (res) => {
            if (res.success) {
                setMachineState(res.data);
                alertSuccessAdded();
                await push(`/machines/category/${machineState?.category}`)
            } else {
                alertFaultAdded();
            }
        }
        await printHouseAddNewMachine(callApi, callBack, payload)
    }

    const duplicateMachine = async () => {
        const payload = {...machineState};
        delete payload['_id'];
        delete payload['id'];
        payload.nickName = payload.nickName + ' - Duplicated'
        const callBack = async (res) => {
            if (res?.success) {
                setMachineState(res.data);
                addMachineToList(res.data)
                alertSuccessAdded();
                
                // Navigate to the newly duplicated machine
                if (res.data?.id && res.data?.category) {
                    await push(`/machines/category/${res.data.category}?machineId=${res.data.id}`);
                }
            } else {
                alertFaultAdded();
            }
        }
        await printHouseDuplicateMachine(callApi, callBack, payload);
    }

    const deleteMachine = async () => {
        const callBack = (res) => {
            if (res?.success) {
                alertSuccessDelete();
                deleteMachineFromArray(machineState.id);
                setMachineState({});
                
                // Navigate to category page after successful deletion
                if (machineState?.category) {
                    push(`/machines/category/${machineState.category}`);
                }
            } else {
                alertFaultDelete();
            }
        }
        await printHouseDeleteMachine(callApi, callBack, {id: machineState?.id})
    };


    const updateMachine = async () => {
        const callBack = (res) => {
            if (res.success) {
                setUpdatedMachine(res.data);
                alertSuccessUpdate();
            } else {
                alertFaultUpdate();
            }
        }
        await printHouseUpdateMachine(callApi, callBack, {...machineState});
    }

    const updateProfitProfile = async (isUpdateAndFixPrice: boolean) => {
        const callBack = (res) => {
            if (res.success) {
                alertSuccessUpdate();
            }
        }
        await updateProfitProfileProductMachineApi(callApi, callBack, {
            key: machineState.category,
            isUpdateAndFixPrice
        })
    }

    return {
        addPrintHouseMachine,
        duplicateMachine,
        deleteMachine,
        updateMachine,
        openUpdateOptionsModal,
        setOpenOptionsModal,
        updateProfitProfile
    }
};

export {usePrintHouseAddMachine};