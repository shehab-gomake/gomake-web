const foldingGluingMachine = (state: Record<string, any>) => {
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
            name: "mediaSheetsLoss",
            label: "machineAttributes.mediaSheetsLoss",
            type: "text",
            placeholder: "machineAttributes.mediaSheetsLoss",
            required: true,
            parameterKey: "mediaSheetsLoss",
            options: [],
            value: state?.attributes?.mediaSheetsLoss ? state?.attributes?.mediaSheetsLoss : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.mediaSheetsLoss,
        },
        {
            name: 'machineAttributes.mediaDimensions',
            parameterKey: 'mediaDimensions',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaDimensions?.minWidth &&
                !!state?.attributes?.mediaDimensions?.minLength &&
                !!state?.attributes?.mediaDimensions?.minWeight &&
                !!state?.attributes?.mediaDimensions?.maxLength &&
                !!state?.attributes?.mediaDimensions?.maxWeight &&
                !!state?.attributes?.mediaDimensions?.maxWidth,

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
                    label: "machineAttributes.minWeight",
                    type: "text",
                    placeholder: "machineAttributes.minWeight",
                    required: true,
                    parameterKey: "minWeight",
                    options: [],
                    value: state.attributes?.mediaDimensions?.minWeight ? state.attributes?.mediaDimensions?.minWeight : ''

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
                {
                    name: "",
                    label: "machineAttributes.maxWeight",
                    type: "text",
                    placeholder: "machineAttributes.maxWeight",
                    required: true,
                    parameterKey: "maxWeight",
                    options: [],
                    value: state.attributes?.mediaDimensions?.maxWeight ? state.attributes?.mediaDimensions?.maxWeight : ''

                },
            ]
        },

        {
            name: 'machineAttributes.mediaASize',
            parameterKey: 'mediaASize',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaASize?.min &&
                !!state?.attributes?.mediaASize?.max,

            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.mediaASize?.min ? state.attributes?.mediaASize?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaASize?.max ? state.attributes?.mediaASize?.max : ''

                },
            ]
        },
        {
            name: 'machineAttributes.mediaBSize',
            parameterKey: 'mediaBSize',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaBSize?.min &&
                !!state?.attributes?.mediaBSize?.max,

            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.mediaBSize?.min ? state.attributes?.mediaBSize?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaBSize?.max ? state.attributes?.mediaBSize?.max : ''

                },
            ]
        },
        {
            name: 'machineAttributes.mediaCSize',
            parameterKey: 'mediaCSize',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaCSize?.min &&
                !!state?.attributes?.mediaCSize?.max,

            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.mediaCSize?.min ? state.attributes?.mediaCSize?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaCSize?.max ? state.attributes?.mediaCSize?.max : ''

                },
            ]
        },
        {
            name: 'machineAttributes.mediaDSize',
            parameterKey: 'mediaDSize',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaDSize?.min &&
                !!state?.attributes?.mediaDSize?.max,

            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.mediaDSize?.min ? state.attributes?.mediaDSize?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaDSize?.max ? state.attributes?.mediaDSize?.max : ''

                },
            ]
        },
    ]
}


export {foldingGluingMachine};