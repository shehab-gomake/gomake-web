const digitalEnhancementMachine = (state: Record<string, any>) => {
    return [
        {
            name: "feederHeight",
            label: "machineAttributes.feederHeight",
            type: "text",
            placeholder: "machineAttributes.feederHeight",
            required: true,
            parameterKey: "feederHeight",
            options: [],
            value: state.attributes?.feederHeight ? state.attributes?.feederHeight : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.feederHeight,
        },
        {
            name: "stackerHeight",
            label: "machineAttributes.stackerHeight",
            type: "text",
            placeholder: "machineAttributes.stackerHeight",
            required: true,
            parameterKey: "stackerHeight",
            options: [],
            value: state.attributes?.stackerHeight ? state.attributes?.stackerHeight : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.stackerHeight,
        },
    ]
};

export {digitalEnhancementMachine};