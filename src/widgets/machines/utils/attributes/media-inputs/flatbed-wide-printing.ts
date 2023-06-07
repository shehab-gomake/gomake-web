const flatbedWidePrinting = (state: Record<string, any>) => {
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
            name: "mediaLoaded",
            label: "machineAttributes.mediaLoaded",
            type: "text",
            placeholder: "machineAttributes.mediaLoaded",
            required: true,
            parameterKey: "mediaLoaded",
            options: [],
            value: state?.attributes?.mediaLoaded ? state?.attributes?.mediaLoaded : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.mediaLoaded,
        },
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
        {
            name: 'machineAttributes.mediaDimensions',
            parameterKey: 'mediaDimensions',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaDimensions?.minWidth &&
                !!state?.attributes?.mediaDimensions?.minRollDiameter &&
                !!state?.attributes?.mediaDimensions?.maxWidth &&
                !!state?.attributes?.mediaDimensions?.maxRollDiameter ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.minWidth",
                    type: "text",
                    placeholder: "machineAttributes.minWidth",
                    required: true,
                    parameterKey: "minWidth",
                    options: [],
                    value: state.attributes?.mediaDimensions?.minWidth ? state.attributes?.mediaDimensions?.minWidth : ''
                },
                {
                    name: "",
                    label: "machineAttributes.minRollDiameter",
                    type: "text",
                    placeholder: "machineAttributes.minRollDiameter",
                    required: true,
                    parameterKey: "minRollDiameter",
                    options: [],
                    value: state.attributes?.mediaDimensions?.minRollDiameter ? state.attributes?.mediaDimensions?.minRollDiameter : ''

                },
                {
                    name: "",
                    label: "machineAttributes.maxWidth",
                    type: "text",
                    placeholder: "machineAttributes.maxWidth",
                    required: true,
                    parameterKey: "maxWidth",
                    options: [],
                    value: state.attributes?.mediaDimensions?.maxWidth ? state.attributes?.mediaDimensions?.maxWidth : ''

                },
                {
                    name: "",
                    label: "machineAttributes.maxRollDiameter",
                    type: "text",
                    placeholder: "machineAttributes.maxRollDiameter",
                    required: true,
                    parameterKey: "maxRollDiameter",
                    options: [],
                    value: state.attributes?.mediaDimensions?.maxRollDiameter ? state.attributes?.mediaDimensions?.maxRollDiameter : ''

                },
            ]
        },
        {
            name: 'machineAttributes.imageSize',
            parameterKey: 'imageSize',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.imageSize?.imageWidth &&
                !!state?.attributes?.imageSize?.imageLength  ,
            inputs: [
                {
                    name: "imageWidth",
                    label: "machineAttributes.imageWidth",
                    type: "text",
                    placeholder: "machineAttributes.imageWidth",
                    required: true,
                    parameterKey: "imageWidth",
                    options: [],
                    value: state.attributes?.imageSize?.imageWidth ? state.attributes?.imageSize?.imageWidth : ''

                },
                {
                    name: "imageLength",
                    label: "machineAttributes.imageLength",
                    type: "text",
                    placeholder: "machineAttributes.imageLength",
                    required: true,
                    parameterKey: "imageLength",
                    options: [],
                    value: state.attributes?.imageSize?.imageLength ? state.attributes?.imageSize?.imageLength  : ''

                },
            ]
        },

    ]
}


export {flatbedWidePrinting};