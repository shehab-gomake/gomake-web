import {useCallback, useEffect} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useRouter} from "next/router";
import {machineState} from "@/widgets/admin-machines/state/machine-state";
import {initState} from "@/widgets/admin-machines/state/init-state";
import {useTranslation} from "react-i18next";

const useAddMachine = () => {
    const {callApi} = useGomakeAxios()
    const state = useRecoilValue(machineState);
    const setState = useSetRecoilState(machineState);
    const router = useRouter();
    const {categoryId} = router.query;
    const { setSnackbarStateValue } = useSnackBar();
    const {t} = useTranslation();
    useEffect(() => {
        const stateInit = initState[categoryId as string] ? initState[categoryId as string] : {};
        setState(stateInit);
    }, [router])


    const curMachineCategoryId = useCallback(() => state?.category ? state?.category.toString() : '', [state]);

    const onClickAddMachine = useCallback( () => {
        callApi('POST', '/v1/administrator/add-machine', {...state}).then(res => {
            if (res?.success) {
                setSnackbarStateValue({
                    state: true,
                    message: t("modal.addedSusuccessfully"),
                    type: "sucess",
                });
                 router.push(`/admin/machine/category/${state?.category}`).then()
            } else {
                setSnackbarStateValue({
                    state: true,
                    message: t("modal.addedfailed"),
                    type: "error",
                });
            }
        })
    }, [state]);

    useEffect(() => {
        console.log('state', state);
    }, [state])

    return {
        onClickAddMachine,
        curMachineCategoryId,
    };
};

export {useAddMachine};