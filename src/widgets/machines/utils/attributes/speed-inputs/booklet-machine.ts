import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";

const bookletMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        {
            name: "bookletSpeed",
            label: "machineAttributes.bookletSpeed",
            type: "text",
            placeholder: "machineAttributes.speed",
            required: true,
            parameterKey: "speed",
            options: [],
            value: state?.attributes?.speed ? state?.attributes?.speed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.speed,
            unit: EMeasurementUnits.BOOKLETS_P_MIN
        },
        {
            name: "manualInsert",
            label: "machineAttributes.manualInsert",
            type: "switch",
            placeholder: "machineAttributes.manualInsert",
            required: true,
            parameterKey: "manualInsert",
            options: [],
            value: state?.attributes?.manualInsert,
            machineInputType: 'input',
            isValid: !!state?.attributes?.manualInsert,
        },
        {
            name: "manualInsertSpeed",
            label: "machineAttributes.manualInsertSpeed",
            type: "text",
            placeholder: "machineAttributes.manualInsertSpeed",
            required: true,
            parameterKey: "manualInsertSpeed",
            options: [],
            value: state?.attributes?.manualInsertSpeed,
            machineInputType: 'input',
            isValid: !!state?.attributes?.manualInsertSpeed,
            disabled: !state?.attributes?.manualInsert,
            unit: EMeasurementUnits.MINUTE
        },
    ]
}


export {bookletMachine};