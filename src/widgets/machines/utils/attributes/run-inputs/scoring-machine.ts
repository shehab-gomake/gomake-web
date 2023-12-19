const scoringMachine = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'scoring',
            machineInputType: 'multiInput',
            value: state.attributes?.scoring ? state.attributes?.scoring : {},
            isValid: !!state?.attributes?.scoring?.maxLength &&
                !!state?.attributes?.scoring?.maxWidth,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.maxLength",
                    type: "text",
                    placeholder: "machineAttributes.maxLength",
                    required: true,
                    parameterKey: "maxLength",
                    options: [],
                    value: state.attributes?.scoring?.maxLength ? state.attributes?.scoring?.maxLength : ''

                },
                {
                    name: "",
                    label: "machineAttributes.maxWidth",
                    type: "text",
                    placeholder: "machineAttributes.maxWidth",
                    required: true,
                    parameterKey: "maxWidth",
                    options: [],
                    value: state.attributes?.scoring?.maxWidth ? state.attributes?.scoring?.maxWidth : ''

                },
            ]
        },
    ]
}

export {scoringMachine};