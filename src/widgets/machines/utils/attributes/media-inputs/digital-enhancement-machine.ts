import {mediaCoatingSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-coating-settings";
import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {mediaWeightSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-weight-settings";
import {mediaThicknessSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-thickness-settings";

const digitalEnhancementMachine = (state: Record<string, any>) => {
    return [
        {
            name: "mediaSheetsLoss",
            label: "machineAttributes.mediaSheetsLoss",
            type: "text",
            placeholder: "machineAttributes.mediaSheetsLoss",
            required: true,
            parameterKey: "mediaSheetsLoss",
            options: [],
            value: state?.attributes?.mediaSheetsLoss ? state?.attributes?.mediaSheetsLoss : '',
            machineInputType: 'input',
            isValid: true,
        },
        ...mediaCoatingSettings(state),
        ...mediaDimensionsSettings(state),
        {
            name: 'machineAttributes.minMarginWithoutEnhancement',
            parameterKey: 'minMarginWithoutEnhancement',
            machineInputType: 'multiInput',
            value: state?.attributes?.minMarginWithoutEnhancement,
            isValid: !!state?.attributes?.minMarginWithoutEnhancement?.width &&
                !!state?.attributes?.minMarginWithoutEnhancement?.length,
            inputs: [
                {
                    name: "minMarginWithoutPrinting",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.minMarginWithoutEnhancement?.width ? state.attributes?.minMarginWithoutEnhancement?.width : ''

                },
                {
                    name: "maxMediaDimensions",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.minMarginWithoutEnhancement?.length ? state.attributes?.minMarginWithoutEnhancement?.length : ''

                },
            ]
        },
        ...mediaWeightSettings(state),
        ...mediaThicknessSettings(state),
    ]
}


export {digitalEnhancementMachine};