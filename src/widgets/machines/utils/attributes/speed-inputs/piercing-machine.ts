import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const piercingMachine = (state: Record<string, any>) => {
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
            value: state.attributes?.maxSpeed ? state.attributes?.maxSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxSpeed,
            unit: EMeasurementUnits.PIERCING_PER_MIN
        },
        {
            name: "delayPerUnit",
            label: "machineAttributes.delayPerUnit",
            type: "text",
            placeholder: "machineAttributes.delayPerUnit",
            required: true,
            parameterKey: "delayPerUnit",
            options: [],
            value: state.attributes?.delayPerUnit ? state.attributes?.delayPerUnit : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.delayPerUnit,
            unit: EMeasurementUnits.SECOND
        },
    ]
}

export {piercingMachine};