
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
    ]
}

export {PVCBendingMachine};