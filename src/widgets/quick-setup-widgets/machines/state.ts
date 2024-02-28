import {atom} from "recoil";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

export interface IMachineItem {
    value: string;
    label: string;
    category: ECategoryId | '';
    isAdminMachine?: boolean;
}
export const machinesSetup = atom<IMachineItem[]>({
    default: [],
    key: 'machinesSetup'
});

export const selectedMachinesSetup = atom<IMachineItem[]>({
    default: [],
    key: 'selectedMachinesSetup'
});