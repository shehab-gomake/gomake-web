import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const analogEnhancement = (state: Record<string, any>) => {
    return [
        {
            name: "setupTimeMin",
            label: "machineAttributes.setupTimeMin",
            type: "text",
            placeholder: "machineAttributes.setupTimeMin",
            required: true,
            parameterKey: "setupTimeMin",
            unit: EMeasurementUnits.MINUTE,
            options: [],
            value: state.attributes?.setupTimeMin ? state.attributes?.setupTimeMin : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setupTimeMin,
        },
        {
            name: "maxSpeed",
            label: "machineAttributes.maxSpeed",
            type: "text",
            placeholder: "machineAttributes.maxSpeed",
            required: true,
            unit: EMeasurementUnits.SPH,
            parameterKey: "maxSpeed",
            options: [],
            value: state.attributes?.maxSpeed ? state.attributes?.maxSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxSpeed,
        },
        {
            name: 'machineAttributes.costBySizeType',
            parameterKey: 'costBySizeType',
            value: state.attributes?.costBySizeType || [],
            machineInputType: 'multiArrayInput',
            isValid: true,
            inputs: [
                {
                    name: "size",
                    label: "machineAttributes.size",
                    type: "text",
                    placeholder: "machineAttributes.size",
                    required: true,
                    parameterKey: "size",
                    options: [],
                    unit: EMeasurementUnits.SQUARE_CM
                },
                {
                    name: "costPercentage",
                    label: "machineAttributes.costPercentage",
                    type: "text",
                    unit: EMeasurementUnits.PERCENTAGE,
                    placeholder: "machineAttributes.costPercentage",
                    required: true,
                    parameterKey: "costPercentage",
                    options: []
                },
            ]
        },
        {
            name: 'machineAttributes.speedByComplexity',
            parameterKey: 'speedByComplexity',
            value: state.attributes?.speedByComplexity || [],
            machineInputType: 'multiArrayInput',
            isValid: true,
            inputs: [
                {
                    name: "complexity",
                    label: "machineAttributes.complexity",
                    type: "select",
                    placeholder: "machineAttributes.complexity",
                    required: true,
                    unit: EMeasurementUnits.CM,
                    parameterKey: "complexity",
                    options: [
                        {value: 1, text: 'Simple'},
                        {value: 2, text: 'Medium'},
                        {value: 1, text: 'Complex'},
                    ]
                },
                {
                    name: "speed",
                    label: "machineAttributes.speedPercentage",
                    type: "text",
                    placeholder: "machineAttributes.speedPercentage",
                    required: true,
                    unit: EMeasurementUnits.PERCENTAGE,
                    parameterKey: "speed",
                    options: []
                },
            ]
        },
    ]
}

export {analogEnhancement};

