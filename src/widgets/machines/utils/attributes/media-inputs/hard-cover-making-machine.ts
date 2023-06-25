import {minMaxInput} from "@/widgets/machines/utils/attributes/media-inputs/min-max-input";

const hardCoverMakingMachine = (state: Record<string, any>) => {
    return [
        ...minMaxInput(state, 'boardThickness', 'boardThickness'),
        ...minMaxInput(state, 'caseHeight', 'caseHeight'),
        ...minMaxInput(state, 'caseWidth', 'caseWidth'),
        ...minMaxInput(state, 'spineWidth', 'spineWidth'),
    ]
}


export {hardCoverMakingMachine};