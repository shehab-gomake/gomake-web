
const bookBinderMachine = (state: Record<string, any>) => {
    return [
        {
            name: "isAvailable",
            label: "machineAttributes.isAvailable",
            type: "switch",
            placeholder: "",
            required: true,
            parameterKey: "hasCuttingUnit",
            value: !!state.attributes?.hasCuttingUnit,
            options: [],
            machineInputType: 'input',
            isValid: true,
        },
    ]
}

export {bookBinderMachine};