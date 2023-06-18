
const pastingBlocksMachine = (state: Record<string, any>) => {
    return [
        {
            name: "glueColors",
            label: "machineAttributes.glueColors",
            type: "select",
            placeholder: "machineAttributes.glueColors",
            required: true,
            parameterKey: "glueColors",
            value: state?.attributes?.glueColors,
            options: [{value: 1, text: 'Clear'}, {value: 2, text: 'Red'}],
            machineInputType: 'input',
            isValid: true
        },
    ]
};


export {pastingBlocksMachine}