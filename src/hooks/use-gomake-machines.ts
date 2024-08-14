import {useRecoilValue, useSetRecoilState} from "recoil";
import {machinesListState} from "@/store/machines";
import {useCallback, useState} from "react";
import {IMachine, IMachineProgress} from "@/shared";
import { getALLMachinesApi } from "@/services/api-service/machines/print-house-machines-colors";
import { useGomakeAxios } from "./use-gomake-axios";
import { useEmployeeList } from "./use-employee-list";

const useGomakeMachines = () => {
    const {callApi} = useGomakeAxios();
    const machines = useRecoilValue<any>(machinesListState);
    const setMachines = useSetRecoilState(machinesListState);
    const [employeesList,setEmployeesList] =useState([])
    const {employeesCategories}= useEmployeeList()
    const getMachinesList = async () => {
        const callBack = (res) => {
            if (res.success) {
                const machinesList: IMachine[] = res.data.map((m) => ({...m,name:m.model, checked: true}))
                setMachines(machinesList)
            }
        }
        await getALLMachinesApi(callApi,callBack ).then();

    }

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
        setMachines(machines.map(machine => {

            // Check if machine ID is not null and progress object has an entry for the current machine ID
            if (machine?.id && progress && progress[machine?.id]) {
                return {
                    ...machine,
                    progress: progress[machine?.id]
                };
            } else {
                // If machine ID is null or no progress entry found for the current machine ID, return the original machine object
                return machine;
            }
        }));
    }


    const addEmployeeProgress = (progress: Record<string, IMachineProgress>) => {
        setEmployeesList(employeesCategories?.map((employee:any) => {

            // Check if machine ID is not null and progress object has an entry for the current machine ID
            if (employee?.id && progress && progress[employee?.id]) {
                return {
                    ...employee,
                    progress: progress[employee?.id]
                };
            } else {
                // If machine ID is null or no progress entry found for the current machine ID, return the original machine object
                return false;
            }
        }));
    }
    const checkAllMachines = () => {
        const isChecked = machines.every(machine => machine.checked);
        const updatedMachines = machines.map(machine => ({...machine, checked: !isChecked}));
        setMachines(updatedMachines);
    }

    return {getMachinesList, getCheckedMachines, setMachineChecked, machines, addMachineProgress, checkAllMachines,addEmployeeProgress,employeesList};
}

export {useGomakeMachines};