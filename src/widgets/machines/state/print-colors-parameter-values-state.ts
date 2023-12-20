import {atom} from "recoil";

export const printColorsParameterValuesState = atom<{value: string, text: string}[]>({
    key: "printColorsParameterValuesState",
    default: [],
});
