import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const encapsulationMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        {
            name: "maxSpeed",
            label: "machineAttributes.maxSpeed",
            type: "text",
            placeholder: "machineAttributes.maxSpeed",
            required: true,
            parameterKey: "maxSpeed",
            options: [],
            value: state?.attributes?.maxSpeed ? state?.attributes?.maxSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxSpeed,
            unit: EMeasurementUnits.SPH
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
        }
    ]
}

export {encapsulationMachine};