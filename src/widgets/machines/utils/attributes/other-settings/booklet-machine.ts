const bookletMachine = (state: Record<string, any>) => {
    return [
        {
            name: "squareBackSpaneOption",
            label: "machineAttributes.squareBackSpaneOption",
            type: "switch",
            placeholder: "machineAttributes.squareBackSpaneOption",
            required: true,
            parameterKey: "squareBackSpaneOption",
            value: state.attributes?.squareBackSpaneOption,
            options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            machineInputType: 'input',
            isValid: true,
        },


    ];
}

export {bookletMachine};