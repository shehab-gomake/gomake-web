
const mediaMinMarginWidth = (state: Record<string, any>) => {
    return [
        {
            name: "minWidthMarginWithoutPrinting",
            label: "machineAttributes.minWidthMarginWithoutPrinting",
            type: "text",
            placeholder: "machineAttributes.minWidthMarginWithoutPrinting",
            required: true,
            parameterKey: "minWidthMarginWithoutPrinting",
            options: [],
            value: state?.attributes?.minWidthMarginWithoutPrinting ? state?.attributes?.minWidthMarginWithoutPrinting : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.minWidthMarginWithoutPrinting,
        },
    ]
}


export {mediaMinMarginWidth};