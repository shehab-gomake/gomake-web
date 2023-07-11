const manualSewingMachine = (state: Record<string, any>) => {
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
            name: "maxSpeed",
            label: "machineAttributes.maxSpeed",
            type: "text",
            placeholder: "machineAttributes.maxSpeed",
            required: true,
            parameterKey: "speed",
            options: [],
            value: state.attributes?.maxSpeed ? state.attributes?.maxSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxSpeed,
        },
        {
            name: "unitDelay",
            label: "machineAttributes.unitDelay",
            type: "text",
            placeholder: "machineAttributes.unitDelay",
            required: true,
            parameterKey: "unitDelay",
            options: [],
            value: state.attributes?.speed ? state.attributes?.unitDelay : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.unitDelay,
        },


    ]
}

export {manualSewingMachine};