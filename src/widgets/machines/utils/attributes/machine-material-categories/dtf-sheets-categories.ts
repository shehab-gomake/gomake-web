
const dtfSheetsCategories = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'dtfSheetsCategories',
            machineInputType: 'multiInput',
            value: state.attributes?.dtfSheetsCategories ? state.attributes?.dtfSheetsCategories : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.dtfSheetsCategories",
                    type: "switch",
                    placeholder: "machineAttributes.dtfSheetsCategories",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.dtfSheetsCategories?.isAvailable ? state.attributes?.dtfSheetsCategories?.isAvailable : ''
                },
                {
                    name: "categories",
                    label: "machineAttributes.categories",
                    type: "select",
                    placeholder: "machineAttributes.categories",
                    required: true,
                    parameterKey: "categories",
                    options: [],
                    value: state?.attributes?.dtfSheetsCategories?.categories,
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=dtfSheets',
                    multiple: true,
                    disabled: !state.attributes?.dtfSheetsCategories?.isAvailable
                },
            ]
        },
    ]
}


export {dtfSheetsCategories};