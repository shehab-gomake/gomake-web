
const sublimationMachine = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'uvUnit',
            machineInputType: 'multiInput',
            value: state.attributes?.uvUnit ? state.attributes?.uvUnit : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.available",
                    type: "switch",
                    placeholder: "machineAttributes.available",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.uvUnit?.isAvailable ? state.attributes?.uvUnit?.isAvailable : ''
                },
            ]
        },
    ]
}


export {sublimationMachine};