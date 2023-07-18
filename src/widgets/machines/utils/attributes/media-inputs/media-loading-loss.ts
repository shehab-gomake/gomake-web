
const mediaLoadingLoss = (state: Record<string, any>) => {
    return [
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
    ]
}


export {mediaLoadingLoss};