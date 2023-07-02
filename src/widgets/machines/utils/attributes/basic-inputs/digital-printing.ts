import {generalPrintingSettings} from "@/widgets/machines/utils/attributes/basic-inputs/general-printing-settings";

const digitalPrinting = (state: Record<string, any>) => {
    return [
        ...generalPrintingSettings(state),
        {
            name: "doubleHead",
            label: "machineAttributes.doubleHead",
            type: "switch",
            placeholder: "machineAttributes.doubleHead",
            required: true,
            parameterKey: "doubleHead",
            value: state.attributes?.doubleHead,
            options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            machineInputType: 'input',
            isValid: true,
        },


    ];
}

export {digitalPrinting};