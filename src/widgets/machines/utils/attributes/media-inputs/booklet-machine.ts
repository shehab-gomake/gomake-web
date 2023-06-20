const bookletMachine = (state: Record<string, any>) => {
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
            name: 'machineAttributes.thicknessBeforeFolding',
            parameterKey: 'thicknessBeforeFolding',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.thicknessBeforeFolding?.min &&
                !!state?.attributes?.thicknessBeforeFolding?.max,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.thicknessBeforeFolding?.min ? state.attributes?.thicknessBeforeFolding?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.thicknessBeforeFolding?.max ? state.attributes?.thicknessBeforeFolding?.max : ''
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


export {bookletMachine};