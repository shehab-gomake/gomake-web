import {generalBasicSettings} from "@/widgets/machines/utils/attributes/basic-inputs/general-basic-settings";

const manualPeelingMachine = (state: Record<string, any>) => {
    return [
        ...generalBasicSettings(state),
        {
            name: "setupTimeMin",
            label: "machineAttributes.setupTimeMin",
            type: "text",
            placeholder: "machineAttributes.setupTimeMin",
            required: true,
            parameterKey: "setupTimeMin",
            options: [],
            value: state.attributes?.setupTimeMin ? state.attributes?.setupTimeMin : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setupTimeMin,

        },
    ];
}

export {manualPeelingMachine};