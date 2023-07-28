import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";

const guillotineMachine = (state: Record<string, any>) => {
    return [
        ...mediaDimensionsSettings(state),
    ]
}


export {guillotineMachine};