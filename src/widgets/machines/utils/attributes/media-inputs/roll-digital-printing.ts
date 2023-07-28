import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {mediaLoadingLoss} from "@/widgets/machines/utils/attributes/media-inputs/media-loading-loss";
import {mediaImageSizeSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-image-size-settings";
import {mediaMinMarginWidth} from "@/widgets/machines/utils/attributes/media-inputs/media-min-margin-width";

const rollDigitalPrinting = (state: Record<string, any>) => {
    return [

        ...mediaLoadingLoss(state),
        ...mediaMinMarginWidth(state),
        ...mediaDimensionsSettings(state),
        ...mediaImageSizeSettings(state)
    ]
}


export {rollDigitalPrinting};