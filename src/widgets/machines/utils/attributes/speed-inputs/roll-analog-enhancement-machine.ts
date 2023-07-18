const rollAnalogEnhancementMachine = (state: Record<string, any>) => {
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
    ]
}

export {rollAnalogEnhancementMachine};