import {minMaxInput} from "@/widgets/machines/utils/attributes/media-inputs/min-max-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const bookCasingInMachine = (state: Record<string, any>) => {
    return [
        ...minMaxInput(state, 'blockThickness', 'blockThickness', EMeasurementUnits.MM),
        ...minMaxInput(state, 'blockHeight', 'blockHeight', EMeasurementUnits.MM),
        ...minMaxInput(state, 'blockWidth', 'blockWidth', EMeasurementUnits.MM),
    ]
}


export {bookCasingInMachine};