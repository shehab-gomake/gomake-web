const gluingMachine = (state: Record<string, any>) => {
    return [
        {
            name: "setupTime",
            label: "machineAttributes.setupTime",
            type: "text",
            placeholder: "machineAttributes.setupTime",
            required: true,
            parameterKey: "setupTime",
            options: [],
            value: state.attributes?.setupTime ? state.attributes?.setupTime : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setupTime,
        },
        {
            name: "speed",
            label: "machineAttributes.speed",
            type: "text",
            placeholder: "machineAttributes.speed",
            required: true,
            parameterKey: "speed",
            options: [],
            value: state.attributes?.speed ? state.attributes?.speed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.speed,
        },


    ]
}

export {gluingMachine};