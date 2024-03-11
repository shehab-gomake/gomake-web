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
            name: 'machineAttributes.speedByArea',
            parameterKey: 'costBySizeType',
            value: state.attributes?.costBySizeType || [],
            machineInputType: 'multiArrayInput',
            isValid: true,
            inputs: [
                {
                    name: "area",
                    label: "machineAttributes.area",
                    type: "text",
                    placeholder: "machineAttributes.area",
                    required: true,
                    parameterKey: "area",
                    options: [],
                    unit: EMeasurementUnits.SQUARE_CM
                },
                {
                    name: "speedPercentage",
                    label: "machineAttributes.speedPercentage",
                    type: "text",
                    unit: EMeasurementUnits.PERCENTAGE,
                    placeholder: "machineAttributes.speedPercentage",
                    required: true,
                    parameterKey: "speedPercentage",
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
                    name: "shape",
                    label: "machineAttributes.shape",
                    type: "select",
                    placeholder: "machineAttributes.shape",
                    required: true,
                    parameterKey: "shape",
                    options: [],
                    optionsUrl: '/v1/print-house-config/parameters/shape-complexity'
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

