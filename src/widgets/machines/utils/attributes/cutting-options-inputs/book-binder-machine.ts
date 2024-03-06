
const bookBinderMachine = (state: Record<string, any>) => {
    return [
        {
            name: "tanksAmount",
            label: "machineAttributes.tanksAmount",
            type: "text",
            placeholder: "machineAttributes.tanksAmount",
            required: true,
            parameterKey: "tanksAmount",
            options: [],
            value: state.attributes?.tanksAmount ? state.attributes?.tanksAmount : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.tanksAmount,
        },
        {
            name: "cost",
            label: "machineAttributes.cost",
            type: "text",
            placeholder: "machineAttributes.cost",
            required: true,
            parameterKey: "cost",
            options: [],
            value: state.attributes?.cost ? state.attributes?.cost : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.cost,
        },
        {
            name: "machineAttributes.glues",
            label: "machineAttributes.glues",
            type: "text",
            placeholder: "machineAttributes.glues",
            required: true,
            parameterKey: "glues",
            options: [],
            machineInputType: 'materialInput',
            value: state?.attributes?.glues,
            isValid: true,
            materialType: 'Glues'
        },
    ];
}

export {bookBinderMachine};