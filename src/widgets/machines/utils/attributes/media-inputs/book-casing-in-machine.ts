const bookCasingInMachine = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.blockThickness',
            parameterKey: 'blockThickness',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.blockThickness?.min &&
                !!state?.attributes?.blockThickness?.max,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.blockThickness?.min ? state.attributes?.blockThickness?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.blockThickness?.max ? state.attributes?.blockThickness?.max : ''
                },
            ]
        },
        {
            name: 'machineAttributes.blockHeight',
            parameterKey: 'blockHeight',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.blockHeight?.min &&
                !!state?.attributes?.blockHeight?.max,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.blockHeight?.min ? state.attributes?.blockHeight?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.blockHeight?.max ? state.attributes?.blockHeight?.max : ''
                },
            ]
        },
        {
            name: 'machineAttributes.blockWidth',
            parameterKey: 'blockWidth',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.blockWidth?.min &&
                !!state?.attributes?.blockWidth?.max,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.blockWidth?.min ? state.attributes?.blockWidth?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.blockWidth?.max ? state.attributes?.blockWidth?.max : ''
                },
            ]
        },
    ]
}


export {bookCasingInMachine};