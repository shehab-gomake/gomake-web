const foldingGluingMachine = (state: Record<string, any>) => {
    return [
        {
            name: "glueCost",
            label: "machineAttributes.glueCost",
            type: "text",
            placeholder: "machineAttributes.glueCost",
            required: true,
            parameterKey: "glueCost",
            options: [],
            value: state.attributes?.glueCost ? state.attributes?.glueCost : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.glueCost,
        },
    ]
}

export {foldingGluingMachine};