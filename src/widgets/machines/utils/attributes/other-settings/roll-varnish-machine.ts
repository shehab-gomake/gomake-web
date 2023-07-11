import {varnishTypes} from "@/widgets/machines/utils/const/varnish-types";

const rollVarnishMachine = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.spiralType',
            parameterKey: 'varnishSettings',
            value: state.attributes?.varnishSettings || [],
            isValid: state.attributes?.varnishSettings?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "type",
                    label: "machineAttributes.type",
                    type: "select",
                    placeholder: "machineAttributes.type",
                    required: true,
                    parameterKey: "type",
                    value: false,
                    options: varnishTypes,
                    machineInputType: 'input',
                    isValid: true,
                },
                {
                    name: "pricePerCM",
                    label: "machineAttributes.pricePerCM",
                    type: "text",
                    placeholder: "machineAttributes.pricePerCM",
                    required: true,
                    parameterKey: "pricePerCM",
                    options: []
                },

            ]
        }
    ];
}

export {rollVarnishMachine};