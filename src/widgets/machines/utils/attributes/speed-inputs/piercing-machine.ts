
const piercingMachine = (state: Record<string, any>) => {
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
            name: "delayPerUnit",
            label: "machineAttributes.delayPerUnit",
            type: "text",
            placeholder: "machineAttributes.delayPerUnit",
            required: true,
            parameterKey: "delayPerUnit",
            options: [],
            value: state.attributes?.delayPerUnit ? state.attributes?.delayPerUnit : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.delayPerUnit,
        },
    ]
}

export {piercingMachine};