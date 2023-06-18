
const staplerMachine = (state: Record<string, any>) => {
    return [
        {
            name: "maxSpeedStitches",
            label: "machineAttributes.maxSpeedStitches",
            type: "text",
            placeholder: "machineAttributes.maxSpeedStitches",
            required: true,
            parameterKey: "maxSpeedStitches",
            options: [],
            value: state.attributes?.maxSpeedStitches ? state.attributes?.maxSpeedStitches : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxSpeedStitches,
        },
        {
            name: "setDelay",
            label: "machineAttributes.setDelay",
            type: "text",
            placeholder: "machineAttributes.setDelay",
            required: true,
            parameterKey: "setDelay",
            options: [],
            value: state.attributes?.setDelay ? state.attributes?.setDelay : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setDelay,
        },
    ]
}

export {staplerMachine};