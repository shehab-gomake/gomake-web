import {useRecoilValue, useSetRecoilState} from "recoil";
import {machinesListState} from "@/store/machines";
import {useCallback} from "react";
import {getApiRequest} from "@/services/api-request";
import {IMachine, IMachineProgress} from "@/shared";

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


    const setMachineChecked = useCallback((machineId: string) => {
        const updatedMachines: IMachine[] = machines.map((machine) => {
            if (machine.id === machineId) {
                return {...machine, checked: !machine.checked}
            }
            return machine
        });
        setMachines(updatedMachines);
    }, [machines]);

    const addMachineProgress = (progress: Record<string, IMachineProgress>) => {
        setMachines(machines.map(machine => progress[machine.id] ? {
            ...machine,
            progress: progress[machine.id]
        } : machine));
    }

    const checkAllMachines = () => {
        const isChecked = machines.every(machine => machine.checked);
        const updatedMachines = machines.map(machine => ({...machine, checked: !isChecked}));
        setMachines(updatedMachines);
    }

    return {getMachinesList, getCheckedMachines, setMachineChecked, machines, addMachineProgress, checkAllMachines};
}

export {useGomakeMachines};