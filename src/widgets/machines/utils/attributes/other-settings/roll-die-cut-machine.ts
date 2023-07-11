const rollDieCutMachine = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'core',
            value: state.attributes?.core || [],
            isValid: state.attributes?.core?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "structure",
                    label: "machineAttributes.axisDiameter",
                    type: "text",
                    placeholder: "machineAttributes.axisDiameter",
                    required: true,
                    parameterKey: "axisDiameter",
                    options: []
                },
                {
                    name: "maxWidth",
                    label: "machineAttributes.maxWidth",
                    type: "text",
                    placeholder: "machineAttributes.maxWidth",
                    required: true,
                    parameterKey: "maxWidth",
                    options: []
                },
            ]
        }
    ];
}

export {rollDieCutMachine};