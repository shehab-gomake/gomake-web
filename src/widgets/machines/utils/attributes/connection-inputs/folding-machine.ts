
const foldingMachine = (state: Record<string, any>) => {
    return [
        {
            machineInputType: 'multiInput',
            name: 'machineAttributes.foldingConnect',
            parameterKey: 'foldingConnect',
            isValid: true,
            value: state?.foldingConnect,
            inputs: [
                {
                    name: "foldingConnect",
                    label: "machineAttributes.canConnect",
                    type: "select",
                    placeholder: "machineAttributes.foldingConnect",
                    required: true,
                    parameterKey: "canConnect",
                    value: state.attributes?.foldingConnect?.canConnect,
                    options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
                    machineInputType: 'input',
                    isValid: true,
                },
                {
                    name: "machineList",
                    label: "machineAttributes.machineList",
                    type: "select",
                    placeholder: "machineAttributes.machineList",
                    required: true,
                    parameterKey: "machine",
                    value: state.attributes?.foldingConnect?.machineList,
                    options: [{value: 1, text: 'machine 1'}, {value: 2, text: 'machine 2'}],
                    machineInputType: 'input',
                    isValid: true,
                    disabled: !state.attributes?.foldingConnect?.canConnect

                },
            ]
        },
        {
            machineInputType: 'multiInput',
            name: 'machineAttributes.scoringConnect',
            parameterKey: 'scoringConnect',
            isValid: true,
            value: state?.scoringConnect,
            inputs: [
                {
                    name: "scoringConnect",
                    label: "machineAttributes.canConnect",
                    type: "select",
                    placeholder: "machineAttributes.scoringConnect",
                    required: true,
                    parameterKey: "canConnect",
                    value: state.attributes?.scoringConnect?.canConnect,
                    options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
                    machineInputType: 'input',
                    isValid: true,
                },
                {
                    name: "",
                    label: "machineAttributes.machineList",
                    type: "select",
                    placeholder: "machineAttributes.machineList",
                    required: true,
                    parameterKey: "machine",
                    value: state.attributes?.scoringConnect?.machine,
                    options: [{value: 1, text: 'machine 1'}, {value: 2, text: 'machine 2'}],
                    machineInputType: 'input',
                    isValid: true,
                    disabled: !state.attributes?.scoringConnect?.canConnect

                },
            ]
        }
    ];
}

export {foldingMachine};