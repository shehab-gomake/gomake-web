
const rollDigitalPrinting = (state: Record<string, any>) => {
    return [
        {
            name: "coatingUnit",
            label: "machineAttributes.coatingUnit",
            type: "switch",
            placeholder: "machineAttributes.coatingUnit",
            required: true,
            parameterKey: "coatingUnit",
            value: state?.attributes?.coatingUnit,
            options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "varnishType",
            label: "machineAttributes.varnishType",
            type: "select",
            placeholder: "machineAttributes.varnishType",
            required: true,
            parameterKey: "varnishType",
            options: [],
            values: state?.attributes?.varnishType,
            optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=varnish',
            disabled: !state?.attributes?.coatingUnit,
            multiple: true
        },
    ]
};


export {rollDigitalPrinting}