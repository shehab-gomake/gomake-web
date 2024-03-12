const foldingMachine = (state: Record<string, any>) => {
    return [
        {
            name: "foldsInWidth",
            label: "machineAttributes.foldsInWidth",
            type: "text",
            placeholder: "machineAttributes.foldsInWidth",
            required: true,
            parameterKey: "foldsInWidth",
            options: [],
            value: state.attributes?.foldsInWidth ? state.attributes?.foldsInWidth : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.foldsInWidth,
        },
        {
            name: "foldsInLength",
            label: "machineAttributes.foldsInLength",
            type: "text",
            placeholder: "machineAttributes.foldsInLength",
            required: true,
            parameterKey: "foldsInLength",
            options: [],
            value: state.attributes?.foldsInLength ? state.attributes?.foldsInLength : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.foldsInLength,
        },
    ]
}

export {foldingMachine};