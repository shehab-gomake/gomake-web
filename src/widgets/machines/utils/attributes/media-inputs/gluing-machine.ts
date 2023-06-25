const gluingMachine = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.height',
            parameterKey: 'mediaHeight',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaHeight?.min &&
                !!state?.attributes?.mediaHeight?.max,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.mediaHeight?.min ? state.attributes?.mediaHeight?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaHeight?.max ? state.attributes?.mediaHeight?.max : ''
                },
            ]
        },
        {
            name: 'machineAttributes.width',
            parameterKey: 'mediaWidth',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaWidth?.min &&
                !!state?.attributes?.mediaWidth?.max,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.mediaWidth?.min ? state.attributes?.mediaWidth?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaWidth?.max ? state.attributes?.mediaWidth?.max : ''
                },
            ]
        },
    ]
}


export {gluingMachine};