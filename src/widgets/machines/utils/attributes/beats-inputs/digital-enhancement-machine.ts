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
        state?.attributes?.embossingAvailable ?
        {
            name: "machineAttributes.varnish",
            label: "machineAttributes.varnish",
            type: "text",
            placeholder: "machineAttributes.varnish",
            required: true,
            parameterKey: "varnishTypes",
            options: [],
            disabled: !state?.attributes?.embossingAvailable,
            machineInputType: 'materialInput',
            value: state?.attributes?.varnishTypes ? state?.attributes?.varnishTypes : [],
            isValid: true,
            materialType: 'varnish'
        } : {
                name: '',
                label: '',
                value: '',
                parameterKey: '',
                disabled: true
            },
    ]
};

export {digitalEnhancementMachine};