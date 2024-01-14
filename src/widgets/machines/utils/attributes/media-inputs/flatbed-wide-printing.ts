import {mediaLoadingLoss} from "@/widgets/machines/utils/attributes/media-inputs/media-loading-loss";
import {mediaMinMarginWidth} from "@/widgets/machines/utils/attributes/media-inputs/media-min-margin-width";
import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {mediaWeightSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-weight-settings";
import {mediaThicknessSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-thickness-settings";

const flatbedWidePrinting = (state: Record<string, any>) => {
    return [
        ...mediaLoadingLoss(state),
        {
            name: "mediaType",
            label: "machineAttributes.mediaType",
            type: "select",
            placeholder: "machineAttributes.mediaType",
            required: true,
            parameterKey: "mediaType",
            value: state?.attributes?.mediaType,
            options: [{value: 1, text: 'Roll'}, {value: true, text: 'Flatbed'}],
            machineInputType: 'input',
            isValid: true,
        },
        ...mediaMinMarginWidth(state),
        ...mediaDimensionsSettings(state),
        ...mediaWeightSettings(state),
        ...mediaThicknessSettings(state),
    ]
}


export {flatbedWidePrinting};