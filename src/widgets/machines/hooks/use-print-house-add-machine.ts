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

const usePrintHouseAddMachine = () => {
    const {addMachineToList, setUpdatedMachine, deleteMachineFromArray} = usePrintHouseMachines();
    const {callApi} = useGomakeAxios();
    const machineState = useRecoilValue(STATE);
    const setMachineState = useSetRecoilState(STATE);
    const {
        alertFaultAdded,
        alertSuccessAdded,
        alertFaultDelete,
        alertSuccessDelete,
        alertFaultUpdate,
        alertSuccessUpdate
    } = useSnackBar();
    const {push} = useRouter();

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
        const callBack = (res) => {
            if (res?.success) {
                setMachineState(res.data);
                addMachineToList(res.data)
                alertSuccessAdded();
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

    return {
        addPrintHouseMachine,
        duplicateMachine,
        deleteMachine,
        updateMachine
    }
};

export {usePrintHouseAddMachine};