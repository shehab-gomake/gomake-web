
const rollSheeterMachine = (state: Record<string, any>) => {
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
            value: state.attributes?.maxSpeed ? state.attributes?.maxSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxSpeed,
        },
        {
            name: "sheetDelay",
            label: "machineAttributes.sheetDelay",
            type: "text",
            placeholder: "machineAttributes.sheetDelay",
            required: true,
            parameterKey: "sheetDelay",
            options: [],
            value: state.attributes?.sheetDelay ? state.attributes?.sheetDelay : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.sheetDelay,
        },
    ]
}

export {rollSheeterMachine};