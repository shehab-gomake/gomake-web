const connectionToPrintingMachine = (state: Record<string, any>) => {
    const parameterKey = 'connectToPrinting';
    const label = 'connectToPrinting'
    return [
        {
            machineInputType: 'multiInput',
            name: `machineAttributes.${label}`,
            parameterKey: parameterKey,
            isValid: true,
            value: state[parameterKey],
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.isConnect",
                    type: "switch",
                    placeholder: "",
                    required: true,
                    parameterKey: "isConnect",
                    value: state.attributes[parameterKey] && state.attributes[parameterKey]['isConnect'] ? !!state.attributes[parameterKey]['isConnect'] : false,
                    options: [],
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
                    value:  state.attributes[parameterKey]?.machine ? state.attributes[parameterKey]?.machine : '',
                    optionsUrl: state.attributes[parameterKey]?.isConnect ? '/v1/machines-list/printing/'  : '',
                    options: [],
                    machineInputType: 'input',
                    isValid: true,
                    disabled: !state.attributes[parameterKey]?.isConnect

                },
                {
                    name: "",
                    label: "machineAttributes.isCollectionCell",
                    type: "switch",
                    placeholder: "",
                    required: true,
                    parameterKey: "isCollectionCell",
                    value: state.attributes[parameterKey] && state.attributes[parameterKey]['isCollectionCell'] ? !!state.attributes[parameterKey]['isCollectionCell'] : false,
                    options: [],
                    machineInputType: 'input',
                    isValid: true,
                },
            ]
        },
    ];
}

export {connectionToPrintingMachine};