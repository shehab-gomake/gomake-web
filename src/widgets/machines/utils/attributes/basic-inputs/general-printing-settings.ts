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
    ];
}

export {generalPrintingSettings};