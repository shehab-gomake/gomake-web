import {atom} from "recoil";
import {IMachine} from "@/shared/interfaces";

export const machinesListState = atom({
    key: 'machinesState', // unique ID (with respect to other atoms/selectors)
    default: [] as IMachine[], // default value (aka initial value)
});
