import {Employee} from "@/widgets/settings-users/users/interface/employee";
import {IInput} from "@/components/form-inputs/interfaces";


const printNodeInputs = (state: Employee, printers: any[], bins: any[])  => {
    return [
        {
            name: "printers",
            label: "usersSettings.printers",
            type: "select",
            placeholder: "usersSettings.printers",
            required: false,
            parameterKey: "printerId",
            value: state.printerId?.toString(),
            options: printers,
            isValid: true,
        },
        // {
        //     name: "bins",
        //     label: "usersSettings.printerBins",
        //     type: "select",
        //     placeholder: "usersSettings.printerBins",
        //     required: true,
        //     parameterKey: "printerBin",
        //     value: state.printerBin,
        //     options: bins,
        //     isValid: true,
        //     disabled: !state.printerId
        //
        // },
    ] as  IInput[];
}

export {printNodeInputs};