
const applicationCategories = (state: Record<string, any>) => {
    return [
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
                {
                    name: "categories",
                    label: "machineAttributes.categories",
                    type: "select",
                    placeholder: "machineAttributes.categories",
                    required: true,
                    parameterKey: "categories",
                    options: [],
                    value: state?.attributes?.applicationUnit?.categories,
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=cut',
                    multiple: true,
                    disabled: !state.attributes?.applicationUnit?.isAvailable
                },
            ]
        },
    ]
}


export {applicationCategories};