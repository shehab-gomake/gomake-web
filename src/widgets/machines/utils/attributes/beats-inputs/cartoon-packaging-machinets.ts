const cartoonPackagingMachine = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.dimensionsCost',
            parameterKey: 'dimensionsCost',
            value: state?.attributes?.dimensionsCost ? state?.attributes?.dimensionsCost : [],
            machineInputType: 'multiArrayInput',
            isValid: state?.attributes?.dimensionsCost?.length > 0,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: []
                },
                {
                    name: "",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: []
                },
                {
                    name: "",
                    label: "machineAttributes.height",
                    type: "text",
                    placeholder: "machineAttributes.height",
                    required: true,
                    parameterKey: "height",
                    options: []
                },
                {
                    name: "",
                    label: "machineAttributes.coast",
                    type: "text",
                    placeholder: "machineAttributes.coast",
                    required: true,
                    parameterKey: "coast",
                    options: []
                },
            ]
        },
    ]
};

export {cartoonPackagingMachine};