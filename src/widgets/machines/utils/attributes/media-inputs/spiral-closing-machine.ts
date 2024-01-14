import {minMaxInput} from "@/widgets/machines/utils/attributes/media-inputs/min-max-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const spiralClosingMachine = (state: Record<string, any>) => {
    return [
        ...minMaxInput(state, 'thickness', 'thickness', EMeasurementUnits.MM),
        ...minMaxInput(state, 'width', 'width', EMeasurementUnits.CM),
        ...minMaxInput(state, 'length', 'length', EMeasurementUnits.CM),
    ]
}


export {spiralClosingMachine};