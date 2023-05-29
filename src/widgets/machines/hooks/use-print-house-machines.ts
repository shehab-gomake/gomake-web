import {useGomakeAxios} from "@/hooks";
import {useEffect, useMemo} from "react";
import {useRecoilState, useSetRecoilState} from "recoil";
import {machineState} from "@/widgets/machines/state/machine-state";
import {useRouter} from "next/router";
import {machinesListState} from "@/widgets/machines/state/machines";

const usePrintHouseMachines = (loop?: boolean) => {
    const router = useRouter();
    const {categoryId} = router.query
    const {callApi} = useGomakeAxios();
    const [machines, setMachines] = useRecoilState(machinesListState);
    const setMachineState = useSetRecoilState(machineState);

    useEffect(() => {
        if (loop) {
            getMachinesAPI().then();
        }
    }, [categoryId]);

    const getMachinesAPI = async () => {
        const res = await callApi('Get', `/v1/machines/category/${categoryId}`);
        setMachines(res?.data?.data?.data ? res?.data?.data?.data : []);
    };


    const getPrintHouseMachinesList = useMemo(() => {
        return machines.map((machine: { nickName: string, manufacturer: string, id: string }) => ({
            text: `${machine.manufacturer} - ${machine.nickName}`,
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
        setMachines(machines.map(machine => updatedMachine?.id === machine.id ? updatedMachine : machine));
        setMachineState(updatedMachine);
    }

    const deleteMachineFromArray = (machineId: string) => {
        setMachines(machines.filter(machine => machineId !== machine.id))
    }

    const addMachineToList = (machine) => {
        console.log(machine);
        const newArray = [...machines, machine];
        setMachines(newArray);
        setMachineState(machine)
    }

    return {
        getPrintHouseMachinesList,
        setMachine,
        getMachinesAPI,
        setUpdatedMachine,
        deleteMachineFromArray,
        setMachines,
        addMachineToList
    }
}

export {usePrintHouseMachines}