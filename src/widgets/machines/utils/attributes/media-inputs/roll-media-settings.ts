import {minMaxInput} from "@/widgets/machines/utils/attributes/media-inputs/min-max-input";

const rollMediaSettings = (state: Record<string, any>) => {
    return [
        ...minMaxInput(state, 'rollWidth', 'rollWidth'),
        {
            name: "maxRollDiameter",
            label: "machineAttributes.maxRollDiameter",
            type: "text",
            placeholder: "machineAttributes.maxRollDiameter",
            parameterKey: "maxRollDiameter",
            options: [],
            value: state?.attributes?.maxRollDiameter ? state?.attributes?.maxRollDiameter : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxRollDiameter,
        },
    ]
}


export {rollMediaSettings};