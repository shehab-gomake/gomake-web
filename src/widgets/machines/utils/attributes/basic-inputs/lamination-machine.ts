import {generalBasicSettings} from "@/widgets/machines/utils/attributes/basic-inputs/general-basic-settings";

const laminationMachine = (state: Record<string, any>) => {
    return [
        ...generalBasicSettings(state),
        {
            name: "laminationSides",
            label: "machineAttributes.laminationSides",
            type: "text",
            placeholder: "machineAttributes.laminationSides",
            required: true,
            parameterKey: "laminationSides",
            options: [],
            value: state.attributes?.minManpowerOperation ? state.attributes?.laminationSides : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.laminationSides,

        },
    ];
}

export {laminationMachine};