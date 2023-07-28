import {mediaLoadingLoss} from "@/widgets/machines/utils/attributes/media-inputs/media-loading-loss";
import {mediaMinMarginWidth} from "@/widgets/machines/utils/attributes/media-inputs/media-min-margin-width";
import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {mediaWeightSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-weight-settings";
import {mediaThicknessSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-thickness-settings";
import {mediaSheetLossInput} from "@/widgets/machines/utils/attributes/media-inputs/media-sheet-loss-input";

const laminationMachine = (state: Record<string, any>) => {
    return [
        ...mediaSheetLossInput(state),
        ...mediaLoadingLoss(state),
        ...mediaMinMarginWidth(state),
        ...mediaDimensionsSettings(state),
        ...mediaWeightSettings(state),
        ...mediaThicknessSettings(state)
    ]
}


export {laminationMachine};