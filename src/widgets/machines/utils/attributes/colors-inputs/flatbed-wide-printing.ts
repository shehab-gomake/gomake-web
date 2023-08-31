import {additionalColorsInput} from "@/widgets/machines/utils/attributes/colors-inputs/additional-colors-input";

const flatbedWidePrinting = (state: Record<string, any>) => {
    return [
        ...additionalColorsInput(state),
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