import {Employee} from "@/widgets/settings-users/users/interface/employee";


const printNodeInputs = (state: Employee, printers: any[], bins: any[])  => {
    return [
        {
            name: "printers",
            label: "usersSettings.printers",
            type: "select",
            placeholder: "usersSettings.printers",
            required: true,
            parameterKey: "printerId",
            value: state.printerId,
            options: printers,
            isValid: true,
        },
        {
            name: "bins",
            label: "usersSettings.printerBins",
            type: "select",
            placeholder: "usersSettings.printerBins",
            required: true,
            parameterKey: "printerBin",
            value: state.printerBin,
            options: bins,
            isValid: true,
            disabled: !state.printerId

        },
    ];
}

export {printNodeInputs};