import { atom } from "recoil";

export const employeesListsState = atom<string[]>({
  key: "employeesListsState",
  default: [],
});

export const employeeListState = atom<any>({
  key: "employeeListState",
  default: "",
});
