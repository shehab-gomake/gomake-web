const bookBinderMachine = (state: Record<string, any>) => {
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
            name: "warmUpTime",
            label: "machineAttributes.warmUpTime",
            type: "text",
            placeholder: "machineAttributes.warmUpTime",
            required: true,
            parameterKey: "warmUpTime",
            options: [],
            value: state?.attributes?.warmUpTime ? state?.attributes?.warmUpTime : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.warmUpTime,
        },
        {
            name: "paperCategoriesSuitable",
            label: "machineAttributes.paperCategoriesSuitable",
            type: "select",
            placeholder: "machineAttributes.paperCategoriesSuitable",
            required: true,
            parameterKey: "paperCategoriesSuitable",
            value: state.attributes?.doubleHead,
            options: [{value: 0, text: 'Option 1'}, {value: 2, text: 'Option 2'}],
            machineInputType: 'input',
            isValid: true,
        },
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


export {bookBinderMachine};