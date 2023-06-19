const foldingGluingMachine = (state: Record<string, any>) => {
    return [
        {
            name: "speedUnit",
            label: "machineAttributes.speedUnit",
            type: "select",
            placeholder: "machineAttributes.speedUnit",
            required: true,
            parameterKey: "speedUnit",
            value: state.attributes?.speedUnit,
            options: [{value: '1', text: 'Automatic'}, {value: "2", text: 'Manual'}],
            machineInputType: 'input',
            isValid: true,
        },
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