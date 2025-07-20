import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {mediaLoadingLoss} from "@/widgets/machines/utils/attributes/media-inputs/media-loading-loss";
import {mediaImageSizeSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-image-size-settings";
import {mediaMinMarginWidth} from "@/widgets/machines/utils/attributes/media-inputs/media-min-margin-width";
import { availableCylinders } from "./available-cylinders";
import {cylinderSizeSettings} from "@/widgets/machines/utils/attributes/media-inputs/cylinder-size-settings";

const flexMachine = (state: Record<string, any>) => {
    return [

        ...mediaLoadingLoss(state),
        ...mediaMinMarginWidth(state),
        ...mediaDimensionsSettings(state),
        ...cylinderSizeSettings(state),
        ...availableCylinders(state)
    ]
}


export {flexMachine};