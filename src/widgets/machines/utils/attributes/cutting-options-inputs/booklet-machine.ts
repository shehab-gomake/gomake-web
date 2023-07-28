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
            options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
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
            value: state.attributes?.squareBackSpaneOption,
            options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            machineInputType: 'input',
            isValid: true,
        },


    ];
}

export {bookletMachine};