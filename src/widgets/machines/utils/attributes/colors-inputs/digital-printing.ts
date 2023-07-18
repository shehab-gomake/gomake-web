import {COLORS} from "@/widgets/machines/utils/const";

const digitalPrinting = (state: Record<string, any>) => {
    return [
        {
            name: "basicsColors",
            label: "machineAttributes.basicsColors",
            type: "select",
            placeholder: "machineAttributes.basicsColors",
            required: true,
            parameterKey: "basicsColors",
            value: state?.attributes?.basicsColors,
            options: [],
            machineInputType: 'input',
            isValid: true,
            optionsUrl: '/v1/enum/get-enums/basicColors'
        },

        {
            name: "additionalColorsAmount",
            label: "machineAttributes.additionalColorsAmount",
            type: "text",
            placeholder: "machineAttributes.additionalColorsAmount",
            required: true,
            parameterKey: "additionalColorsAmount",
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.additionalColorsAmount ? state?.attributes?.additionalColorsAmount : '',
            isValid: true
        },
        {
            name: "printLayers",
            label: "machineAttributes.printLayers",
            type: "switch",
            placeholder: "",
            required: true,
            parameterKey: "printLayers",
            value: state?.attributes?.printLayers,
            options:  [],
            machineInputType: 'input',
            isValid: true
        },
        {
            name: "printLayersSameRun",
            label: "machineAttributes.printLayersSameRun",
            type: "switch",
            placeholder: "",
            required: true,
            parameterKey: "printLayersSameRun",
            value: state?.attributes?.printLayers ? state?.attributes?.printLayersSameRun : false ,
            options:  [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            disabled: !state?.attributes?.printLayers,
            machineInputType: 'input',
            isValid: true
        },
        {
            name: "printLayersMax",
            label: "machineAttributes.printLayersMax",
            type: "text",
            placeholder: "machineAttributes.printLayersMax",
            required: true,
            parameterKey: "printLayersMax",
            options: [],
            disabled: !state?.attributes?.printLayers,
            machineInputType: 'input',
            value: state?.attributes?.printLayersMax,
            isValid: true

        },
        {
            name: 'machineAttributes.additionalColorsCoast',
            parameterKey: 'additionalColorsCoast',
            value: state?.attributes?.additionalColorsCoast ? state?.attributes?.additionalColorsCoast : [],
            machineInputType: 'multiArrayInput',
            isValid: true,
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
                    label: "machineAttributes.costOfPrintPerCm",
                    type: "text",
                    placeholder: "machineAttributes.cost",
                    required: true,
                    parameterKey: "cost",
                    options: []
                },

            ]
        },
    ]
};


export {digitalPrinting}