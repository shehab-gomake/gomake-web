import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";

const bookSewingMachine = (state: Record<string, any>) => {
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
            unit: EMeasurementUnits.SETS_MIN
        },
        {
            name: "setDelay",
            label: "machineAttributes.setDelay",
            type: "text",
            placeholder: "machineAttributes.setDelay",
            required: true,
            parameterKey: "setDelay",
            options: [],
            value: state?.attributes?.setDelay ? state?.attributes?.setDelay : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setDelay,
            unit: EMeasurementUnits.SECOND
        },
    ]
}


export {bookSewingMachine};