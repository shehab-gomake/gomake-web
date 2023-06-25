
const mediaImageSizeSettings = (state: Record<string, any>) => {
    return [
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


export {mediaImageSizeSettings};