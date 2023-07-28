const digitalPrinting = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'machineDimensions',
            machineInputType: 'multiInput',
            value: state.attributes?.machineDimensions ? state.attributes?.machineDimensions : {},
            isValid: !!state?.attributes?.machineDimensions?.height &&
                !!state?.attributes?.machineDimensions?.length &&
                !!state?.attributes?.machineDimensions?.width &&
        !!state?.attributes?.machineDimensions?.weight,

        inputs: [
                {
                    name: "",
                    label: "machineAttributes.height",
                    type: "text",
                    placeholder: "machineAttributes.height",
                    required: true,
                    parameterKey: "height",
                    options: [],
                    value: state.attributes?.machineDimensions?.height ? state.attributes?.machineDimensions?.height : ''

                },
                {
                    name: "",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.machineDimensions?.length ? state.attributes?.machineDimensions?.length : ''

                },
                {
                    name: "",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.machineDimensions?.width ? state.attributes?.machineDimensions?.width : ''

                },
                {
                    name: "",
                    label: "machineAttributes.weight",
                    type: "text",
                    placeholder: "machineAttributes.weight",
                    required: true,
                    parameterKey: "weight",
                    options: [],
                    value: state.attributes?.machineDimensions?.weight ? state.attributes?.machineDimensions?.weight : ''
                },
            ]
        },
    ]
}

export {digitalPrinting};