import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";

const customFrameMachine = (state: Record<string, any>) => {
    return [
        ...mediaDimensionsSettings(state),
    ]
}


export {customFrameMachine};