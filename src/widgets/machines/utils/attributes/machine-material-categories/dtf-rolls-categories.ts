
const dtfRollsCategories = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'dtfRollsCategories',
            machineInputType: 'multiInput',
            value: state.attributes?.dtfRollsCategories ? state.attributes?.dtfRollsCategories : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.dtfRollsCategories",
                    type: "switch",
                    placeholder: "machineAttributes.dtfRollsCategories",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.dtfRollsCategories?.isAvailable ? state.attributes?.dtfRollsCategories?.isAvailable : ''
                },
                {
                    name: "categories",
                    label: "machineAttributes.categories",
                    type: "select",
                    placeholder: "machineAttributes.categories",
                    required: true,
                    parameterKey: "categories",
                    options: [],
                    value: state?.attributes?.advertisingProducts?.categories,
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=dtfRolls',
                    multiple: true,
                    disabled: !state.attributes?.dtfRollsCategories?.isAvailable
                },
            ]
        },
    ]
}


export {dtfRollsCategories};