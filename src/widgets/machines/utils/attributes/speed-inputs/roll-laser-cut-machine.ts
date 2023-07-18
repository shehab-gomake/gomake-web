import {shapes} from "@/widgets/machines/utils/const/shapes";

const rollLaserCutMachine = (state: Record<string, any>) => {
    return [
        {
            name: "setupTimeMin",
            label: "machineAttributes.setupTimeMin",
            type: "text",
            placeholder: "machineAttributes.setupTimeMin",
            required: true,
            parameterKey: "setupTimeMin",
            options: [],
            value: state?.attributes?.setupTimeMin ? state?.attributes?.setupTimeMin : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setupTimeMin,
        },
        {
            name: "maxSpeed",
            label: "machineAttributes.maxSpeed",
            type: "text",
            placeholder: "machineAttributes.maxSpeed",
            required: true,
            parameterKey: "maxSpeed",
            options: [],
            value: state?.attributes?.maxSpeed ? state?.attributes?.maxSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxSpeed,
        },
        {
            name: 'machineAttributes.speedByMediaType',
            parameterKey: 'speedByMediaType',
            value: state.attributes?.speedByMediaType || [],
            isValid: state.attributes?.speedByMediaType?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "mediaType",
                    label: "machineAttributes.mediaType",
                    type: "text",
                    placeholder: "machineAttributes.mediaType",
                    required: true,
                    parameterKey: "mediaType",
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
        },
        {
            name: 'machineAttributes.speedByShape',
            parameterKey: 'speedByShape',
            value: state.attributes?.speedByShape || [],
            isValid: state.attributes?.speedByShape?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "shape",
                    label: "machineAttributes.shape",
                    type: "select",
                    placeholder: "machineAttributes.shape",
                    required: true,
                    parameterKey: "shape",
                    options: shapes
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
        },
        {
            name: 'machineAttributes.speedBySize',
            parameterKey: 'speedBySize',
            value: state.attributes?.speedBySize || [],
            isValid: state.attributes?.speedBySize?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "upCm",
                    label: "machineAttributes.upCm",
                    type: "text",
                    placeholder: "machineAttributes.upCm",
                    required: true,
                    parameterKey: "upCm",
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

export {rollLaserCutMachine};