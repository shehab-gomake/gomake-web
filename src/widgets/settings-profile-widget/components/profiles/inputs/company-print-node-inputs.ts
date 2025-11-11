import {ICompanyProfile} from "@/store/company-profile";
import {IPrintNodePrinter} from "@/store/print-node-printers-state";
import {IInput} from "@/components/form-inputs/interfaces";


const companyPrintNodeInputs = (state: ICompanyProfile, printers: IPrintNodePrinter[] = []): IInput[] => {
    return [
        {
            name: "printnodeUsername",
            label: "profileSettings.printnodeUsername",
            type: "text",
            placeholder: "profileSettings.printnodeUsername",
            required: true,
            parameterKey: "printnodeUsername",
            options: [],
            value: state.printnodeUsername,
            machineInputType: 'input',
            isValid: !!state.printnodeUsername,
        },
        {
            name: "printnodePassword",
            label: "profileSettings.printnodePassword",
            type: "password",
            placeholder: "profileSettings.printnodePassword",
            required: true,
            parameterKey: "printnodePassword",
            options: [],
            value: state.printnodePassword,
            machineInputType: 'input',
            isValid: !!state.printnodePassword,
        },
        {
            name: "packingSlipPrinter",
            label: "profileSettings.packingSlipPrinter",
            type: "select",
            placeholder: "profileSettings.packingSlipPrinter",
            required: false,
            parameterKey: "packagingSlipPrinterId",
            options: printers.map(printer => ({
                value: printer.printerId.toString(),
                text: printer.printerName,
            })),
            value: state.packagingSlipPrinterId?.toString(),
            machineInputType: 'select',
            isValid: true,
        },
    ] as IInput[];
}

export {companyPrintNodeInputs};