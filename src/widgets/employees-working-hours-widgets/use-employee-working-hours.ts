import {useGomakeAxios} from "@/hooks";
import {getEmployeesWorkingHoursApi} from "@/services/api-service/users/users-api";
import {useState} from "react";
import {
    IEmployeeDefaultWorkingHours,
    IEmployeeExceptionWorkingHours,
    IEmployeeWorkingHours
} from "@/widgets/employees-working-hours-widgets/interface";
import {useRecoilState, useRecoilValue} from "recoil";
import {
    employeesWorkingHoursSelector,
    employeesWorkingHoursState
} from "@/widgets/employees-working-hours-widgets/state";

const useEmployeeWorkingHours = () => {
    const {callApi} = useGomakeAxios();

    const [employeesState, setEmployeesState] = useRecoilState<IEmployeeWorkingHours[]>(employeesWorkingHoursState);
    const employees = useRecoilValue(employeesWorkingHoursSelector);
    const getEmployees = async () => {
        const callBack = (res) => {
          if (res.success) {
              setEmployeesState(res.data);
          }
        }
        await getEmployeesWorkingHoursApi(callApi, callBack);
    }

    const updateEmployeeStateDefaultWorkingHours = (employeeId: string, workingHours: IEmployeeDefaultWorkingHours[]) => {
      setEmployeesState(prev => prev.map(employee => employee.id === employeeId ? {...employee, defaultWorkingHours: workingHours} : employee))
    }

    const updateEmployeeExceptionWorkingHours = (workingHours: IEmployeeExceptionWorkingHours, employeeId: string) => {
        setEmployeesState(prevState => prevState.map(employee => employee.id === employeeId ? {...employee,
            exceptionWorkingHours: [...employee.exceptionWorkingHours.filter(day => new Date(day.date).getDate() !== new Date(workingHours.date).getDate()), workingHours]
        }: employee))
    }
    return {
        employees,
        getEmployees,
        updateEmployeeStateDefaultWorkingHours,
        updateEmployeeExceptionWorkingHours
    };
}

export {useEmployeeWorkingHours}