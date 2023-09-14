import {useRouter} from "next/router";
import {useMemo} from "react";
import {useGomakeAxios} from "@/hooks";
import {useRecoilState, useSetRecoilState} from "recoil";
import {machineState} from "@/widgets/machines/state/machine-state";
import {machinesListState} from "@/widgets/machines/state/machines";
import {adminGetAllMachineByCategory} from "@/services/api-service/machines/admin-machines";

const useAdminMachines = () => {
    const router = useRouter();
    const {categoryId} = router.query
    const {callApi} = useGomakeAxios();
    const [machines, setMachines] = useRecoilState(machinesListState);
    const setMachineState = useSetRecoilState(machineState);
    const getAndSetAdminMachines = async () => {
        if (categoryId) {
            const callBack = (res) => {
                if (res.success) {
                    setMachines(res.data);
                }
            }
            await adminGetAllMachineByCategory(callApi, callBack, categoryId);
        }
    }

    const getMachinesList = useMemo(() => {
        return machines.map((machine: { model: string, manufacturer: string, id: string }) => ({
            text: `${machine.manufacturer} - ${machine.model}`,
            value: machine.id
        }))
    }, [machines]);

    const setMachine = (machineId: string) => {
        const selectedMachine = machines.find(machine => machine.id === machineId);
        if (selectedMachine) {
            setMachineState(selectedMachine);
        }
    }

    const setUpdatedMachine = (updatedMachine: Record<string, any>) => {
        setMachines(machines.map(machine => updatedMachine.id === machine.id ? updatedMachine : machine));
        setMachineState(updatedMachine);
    }

    const addMachineToList = (machine: Record<string, any>) => {
        const machinesList = [...machines];
        machinesList.push(machine)
        setMachines(machinesList);
    }

    return {
        getMachinesList,
        setMachine,
        setUpdatedMachine,
        addMachineToList,
        getAndSetAdminMachines
    };
}

export {useAdminMachines};