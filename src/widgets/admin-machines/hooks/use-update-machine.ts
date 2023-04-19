import {useGomakeAxios} from "@/hooks";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {machineState as STATE} from "@/widgets/admin-machines/state/machine-state";
import {useCallback, useState} from "react";
import {useRouter} from "next/router";

const useUpdateMachine = () => {
    const {callApi} = useGomakeAxios();
    const machineState = useRecoilValue(STATE);
    const setMachine = useSetRecoilState(STATE);
    const router = useRouter();
    const updateMachine = async () => {
       const result = await callApi('POST', '/v1/administrator/update-machine', {...machineState});
        if (result?.success) {
            await router.push(`/admin/machine/category/${machineState?.category}`)
        }
    }

    const machineCategoryId = useCallback(() => machineState?.category,[machineState])

    return {
        updateMachine,
        machineCategoryId
    };
}

export {useUpdateMachine};