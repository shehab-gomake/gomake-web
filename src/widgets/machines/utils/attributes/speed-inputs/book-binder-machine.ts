import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";

const bookBinderMachine = (state: Record<string, any>) => {
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
            unit: EMeasurementUnits.BOOKS_P_MIN
        },
        {
            name: 'machineAttributes.speedByThickness',
            parameterKey: 'speedByThickness',
            value: state.attributes?.speedByThickness || [],
            isValid: state.attributes?.speedByThickness?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "thickness",
                    label: "machineAttributes.thickness",
                    type: "text",
                    placeholder: "machineAttributes.thickness",
                    required: true,
                    parameterKey: "thickness",
                    options: [],
                    unit: EMeasurementUnits.MM
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

export {bookBinderMachine};