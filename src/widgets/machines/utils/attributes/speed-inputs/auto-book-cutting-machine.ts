
const autoBookCuttingMachine = (state: Record<string, any>) => {
    return [
        {
            name: "maxSpeed",
            label: "machineAttributes.maxSpeed",
            type: "text",
            placeholder: "machineAttributes.maxSpeed",
            required: true,
            parameterKey: "maxSpeed",
            options: [],
            value: state.attributes?.maxSpeed ? state.attributes?.maxSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxSpeed,
        },
        {
            name: 'machineAttributes.speedByBookThickness',
            parameterKey: 'speedByBookThickness',
            value: state.attributes?.speedByBookThickness || [],
            isValid: state.attributes?.speedByBookThickness?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "thickness",
                    label: "machineAttributes.thickness",
                    type: "text",
                    placeholder: "machineAttributes.thickness",
                    required: true,
                    parameterKey: "thickness",
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

export {autoBookCuttingMachine};