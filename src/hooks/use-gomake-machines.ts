import {useRecoilValue, useSetRecoilState} from "recoil";
import {machinesListState} from "@/store/machines";
import {useCallback} from "react";
import {getApiRequest} from "@/services/api-request";
import {IMachine} from "@/shared";

const useGomakeMachines = () => {
    const machines = useRecoilValue(machinesListState);
    const setMachines = useSetRecoilState(machinesListState);

    const getMachinesList = useCallback(() => {
        getApiRequest('/machines', {}, true).then(
            (res) => {
                if (res && res.data) {
                    const machinesList: IMachine[] = res.data.map((m: IMachine) => ({...m, checked: true}))
                    setMachines(machinesList);
                }
            });
    }, []);

    const getCheckedMachines = useCallback(() => {
        return machines.filter(machine => machine.checked)
    }, [machines]);

    const machineChecked = useCallback((machineId: string) => {
        const updatedMachines: IMachine[] = machines.map((machine) => {
            if (machine.id === machineId) {
                return {...machine, checked: !machine.checked}
            }
            return machine
        });
        setMachines(updatedMachines);
    }, [machines]);

    return { getMachinesList, getCheckedMachines, machineChecked, machines };
}

export { useGomakeMachines };