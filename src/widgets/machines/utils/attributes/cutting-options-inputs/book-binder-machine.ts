
const bookBinderMachine = (state: Record<string, any>) => {
    return [
        {
            name: "",
            label: "machineAttributes.glues",
            type: "text",
            placeholder: "machineAttributes.glues",
            required: true,
            parameterKey: "glues",
            options: [],
            machineInputType: 'materialInput',
            value: state?.attributes?.glues,
            isValid: true,
            materialType: 'Glues'
        },
    ];
}

export {bookBinderMachine};