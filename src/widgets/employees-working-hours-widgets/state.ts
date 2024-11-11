import {atom, selector} from "recoil";
import {IEmployeeWorkingHours} from "@/widgets/employees-working-hours-widgets/interface";

export const employeeWorkingHoursSearchState = atom<string>({
    default: '',
    key: 'employeeWorkingHoursSearchState'
});

export const employeesWorkingHoursState = atom<IEmployeeWorkingHours[]>({
        default: [],
        key: 'employeesWorkingHoursState'
    }
);

export const employeesWorkingHoursSelector = selector({
    key: 'employeesWorkingHoursSelector',
    get: ({get}) => {
        const search = get(employeeWorkingHoursSearchState);
        const employees = get(employeesWorkingHoursState);
        return search ? employees.filter(employee => employee.firstname.includes(search) || employee.lastname.includes(search)) : employees
    }
})