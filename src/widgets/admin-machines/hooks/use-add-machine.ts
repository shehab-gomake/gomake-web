import {useCallback, useEffect} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {useGomakeAxios} from "@/hooks";
import {useRouter} from "next/router";
import {machineState} from "@/widgets/admin-machines/state/machine-state";
import {initState} from "@/widgets/admin-machines/state/init-state";

const useAddMachine = () => {
    const {callApi} = useGomakeAxios()
    const state = useRecoilValue(machineState);
    const setState = useSetRecoilState(machineState);
    const router = useRouter();
    const {categoryId} = router.query;

    useEffect(() => {
        const stateInit = initState[categoryId as string] ? initState[categoryId as string] : {};
        setState(stateInit);
    }, [router])


    const curMachineCategoryId = useCallback(() => state?.category ? state?.category.toString() : '', [state]);

    const onClickAddMachine = useCallback(() => {
        callApi('POST', '/v1/administrator/add-machine', {...state}).then()
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