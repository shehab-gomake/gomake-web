const shrinkPackingMachine = (state: Record<string, any>) => {
    return [
        {
            name: "costPerPackage",
            label: "machineAttributes.costPerPackage",
            type: "text",
            placeholder: "machineAttributes.costPerPackage",
            required: true,
            parameterKey: "costPerPackage",
            options: [],
            value: state?.attributes?.costPerPackage ? state?.attributes?.costPerPackage : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.costPerPackage,
        },
    ]
};

export {shrinkPackingMachine};