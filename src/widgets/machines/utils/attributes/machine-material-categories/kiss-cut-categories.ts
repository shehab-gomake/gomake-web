
const kissCutCategories = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'kissCutTool',
            machineInputType: 'multiInput',
            value: state.attributes?.kissCutTool ? state.attributes?.kissCutTool : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.kissCutTool",
                    type: "switch",
                    placeholder: "machineAttributes.kissCutTool",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.kissCutTool?.isAvailable ? state.attributes?.kissCutTool?.isAvailable : ''
                },
                // {
                //     name: "categories",
                //     label: "machineAttributes.categories",
                //     type: "select",
                //     placeholder: "machineAttributes.categories",
                //     required: true,
                //     parameterKey: "categories",
                //     options: [],
                //     value: state?.attributes?.kissCutTool?.categories,
                //     optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=cut',
                //     multiple: true,
                //     disabled: !state.attributes?.kissCutTool?.isAvailable
                // },
            ]
        },
    ]
}


export {kissCutCategories};