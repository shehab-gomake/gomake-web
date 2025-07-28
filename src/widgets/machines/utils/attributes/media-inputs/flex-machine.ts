import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {mediaLoadingLoss} from "@/widgets/machines/utils/attributes/media-inputs/media-loading-loss";
import {mediaImageSizeSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-image-size-settings";
import {mediaMinMarginWidth} from "@/widgets/machines/utils/attributes/media-inputs/media-min-margin-width";
import { availableCylinders } from "./available-cylinders";
import {cylinderSizeSettings} from "@/widgets/machines/utils/attributes/media-inputs/cylinder-size-settings";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const flexMachine = (state: Record<string, any>) => {
    return [

        ...mediaLoadingLoss(state),
        ...mediaWastePerColor(state),
        ...mediaMinMarginWidth(state),
        ...mediaDimensionsSettings(state),
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