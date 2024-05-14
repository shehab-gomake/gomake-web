import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {minMaxInput} from "@/widgets/machines/utils/attributes/media-inputs/min-max-input";

const cardCutting = (state: Record<string, any>) => {
    return [
        ...minMaxInput(state, 'paperThickness', 'paperThickness', EMeasurementUnits.MM),
        ...minMaxInput(state, 'paperThickness', 'paperLength', EMeasurementUnits.MM),
        ...minMaxInput(state, 'paperThickness', 'paperWidth', EMeasurementUnits.MM),
    ]
}


export {cardCutting};