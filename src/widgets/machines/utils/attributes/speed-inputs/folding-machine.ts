import {maxSpeedInput} from "@/widgets/machines/utils/attributes/speed-inputs/max-speed-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const foldingMachine = (state: Record<string, any>) => {
    return [
        ...maxSpeedInput(state, EMeasurementUnits.MINUTE),
        {
            name: "unitDelay",
            label: "machineAttributes.unitDelay",
            type: "text",
            placeholder: "machineAttributes.unitDelay",
            required: true,
            parameterKey: "unitDelay",
            options: [],
            value: state?.attributes?.unitDelay ? state?.attributes?.unitDelay : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.unitDelay,
        },
        {
            name: "foldingDelay",
            label: "machineAttributes.foldingDelay",
            type: "text",
            placeholder: "machineAttributes.foldingDelay",
            required: true,
            parameterKey: "foldingDelay",
            options: [],
            value: state?.attributes?.foldingDelay ? state?.attributes?.foldingDelay : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.foldingDelay,
        },
        {
            name: 'machineAttributes.speedByMediaWeight',
            parameterKey: 'speedByMediaWeight',
            value: state.attributes?.speedByMediaWeight || [],
            isValid: state.attributes?.speedByMediaWeight?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "weight",
                    label: "machineAttributes.weight",
                    type: "text",
                    placeholder: "machineAttributes.weight",
                    required: true,
                    parameterKey: "weight",
                    options: []
                },
                {
                    name: "targetWeight",
                    label: "machineAttributes.targetWeight",
                    type: "text",
                    placeholder: "machineAttributes.targetWeight",
                    required: true,
                    parameterKey: "targetWeight",
                    options: []
                },
                {
                    name: "speedPercentage",
                    label: "machineAttributes.speedPercentage",
                    type: "text",
                    placeholder: "machineAttributes.speedPercentage",
                    required: true,
                    parameterKey: "speedPercentage",
                    options: []
                },

            ]
        }
    ]
}

export {foldingMachine};