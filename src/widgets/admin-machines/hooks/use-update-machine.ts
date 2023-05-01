import {useGomakeAxios} from "@/hooks";
import {useRecoilValue} from "recoil";
import {machineState as STATE} from "@/widgets/admin-machines/state/machine-state";
import {useCallback} from "react";
import {useRouter} from "next/router";
import {ECategoryId} from "@/widgets/admin-machines/enums/category-id";

const useUpdateMachine = () => {
    const {callApi} = useGomakeAxios();
    const machineState = useRecoilValue(STATE);
    const router = useRouter();

    const updateMachine = async () => {
       const result = await callApi('POST', '/v1/administrator/update-machine', {...machineState});
        if (result?.success) {
            await router.push(`/admin/machine/category/${machineState?.category}`)
        }
    }

    const machineCategoryId = useCallback(() => machineState?.category as ECategoryId,[machineState])

    return {
        updateMachine,
        machineCategoryId
    };
}

export {useUpdateMachine};