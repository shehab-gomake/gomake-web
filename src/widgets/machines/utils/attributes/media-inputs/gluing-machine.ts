import {minMaxInput} from "@/widgets/machines/utils/attributes/media-inputs/min-max-input";

const gluingMachine = (state: Record<string, any>) => {
    return [
        ...minMaxInput(state, 'mediaHeight', 'height' ),
        ...minMaxInput(state, 'mediaWidth', 'width' ),
    ]
}


export {gluingMachine};