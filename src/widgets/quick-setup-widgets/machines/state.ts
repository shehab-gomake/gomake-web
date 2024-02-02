import {atom} from "recoil";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

interface IMachineItem {
    id: string;
    name: string;
    checked: boolean;
    category: ECategoryId;
}
export const machinesSetup = atom<IMachineItem[]>({
    default: [],
    key: 'machinesSetup'
});

export const selectedMachinesSetup = atom<IMachineItem[]>({
    default: [],
    key: 'selectedMachinesSetup'
});