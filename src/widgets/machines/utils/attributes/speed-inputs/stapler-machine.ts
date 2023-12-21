import {maxSpeedInput} from "@/widgets/machines/utils/attributes/speed-inputs/max-speed-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const staplerMachine = (state: Record<string, any>) => {
    return [
        ...maxSpeedInput(state, EMeasurementUnits.MINUTE),
        {
            name: "setDelay",
            label: "machineAttributes.setDelay",
            type: "text",
            placeholder: "machineAttributes.setDelay",
            required: true,
            parameterKey: "setDelay",
            options: [],
            value: state.attributes?.setDelay ? state.attributes?.setDelay : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setDelay,
            unit: EMeasurementUnits.MINUTE
        },
    ]
}

export {staplerMachine};