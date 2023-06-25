const shrinkPackingMachine = (state: Record<string, any>) => {
    return [
        {
            name: "setupTime",
            label: "machineAttributes.setupTime",
            type: "text",
            placeholder: "machineAttributes.setupTime",
            required: true,
            parameterKey: "setupTime",
            options: [],
            value: state.attributes?.setupTime ? state.attributes?.setupTime : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setupTime,
        },
        {
            name: "warmUpTime",
            label: "machineAttributes.warmUpTime",
            type: "text",
            placeholder: "machineAttributes.warmUpTime",
            required: true,
            parameterKey: "warmUpTime",
            options: [],
            value: state.attributes?.warmUpTime ? state.attributes?.warmUpTime : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.warmUpTime,
        },

        {
            name: 'machineAttributes.mediaDimensions',
            parameterKey: 'mediaDimensions',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaDimensions?.minWidth &&
                !!state?.attributes?.mediaDimensions?.minLength &&
                !!state?.attributes?.mediaDimensions?.maxWidth &&
                !!state?.attributes?.mediaDimensions?.maxLength ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.minWidth",
                    type: "text",
                    placeholder: "machineAttributes.minWidth",
                    required: true,
                    parameterKey: "minWidth",
                    options: [],
                    value: state.attributes?.mediaDimensions?.minWidth ? state.attributes?.mediaDimensions?.minWidth : ''
                },
                {
                    name: "",
                    label: "machineAttributes.minLength",
                    type: "text",
                    placeholder: "machineAttributes.minLength",
                    required: true,
                    parameterKey: "minLength",
                    options: [],
                    value: state.attributes?.mediaDimensions?.minLength ? state.attributes?.mediaDimensions?.minLength : ''

                },
                {
                    name: "",
                    label: "machineAttributes.maxWidth",
                    type: "text",
                    placeholder: "machineAttributes.maxWidth",
                    required: true,
                    parameterKey: "maxWidth",
                    options: [],
                    value: state.attributes?.mediaDimensions?.maxWidth ? state.attributes?.mediaDimensions?.maxWidth : ''

                },
                {
                    name: "",
                    label: "machineAttributes.maxLength",
                    type: "text",
                    placeholder: "machineAttributes.maxLength",
                    required: true,
                    parameterKey: "maxLength",
                    options: [],
                    value: state.attributes?.mediaDimensions?.maxLength ? state.attributes?.mediaDimensions?.maxLength : ''

                },
            ]
        },
        {
            name: 'machineAttributes.height',
            parameterKey: 'mediaHeight',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaHeight?.min &&
                !!state?.attributes?.mediaHeight?.max  ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.mediaHeight?.min ? state.attributes?.mediaHeight?.min : ''

                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaHeight?.max ? state.attributes?.mediaHeight?.max : ''
                },
            ]
        },
    ]
}


export {shrinkPackingMachine};