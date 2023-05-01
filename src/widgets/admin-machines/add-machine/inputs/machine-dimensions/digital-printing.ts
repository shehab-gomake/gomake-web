const digitalPrinting = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'machineDimensions',
            machineInputType: 'multiInput',
            value: state.attributes?.machineDimensions ? state.attributes?.machineDimensions : {},
            isValid: !!state?.attributes?.machineDimensions?.height &&
                !!state?.attributes?.machineDimensions?.length &&
                !!state?.attributes?.machineDimensions?.width,
            inputs: [
                {
                    name: "",
                    label: "Height",
                    type: "text",
                    placeholder: "Height",
                    required: true,
                    parameterKey: "height",
                    options: [],
                    value: state.attributes?.machineDimensions?.height ? state.attributes?.machineDimensions?.height : ''

                },
                {
                    name: "",
                    label: "Length",
                    type: "text",
                    placeholder: "Length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.machineDimensions?.length ? state.attributes?.machineDimensions?.length : ''

                },
                {
                    name: "",
                    label: "width",
                    type: "text",
                    placeholder: "width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.machineDimensions?.width ? state.attributes?.machineDimensions?.width : ''

                },
            ]
        },
    ]
}

export {digitalPrinting};