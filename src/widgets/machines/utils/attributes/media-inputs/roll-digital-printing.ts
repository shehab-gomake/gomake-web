import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {mediaLoadingLoss} from "@/widgets/machines/utils/attributes/media-inputs/media-loading-loss";
import {mediaImageSizeSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-image-size-settings";
import {mediaMinMarginWidth} from "@/widgets/machines/utils/attributes/media-inputs/media-min-margin-width";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

// Custom media dimensions for roll digital printing without min/max length
const rollDigitalPrintingMediaDimensions = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.mediaDimensions',
            parameterKey: 'mediaDimensions',
            machineInputType: 'multiInput',
            value: state?.attributes?.mediaDimensions,
            isValid: !!state?.attributes?.mediaDimensions?.minWidth &&
                !!state?.attributes?.mediaDimensions?.maxWidth,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.minWidth",
                    type: "text",
                    placeholder: "machineAttributes.minWidth",
                    required: true,
                    parameterKey: "minWidth",
                    unit: EMeasurementUnits.CM,
                    options: [],
                    value: state.attributes?.mediaDimensions?.minWidth ? state.attributes?.mediaDimensions?.minWidth : ''
                },
                {
                    name: "",
                    label: "machineAttributes.maxWidth",
                    unit: EMeasurementUnits.CM,
                    type: "text",
                    placeholder: "machineAttributes.maxWidth",
                    required: true,
                    parameterKey: "maxWidth",
                    options: [],
                    value: state.attributes?.mediaDimensions?.maxWidth ? state.attributes?.mediaDimensions?.maxWidth : ''
                },
            ]
        },
    ]
}

const rollDigitalPrinting = (state: Record<string, any>) => {
    return [

        ...mediaLoadingLoss(state),
        ...mediaMinMarginWidth(state),
        ...rollDigitalPrintingMediaDimensions(state),
        ...mediaImageSizeSettings(state),
    ]
}


export {rollDigitalPrinting};