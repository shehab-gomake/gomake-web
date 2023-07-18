import {minMaxInput} from "@/widgets/machines/utils/attributes/media-inputs/min-max-input";

const framingFixedFrameMachine = (state: Record<string, any>) => {
    return [
        ...minMaxInput(state, 'mediaSize', 'sizes'),
    ]
}


export {framingFixedFrameMachine};