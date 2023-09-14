import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {machineState as STATE} from "@/widgets/machines/state/machine-state";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";
import {usePrintHouseMachines} from "@/widgets/machines/hooks/use-print-house-machines";
import {
    printHouseAddNewMachine,
    printHouseDeleteMachine,
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

    function addPrintHouseMachine() {
        const payload = {...machineState};
        payload.machineId = machineState.id;
        delete payload['_id'];
        delete payload['id'];
        printHouseAddNewMachine(callApi, setMachineState, payload).then(res => {
            if (res.success) {
                alertSuccessAdded();
                push(`/machines/category/${machineState?.category}`).then()
            } else {
                alertFaultAdded();
            }
        })
    }

    const duplicateMachine = () => {
        const payload = {...machineState};
        delete payload['_id'];
        delete payload['id'];
        payload.nickName = payload.nickName + ' - Duplicated'
        printHouseAddNewMachine(callApi, setMachineState, payload).then(res => {
            if (res?.success) {
                addMachineToList(res.data)
                alertSuccessAdded();
            } else {
                alertFaultAdded();
            }
        })
    }

    const deleteMachine = () => {
        printHouseDeleteMachine(callApi, undefined, {id: machineState?.id}).then(res => {
            if (res?.success) {
                alertSuccessDelete();
                deleteMachineFromArray(machineState.id);
                setMachineState({});
            } else {
                alertFaultDelete();
            }
        })
    };


    const updateMachine = async () => {
        const result = await printHouseUpdateMachine(callApi, undefined, {...machineState});
        if (result.success) {
            setUpdatedMachine(result.data);
            alertSuccessUpdate();
        } else {
            alertFaultUpdate();
        }
    }

    return {
        addPrintHouseMachine,
        duplicateMachine,
        deleteMachine,
        updateMachine
    }
};

export {usePrintHouseAddMachine};