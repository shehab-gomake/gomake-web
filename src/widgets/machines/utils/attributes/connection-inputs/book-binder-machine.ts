
const bookBinderMachine = (state: Record<string, any>) => {
    return [
        {
            machineInputType: 'multiInput',
            name: 'machineAttributes.collectionConnection',
            parameterKey: 'bookletConnection',
            isValid: true,
            value: state?.collectionConnection,
            inputs: [
                {
                    name: "collectionConnection",
                    label: "machineAttributes.canConnect",
                    type: "switch",
                    placeholder: "",
                    required: true,
                    parameterKey: "canConnect",
                    value: state.attributes?.collectionConnection?.canConnect,
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
                    value: state.attributes?.collectionConnection?.machineList,
                    options: [{value: 1, text: 'machine 1'}, {value: 2, text: 'machine 2'}],
                    machineInputType: 'input',
                    isValid: true,
                    disabled: !state.attributes?.collectionConnection?.canConnect

                },
            ]
        },
        {
            machineInputType: 'multiInput',
            name: 'machineAttributes.printingMachineConnection',
            parameterKey: 'printingMachineConnection',
            isValid: true,
            value: state?.printingMachineConnection,
            inputs: [
                {
                    name: "BoosbinderConnection",
                    label: "machineAttributes.canConnect",
                    type: "switch",
                    placeholder: "machineAttributes.printingMachineConnection",
                    required: true,
                    parameterKey: "canConnect",
                    value: state.attributes?.printingMachineConnection?.canConnect,
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
                    value: state.attributes?.printingMachineConnection?.machine,
                    options: [{value: 1, text: 'machine 1'}, {value: 2, text: 'machine 2'}],
                    machineInputType: 'input',
                    isValid: true,
                    disabled: !state.attributes?.printingMachineConnection?.canConnect
                },
                {
                    name: "collectionCell",
                    label: "machineAttributes.collectionCell",
                    type: "text",
                    placeholder: "machineAttributes.collectionCell",
                    required: true,
                    parameterKey: "collectionCell",
                    options: [],
                    value: state.attributes?.printingMachineConnection?.collectionCell ? state.attributes?.printingMachineConnection?.collectionCell : '',
                    machineInputType: 'input',
                    isValid: !!state?.attributes?.printingMachineConnection?.collectionCell,
                    disabled: !state.attributes?.printingMachineConnection?.canConnect

                },
            ]
        } ,
    ];
}

export {bookBinderMachine};