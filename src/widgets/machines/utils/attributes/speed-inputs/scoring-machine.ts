import {maxSpeedInput} from "@/widgets/machines/utils/attributes/speed-inputs/max-speed-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";

const scoringMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        ...maxSpeedInput(state, EMeasurementUnits.SPH),
        {
            name: "unitDelay",
            label: "machineAttributes.scoringPerforationUnitDelay",
            type: "text",
            placeholder: "machineAttributes.unitDelay",
            required: true,
            parameterKey: "unitDelay",
            options: [],
            value: state?.attributes?.unitDelay ? state?.attributes?.unitDelay : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.unitDelay,
        },
        {
            name: 'machineAttributes.speedByMediaWeight',
            parameterKey: 'speedByMediaWeight',
            value: state.attributes?.speedByMediaWeight || [],
            isValid: state.attributes?.speedByMediaWeight?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "weight",
                    label: "machineAttributes.weight",
                    type: "text",
                    placeholder: "machineAttributes.weight",
                    required: true,
                    parameterKey: "weight",
                    options: [],
                    unit: EMeasurementUnits.GRAM
                },
                {
                    name: "speedPercentage",
                    label: "machineAttributes.speedPercentage",
                    type: "text",
                    placeholder: "machineAttributes.speedPercentage",
                    required: true,
                    parameterKey: "speedPercentage",
                    options: [],
                    unit: EMeasurementUnits.PERCENTAGE
                },

            ]
        },
        {
            name: 'machineAttributes.speedByMediaLength',
            parameterKey: 'speedByMediaLength',
            value: state.attributes?.speedByMediaLength || [],
            isValid: state.attributes?.speedByMediaLength?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "length",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "speedPercentage",
                    label: "machineAttributes.speedPercentage",
                    type: "text",
                    placeholder: "machineAttributes.speedPercentage",
                    required: true,
                    parameterKey: "speedPercentage",
                    options: [],
                    unit: EMeasurementUnits.PERCENTAGE
                },

            ]
        }
    ]
}

export {scoringMachine};