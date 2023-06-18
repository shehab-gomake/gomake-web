import {COLORS} from "@/widgets/machines/utils/const";

const rollWidePrinting = (state: Record<string, any>) => {
    return [

        {
            name: 'machineAttributes.additionalColorsCoast',
            parameterKey: 'additionalColorsCoast',
            value: state?.attributes?.additionalColorsCoast ? state?.attributes?.additionalColorsCoast : [],
            machineInputType: 'multiArrayInput',
            isValid: state?.attributes?.additionalColorsCoast?.length > 0,
            inputs: [
                {
                    name: "color",
                    label: "machineAttributes.color",
                    type: "select",
                    placeholder: "machineAttributes.color",
                    required: true,
                    parameterKey: "color",
                    value: COLORS[0].value,
                    options:  COLORS
                },
                {
                    name: "cost",
                    label: "machineAttributes.cost",
                    type: "text",
                    placeholder: "machineAttributes.cost",
                    required: true,
                    parameterKey: "cost",
                    options: []
                },

            ]
        },
        {
            name: "maxLayers",
            label: "machineAttributes.maxLayers",
            type: "text",
            placeholder: "machineAttributes.maxLayers",
            required: true,
            parameterKey: "maxLayers",
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.maxLayers ? state?.attributes?.maxLayers : '',
            isValid: !!state?.attributes?.maxLayers
        },
    ]
};


export {rollWidePrinting}