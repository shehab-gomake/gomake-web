import {generalBasicSettings} from "@/widgets/machines/utils/attributes/basic-inputs/general-basic-settings";

const generalPrintingSettings = (state: Record<string, any>) => {
    return [
        ...generalBasicSettings(state),
        {
            name: "resolution",
            label: "machineAttributes.resolution",
            type: "select",
            placeholder: "",
            required: true,
            parameterKey: "resolution",
            value: state.attributes?.resolution,
            options: [],
            machineInputType: 'input',
            isValid: true,
            optionsUrl: '/v1/enum/get-enums/resolution'

        },
        {
            name: "printingSides",
            label: "machineAttributes.printingSides",
            type: "text",
            placeholder: "machineAttributes.printingSides",
            required: true,
            parameterKey: "printingSides",
            options: [],
            value: state.attributes?.printingSides ? state.attributes?.printingSides : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.printingSides,
        },
    ];
}

export {generalPrintingSettings};