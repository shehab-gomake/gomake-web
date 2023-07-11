
const mediaBaseTypeInput = (state: Record<string, any>) => {
    return [
        {
            name: "mediaBaseType",
            label: "machineAttributes.mediaBaseType",
            type: "select",
            placeholder: "machineAttributes.mediaBaseType",
            required: true,
            parameterKey: "mediaBaseType",
            value: state?.attributes?.mediaBaseType,
            options: [{value: 1, text: 'type 1'}, {value: 2, text: 'type 2'}],
            machineInputType: 'input',
            isValid: true,
        },
    ]
}


export {mediaBaseTypeInput};