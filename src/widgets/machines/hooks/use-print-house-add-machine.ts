import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useRecoilValue} from "recoil";
import {machineState as STATE} from "@/widgets/machines/utils/state/machine-state";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";

const usePrintHouseAddMachine = () => {
    const {callApi} = useGomakeAxios();
    const machineState = useRecoilValue(STATE);
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
                push(`/machines/category/${machineState?.category}`).then()
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
                setSnackbarStateValue({
                    state: true,
                    message: 'deleted Successfully',
                    type: "success",
                });
            } else {
                setSnackbarStateValue({
                    state: true,
                    message: 'Can not DeleteMachine',
                    type: "error",
                });
            }
        })
    };

    return {
        addPrintHouseMachine,
        duplicateMachine,
        deleteMachine
    }
};

export {usePrintHouseAddMachine};