
const additionalColorsInput = (state: Record<string, any>, colors= [], manufacturers = []) => {
    return [
        {
            name: 'machineAttributes.machineColors',
            parameterKey: 'machineColors',
            value: state?.attributes?.machineColors ? state?.attributes?.machineColors : [],
            machineInputType: 'multiArrayInput',
            isValid: true,
            inputs: [
                {
                    name: "color",
                    label: "machineAttributes.color",
                    type: "select",
                    placeholder: "machineAttributes.color",
                    required: true,
                    parameterKey: "color",
                    value: '',
                    options:  colors
                },
                {
                    name: "manufacturer",
                    label: "machineAttributes.manufacturer",
                    type: "select",
                    placeholder: "machineAttributes.manufacturer",
                    required: true,
                    parameterKey: "manufacturer",
                    value: '',
                    options:  manufacturers,
                    disabled: manufacturers.length === 0
                },
            ]
        },
    ]
};


export {additionalColorsInput}