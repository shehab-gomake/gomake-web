import {useRouter} from "next/router";
import {useCallback, useEffect, useState} from "react";
import {useGomakeAxios} from "@/hooks";
import {useSetRecoilState} from "recoil";
import {machineState} from "@/widgets/machines/utils/state/machine-state";

const useAdminMachines = () => {
    const router = useRouter();
    const {categoryId} = router.query
    const {callApi} = useGomakeAxios();
    const [machines, setMachines] = useState<any[]>([]);
    const setMachineState = useSetRecoilState(machineState);
    useEffect(() => {
        const call = async () => {
            if (categoryId) {
                const res = await callApi('Get', `/v1/administrator/machines/category/${categoryId}`);
                setMachines(res?.data?.data?.data ? res?.data?.data?.data : []);
            }
        }
        call().then();
    }, [categoryId]);

    const getMachinesList = useCallback(() => {
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
        getMachinesList,
        setMachine
    };
}

export {useAdminMachines};