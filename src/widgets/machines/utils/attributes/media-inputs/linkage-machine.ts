const linkageMachine = (state: Record<string, any>) => {
    return [
        {
            name: "mediaLossMeter",
            label: "machineAttributes.mediaLossMeter",
            type: "text",
            placeholder: "machineAttributes.mediaLossMeter",
            required: true,
            parameterKey: "mediaLossMeter",
            value: state?.attributes?.mediaLossMeter,
            options: [],
            machineInputType: 'input',
            isValid: !!state?.attributes?.mediaLossMeter,
        },
        {
            name: 'machineAttributes.rolls',
            parameterKey: 'rolls',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.rolls?.maxWidth &&
                !!state?.attributes?.rolls?.maxLength &&
                !!state?.attributes?.rolls?.maxThickness ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.maxWidth",
                    type: "text",
                    placeholder: "machineAttributes.maxWidth",
                    required: true,
                    parameterKey: "maxWidth",
                    options: [],
                    value: state.attributes?.rolls?.maxWidth ? state.attributes?.rolls?.maxWidth : ''
                },
                {
                    name: "",
                    label: "machineAttributes.maxLength",
                    type: "text",
                    placeholder: "machineAttributes.maxLength",
                    required: true,
                    parameterKey: "maxLength",
                    options: [],
                    value: state.attributes?.rolls?.maxLength ? state.attributes?.rolls?.maxLength : ''

                },
                {
                    name: "",
                    label: "machineAttributes.maxThickness",
                    type: "text",
                    placeholder: "machineAttributes.maxThickness",
                    required: true,
                    parameterKey: "maxThickness",
                    options: [],
                    value: state.attributes?.rolls?.maxThickness ? state.attributes?.rolls?.maxThickness : ''

                },
            ]
        },
        {
            name: 'machineAttributes.flatbeds',
            parameterKey: 'flatbeds',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.flatbeds?.maxWidth &&
                !!state?.attributes?.flatbeds?.maxLength &&
                !!state?.attributes?.flatbeds?.maxThickness ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.maxWidth",
                    type: "text",
                    placeholder: "machineAttributes.maxWidth",
                    required: true,
                    parameterKey: "maxWidth",
                    options: [],
                    value: state.attributes?.flatbeds?.maxWidth ? state.attributes?.flatbeds?.maxWidth : ''
                },
                {
                    name: "",
                    label: "machineAttributes.maxLength",
                    type: "text",
                    placeholder: "machineAttributes.maxLength",
                    required: true,
                    parameterKey: "maxLength",
                    options: [],
                    value: state.attributes?.flatbeds?.maxLength ? state.attributes?.flatbeds?.maxLength : ''

                },
                {
                    name: "",
                    label: "machineAttributes.maxThickness",
                    type: "text",
                    placeholder: "machineAttributes.maxThickness",
                    required: true,
                    parameterKey: "maxThickness",
                    options: [],
                    value: state.attributes?.flatbeds?.maxThickness ? state.attributes?.flatbeds?.maxThickness : ''

                },
            ]
        },
    ]
}


export {linkageMachine};