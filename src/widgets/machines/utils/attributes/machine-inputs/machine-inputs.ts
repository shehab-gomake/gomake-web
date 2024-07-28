const machineHourCost = (machine) => {
    if (machine?.price?.price && machine.attributes?.dailyProductivityInHours && machine.attributes?.lifeExpectancyYears && machine.attributes?.monthlyMaintenanceCost && machine.attributes?.monthlyCostOfSpace && machine.attributes?.electricityCostPerWorkingHour) {
        return machine?.price?.price /
            (+machine.attributes?.dailyProductivityInHours * +machine.attributes?.lifeExpectancyYears * 22 * 12) +
            +machine.attributes?.monthlyMaintenanceCost / (22 * 8) +
            +machine.attributes?.electricityCostPerWorkingHour + +machine.attributes?.monthlyCostOfSpace / (22 * 8);
    }
    return 0
};
const machineInputs = (state: Record<string, any>) => {
    return [
        {
            name: "manufacturer",
            label: "machineAttributes.manufacturer",
            type: "text",
            placeholder: "machineAttributes.manufacturer",
            required: true,
            parameterKey: "manufacturer",
            options: [],
            value: state?.manufacturer ? state?.manufacturer : '',
            machineInputType: 'input',
            isValid: !!state?.manufacturer,
        },
        {
            name: "model",
            label: "machineAttributes.model",
            type: "text",
            placeholder: "machineAttributes.model",
            required: true,
            parameterKey: "model",
            options: [],
            value: state?.model ? state?.model : '',
            machineInputType: 'input',
            isValid: !!state?.model,
        },
        {
            name: "nickName",
            label: "machineAttributes.nickName",
            type: "text",
            placeholder: "machineAttributes.nickName",
            required: false,
            parameterKey: "nickName",
            options: [],
            value: state?.nickName ? state?.nickName : '',
            machineInputType: 'input',
            isValid: !!state?.nickName,
        },
        {
            machineInputType: 'multiInput',
            name: 'machineAttributes.price',
            parameterKey: 'price',
            isValid: !!state?.price?.price,
            value: state?.price,
            inputs: [
                {
                    name: "price",
                    label: "machineAttributes.price",
                    type: "text",
                    placeholder: "machineAttributes.price",
                    required: true,
                    parameterKey: "price",
                    options: [],
                    value: state?.price?.price ? state.price.price : '',
                    isValid: !!state?.price?.price,
                },
                {
                    name: "currency",
                    label: "machineAttributes.currency",
                    type: "select",
                    placeholder: "machineAttributes.currency",
                    required: true,
                    parameterKey: "currency",
                    value: state?.price?.currency ? state?.price?.currency : 0,
                    options: [],
                    isValid: true,
                    optionsUrl: '/v1/enum/get-enums/currency'
                },
                {
                    name: "machineHourCost",
                    label: "machineAttributes.machineHourCost",
                    type: "number",
                    placeholder: "machineAttributes.machineHourCost",
                    required: true,
                    parameterKey: "",
                    options: [],
                    value: machineHourCost(state)?.toFixed(2),
                    isValid: !!state?.machineHourCost,
                    readonly: true
                },
            ]
        }

    ];
}

export {machineInputs};