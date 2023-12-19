const bookletMachine = (state: Record<string, any>) => {
    return [
        {
            name: "foldingUnit",
            label: "machineAttributes.foldingUnit",
            type: "switch",
            placeholder: "machineAttributes.foldingUnit",
            required: true,
            parameterKey: "foldingUnit",
            options: [],
            value: state?.attributes?.foldingUnit
        },
    ];
}

export {bookletMachine};