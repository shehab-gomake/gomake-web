
const applicationCategories = (state: Record<string, any>) => {
    return [
        {
            name: "categories",
            label: "machineAttributes.categories",
            type: "select",
            placeholder: "machineAttributes.categories",
            required: true,
            parameterKey: "applicationUnitCategories",
            options: [],
            value: state?.attributes?.applicationUnitCategories,
            optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=application',
            multiple: true,
        },
        {
            name: '',
            parameterKey: 'applicationUnit',
            machineInputType: 'multiInput',
            value: state.attributes?.applicationUnit ? state.attributes?.applicationUnit : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.available",
                    type: "switch",
                    placeholder: "machineAttributes.available",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.applicationUnit?.isAvailable ? state.attributes?.applicationUnit?.isAvailable : ''
                },
            ]
        },
    ]
}


export {applicationCategories};