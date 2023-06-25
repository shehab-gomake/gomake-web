import {atom} from "recoil";

export const machineState = atom<Record<string, any>>({
    key: "machineState",
    default: {} ,
});