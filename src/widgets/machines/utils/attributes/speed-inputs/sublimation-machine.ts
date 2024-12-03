import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";


const sublimationMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        {
            name: "sheetSpeed",
            label: "machineAttributes.sheetSpeed",
            type: "text",
            placeholder: "machineAttributes.sheetSpeed",
            required: true,
            parameterKey: "sheetSpeed",
            unit: EMeasurementUnits.SPH,
            options: [],
            value: state?.attributes?.sheetSpeed ? state?.attributes?.sheetSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.sheetSpeed,
        },
        {
            name: "rollSpeed",
            label: "machineAttributes.rollSpeed",
            type: "text",
            placeholder: "machineAttributes.rollSpeed",
            required: true,
            parameterKey: "rollSpeed",
            unit: EMeasurementUnits.SQUARE_METER_P_HOUR,
            options: [],
            value: state?.attributes?.rollSpeed ? state?.attributes?.rollSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.rollSpeed,
        },
    ]
}

export {sublimationMachine};