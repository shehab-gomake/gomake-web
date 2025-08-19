import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {mediaLoadingLoss} from "@/widgets/machines/utils/attributes/media-inputs/media-loading-loss";
import {mediaImageSizeSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-image-size-settings";
import {mediaMinMarginWidth} from "@/widgets/machines/utils/attributes/media-inputs/media-min-margin-width";
import { availableCylinders } from "./available-cylinders";
import {cylinderSizeSettings} from "@/widgets/machines/utils/attributes/media-inputs/cylinder-size-settings";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

// Custom media dimensions for flexo printing without min/max length
const flexoPrintingMediaDimensions = (state: Record<string, any>) => {
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

const flexMachine = (state: Record<string, any>) => {
    return [

        ...mediaLoadingLoss(state),
        ...mediaWastePerColor(state),
        ...mediaMinMarginWidth(state),
        ...flexoPrintingMediaDimensions(state),
        ...cylinderSizeSettings(state),
        ...availableCylinders(state)
    ]
}

const mediaWastePerColor = (state: Record<string, any>)=>{
    return [
        {
            name: "mediaWastePerColor",
            label: "machineAttributes.mediaWastePerColor",
            type: "text",
            placeholder: "machineAttributes.mediaWastePerColor",
            required: true,
            parameterKey: "mediaWastePerColor",
            unit: EMeasurementUnits.METER,
            options: [],
            value: state?.attributes?.mediaWastePerColor ? state?.attributes?.mediaWastePerColor : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.mediaWastePerColor,
        },
    ]
}
export {flexMachine};