import {atom} from "recoil";


export interface IPrintNodePrinter {
    printerId: number;
    printerName: string;
    bins: string[];
    label: string;
}
export const printNodePrintersState = atom<IPrintNodePrinter[]>({
    key: 'printNodePrintersState',
    default: []
})