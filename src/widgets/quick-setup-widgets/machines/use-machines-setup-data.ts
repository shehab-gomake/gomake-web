import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {machinesSetup, selectedMachinesSetup} from "@/widgets/quick-setup-widgets/machines/state";
import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {getAdminMachinesByCategories} from "@/services/api-service/machines/admin-machines";
import {useRouter} from "next/router";
import {useEffect, useMemo, useState} from "react";
import {MachinesTypes, machinesTypeCategories} from "@/widgets/quick-setup-widgets/machines/const";
import {machineCategoriesState} from "@/store/machine-categories";
import {quickSetupAddMachines} from "@/services/api-service/machines/print-house-machines";

const useMachinesSetupData = () => {
    const setMachineState = useSetRecoilState(machinesSetup);
    const router = useRouter();
    const {machinesType} = router.query
    const {callApi} = useGomakeAxios();
    const machinesCategoriesState = useRecoilValue(machineCategoriesState);
    const [selectedMachinesState, setSelectedMachinesState] = useRecoilState(selectedMachinesSetup);
    const {alertFaultAdded} = useSnackBar();
    const [loading, setLoading] = useState<boolean>(false)
    const getMachineNameKey = (categoryId: ECategoryId) => {
        return machinesCategoriesState?.find(category => category.id === categoryId)?.name;
    }
    const getMachineColor = (categoryId: ECategoryId) => {
        return machinesCategoriesState?.find(category => category.id === categoryId)?.color;
    }
    const step = useMemo(() => {
        return machinesTypeCategories(machinesType as MachinesTypes);
    }, [machinesType]);

    const getMachines = async (categories: ECategoryId[]) => {
        const callBack = (res) => {
            if (res.success) {
                setMachineState(res?.data?.map(m => ({...m, checked: false})))
            }
        }
        await getAdminMachinesByCategories(callApi, callBack, categories);
    }

    useEffect(() => {
        if (step.categories.length > 0) {
            getMachines(step.categories).then()
        }
    }, [machinesType, step]);

    const onClickNext = async () => {
        const callBack = (res) => {
            if (res?.success) {
                setSelectedMachinesState([]);
                setMachineState([]);
                router.push(step.next);
            } else {
                alertFaultAdded();
            }
            setLoading(false)
        }
        if (selectedMachinesState.length === 0) {
            alertFaultAdded();
        } else {
            setLoading(true);
            await quickSetupAddMachines(callApi, callBack, {machines: selectedMachinesState})
        }
    }

    const onClickSkip = () => {
        setSelectedMachinesState([]);
        setMachineState([])
        router.push(step.next).then();
    }
    return {
        step,
        getMachineNameKey,
        getMachineColor,
        onClickNext,
        onClickSkip,
        loading
    }
}
export {useMachinesSetupData}