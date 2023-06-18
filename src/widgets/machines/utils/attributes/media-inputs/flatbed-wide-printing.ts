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
                !!state?.attributes?.mediaDimensions?.minThickness &&
                !!state?.attributes?.mediaDimensions?.minWeight &&
                !!state?.attributes?.mediaDimensions?.minLength &&
                !!state?.attributes?.mediaDimensions?.maxWidth &&
                !!state?.attributes?.mediaDimensions?.maxThickness &&
                !!state?.attributes?.mediaDimensions?.maxWeight &&
                !!state?.attributes?.mediaDimensions?.maxLength ,
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
                    label: "machineAttributes.minLength",
                    type: "text",
                    placeholder: "machineAttributes.minLength",
                    required: true,
                    parameterKey: "minLength",
                    options: [],
                    value: state.attributes?.mediaDimensions?.minLength ? state.attributes?.mediaDimensions?.minLength : ''

                },
                {
                    name: "",
                    label: "machineAttributes.minWeight",
                    type: "text",
                    placeholder: "machineAttributes.minWeight",
                    required: true,
                    parameterKey: "minWeight",
                    options: [],
                    value: state.attributes?.mediaDimensions?.minWeight ? state.attributes?.mediaDimensions?.minWeight : ''

                },
                {
                    name: "",
                    label: "machineAttributes.minThickness",
                    type: "text",
                    placeholder: "machineAttributes.minThickness",
                    required: true,
                    parameterKey: "minThickness",
                    options: [],
                    value: state.attributes?.mediaDimensions?.minThickness ? state.attributes?.mediaDimensions?.minThickness : ''

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
                    label: "machineAttributes.maxLength",
                    type: "text",
                    placeholder: "machineAttributes.maxLength",
                    required: true,
                    parameterKey: "maxLength",
                    options: [],
                    value: state.attributes?.mediaDimensions?.maxLength ? state.attributes?.mediaDimensions?.maxLength : ''

                },
                {
                    name: "",
                    label: "machineAttributes.maxWeight",
                    type: "text",
                    placeholder: "machineAttributes.maxWeight",
                    required: true,
                    parameterKey: "maxWeight",
                    options: [],
                    value: state.attributes?.mediaDimensions?.maxWeight ? state.attributes?.mediaDimensions?.maxWeight : ''

                },
                {
                    name: "",
                    label: "machineAttributes.maxThickness",
                    type: "text",
                    placeholder: "machineAttributes.maxThickness",
                    required: true,
                    parameterKey: "maxThickness",
                    options: [],
                    value: state.attributes?.mediaDimensions?.maxThickness ? state.attributes?.mediaDimensions?.maxThickness : ''

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