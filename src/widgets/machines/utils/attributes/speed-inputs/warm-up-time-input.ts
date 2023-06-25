const warmUpTimeInput = (state: Record<string, any>) => {
    return [
        {
            name: "warmUpTime",
            label: "machineAttributes.warmUpTime",
            type: "text",
            placeholder: "machineAttributes.warmUpTime",
            required: true,
            parameterKey: "warmUpTime",
            options: [],
            value: state?.attributes?.warmUpTime ? state?.attributes?.warmUpTime : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.warmUpTime,
        }
    ]
}


export {warmUpTimeInput};