const bookSewingMachine = (state: Record<string, any>) => {
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
            name: "setDelay",
            label: "machineAttributes.setDelay",
            type: "text",
            placeholder: "machineAttributes.setDelay",
            required: true,
            parameterKey: "setDelay",
            options: [],
            value: state?.attributes?.setDelay ? state?.attributes?.setDelay : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setDelay,
        },
    ]
}


export {bookSewingMachine};