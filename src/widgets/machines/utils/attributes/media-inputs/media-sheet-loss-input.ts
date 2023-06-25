const mediaSheetLossInput = (state: Record<string, any>) => {
    return [
        {
            name: "mediaSheetsLoss",
            label: "machineAttributes.mediaSheetsLoss",
            type: "text",
            placeholder: "machineAttributes.mediaSheetsLoss",
            required: true,
            parameterKey: "mediaSheetsLoss",
            options: [],
            value: state?.attributes?.mediaSheetsLoss ? state?.attributes?.mediaSheetsLoss : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.mediaSheetsLoss,
        },
    ]
}


export {mediaSheetLossInput};