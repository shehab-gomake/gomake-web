import { atom } from "recoil";
import {EmployeeActions} from "@/widgets/settings-users/users/enums/employee-actions";

export const addEmployeeOpenModalState = atom<boolean>({
  key: "addEmployeeOpenModalState",
  default: false,
});

export const employeeActionState = atom<EmployeeActions | null>({
  key: "employeeActionState",
  default: null,
});


