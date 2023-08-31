import {COLORS} from "@/widgets/machines/utils/const";
import {additionalColorsInput} from "@/widgets/machines/utils/attributes/colors-inputs/additional-colors-input";
import {basicColorsInput} from "@/widgets/machines/utils/attributes/colors-inputs/basic-colors-input";

const rollDigitalPrinting = (state: Record<string, any>) => {
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
            type: "select",
            placeholder: "",
            required: true,
            parameterKey: "printLayers",
            value: state?.attributes?.printLayers,
            options:  [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            machineInputType: 'input',
            isValid: true
        },
        {
            name: "printLayersSameRun",
            label: "machineAttributes.printLayersSameRun",
            type: "select",
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
        ...additionalColorsInput(state),
    ]
};


export {rollDigitalPrinting}