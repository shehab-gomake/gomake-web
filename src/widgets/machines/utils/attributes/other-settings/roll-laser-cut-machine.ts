import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const rollLaserCutMachine = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'axisDiameter',
            value: state.attributes?.axisDiameter || [],
            machineInputType: 'multiArrayInput',
            isValid: true,
            inputs: [
                {
                    name: "axisDiameter",
                    label: "machineAttributes.axisDiameter",
                    type: "text",
                    placeholder: "machineAttributes.axisDiameter",
                    required: true,
                    parameterKey: "axisDiameter",
                    options: [],
                    unit: EMeasurementUnits.INCH
                },
            ]
        },
        {
            name: "coreMaxWidth",
            label: "machineAttributes.coreMaxWidth",
            type: "text",
            placeholder: "machineAttributes.coreMaxWidth",
            required: true,
            parameterKey: "coreMaxWidth",
            options: [],
            value: state.attributes?.coreMaxWidth ? state.attributes?.coreMaxWidth : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.coreMaxWidth,
        },

    ];
}

export {rollLaserCutMachine};