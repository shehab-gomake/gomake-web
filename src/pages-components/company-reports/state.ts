import {atom} from "recoil";

export const printHousesState = atom<{id: string; name: string}[]>({
    default: [],
    key: 'reportPrintHousesListState'
})