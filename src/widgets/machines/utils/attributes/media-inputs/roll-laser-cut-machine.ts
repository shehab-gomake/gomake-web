const rollLaserCutMachine = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.rollWidth',
            parameterKey: 'rollWidth',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.rollWidth?.min &&
                !!state?.attributes?.rollWidth?.max  ,
            inputs: [
                {
                    name: "min",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.rollWidth?.min ? state.attributes?.rollWidth?.min : ''

                },
                {
                    name: "max",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.rollWidth?.max ? state.attributes?.rollWidth?.max  : ''

                },
            ]
        },
        {
            name: "maxRollDiameter",
            label: "machineAttributes.maxRollDiameter",
            type: "text",
            placeholder: "machineAttributes.maxRollDiameter",
            parameterKey: "maxRollDiameter",
            options: [],
            value: state?.attributes?.maxRollDiameter ? state?.attributes?.maxRollDiameter : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxRollDiameter,
        },
    ]
}


export {rollLaserCutMachine};