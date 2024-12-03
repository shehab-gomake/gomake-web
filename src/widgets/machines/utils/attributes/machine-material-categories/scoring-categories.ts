
const scoringCategories = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'scoringTool',
            machineInputType: 'multiInput',
            value: state.attributes?.scoringTool ? state.attributes?.scoringTool : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.scoringTool",
                    type: "switch",
                    placeholder: "machineAttributes.scoringTool",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.scoringTool?.isAvailable ? state.attributes?.scoringTool?.isAvailable : ''
                },
                // {
                //     name: "categories",
                //     label: "machineAttributes.categories",
                //     type: "select",
                //     placeholder: "machineAttributes.categories",
                //     required: true,
                //     parameterKey: "categories",
                //     options: [],
                //     value: state?.attributes?.scoringTool?.categories,
                //     optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=cut',
                //     multiple: true,
                //     disabled: !state.attributes?.scoringTool?.isAvailable
                // },
            ]
        },
    ]
}


export {scoringCategories};