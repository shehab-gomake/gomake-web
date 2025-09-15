import { useGomakeAxios } from "@/hooks";
import { useRecoilState } from "recoil";
import { machinesState } from "@/widgets/employees-working-hours-widgets/state";
import { getAllPrintHouseMachines } from "@/services/api-service/machines/print-house-machines";
import { useState } from "react";

const useMachines = () => {
  const [machines, setMachines] = useRecoilState(machinesState);
  const [machinesLoading, setMachinesLoading] = useState<boolean>(false);
  const [machinesFetched, setMachinesFetched] = useState<boolean>(false);
  const { callApi } = useGomakeAxios();

  const getMachines = async () => {
    setMachinesLoading(true);
    const callBack = (res) => {
      if (res.success) {
        setMachines(
          res.data.map((machine) => ({
            category: machine.category,
            value: machine.id,
            label:
              machine.manufacturer +
              " - " +
              machine.model +
              " - " +
              machine.nickName,
          }))
        );
      }
      setMachinesLoading(false);
      setMachinesFetched(true);
    };
    await getAllPrintHouseMachines(callApi, callBack, false);
  };
  const getEmployeeMachines = (employeeMachinesIds: string[]) => {
    return machines.filter((machine) =>
      employeeMachinesIds.includes(machine.value)
    );
  };
  return {
    machines,
    machinesLoading,
    machinesFetched,
    getMachines,
    getEmployeeMachines,
  };
};

export { useMachines };
