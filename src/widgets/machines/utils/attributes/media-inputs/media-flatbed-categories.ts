
const mediaFlatbedCategories = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'flatbedsCategories',
            machineInputType: 'multiInput',
            value: state.attributes?.flatbedsCategories ? state.attributes?.flatbedsCategories : {},
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
                    value: state.attributes?.flatbedsCategories?.isAvailable ? state.attributes?.flatbedsCategories?.isAvailable : ''
                },
                {
                    name: "categories",
                    label: "machineAttributes.categories",
                    type: "select",
                    placeholder: "machineAttributes.categories",
                    required: true,
                    parameterKey: "categories",
                    options: [],
                    value: state?.attributes?.flatbedsCategories?.categories,
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=flatbeds',
                    multiple: true,
                    disabled: !state.attributes?.flatbedsCategories?.isAvailable
                },
            ]
        },
    ]
}


export {mediaFlatbedCategories};