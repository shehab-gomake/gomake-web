const flatbedCuttingMachine = (state: Record<string, any>) => {
    return [
        {
            name: "setupTimeMin",
            label: "machineAttributes.setupTimeMin",
            type: "text",
            placeholder: "machineAttributes.setupTimeMin",
            required: true,
            parameterKey: "setupTimeMin",
            options: [],
            value: state?.attributes?.setupTimeMin ? state?.attributes?.setupTimeMin : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setupTimeMin,
        },
        {
            name: "mediaSheetsLoss",
            label: "machineAttributes.mediaSheetsLoss",
            type: "text",
            placeholder: "machineAttributes.mediaSheetsLoss",
            required: true,
            parameterKey: "mediaSheetsLoss",
            value: state?.attributes?.mediaSheetsLoss,
            options: [],
            machineInputType: 'input',
            isValid: !!state?.attributes?.mediaSheetsLoss,
        },
        {
            name: "minWidthMarginCutting",
            label: "machineAttributes.minWidthMarginCutting",
            type: "text",
            placeholder: "machineAttributes.minWidthMarginCutting",
            required: true,
            parameterKey: "minWidthMarginCutting",
            value: state?.attributes?.minWidthMarginCutting,
            options: [],
            machineInputType: 'input',
            isValid: !!state?.attributes?.minWidthMarginCutting,
        },
        {
            name: 'machineAttributes.tableDimensions',
            parameterKey: 'tableDimensions',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.tableDimensions?.width &&
                !!state?.attributes?.tableDimensions?.length &&
                !!state?.attributes?.tableDimensions?.thickness ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.tableDimensions?.width ? state.attributes?.tableDimensions?.width : ''
                },
                {
                    name: "",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.tableDimensions?.length ? state.attributes?.tableDimensions?.length : ''

                },
                {
                    name: "",
                    label: "machineAttributes.thickness",
                    type: "text",
                    placeholder: "machineAttributes.thickness",
                    required: true,
                    parameterKey: "thickness",
                    options: [],
                    value: state.attributes?.tableDimensions?.thickness ? state.attributes?.tableDimensions?.thickness : ''

                },
            ]
        },
    ]
}


export {flatbedCuttingMachine};