import {COLORS} from "@/widgets/machines/utils/const";
import {additionalColorsInput} from "@/widgets/machines/utils/attributes/colors-inputs/additional-colors-input";

const rollWidePrinting = (state: Record<string, any>) => {
    return [

        ...additionalColorsInput(state),
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