import {minMaxInput} from "@/widgets/machines/utils/attributes/media-inputs/min-max-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const hardCoverMakingMachine = (state: Record<string, any>) => {
    return [
        ...minMaxInput(state, 'boardThickness', 'boardThickness', EMeasurementUnits.MM),
        ...minMaxInput(state, 'caseHeight', 'caseHeight', EMeasurementUnits.MM),
        ...minMaxInput(state, 'caseWidth', 'caseWidth', EMeasurementUnits.MM),
        ...minMaxInput(state, 'spineWidth', 'spineWidth', EMeasurementUnits.MM),
    ]
}


export {hardCoverMakingMachine};