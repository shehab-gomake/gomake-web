import {useGomakeAxios} from "@/hooks";
import {useCallback, useEffect} from "react";
import {useRecoilState, useSetRecoilState} from "recoil";
import {machineState} from "@/widgets/machines/state/machine-state";
import {useRouter} from "next/router";
import {

    machinesListState
} from "@/widgets/machines/state/machines";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const usePrintHouseMachines = () => {
    const router = useRouter();
    const {categoryId} = router.query
    const {callApi} = useGomakeAxios();
    const [machines, setMachines] = useRecoilState(machinesListState);

    const setMachineState = useSetRecoilState(machineState);



    const getAndSetMachines = ()=> {
        getMachinesByCategoryId(categoryId as ECategoryId).then(
            (res) => {
                if (res?.data?.data?.data?.length > 0) {
                    setMachines(res?.data?.data?.data);
                }
            }
        );
    }
    const getMachinesByCategoryId = async (category: ECategoryId) => {
        return await callApi('Get', `/v1/machines/category/${category}`);
    };

    const machinesToList = (machinesList: { nickName: string, manufacturer: string, model: string, id: string }[]) => {
        return machinesList.map(machine => ({
            text: `${machine.manufacturer} ${machine.model} - ${machine.nickName}`,
            value: machine.id
        }));
    };

    const getPrintHouseMachinesList = useCallback(() => {
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
        const newArray = [...machines, machine];
        setMachines(newArray);
        // setMachineState(machine)
    }
    useEffect(() => console.log(machines), [machines])

    return {
        getPrintHouseMachinesList,
        setMachine,
        getMachinesByCategoryId,
        setUpdatedMachine,
        deleteMachineFromArray,
        setMachines,
        addMachineToList,
        machinesToList,
        getAndSetMachines
    }
}

export {usePrintHouseMachines}