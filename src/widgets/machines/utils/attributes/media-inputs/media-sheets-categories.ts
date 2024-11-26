
const mediaSheetsCategories = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'sheetCategories',
            machineInputType: 'multiInput',
            value: state.attributes?.sheetCategories ? state.attributes?.sheetCategories : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.sheetsAvailable",
                    type: "switch",
                    placeholder: "machineAttributes.sheetsAvailable",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.sheetCategories?.isAvailable ? state.attributes?.sheetCategories?.isAvailable : ''
                },
                {
                    name: "categories",
                    label: "machineAttributes.categories",
                    type: "select",
                    placeholder: "machineAttributes.categories",
                    required: true,
                    parameterKey: "categories",
                    options: [],
                    value: state?.attributes?.sheetCategories?.categories,
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=sheets',
                    multiple: true,
                    disabled: !state.attributes?.sheetCategories?.isAvailable
                },
            ]
        },
    ]
}


export {mediaSheetsCategories};