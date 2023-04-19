const digitalPrinting = (state: Record<string, any>) => {
    return [
        {
            name: 'Feeders',
            parameterKey: 'feeders',
            machineInputType: 'multiInput',
            inputs: [
                {
                    name: "",
                    label: "Number",
                    type: "text",
                    placeholder: "Number",
                    required: true,
                    parameterKey: "number",
                    options: [],
                    value: state.attributes?.feeders?.number ? state.attributes?.feeders?.number : ''

                },
                {
                    name: "",
                    label: "Height",
                    type: "text",
                    placeholder: "Height",
                    required: true,
                    parameterKey: "height",
                    options: [],
                    value: state.attributes?.feeders?.height ? state.attributes?.feeders?.height : ''

                },
                {
                    name: "",
                    label: "Length",
                    type: "text",
                    placeholder: "Length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.feeders?.length ? state.attributes?.feeders?.length : ''

                },
                {
                    name: "",
                    label: "width",
                    type: "text",
                    placeholder: "width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.feeders?.width ? state.attributes?.feeders?.width : ''

                },
            ]
        },
        {
            name: 'Stackers',
            parameterKey: 'stackers',
            machineInputType: 'multiInput',
            inputs: [
                {
                    name: "",
                    label: "Number",
                    type: "text",
                    placeholder: "Number",
                    required: true,
                    parameterKey: "number",
                    options: [],
                    value: state.attributes?.stackers?.number ? state.attributes?.stackers?.number : ''

                },
                {
                    name: "",
                    label: "Height",
                    type: "text",
                    placeholder: "Height",
                    required: true,
                    parameterKey: "height",
                    options: [],
                    value: state.attributes?.stackers?.height ? state.attributes?.stackers?.height : ''

                },
                {
                    name: "",
                    label: "Length",
                    type: "text",
                    placeholder: "Length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.stackers?.length ? state.attributes?.stackers?.length : ''

                },
                {
                    name: "",
                    label: "width",
                    type: "text",
                    placeholder: "width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.stackers?.width ? state.attributes?.stackers?.width : ''

                },
            ]
        },

    ]
};

export {digitalPrinting};