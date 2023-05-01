const digitalPrinting = (state: Record<string, any>) => {
    return [
        {
            name: 'Beat cost according to size scale according to the amount of colors',
            parameterKey: 'beats',
            value: state?.attributes?.beats ? state?.attributes?.beats : [],
            machineInputType: 'multiArrayInput',
            isValid: state?.attributes?.beats?.length > 0,
            inputs: [
                {
                    name: "",
                    label: "adminAddMachine.color",
                    type: "text",
                    placeholder: "Color",
                    required: true,
                    parameterKey: "color",
                    options: []
                },
                {
                    name: "",
                    label: "media length",
                    type: "text",
                    placeholder: "media length",
                    required: true,
                    parameterKey: "mediaLength",
                    options: []
                },
                {
                    name: "",
                    label: "media width",
                    type: "text",
                    placeholder: "media width",
                    required: true,
                    parameterKey: "mediaWidth",
                    options: []
                },
                {
                    name: "",
                    label: "coast",
                    type: "text",
                    placeholder: "coast",
                    required: true,
                    parameterKey: "coast",
                    options: []
                },
            ]
        },
    ]
};

export {digitalPrinting};