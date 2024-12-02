import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const painting = (state: Record<string, any>) => {
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
            name: "setupTimePerElement",
            label: "machineAttributes.setupTimePerElement",
            type: "text",
            placeholder: "machineAttributes.setupTimePerElement",
            required: true,
            parameterKey: "setupTimePerElement",
            options: [],
            value: state.attributes?.setupTimePerElement ? state.attributes?.setupTimePerElement : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setupTimePerElement,
        },
        {
            name: "speed",
            label: "machineAttributes.speed",
            type: "text",
            placeholder: "machineAttributes.speed",
            required: true,
            parameterKey: "speed",
            options: [],
            value: state.attributes?.speed ? state.attributes?.speed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.speed,
            unit: EMeasurementUnits.SQUARE_CM_HOUR
        },

    ]
}

export {painting};

