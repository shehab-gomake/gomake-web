
const sideColoringMachine = (state: Record<string, any>) => {
    return [
        {
            name: "machineAttributes.colors",
            label: "machineAttributes.color",
            type: "text",
            placeholder: "machineAttributes.color",
            required: true,
            parameterKey: "colors",
            options: [],
            machineInputType: 'materialInput',
            value: state?.attributes?.colors,
            isValid: true,
            materialType: 'colors'
        },
    ]
};


export {sideColoringMachine}