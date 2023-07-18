import {minMaxInput} from "@/widgets/machines/utils/attributes/media-inputs/min-max-input";

const spiralClosingMachine = (state: Record<string, any>) => {
    return [
        ...minMaxInput(state, 'thickness', 'thickness'),
        ...minMaxInput(state, 'width', 'width'),
        ...minMaxInput(state, 'length', 'length'),
        ...minMaxInput(state, 'paperThickness', 'paperThickness'),
    ]
}


export {spiralClosingMachine};