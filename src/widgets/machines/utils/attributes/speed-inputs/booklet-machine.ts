const bookletMachine = (state: Record<string, any>) => {
    return [
        {
            name: "bookletSpeed",
            label: "machineAttributes.bookletSpeed",
            type: "text",
            placeholder: "machineAttributes.speed",
            required: true,
            parameterKey: "speed",
            options: [],
            value: state?.attributes?.speed ? state?.attributes?.speed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.speed,
        },
    ]
}


export {bookletMachine};