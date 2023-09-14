import {useCallback} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {machineState} from "@/widgets/machines/state/machine-state";
import {initState} from "@/widgets/machines/state/init-state";
import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {useRouter} from "next/router";
import {useAdminMachines} from "@/widgets/machines/hooks/use-admin-machines";
import {adminAddNewMachine, adminUpdateMachine} from "@/services/api-service/machines/admin-machines";

const useAdminAddMachine = () => {
    const {callApi} = useGomakeAxios();
    const state = useRecoilValue(machineState);
    const setState = useSetRecoilState(machineState);
    const {push} = useRouter();
    const { alertSuccessAdded, alertFaultAdded, alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
    const {setUpdatedMachine, addMachineToList} = useAdminMachines()
    const initMachineStateCategory = (categoryId: ECategoryId) => {
        setState(initState[categoryId]);
    }


    const curMachineCategoryId = useCallback(() => state?.category ? state?.category.toString() : '', [state]);

    const adminAddMachine = useCallback( () => {
        adminAddNewMachine(callApi, undefined, {...state}).then(res => {
            if (res.success) {
                push('/admin/machine/category/' + res.data?.category).then(() => setState(res.data))
                alertSuccessAdded();
            } else {
                alertFaultAdded();
            }
        })
    }, [state]);

    const adminDuplicateMachine = () => {
        const payload = {...state};
        delete payload['_id'];
        delete payload['id'];
        payload.nickName = payload?.nickName + 'duplicated';

        adminAddNewMachine(callApi, setState, payload).then(res => {
            if (res.success) {
                addMachineToList(res.data);
                alertSuccessAdded();
            } else {
                alertFaultAdded();
            }
        })
    }

    const updateMachine = async () => {
        const result = await adminUpdateMachine(callApi, setState, state);
        if (result?.success) {
            setUpdatedMachine(result.data);
            alertSuccessUpdate()
        } else {
            alertFaultUpdate();
        }
    }

    return {
        adminAddMachine,
        curMachineCategoryId,
        initMachineStateCategory,
        updateMachine,
        adminDuplicateMachine
    };
};

export {useAdminAddMachine};