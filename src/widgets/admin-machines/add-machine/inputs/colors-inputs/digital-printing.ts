import {COLORS} from "@/widgets/admin-machines/const";

const digitalPrinting = (state: Record<string, any>) => {
    return [
        {
            name: "basicsColors",
            label: "adminAddMachine.basicsColors",
            type: "select",
            placeholder: "Basics colors",
            required: true,
            parameterKey: "basicsColors",
            value: state?.attributes?.basicsColors,
            options: [{value: 1, text: 'Black'}, {value: 2, text: 'CMYK'}],
            machineInputType: 'input',
            isValid: true
        },

        {
            name: "additionalColorsAmount",
            label: "adminAddMachine.additionalColorsAmount",
            type: "text",
            placeholder: "Colors number",
            required: true,
            parameterKey: "additionalColorsAmount",
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.additionalColorsAmount ? state?.attributes?.additionalColorsAmount : '',
            isValid: true
        },
        {
            name: "printLayers",
            label: "adminAddMachine.printLayers",
            type: "select",
            placeholder: "Option to print layers",
            required: true,
            parameterKey: "printLayers",
            value: state?.attributes?.printLayers,
            options:  [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            machineInputType: 'input',
            isValid: true
        },
        {
            name: "printLayersSameRun",
            label: "adminAddMachine.printLayersSameRun",
            type: "select",
            placeholder: "Option to print same run",
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
            label: "adminAddMachine.printLayersMax",
            type: "text",
            placeholder: "Maximum layers",
            required: true,
            parameterKey: "printLayersMax",
            options: [],
            disabled: !state?.attributes?.printLayers,
            machineInputType: 'input',
            value: state?.attributes?.printLayersMax,
            isValid: true

        },
        {
            name: 'Additional colors',
            parameterKey: 'additionalColorsCoast',
            value: state?.attributes?.additionalColorsCoast ? state?.attributes?.additionalColorsCoast : [],
            machineInputType: 'multiArrayInput',
            isValid: state?.attributes?.additionalColorsCoast?.length > 0,
            inputs: [
                {
                    name: "color",
                    label: "adminAddMachine.color",
                    type: "select",
                    placeholder: "Color",
                    required: true,
                    parameterKey: "color",
                    value: COLORS[0].value,
                    options:  COLORS
                },
                {
                    name: "cost",
                    label: "adminAddMachine.cost",
                    type: "text",
                    placeholder: "Coast",
                    required: true,
                    parameterKey: "cost",
                    options: []
                },

            ]
        },
    ]
};


export {digitalPrinting}