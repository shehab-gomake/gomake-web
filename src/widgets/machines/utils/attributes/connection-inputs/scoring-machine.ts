
const scoringMachine = (state: Record<string, any>) => {
    return [
        {
            machineInputType: 'multiInput',
            name: 'machineAttributes.foldingConnect',
            parameterKey: 'foldingConnect',
            isValid: true,
            value: state?.foldingConnect,
            inputs: [
                {
                    name: "canConnect",
                    label: "machineAttributes.canConnect",
                    type: "select",
                    placeholder: "machineAttributes.canConnect",
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
                    value: state.attributes?.connection?.machineList,
                    options: [{value: 1, text: 'machine 1'}, {value: 2, text: 'machine 2'}],
                    machineInputType: 'input',
                    isValid: true,
                    disabled: !state.attributes?.foldingConnect?.canConnect

                },
            ]
        },
        {
            machineInputType: 'multiInput',
            name: 'machineAttributes.perforationConnect',
            parameterKey: 'perforationConnect',
            isValid: true,
            value: state?.perforationConnect,
            inputs: [
                {
                    name: "canConnect",
                    label: "machineAttributes.canConnect",
                    type: "select",
                    placeholder: "machineAttributes.canConnect",
                    required: true,
                    parameterKey: "canConnect",
                    value: state.attributes?.perforationConnect?.canConnect,
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
                    value: state.attributes?.perforationConnect?.machine,
                    options: [{value: 1, text: 'machine 1'}, {value: 2, text: 'machine 2'}],
                    machineInputType: 'input',
                    isValid: true,
                    disabled: !state.attributes?.perforationConnect?.canConnect
                },
            ]
        }
    ];
}

export {scoringMachine};