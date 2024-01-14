import {maxSpeedInput} from "@/widgets/machines/utils/attributes/speed-inputs/max-speed-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";

const staplerMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        ...maxSpeedInput(state, EMeasurementUnits.STAPLES_P_MIN),
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
            unit: EMeasurementUnits.SECOND
        },
    ]
}

export {staplerMachine};