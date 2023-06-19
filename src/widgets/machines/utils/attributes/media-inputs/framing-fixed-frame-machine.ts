const framingFixedFrameMachine = (state: Record<string, any>) => {
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
            name: 'machineAttributes.sizes',
            parameterKey: 'mediaSizes',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaSizes?.width &&
                !!state?.attributes?.mediaSizes?.length ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.mediaSizes?.width ? state.attributes?.mediaSizes?.width : ''
                },
                {
                    name: "",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.mediaSizes?.length ? state.attributes?.mediaSizes?.length : ''

                },
            ]
        },
    ]
}


export {framingFixedFrameMachine};