const insertTypeInput = (state: Record<string, any>, disabled?: boolean) => {
    return [
        {
            name: "insertTypes",
            label: "machineAttributes.insertTypes",
            type: "select",
            placeholder: "machineAttributes.insertTypes",
            required: true,
            parameterKey: "insertTypes",
            options: [
                {value: 1, text: 'Sets without fold'},
                {value: 2, text: 'Folded sets'},

            ],
            value: state.attributes?.insertTypes ? state.attributes?.insertTypes: '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.insertTypes,
            disabled
        },
    ]
}

export {insertTypeInput};