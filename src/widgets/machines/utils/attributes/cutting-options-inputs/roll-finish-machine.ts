import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const rollFinishMachine = (state: Record<string, any>) => {
    return [
        {
            name: "",
            label: "machineAttributes.hasDieKissCutUnit",
            type: "switch",
            placeholder: "",
            required: true,
            parameterKey: "hasDieKissCutUnit",
            value: state.attributes?.hasDieKissCutUnit,
            options: [],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "dieSetupTime",
            label: "machineAttributes.dieSetupTime",
            type: "text",
            placeholder: "machineAttributes.dieSetupTime",
            required: true,
            parameterKey: "dieSetupTime",
            unit: EMeasurementUnits.MINUTE,
            options: [],
            value: state?.attributes?.dieSetupTime ? state?.attributes?.dieSetupTime : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.dieSetupTime,
            disabled: !state.attributes?.hasDieKissCutUnit
        },
        {
            name: 'machineAttributes.straightKnife',
            parameterKey: 'straightKnife',
            machineInputType: 'multiInput',
            value: state?.attributes?.straightKnife,
            isValid: true,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.exit",
                    type: "switch",
                    placeholder: "",
                    required: true,
                    parameterKey: "exit",
                    value: state?.attributes?.straightKnife?.exit,
                    options: [],
                    machineInputType: 'input',
                    isValid: true,
                },
                {
                    name: "",
                    label: "machineAttributes.setupTime",
                    type: "text",
                    placeholder: "machineAttributes.minWidth",
                    required: true,
                    parameterKey: "setupTime",
                    unit: EMeasurementUnits.MINUTE,
                    options: [],
                    value: state.attributes?.straightKnife?.setupTime ? state.attributes?.straightKnife?.setupTime : '',
                    disabled: !state?.attributes?.straightKnife?.exit
                },
                {
                    name: "",
                    label: "machineAttributes.minWidth",
                    type: "text",
                    placeholder: "machineAttributes.minWidth",
                    required: true,
                    parameterKey: "minWidth",
                    unit: EMeasurementUnits.MM,
                    options: [],
                    value: state.attributes?.straightKnife?.minWidth ? state.attributes?.straightKnife?.minWidth : '',
                    disabled: !state?.attributes?.straightKnife?.exit
                },
                {
                    name: "",
                    label: "machineAttributes.minLength",
                    type: "text",
                    placeholder: "machineAttributes.minLength",
                    required: true,
                    unit: EMeasurementUnits.MM,
                    parameterKey: "minLength",
                    options: [],
                    value: state.attributes?.straightKnife?.minLength ? state.attributes?.straightKnife?.minLength : '',
                    disabled: !state?.attributes?.straightKnife?.exit
                },
                {
                    name: "",
                    label: "machineAttributes.maxWidth",
                    unit: EMeasurementUnits.MM,
                    type: "text",
                    placeholder: "machineAttributes.maxWidth",
                    required: true,
                    parameterKey: "maxWidth",
                    options: [],
                    value: state.attributes?.straightKnife?.maxWidth ? state.attributes?.straightKnife?.maxWidth : '',
                    disabled: !state?.attributes?.straightKnife?.exit
                },
                {
                    name: "",
                    label: "machineAttributes.maxLength",
                    type: "text",
                    placeholder: "machineAttributes.maxLength",
                    required: true,
                    unit: EMeasurementUnits.MM,
                    parameterKey: "maxLength",
                    options: [],
                    value: state.attributes?.straightKnife?.maxLength ? state.attributes?.straightKnife?.maxLength : '',
                    disabled: !state?.attributes?.straightKnife?.exit
                },
                {
                    name: "",
                    label: "machineAttributes.maxColumns",
                    type: "text",
                    placeholder: "machineAttributes.maxColumns",
                    required: true,
                    parameterKey: "maxColumns",
                    options: [],
                    value: state.attributes?.straightKnife?.maxColumns ? state.attributes?.straightKnife?.maxColumns : '',
                    disabled: !state?.attributes?.straightKnife?.exit
                },
            ]
        },

    ];
}

export {rollFinishMachine};