const spiralClosingMachine = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.thickness',
            parameterKey: 'thickness',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.thickness?.min &&
                !!state?.attributes?.thickness?.max,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.thickness?.min ? state.attributes?.thickness?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.thickness?.max ? state.attributes?.thickness?.max : ''
                },
            ]
        },
        {
            name: 'machineAttributes.width',
            parameterKey: 'width',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.width?.min &&
                !!state?.attributes?.width?.max,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.width?.min ? state.attributes?.width?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.width?.max ? state.attributes?.width?.max : ''
                },
            ]
        },
        {
            name: 'machineAttributes.length',
            parameterKey: 'length',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.length?.min &&
                !!state?.attributes?.length?.max,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.length?.min ? state.attributes?.length?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.length?.max ? state.attributes?.length?.max : ''
                },
            ]
        },
        {
            name: 'machineAttributes.paperThickness',
            parameterKey: 'paperThickness',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.paperThickness?.min &&
                !!state?.attributes?.paperThickness?.max,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.paperThickness?.min ? state.attributes?.paperThickness?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.paperThickness?.max ? state.attributes?.paperThickness?.max : ''
                },
            ]
        },
    ]
}


export {spiralClosingMachine};