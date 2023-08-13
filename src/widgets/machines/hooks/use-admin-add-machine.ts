import {useCallback} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {machineState} from "@/widgets/machines/state/machine-state";
import {initState} from "@/widgets/machines/state/init-state";
import {useTranslation} from "react-i18next";
import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {useRouter} from "next/router";
import {useAdminMachines} from "@/widgets/machines/hooks/use-admin-machines";

const useAdminAddMachine = () => {
    const {callApi} = useGomakeAxios();
    const state = useRecoilValue(machineState);
    const setState = useSetRecoilState(machineState);
    const {push} = useRouter();
    const { setSnackbarStateValue } = useSnackBar();
    const {setUpdatedMachine} = useAdminMachines()
    const {t} = useTranslation();
    const initMachineStateCategory = (categoryId: ECategoryId) => {
        setState(initState[categoryId]);
    }


    const curMachineCategoryId = useCallback(() => state?.category ? state?.category.toString() : '', [state]);
    const adminAddMachine = useCallback( () => {
        callApi('POST', '/v1/administrator/add-machine', {...state}).then(res => {
            if (res?.success) {
                console.log(res.data);
                push('/admin/machine/category/' + res.data.data.category).then(() => setState(res.data.data))
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

    const updateMachine = async () => {
        const result = await callApi('POST', '/v1/administrator/update-machine', {...state});
        if (result?.success) {
            console.log(result.data.data)
            setUpdatedMachine(result.data.data);
            setState(result.data.data);
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
        adminAddMachine,
        curMachineCategoryId,
        initMachineStateCategory,
        updateMachine
    };
};

export {useAdminAddMachine};