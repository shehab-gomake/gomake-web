
const mediaFlatbedCategories = (state: Record<string, any>, parameterKey = 'flatbedsCategories') => {
    return [
        {
            name: '',
            parameterKey: parameterKey,
            machineInputType: 'multiInput',
            value: state.attributes[parameterKey] ? state.attributes[parameterKey] : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.flatbedsAvailable",
                    type: "switch",
                    placeholder: "machineAttributes.flatbedsAvailable",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes[parameterKey]?.isAvailable ? state.attributes[parameterKey]?.isAvailable : ''
                },
                {
                    name: "categories",
                    label: "machineAttributes.categories",
                    type: "select",
                    placeholder: "machineAttributes.categories",
                    required: true,
                    parameterKey: "categories",
                    options: [],
                    value: state?.attributes[parameterKey]?.categories,
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=flatbeds',
                    multiple: true,
                    disabled: !state.attributes[parameterKey]?.isAvailable
                },
            ]
        },
    ]
}


export {mediaFlatbedCategories};