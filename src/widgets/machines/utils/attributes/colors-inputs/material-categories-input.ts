const materialCategoriesInput = (
    state: Record<string, any>,
    categories = [],
    manufacturers = [],
    materialType: string,
    value,
    parameterKey: string,
    pathName: string,
    label: string,
    name: string
) => {
    return [
        {
            name: name,
            parameterKey: parameterKey,
            value: value,
            machineInputType: 'multiArrayInput',
            isValid: true,
            inputs: [
                {
                    name: label,
                    label: label,
                    type: "select",
                    placeholder: "machineAttributes.color",
                    required: true,
                    parameterKey: materialType,
                    value: '',
                    options: categories
                },
                {
                    name: pathName,
                    label: pathName,
                    type: "select",
                    placeholder: "machineAttributes.manufacturer",
                    required: true,
                    parameterKey: pathName,
                    value: '',
                    options: manufacturers,
                    disabled: manufacturers.length === 0
                },
            ]
        },
    ]
};


export {materialCategoriesInput}