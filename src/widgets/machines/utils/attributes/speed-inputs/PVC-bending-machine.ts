
const PVCBendingMachine = (state: Record<string, any>) => {
    return [
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

export {PVCBendingMachine};