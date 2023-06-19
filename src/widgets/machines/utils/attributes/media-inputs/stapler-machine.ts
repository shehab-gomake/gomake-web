const staplerMachine = (state: Record<string, any>) => {
    return [
        {
            name: "setupTimeMin",
            label: "machineAttributes.setupTimeMin",
            type: "text",
            placeholder: "machineAttributes.setupTimeMin",
            required: true,
            parameterKey: "setupTimeMin",
            options: [],
            value: state?.attributes?.setupTimeMin ? state?.attributes?.setupTimeMin : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setupTimeMin,
        },
        {
            name: "maxStaplerThickness",
            label: "machineAttributes.maxStaplerThickness",
            type: "text",
            placeholder: "machineAttributes.maxStaplerThickness",
            required: true,
            parameterKey: "maxStaplerThickness",
            value: state?.attributes?.maxStaplerThickness,
            options: [],
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxStaplerThickness,
        },
        {
            name: "maxStapleHeight",
            label: "machineAttributes.maxStapleHeight",
            type: "text",
            placeholder: "machineAttributes.maxStapleHeight",
            required: true,
            parameterKey: "maxStapleHeight",
            value: state?.attributes?.maxStapleHeight,
            options: [],
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxStapleHeight,
        },
        {
            name: "coilThickness",
            label: "machineAttributes.coilThickness",
            type: "select",
            placeholder: "machineAttributes.coilThickness",
            required: true,
            parameterKey: "coilThickness",
            value: state?.attributes?.coilThickness,
            options: [{value: 1, text: '1'}, {value: 2, text: '2'}],
            machineInputType: 'input',
            isValid: true,
        },
    ]
}


export {staplerMachine};