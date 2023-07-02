
const collectorMachine = (state: Record<string, any>) => {
    return [
        {
            machineInputType: 'multiInput',
            name: 'machineAttributes.bookletConnection',
            parameterKey: 'bookletConnection',
            isValid: true,
            value: state?.bookletConnection,
            inputs: [
                {
                    name: "foldingConnect",
                    label: "machineAttributes.canConnect",
                    type: "switch",
                    placeholder: "",
                    required: true,
                    parameterKey: "canConnect",
                    value: state.attributes?.bookletConnection?.canConnect,
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
                    value: state.attributes?.bookletConnection?.machineList,
                    options: [{value: 1, text: 'machine 1'}, {value: 2, text: 'machine 2'}],
                    machineInputType: 'input',
                    isValid: true,
                    disabled: !state.attributes?.bookletConnection?.canConnect

                },
            ]
        },
        {
            machineInputType: 'multiInput',
            name: 'machineAttributes.BoosbinderConnection',
            parameterKey: 'BoosbinderConnection',
            isValid: true,
            value: state?.BoosbinderConnection,
            inputs: [
                {
                    name: "BoosbinderConnection",
                    label: "machineAttributes.canConnect",
                    type: "switch",
                    placeholder: "machineAttributes.scoringConnect",
                    required: true,
                    parameterKey: "canConnect",
                    value: state.attributes?.BoosbinderConnection?.canConnect,
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
                    value: state.attributes?.BoosbinderConnection?.machine,
                    options: [{value: 1, text: 'machine 1'}, {value: 2, text: 'machine 2'}],
                    machineInputType: 'input',
                    isValid: true,
                    disabled: !state.attributes?.BoosbinderConnection?.canConnect

                },
            ]
        } ,
        {
            machineInputType: 'multiInput',
            name: 'machineAttributes.sewingConnection',
            parameterKey: 'sewingConnection',
            isValid: true,
            value: state?.scoringConnect,
            inputs: [
                {
                    name: "sewingConnection",
                    label: "machineAttributes.canConnect",
                    type: "switch",
                    placeholder: "machineAttributes.sewingConnection",
                    required: true,
                    parameterKey: "canConnect",
                    value: state.attributes?.sewingConnection?.canConnect,
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
                    value: state.attributes?.sewingConnection?.machine,
                    options: [{value: 1, text: 'machine 1'}, {value: 2, text: 'machine 2'}],
                    machineInputType: 'input',
                    isValid: true,
                    disabled: !state.attributes?.sewingConnection?.canConnect

                },
            ]
        }
    ];
}

export {collectorMachine};