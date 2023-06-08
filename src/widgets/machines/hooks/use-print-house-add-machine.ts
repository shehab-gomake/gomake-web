import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {machineState as STATE} from "@/widgets/machines/state/machine-state";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";
import {usePrintHouseMachines} from "@/widgets/machines/hooks/use-print-house-machines";

const usePrintHouseAddMachine = () => {
    const {addMachineToList, setUpdatedMachine, deleteMachineFromArray} = usePrintHouseMachines();
    const {callApi} = useGomakeAxios();
    const machineState = useRecoilValue(STATE);
    const setMachineState = useSetRecoilState(STATE);
    const {setSnackbarStateValue} = useSnackBar();
    const {t} = useTranslation();
    const {push} = useRouter();
    function addPrintHouseMachine() {
        const payload = {...machineState};
        payload.machineId = machineState.id;
        delete payload['_id'];
        delete payload['id'];
        callApi('POST', '/v1/add-machine', payload).then(res => {
            if (res?.success) {
                setSnackbarStateValue({
                    state: true,
                    message: t("modal.addedSusuccessfully"),
                    type: "success",
                });
                push(`/machines/category/${machineState?.category}`)
                    .then(() => setMachineState(res.data.data))
            } else {
                setSnackbarStateValue({
                    state: true,
                    message: t("modal.addedfailed"),
                    type: "error",
                });
            }
        })
    }

    const duplicateMachine = () => {
        const payload = {...machineState};
        delete payload['_id'];
        delete payload['id'];
        payload.nickName = payload.nickName + ' - Duplicated'
        callApi('POST', '/v1/add-machine', payload).then(res => {
            if (res?.success) {
                addMachineToList(res.data.data)
                setSnackbarStateValue({
                    state: true,
                    message: t("modal.addedSusuccessfully"),
                    type: "success",
                });
            } else {
                setSnackbarStateValue({
                    state: true,
                    message: t("modal.addedfailed"),
                    type: "error",
                });
            }
        })
    }

    const deleteMachine = () => {
        callApi('POST', '/v1/delete-machine', {id: machineState.id}).then(res => {
            if (res?.success) {
                deleteMachineFromArray(machineState.id);
                setMachineState({});
                setSnackbarStateValue({
                    state: true,
                    message: t('modal.deleteSusuccessfully'),
                    type: "success",
                });
            } else {
                setSnackbarStateValue({
                    state: true,
                    message: t('modal.deletefailed'),
                    type: "error",
                });
            }
        })
    };


    const updateMachine = async () => {
        const result = await callApi('POST', '/v1/update-machine', {...machineState});
        if (result?.success) {
            setUpdatedMachine(result.data.data);
            setSnackbarStateValue({
                state: true,
                message: t("modal.updatedSusuccessfully"),
                type: "sucess",
            });
        } else {
            setSnackbarStateValue({
                state: true,
                message: t("modal.updatedfailed"),
                type: "error",
            });
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