import {mediaSheetsCategories} from "@/widgets/machines/utils/attributes/media-inputs/media-sheets-categories";
import {mediaWideFormatCategories} from "@/widgets/machines/utils/attributes/media-inputs/media-wide-format-categories";
import {mediaFlatbedCategories} from "@/widgets/machines/utils/attributes/media-inputs/media-flatbed-categories";
import {
    mediaAdvertisingProductsCategories
} from "@/widgets/machines/utils/attributes/media-inputs/media-advertising-products-categories";
import {mediaLoadingLoss} from "@/widgets/machines/utils/attributes/media-inputs/media-loading-loss";
import {mediaMinMarginWidth} from "@/widgets/machines/utils/attributes/media-inputs/media-min-margin-width";
import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {mediaWeightSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-weight-settings";
import {mediaThicknessSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-thickness-settings";

const sublimationMachine = (state: Record<string, any>) => {
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
            options: [{value: '1', text: 'Roll'}, {value: '2', text: 'Sheets'}],
            values: state?.attributes?.mediaType,
            machineInputType: 'input',
            isValid: true,
            multiple: true
        },
        {
            name: "materialType",
            label: "machineAttributes.materialType",
            type: "select",
            placeholder: "machineAttributes.materialType",
            required: true,
            parameterKey: "materialType",
            value: state?.attributes?.materialType,
            options: [{value: '1', text: 'DTF Roll'}, {value: '2', text: 'DTF Sheets'}],
            values: state?.attributes?.materialType,
            machineInputType: 'input',
            isValid: true,
            multiple: true
        },
        ...mediaMinMarginWidth(state),
        ...mediaDimensionsSettings(state),
        ...mediaWeightSettings(state),
        ...mediaThicknessSettings(state),
        ...mediaSheetsCategories(state),
        ...mediaWideFormatCategories(state),
        ...mediaFlatbedCategories(state),
        ...mediaAdvertisingProductsCategories(state)
    ]
}


export {sublimationMachine};