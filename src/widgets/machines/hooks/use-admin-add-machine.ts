import {useCallback} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {machineState} from "@/widgets/machines/utils/state/machine-state";
import {initState} from "@/widgets/machines/utils/state/init-state";
import {useTranslation} from "react-i18next";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const useAdminAddMachine = () => {
    const {callApi} = useGomakeAxios()
    const state = useRecoilValue(machineState);
    const setState = useSetRecoilState(machineState);

    const { setSnackbarStateValue } = useSnackBar();
    const {t} = useTranslation();
    const initMachineStateCategory = (categoryId: ECategoryId) => {
        setState(initState[categoryId]);
    }

    const curMachineCategoryId = useCallback(() => state?.category ? state?.category.toString() : '', [state]);

    const adminAddMachine = useCallback( () => {
        callApi('POST', '/v1/administrator/add-machine', {...state}).then(res => {
            if (res?.success) {
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
        })
    }, [state]);

    return {
        adminAddMachine,
        curMachineCategoryId,
        initMachineStateCategory,
    };
};

export {useAdminAddMachine};