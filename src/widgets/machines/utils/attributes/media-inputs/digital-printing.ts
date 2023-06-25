import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {mediaCoatingSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-coating-settings";
import {
    marginWithoutPrintingSettings
} from "@/widgets/machines/utils/attributes/media-inputs/margin-without-printing-settings";
import {mediaWeightSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-weight-settings";
import {mediaThicknessSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-thickness-settings";

const digitalPrinting = (state: Record<string, any>) => {
    return [
        ...mediaCoatingSettings(state),
        ...mediaDimensionsSettings(state),
        ...marginWithoutPrintingSettings(state),
        ...mediaWeightSettings(state),
        ...mediaThicknessSettings(state)
    ]
}


export {digitalPrinting};