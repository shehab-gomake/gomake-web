import {mediaSheetLossInput} from "@/widgets/machines/utils/attributes/media-inputs/media-sheet-loss-input";
import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {mediaBaseTypeInput} from "@/widgets/machines/utils/attributes/media-inputs/media-base-type-input";

const pastingBlocksMachine = (state: Record<string, any>) => {
    return [
        ...mediaSheetLossInput(state),
        ...mediaDimensionsSettings(state),
        ...mediaBaseTypeInput(state)
    ]
}


export {pastingBlocksMachine};