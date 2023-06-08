const ofssetPrinting = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.blanketDimensions',
            parameterKey: 'blanketDimensions',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.blanketDimensions?.length &&
                !!state?.attributes?.blanketDimensions?.width &&
                !!state?.attributes?.blanketDimensions?.thickness,
            inputs: [
                {
                    name: "length",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state?.attributes?.blanketDimensions?.length ? state?.attributes?.blanketDimensions?.length : ''
                },
                {
                    name: "width",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state?.attributes?.blanketDimensions?.width ? state?.attributes?.blanketDimensions?.width : ''

                },
                {
                    name: "thickness",
                    label: "machineAttributes.thickness",
                    type: "text",
                    placeholder: "machineAttributes.thickness",
                    required: true,
                    parameterKey: "thickness",
                    options: [],
                    value: state?.attributes?.blanketDimensions?.thickness ? state?.attributes?.blanketDimensions?.thickness : ''

                },
            ]
        },
        {
            name: 'machineAttributes.packingSheet',
            parameterKey: 'packingSheet',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.packingSheet?.length &&
                !!state?.attributes?.packingSheet?.width,
            inputs: [
                {
                    name: "length",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.packingSheet?.length ? state.attributes?.packingSheet?.length : ''
                },
                {
                    name: "width",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.packingSheet?.width ? state.attributes?.packingSheet?.width : ''

                },
            ]
        },
    ]
}


export {ofssetPrinting};