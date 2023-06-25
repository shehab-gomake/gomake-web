
const mediaCoatingSettings = (state: Record<string, any>) => {
    return [
        {
            name: "coatingUnit",
            label: "machineAttributes.coatingUnit",
            type: "select",
            placeholder: "machineAttributes.coatingUnit",
            required: true,
            parameterKey: "coatingUnit",
            value: state?.attributes?.coatingUnit,
            options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "coatingUnitCost",
            label: "machineAttributes.coatingUnitCost",
            type: "text",
            placeholder: "machineAttributes.coatingUnitCost",
            required: state?.coatingUnitCost,
            parameterKey: "coatingUnitCost",
            options: [],
            disabled: !state?.attributes?.coatingUnit,
            value: state?.attributes?.coatingUnit && state?.attributes?.coatingUnitCost ? state?.attributes?.coatingUnitCost : '',
            machineInputType: 'input',
            isValid: true,
        },
    ]
}


export {mediaCoatingSettings};