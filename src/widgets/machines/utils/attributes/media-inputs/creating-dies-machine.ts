import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";

const creatingDiesMachine = (state: Record<string, any>) => {
    return [
        ...mediaDimensionsSettings(state),

    ]
}


export {creatingDiesMachine};