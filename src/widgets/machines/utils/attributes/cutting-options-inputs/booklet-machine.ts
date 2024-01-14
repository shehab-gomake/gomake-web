const bookletMachine = (state: Record<string, any>) => {
    return [
        {
            name: "down",
            label: "machineAttributes.up&down",
            type: "switch",
            placeholder: "machineAttributes.up&down",
            required: true,
            parameterKey: "cuttingUpDown",
            value: state.attributes?.cuttingUpDown,
            options: [],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "side",
            label: "machineAttributes.side",
            type: "switch",
            placeholder: "machineAttributes.side",
            required: true,
            parameterKey: "cuttingSide",
            value: state.attributes?.cuttingSide,
            options: [],
            machineInputType: 'input',
            isValid: true,
        },


    ];
}

export {bookletMachine};