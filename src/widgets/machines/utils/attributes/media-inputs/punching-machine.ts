import {mediaSheetLossInput} from "@/widgets/machines/utils/attributes/media-inputs/media-sheet-loss-input";
import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";

const punchingMachine = (state: Record<string, any>) => {
    return [
        ...mediaSheetLossInput(state),
        ...mediaDimensionsSettings(state),
    ]
}


export {punchingMachine};