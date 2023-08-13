
const marginWithoutPrintingSettings = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.minMarginWithoutPrinting',
            parameterKey: 'minMarginWithoutPrinting',
            machineInputType: 'multiInput',
            value: state?.attributes?.minMarginWithoutPrinting,
            isValid: !!state?.attributes?.minMarginWithoutPrinting?.width &&
                !!state?.attributes?.minMarginWithoutPrinting?.length  ,
            inputs: [
                {
                    name: "minMarginWithoutPrinting",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.minMarginWithoutPrinting?.width ? state.attributes?.minMarginWithoutPrinting?.width : ''

                },
                {
                    name: "maxMediaDimensions",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.minMarginWithoutPrinting?.length ? state.attributes?.minMarginWithoutPrinting?.length  : ''

                },
            ]
        },
    ]
}


export {marginWithoutPrintingSettings};