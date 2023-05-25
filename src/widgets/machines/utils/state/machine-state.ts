import {atom} from "recoil";

export const machineState = atom({
    key: "machineState",
    default: {} as Record<string, any>,
});