import {minMaxInput} from "@/widgets/machines/utils/attributes/media-inputs/min-max-input";

const bookCasingInMachine = (state: Record<string, any>) => {
    return [
        ...minMaxInput(state, 'blockThickness', 'blockThickness'),
        ...minMaxInput(state, 'blockHeight', 'blockHeight'),
        ...minMaxInput(state, 'blockWidth', 'blockWidth'),
    ]
}


export {bookCasingInMachine};