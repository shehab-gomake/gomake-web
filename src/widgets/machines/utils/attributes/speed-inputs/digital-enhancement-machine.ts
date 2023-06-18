const digitalEnhancementMachine = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.maxSpeed',
            parameterKey: 'maxSpeed',
            value: state.attributes?.maxSpeed || [],
            machineInputType: 'multiArrayInput',
            isValid: state.attributes?.maxSpeed?.length > 0,
            inputs: [
                {
                    name: "speed",
                    label: "machineAttributes.speed",
                    type: "text",
                    placeholder: "machineAttributes.speed",
                    required: true,
                    parameterKey: "speed",
                    options: []
                },
                {
                    name: "mediaWeightMaxSpeed",
                    label: "machineAttributes.mediaWeightMaxSpeed",
                    type: "text",
                    placeholder: "machineAttributes.mediaWeightMaxSpeed",
                    required: true,
                    parameterKey: "mediaWeightMaxSpeed",
                    options: []
                },
            ]
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

export {digitalEnhancementMachine};