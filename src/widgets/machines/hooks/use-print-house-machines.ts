import {useGomakeAxios} from "@/hooks";
import {useCallback, useEffect, useState} from "react";
import {useSetRecoilState} from "recoil";
import {machineState} from "@/widgets/machines/utils/state/machine-state";
import {useRouter} from "next/router";

const usePrintHouseMachines = () => {
    const router = useRouter();
    const {categoryId} = router.query
    const {callApi} = useGomakeAxios();
    const [machines, setMachines] = useState<any[]>([]);
    const setMachineState = useSetRecoilState(machineState);

    useEffect(() => {
        const call = async () => {
            if (categoryId) {
                const res = await callApi('Get', `/v1/machines/category/${categoryId}`);
                setMachines(res?.data?.data?.data ? res?.data?.data?.data : []);
            }
        }
        call().then();
    }, [categoryId]);


    const getPrintHouseMachinesList = useCallback(() => {
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
    return {
        getPrintHouseMachinesList,
        setMachine
    }
}

export {usePrintHouseMachines}