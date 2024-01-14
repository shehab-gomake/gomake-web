import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const linkageMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
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
            unit: EMeasurementUnits.METER_P_MIN
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

export {linkageMachine};