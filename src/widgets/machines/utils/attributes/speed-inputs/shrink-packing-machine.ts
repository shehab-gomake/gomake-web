const shrinkPackingMachine = (state: Record<string, any>) => {
    return [
        {
            name: "packagePerHour",
            label: "machineAttributes.packagePerHour",
            type: "text",
            placeholder: "machineAttributes.packagePerHour",
            required: true,
            parameterKey: "packagePerHour",
            options: [],
            value: state.attributes?.packagePerHour ? state.attributes?.packagePerHour : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.packagePerHour,
        },

    ]
}

export {shrinkPackingMachine};