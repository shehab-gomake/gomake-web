
const encapsulationMachine = (state: Record<string, any>) => {
    return [
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

export {encapsulationMachine};