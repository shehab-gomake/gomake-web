const minMaxInput = (state: Record<string, any>, parameterKey: string, label: string ) => {
    debugger
    return [
        {
            name: `machineAttributes.${label}`,
            parameterKey: parameterKey,
            machineInputType: 'multiInput',
            value: state?.attributes[parameterKey],
            isValid: state?.attributes && state?.attributes[parameterKey] &&  !!state?.attributes[parameterKey]['min'] &&
                !!state?.attributes[parameterKey]['max'] ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state?.attributes && state?.attributes[parameterKey] && state?.attributes[parameterKey]['min'] ? state?.attributes[parameterKey]['min'] : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state?.attributes && state?.attributes[parameterKey] && state?.attributes[parameterKey]['max'] ? state?.attributes[parameterKey]['max'] : ''
                },
            ]
        },
    ]
}


export {minMaxInput};