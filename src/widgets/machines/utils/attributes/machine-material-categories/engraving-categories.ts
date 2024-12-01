
const engravingCategories = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'engravingTool',
            machineInputType: 'multiInput',
            value: state.attributes?.engravingTool ? state.attributes?.engravingTool : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.engravingTool",
                    type: "switch",
                    placeholder: "machineAttributes.engravingTool",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.engravingTool?.isAvailable ? state.attributes?.engravingTool?.isAvailable : ''
                },
                {
                    name: "categories",
                    label: "machineAttributes.categories",
                    type: "select",
                    placeholder: "machineAttributes.categories",
                    required: true,
                    parameterKey: "categories",
                    options: [],
                    value: state?.attributes?.engravingTool?.categories,
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=cut',
                    multiple: true,
                    disabled: !state.attributes?.engravingTool?.isAvailable
                },
            ]
        },
    ]
}


export {engravingCategories};