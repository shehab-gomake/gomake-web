import {digitalPrinting} from "@/widgets/machines/utils/attributes/colors-inputs/digital-printing";

const rollWidePrinting = (state: Record<string, any>) => {
    return [
        {
            name: "colorType",
            label: "machineAttributes.colorType",
            type: "select",
            placeholder: "machineAttributes.colorType",
            required: true,
            parameterKey: "colorType",
            value: state?.attributes?.colorType,
            options: [{value: '1', text: 'UV'}, {value: '2', text: 'Eco solvent'}, {value: '3', text: 'latex'}],
            machineInputType: 'input',
            isValid: true,
        },
        ...digitalPrinting(state)
    ]
};


export {rollWidePrinting}