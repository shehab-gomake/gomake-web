import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const bookCasingInMachine = (state: Record<string, any>) => {
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
            unit: EMeasurementUnits.BOOK_PH
        },


    ]
}

export {bookCasingInMachine};