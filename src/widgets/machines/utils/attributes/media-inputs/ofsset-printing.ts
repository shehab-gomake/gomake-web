import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {
    marginWithoutPrintingSettings
} from "@/widgets/machines/utils/attributes/media-inputs/margin-without-printing-settings";
import {mediaWeightSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-weight-settings";
import {mediaThicknessSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-thickness-settings";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const ofssetPrinting = (state: Record<string, any>) => {
    return [
        ...mediaDimensionsSettings(state),
        ...marginWithoutPrintingSettings(state),
        ...mediaWeightSettings(state),
        ...mediaThicknessSettings(state,EMeasurementUnits.UM)
    ]
}


export {ofssetPrinting};