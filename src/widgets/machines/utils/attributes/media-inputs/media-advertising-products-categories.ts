
const mediaAdvertisingProductsCategories = (state: Record<string, any>, parameterKey = 'advertisingProducts') => {
    return [
        {
            name: '',
            parameterKey: parameterKey,
            machineInputType: 'multiInput',
            value: state.attributes[parameterKey] ? state.attributes[parameterKey] : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.advertisingProducts",
                    type: "switch",
                    placeholder: "machineAttributes.advertisingProducts",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes[parameterKey]?.isAvailable ? state.attributes[parameterKey]?.isAvailable : ''
                },
            ]
        },
    ]
}

export {mediaAdvertisingProductsCategories};