const digitalPrinting = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.beatByColorsBySize',
            parameterKey: 'beats',
            value: state?.attributes?.beats ? state?.attributes?.beats : [],
            machineInputType: 'multiArrayInput',
            isValid: state?.attributes?.beats?.length > 0,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.color",
                    type: "text",
                    placeholder: "machineAttributes.color",
                    required: true,
                    parameterKey: "color",
                    options: []
                },
                {
                    name: "",
                    label: "machineAttributes.mediaLength",
                    type: "text",
                    placeholder: "machineAttributes.mediaLength",
                    required: true,
                    parameterKey: "mediaLength",
                    options: []
                },
                {
                    name: "",
                    label: "machineAttributes.mediaWidth",
                    type: "text",
                    placeholder: "machineAttributes.mediaWidth",
                    required: true,
                    parameterKey: "mediaWidth",
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

export {digitalPrinting};