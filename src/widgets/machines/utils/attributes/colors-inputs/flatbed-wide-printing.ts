import {COLORS} from "@/widgets/machines/utils/const";

const flatbedWidePrinting = (state: Record<string, any>) => {
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
            name: "printLayersMax",
            label: "machineAttributes.printLayersMax",
            type: "text",
            placeholder: "machineAttributes.printLayersMax",
            required: true,
            parameterKey: "printLayersMax",
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.printLayersMax,
            isValid: !!state?.attributes?.printLayersMax

        },
    ]
};


export {flatbedWidePrinting}