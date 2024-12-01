
const applyingGlueCategories = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'applyingGlue',
            machineInputType: 'multiInput',
            value: state.attributes?.applyingGlue ? state.attributes?.applyingGlue : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.applyingGlue",
                    type: "switch",
                    placeholder: "machineAttributes.applyingGlue",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.applyingGlue?.isAvailable ? state.attributes?.applyingGlue?.isAvailable : ''
                },
                {
                    name: "categories",
                    label: "machineAttributes.categories",
                    type: "select",
                    placeholder: "machineAttributes.categories",
                    required: true,
                    parameterKey: "categories",
                    options: [],
                    value: state?.attributes?.applyingGlue?.categories,
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=cut',
                    multiple: true,
                    disabled: !state.attributes?.applyingGlue?.isAvailable
                },
                {
                    name: "glueType",
                    label: "machineAttributes.glueType",
                    type: "select",
                    placeholder: "machineAttributes.glueType",
                    required: true,
                    parameterKey: "categories",
                    options: [],
                    value: state?.attributes?.applyingGlue?.glueType,
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=cut',
                    multiple: true,
                    disabled: !state.attributes?.applyingGlue?.isAvailable
                },
            ]
        },
    ]
}


export {applyingGlueCategories};