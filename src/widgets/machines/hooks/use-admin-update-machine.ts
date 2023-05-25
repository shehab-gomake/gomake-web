import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useRecoilValue} from "recoil";
import {machineState as STATE} from "@/widgets/machines/utils/state/machine-state";
import {useCallback} from "react";
import {useRouter} from "next/router";
import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {useTranslation} from "react-i18next";

const useAdminUpdateMachine = () => {
    const {callApi} = useGomakeAxios();
    const machineState = useRecoilValue(STATE);
    const router = useRouter();
    const { setSnackbarStateValue } = useSnackBar();
    const {t} = useTranslation();
    const updateMachine = async () => {
       const result = await callApi('POST', '/v1/administrator/update-machine', {...machineState});
        if (result?.success) {
            setSnackbarStateValue({
                state: true,
                message: t("modal.addedSusuccessfully"),
                type: "sucess",
            });
            await router.push(`/admin/machine/category/${machineState?.category}`)
        } else {
            setSnackbarStateValue({
                state: true,
                message: t("modal.addedfailed"),
                type: "error",
            });
        }
    }

    const machineCategoryId = useCallback(() => machineState?.category as ECategoryId,[machineState])

    return {
        updateMachine,
        machineCategoryId
    };
}

export {useAdminUpdateMachine};