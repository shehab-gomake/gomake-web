import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {maxSpeedInput} from "@/widgets/machines/utils/attributes/speed-inputs/max-speed-input";

const cardCutting = (state: Record<string, any>) => {
    return [
        {
            name: "setupTimeMin",
            label: "machineAttributes.setupTimeMin",
            type: "text",
            placeholder: "machineAttributes.setupTimeMin",
            required: true,
            parameterKey: "setupTimeMin",
            unit: EMeasurementUnits.MINUTE,
            options: [],
            value: state.attributes?.setupTimeMin ? state.attributes?.setupTimeMin : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setupTimeMin,
        },
        {
            name: "sheetDelay",
            label: "machineAttributes.sheetDelay",
            type: "text",
            placeholder: "machineAttributes.sheetDelay",
            required: true,
            parameterKey: "sheetDelay",
            unit: EMeasurementUnits.SECOND,
            options: [],
            value: state.attributes?.sheetDelay ? state.attributes?.sheetDelay : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.sheetDelay,
        },        
        ...maxSpeedInput(state, EMeasurementUnits.CUTS_P_MIN),
        {
            name: "maxColumns",
            label: "machineAttributes.maxColumns",
            type: "text",
            placeholder: "machineAttributes.maxColumns",
            required: true,
            parameterKey: "maxColumns",
            options: [],
            value: state.attributes?.maxColumns ? state.attributes?.maxColumns : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxColumns,
        },
        {
            name: 'machineAttributes.speedByPaperThickness',
            parameterKey: 'speedByThickness',
            value: state.attributes?.speedByThickness || [],
            machineInputType: 'multiArrayInput',
            isValid: true,
            inputs: [
                {
                    name: "thickness",
                    label: "machineAttributes.thickness",
                    type: "text",
                    placeholder: "machineAttributes.thickness",
                    required: true,
                    unit: EMeasurementUnits.MM,
                    parameterKey: "thickness",
                    options: []
                },
                {
                    name: "speed",
                    label: "machineAttributes.speedPercentage",
                    type: "text",
                    placeholder: "machineAttributes.speedPercentage",
                    required: true,
                    unit: EMeasurementUnits.PERCENTAGE,
                    parameterKey: "speed",
                    options: []
                },
            ]
        },
    ]
}

export {cardCutting};

