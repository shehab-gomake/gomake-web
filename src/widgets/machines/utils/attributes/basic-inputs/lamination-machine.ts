import {generalBasicSettings} from "@/widgets/machines/utils/attributes/basic-inputs/general-basic-settings";

const laminationMachine = (state: Record<string, any>) => {
    return [
        ...generalBasicSettings(state),
        {
            name: "laminationSides",
            label: "machineAttributes.laminationSides",
            type: "select",
            placeholder: "machineAttributes.laminationSides",
            required: true,
            parameterKey: "laminationSides",
            options: [{value: 1, text: '1'}, {value: 2, text: '2'}],
            value: state.attributes?.laminationSides ? state.attributes?.laminationSides : '',
            machineInputType: 'input',
            isValid: true,

        },
    ];
}

export {laminationMachine};