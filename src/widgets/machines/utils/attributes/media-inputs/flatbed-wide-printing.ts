import {mediaLoadingLoss} from "@/widgets/machines/utils/attributes/media-inputs/media-loading-loss";
import {mediaMinMarginWidth} from "@/widgets/machines/utils/attributes/media-inputs/media-min-margin-width";
import {mediaImageSizeSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-image-size-settings";
import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {mediaWeightSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-weight-settings";
import {mediaThicknessSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-thickness-settings";

const flatbedWidePrinting = (state: Record<string, any>) => {
    return [
        ...mediaLoadingLoss(state),
        ...mediaMinMarginWidth(state),
        ...mediaDimensionsSettings(state),
        ...mediaWeightSettings(state),
        ...mediaThicknessSettings(state),
        ...mediaImageSizeSettings(state)
    ]
}


export {flatbedWidePrinting};