const encapsulationMachine = (state: Record<string, any>) => {
    return [
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
            name: "minMarginLamination",
            label: "machineAttributes.minMarginLamination",
            type: "text",
            placeholder: "machineAttributes.minMarginLamination",
            required: true,
            parameterKey: "minMarginLamination",
            options: [],
            value: state?.attributes?.minMarginLamination ? state?.attributes?.minMarginLamination : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.minMarginLamination,
        },
        {
            name: 'machineAttributes.mediaDimensions',
            parameterKey: 'mediaDimensions',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaDimensions?.minWidth &&
                !!state?.attributes?.mediaDimensions?.minLength &&
                !!state?.attributes?.mediaDimensions?.minWeight &&
                !!state?.attributes?.mediaDimensions?.minThickness &&
                !!state?.attributes?.mediaDimensions?.maxWidth &&
                !!state?.attributes?.mediaDimensions?.maxThickness &&
                !!state?.attributes?.mediaDimensions?.maxWeight &&
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
                    label: "machineAttributes.minThickness",
                    type: "text",
                    placeholder: "machineAttributes.minThickness",
                    required: true,
                    parameterKey: "minThickness",
                    options: [],
                    value: state.attributes?.mediaDimensions?.minThickness ? state.attributes?.mediaDimensions?.minThickness : ''

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
                {
                    name: "",
                    label: "machineAttributes.maxThickness",
                    type: "text",
                    placeholder: "machineAttributes.maxThickness",
                    required: true,
                    parameterKey: "maxThickness",
                    options: [],
                    value: state.attributes?.mediaDimensions?.maxThickness ? state.attributes?.mediaDimensions?.maxThickness : ''

                },
            ]
        },
    ]
}


export {encapsulationMachine};