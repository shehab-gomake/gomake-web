import {useGomakeAxios} from "@/hooks";
import {useRecoilState} from "recoil";
import {machinesState} from "@/widgets/employees-working-hours-widgets/state";
import {getAllPrintHouseMachines} from "@/services/api-service/machines/print-house-machines";

const useMachines = () => {
    const [machines, setMachines] = useRecoilState(machinesState);
    const {callApi} = useGomakeAxios();
    const getMachines = async () => {
        const callBack = res => {
            if (res.success) {
                setMachines(res.data.map(machine => ({value: machine.id, label: machine.manufacturer + ' - ' + machine.model + ' - ' + machine.nickName})))
            }
        }
        await getAllPrintHouseMachines(callApi, callBack, false);
    }
    const getEmployeeMachines = (employeeMachinesIds: string[]) => {
      return machines.filter(machine => employeeMachinesIds.includes(machine.value))
    }
    return {
        getMachines,
        getEmployeeMachines
    }
};

export {useMachines}