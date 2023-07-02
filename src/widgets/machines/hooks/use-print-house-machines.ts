import {useGomakeAxios} from "@/hooks";
import {useEffect, useMemo} from "react";
import {useRecoilState, useSetRecoilState} from "recoil";
import {machineState} from "@/widgets/machines/state/machine-state";
import {useRouter} from "next/router";
import {

    machinesListState
} from "@/widgets/machines/state/machines";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const usePrintHouseMachines = (loop?: boolean) => {
    const router = useRouter();
    const {categoryId} = router.query
    const {callApi} = useGomakeAxios();
    const [machines, setMachines] = useRecoilState(machinesListState);

    const setMachineState = useSetRecoilState(machineState);

    useEffect(() => {
        if (loop) {
            getMachinesByCategoryId(categoryId as ECategoryId).then(
                (res) => {
                    setMachines(res?.data?.data?.data ? res?.data?.data?.data : []);
                }
            );
        }
    }, [categoryId]);


    const getMachinesByCategoryId = async (category: ECategoryId) => {
        return  await callApi('Get', `/v1/machines/category/${category}`);
    };

    const machinesToList = (machinesList: { nickName: string, manufacturer: string, model: string, id: string }[]) => {
        return machinesList.map(machine => ({
            text: `${machine.manufacturer} ${machine.model} - ${machine.nickName}`,
            value: machine.id
        }));
    };

    const getPrintHouseMachinesList = useMemo(() => {
        return machinesToList(machines);
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
        getMachinesByCategoryId,
        setUpdatedMachine,
        deleteMachineFromArray,
        setMachines,
        addMachineToList,
        machinesToList
    }
}

export {usePrintHouseMachines}