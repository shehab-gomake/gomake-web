
const advertisingProductsCategories = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'advertisingProducts',
            machineInputType: 'multiInput',
            value: state.attributes?.advertisingProducts ? state.attributes?.advertisingProducts : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.advertisingProducts",
                    type: "switch",
                    placeholder: "machineAttributes.available",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.advertisingProducts?.isAvailable ? state.attributes?.advertisingProducts?.isAvailable : ''
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
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=Advertising Products',
                    multiple: true,
                    disabled: !state.attributes?.advertisingProducts?.isAvailable
                },
            ]
        },
    ]
}


export {advertisingProductsCategories};