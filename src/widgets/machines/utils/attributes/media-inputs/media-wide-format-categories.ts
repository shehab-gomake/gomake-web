
const mediaWideFormatCategories = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'wideFormatCategories',
            machineInputType: 'multiInput',
            value: state.attributes?.wideFormatCategories ? state.attributes?.wideFormatCategories : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.wideFormatAvailable",
                    type: "switch",
                    placeholder: "machineAttributes.wideFormatAvailable",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.wideFormatCategories?.isAvailable ? state.attributes?.wideFormatCategories?.isAvailable : ''
                },
                {
                    name: "categories",
                    label: "machineAttributes.categories",
                    type: "select",
                    placeholder: "machineAttributes.categories",
                    required: true,
                    parameterKey: "categories",
                    options: [],
                    value: state?.attributes?.wideFormatCategories?.categories,
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=wideFormatMaterial',
                    multiple: true,
                    disabled: !state.attributes?.wideFormatCategories?.isAvailable
                },
            ]
        },
    ]
}


export {mediaWideFormatCategories};