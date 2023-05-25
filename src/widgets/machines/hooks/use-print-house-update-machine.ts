import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useRecoilValue} from "recoil";
import {machineState as STATE} from "@/widgets/machines/utils/state/machine-state";
import {useTranslation} from "react-i18next";

const usePrintHouseUpdateMachine = () => {
    const {callApi} = useGomakeAxios();
    const machineState = useRecoilValue(STATE);
    const {setSnackbarStateValue} = useSnackBar();
    const {t} = useTranslation();
    const updateMachine = async () => {
        const result = await callApi('POST', '/v1/update-machine', {...machineState});
        if (result?.success) {
            setSnackbarStateValue({
                state: true,
                message: t("modal.addedSusuccessfully"),
                type: "sucess",
            });
        } else {
            setSnackbarStateValue({
                state: true,
                message: t("modal.addedfailed"),
                type: "error",
            });
        }
    }

    return {
        updateMachine,
    };
}

export {usePrintHouseUpdateMachine};