import {atom} from "recoil";

export const newOrderIdToPrintJobsState = atom<string>({
    key: 'showPrintOrderJobsModalState',
    default: ''
})