
const vCutCategories = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'vCutTool',
            machineInputType: 'multiInput',
            value: state.attributes?.vCutTool ? state.attributes?.vCutTool : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.vCutTool",
                    type: "switch",
                    placeholder: "machineAttributes.vCutTool",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.vCutTool?.isAvailable ? state.attributes?.vCutTool?.isAvailable : ''
                },
                {
                    name: "categories",
                    label: "machineAttributes.categories",
                    type: "select",
                    placeholder: "machineAttributes.categories",
                    required: true,
                    parameterKey: "categories",
                    options: [],
                    value: state?.attributes?.vCutTool?.categories,
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=cut',
                    multiple: true,
                    disabled: !state.attributes?.vCutTool?.isAvailable
                },
            ]
        },
    ]
}


export {vCutCategories};