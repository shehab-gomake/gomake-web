
const mediaWeightSettings = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.mediaWeight',
            parameterKey: 'mediaWeight',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaWeight?.min &&
                !!state?.attributes?.mediaWeight?.max  ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.mediaWeight?.min ? state.attributes?.mediaWeight?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaWeight?.max ? state.attributes?.mediaWeight?.max : ''

                },
            ]
        },
    ]
}


export {mediaWeightSettings};