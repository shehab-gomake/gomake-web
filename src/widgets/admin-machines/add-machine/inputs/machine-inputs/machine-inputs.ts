const machineInputs = (state: Record<string, any>) => {
    return [
        {
            name: "manufacturer",
            label: "adminAddMachine.manufacturer",
            type: "text",
            placeholder: "Manufacturer",
            required: true,
            parameterKey: "manufacturer",
            options: [],
            value: state?.manufacturer ? state?.manufacturer : '',
            machineInputType: 'input',
        },
        {
            name: "model",
            label: "adminAddMachine.model",
            type: "text",
            placeholder: "Model",
            required: true,
            parameterKey: "model",
            options: [],
            value: state?.model ? state?.model : '',
            machineInputType: 'input',

        },
        {
            name: "code",
            label: "adminAddMachine.code",
            type: "text",
            placeholder: "Code",
            required: true,
            parameterKey: "code",
            options: [],
            value: state?.code ? state?.code : '',
            machineInputType: 'input',
        },
        {
            name: "nickName",
            label: "adminAddMachine.nickName",
            type: "text",
            placeholder: "Nick name",
            required: true,
            parameterKey: "nickName",
            options: [],
            value: state?.nickName ? state?.nickName : '',
            machineInputType: 'input',

        },
        {
            machineInputType: 'multiInput',
            name: '',
            parameterKey: 'price',
            inputs: [
                {
                    name: "price",
                    label: "adminAddMachine.price",
                    type: "text",
                    placeholder: "Price",
                    required: true,
                    parameterKey: "price",
                    options: [],
                    value: state?.price?.price ? state.price.price : ''

                },
                {
                    name: "currency",
                    label: "adminAddMachine.currency",
                    type: "select",
                    placeholder: "Currency",
                    required: true,
                    parameterKey: "currency",
                    value: state?.price?.currency ? state?.price?.currency : 0,
                    options: [{value: 1, text: 'adminAddMachine.dollar'}, {value: 2, text: 'adminAddMachine.euro'}]
                },
            ]
        }

    ];
}

export {machineInputs};