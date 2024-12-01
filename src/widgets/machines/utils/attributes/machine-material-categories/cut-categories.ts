
const cutCategories = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'cutTool',
            machineInputType: 'multiInput',
            value: state.attributes?.cutTool ? state.attributes?.cutTool : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.cut",
                    type: "switch",
                    placeholder: "machineAttributes.cut",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.cutTool?.isAvailable ? state.attributes?.cutTool?.isAvailable : ''
                },
                {
                    name: "categories",
                    label: "machineAttributes.categories",
                    type: "select",
                    placeholder: "machineAttributes.categories",
                    required: true,
                    parameterKey: "categories",
                    options: [],
                    value: state?.attributes?.cutTool?.categories,
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=cut',
                    multiple: true,
                    disabled: !state.attributes?.cutTool?.isAvailable
                },
            ]
        },
    ]
}


export {cutCategories};