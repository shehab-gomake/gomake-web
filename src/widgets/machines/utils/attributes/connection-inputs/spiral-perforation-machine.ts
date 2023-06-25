
const spiralPerforationMachine = (state: Record<string, any>) => {
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
                    type: "select",
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
    ];
}

export {spiralPerforationMachine};