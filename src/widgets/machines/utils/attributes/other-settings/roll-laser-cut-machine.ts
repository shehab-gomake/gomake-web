
const rollLaserCutMachine = (state: Record<string, any>) => {
    return [
        {
            name: "axisDiameter",
            label: "machineAttributes.axisDiameter",
            type: "text",
            placeholder: "machineAttributes.axisDiameter",
            required: true,
            parameterKey: "axisDiameter",
            options: [],
            value: state.attributes?.axisDiameter ? state.attributes?.axisDiameter : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.axisDiameter,
        },
        {
            name: "coreMaxWidth",
            label: "machineAttributes.coreMaxWidth",
            type: "text",
            placeholder: "machineAttributes.coreMaxWidth",
            required: true,
            parameterKey: "coreMaxWidth",
            options: [],
            value: state.attributes?.coreMaxWidth ? state.attributes?.coreMaxWidth : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.coreMaxWidth,
        },
    ];
}

export {rollLaserCutMachine};