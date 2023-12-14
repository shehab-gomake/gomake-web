const analogEnhancementMachine = (state: Record<string, any>) => {
    return [
        {
            name: "dieCut",
            label: "machineAttributes.dieCut",
            type: "switch",
            placeholder: "machineAttributes.dieCut",
            required: true,
            parameterKey: "dieCut",
            value: state.attributes?.dieCut,
            options: [],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "dieKissCut",
            label: "machineAttributes.dieKissCut",
            type: "switch",
            placeholder: "machineAttributes.dieKissCut",
            required: true,
            parameterKey: "dieKissCut",
            value: state.attributes?.dieKissCut,
            options: [],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "dieStamp",
            label: "machineAttributes.dieStamp",
            type: "switch",
            placeholder: "machineAttributes.dieStamp",
            required: true,
            parameterKey: "dieStamp",
            value: state.attributes?.dieStamp,
            options: [],
            machineInputType: 'input',
            isValid: true,
        },
    ];
}

export {analogEnhancementMachine};