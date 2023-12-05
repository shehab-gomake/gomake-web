
const rollWidePrinting = (state: Record<string, any>) => {
    return [

        {
            name: "maxLayers",
            label: "machineAttributes.maxLayers",
            type: "text",
            placeholder: "machineAttributes.maxLayers",
            required: true,
            parameterKey: "maxLayers",
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.maxLayers ? state?.attributes?.maxLayers : '',
            isValid: !!state?.attributes?.maxLayers
        },
    ]
};


export {rollWidePrinting}