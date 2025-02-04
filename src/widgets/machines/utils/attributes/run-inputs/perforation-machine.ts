const perforationMachine = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'perforation',
            machineInputType: 'multiInput',
            value: state.attributes?.perforation ? state.attributes?.perforation : {},
            isValid: !!state?.attributes?.perforation?.maxLength &&
                !!state?.attributes?.perforation?.maxWidth,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.maxLength",
                    type: "text",
                    placeholder: "machineAttributes.maxLength",
                    required: true,
                    parameterKey: "maxLength",
                    options: [],
                    value: state.attributes?.perforation?.maxLength ? state.attributes?.perforation?.maxLength : ''

                },
                {
                    name: "",
                    label: "machineAttributes.maxWidth",
                    type: "text",
                    placeholder: "machineAttributes.maxWidth",
                    required: true,
                    parameterKey: "maxWidth",
                    options: [],
                    value: state.attributes?.perforation?.maxWidth ? state.attributes?.perforation?.maxWidth : ''

                },
            ]
        },
    ]
}

export {perforationMachine};