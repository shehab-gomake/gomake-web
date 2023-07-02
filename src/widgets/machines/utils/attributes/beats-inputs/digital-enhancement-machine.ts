const digitalEnhancementMachine = (state: Record<string, any>) => {
    return [
        {
            name: "available",
            label: "machineAttributes.available",
            type: "switch",
            placeholder: "machineAttributes.available",
            required: true,
            parameterKey: "embossingAvailable",
            value: state?.attributes?.embossingAvailable,
            options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            machineInputType: 'input',
            isValid: true
        },
    ]
};

export {digitalEnhancementMachine};