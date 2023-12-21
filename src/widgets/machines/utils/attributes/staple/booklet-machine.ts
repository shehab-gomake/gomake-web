const bookletMachine = (state: Record<string, any>) => {
    return [
        {
            name: "stapleHeadsAmount",
            label: "machineAttributes.stapleHeadsAmount",
            type: "text",
            placeholder: "machineAttributes.stapleHeadsAmount",
            required: true,
            parameterKey: "stapleHeadsAmount",
            options: [],
            value: state.attributes?.stapleHeadsAmount ? state.attributes?.stapleHeadsAmount : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.stapleHeadsAmount,
        },
        {
            name: "cost",
            label: "machineAttributes.cost",
            type: "text",
            placeholder: "machineAttributes.cost",
            required: true,
            parameterKey: "stapleCost",
            options: [],
            value: state.attributes?.stapleCost ? state.attributes?.stapleCost : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.stapleCost,
        },
    ];
}

export {bookletMachine};