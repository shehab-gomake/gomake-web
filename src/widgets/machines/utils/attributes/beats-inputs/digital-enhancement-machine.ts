import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const digitalEnhancementMachine = (state: Record<string, any>) => {
    return [
        {
            name: "available",
            label: "machineAttributes.available",
            type: "switch",
            placeholder: "machineAttributes.available",
            required: true,
            parameterKey: "embossingAvailable",
            value: state?.attributes?.embossingAvailable,
            options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            machineInputType: 'input',
            isValid: true
        },
        {
            name: "machineAttributes.varnish",
            label: "machineAttributes.varnish",
            type: "text",
            placeholder: "machineAttributes.varnish",
            required: true,
            parameterKey: "varnishTypes",
            options: [],
            disabled: !state?.attributes?.embossingAvailable,
            machineInputType: 'materialInput',
            value: state?.attributes?.varnishTypes ? state?.attributes?.varnishTypes : [],
            isValid: true,
            materialType: 'varnish',
        },
        {
            name: 'machineAttributes.heightLevels',
            parameterKey: 'heightLevels',
            value: state?.attributes?.heightLevels ? state?.attributes?.heightLevels : [],
            machineInputType: 'multiArrayInput',
            isValid: state?.attributes?.heightLevels?.length > 0,
            disabled: !state?.attributes?.embossingAvailable,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.heightLevel",
                    type: "text",
                    placeholder: "machineAttributes.heightLevel",
                    required: true,
                    parameterKey: "value",
                    options: [],
                },
                {
                    name: "",
                    label: "machineAttributes.WeightOfVarnish",
                    type: "text",
                    placeholder: "machineAttributes.WeightOfVarnish",
                    required: true,
                    parameterKey: "weightPerArea",
                    options: [],
                    unit: EMeasurementUnits.KgPerSquareMeter
                }
            ]
        },
    ]
};

export {digitalEnhancementMachine};