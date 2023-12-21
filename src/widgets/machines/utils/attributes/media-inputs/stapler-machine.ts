const staplerMachine = (state: Record<string, any>) => {
    return [
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
            name: "maxStapleLength",
            label: "machineAttributes.maxStapleLength",
            type: "text",
            placeholder: "machineAttributes.maxStapleLength",
            required: true,
            parameterKey: "maxStapleHeight",
            value: state?.attributes?.maxStapleLength,
            options: [],
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxStapleLength,
        },
        {
            name: "maxStapleWidth",
            label: "machineAttributes.maxStapleWidth",
            type: "text",
            placeholder: "machineAttributes.maxStapleWidth",
            required: true,
            parameterKey: "maxStapleWidth",
            value: state?.attributes?.maxStapleWidth,
            options: [],
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxStapleWidth,
        },
    ]
}


export {staplerMachine};