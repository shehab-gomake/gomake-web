import {basicColorsInput} from "@/widgets/machines/utils/attributes/colors-inputs/basic-colors-input";

const digitalPrinting = (state: Record<string, any>) => {
    return [
        ...basicColorsInput(state),
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
            name: "machineAttributes.colors",
            label: "machineAttributes.color",
            type: "text",
            placeholder: "machineAttributes.color",
            required: true,
            parameterKey: "colors",
            options: [],
            machineInputType: 'materialInput',
            value: state?.attributes?.colors,
            isValid: true,
            materialType: 'colors'
        },
    ]
};


export {digitalPrinting}