import {atom} from "recoil";

export const actionsListState = atom<IActionMachines[]>({
    key: "actionsListState",
    default: []
});


export interface IActionMachines {
    actionName: string;
    actionId: string;
    label?: string;
    machines: {
        machineId: string;
        machineName: string;
        machineCategory: string;
        checked?: boolean;
        label?: string;
    }[];
    checked?: boolean;
}