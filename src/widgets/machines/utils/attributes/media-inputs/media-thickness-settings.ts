const mediaThicknessSettings = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.mediaThickness',
            parameterKey: 'mediaThickness',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaThickness?.min &&
                !!state?.attributes?.mediaThickness?.max  ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.mediaThickness?.min ? state.attributes?.mediaThickness?.min : ''

                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaThickness?.max ? state.attributes?.mediaThickness?.max : ''
                },
            ]
        },
    ]
}


export {mediaThicknessSettings};