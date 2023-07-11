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
            options: [{value: 0, text: '2438 X 2438 dpi'}, {value: 1, text: '2400 X 2400 dpi'}],
            machineInputType: 'input',
            isValid: true,
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